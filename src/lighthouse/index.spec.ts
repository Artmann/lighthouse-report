const killMock = jest.fn()
const lighouseMock = jest.fn()

jest.mock('chrome-launcher', () => ({
  launch: jest.fn().mockResolvedValue({
    kill: killMock,
    port: 8021
  })
}))
jest.mock('lighthouse', () => lighouseMock)

import { Audit, AuditId } from 'lighthouse'
import { runLighthouseTests } from '.'

const options = {
  isDebugMode: false,
  numberOfTests: 3,
  runHeadless: true
}

describe('runLighthouseTests', () => {
  beforeEach(() => {
    lighouseMock.mockResolvedValue({
      lhr: {
        audits: {
          'cumulative-layout-shift': createMockAudit('cumulative-layout-shift'),
          'first-contentful-paint': createMockAudit('first-contentful-paint'),
          'first-meaningful-paint': createMockAudit('first-meaningful-paint'),
          'interactive': createMockAudit('interactive'),
          'largest-contentful-paint': createMockAudit('largest-contentful-paint'),
          'speed-index': createMockAudit('speed-index'),
          'total-blocking-time': createMockAudit('total-blocking-time')
        }
      }
    })
  })

  it('runs the given number of tests.', async() => {
    await runLighthouseTests('https://example.com', options)

    expect(lighouseMock).toHaveBeenCalledTimes(3)
  })

  it('aggregates the results using an average function.', async() => {
    lighouseMock.mockResolvedValueOnce({
      lhr: {
        audits: {
          'cumulative-layout-shift': createMockAudit('cumulative-layout-shift', 10),
          'first-contentful-paint': createMockAudit('first-contentful-paint', 20),
          'first-meaningful-paint': createMockAudit('first-meaningful-paint', 30),
          'interactive': createMockAudit('interactive', 40),
          'largest-contentful-paint': createMockAudit('largest-contentful-paint', 50),
          'speed-index': createMockAudit('speed-index', 60),
          'total-blocking-time': createMockAudit('total-blocking-time', 70)
        }
      }
    })

    lighouseMock.mockResolvedValueOnce({
      lhr: {
        audits: {
          'cumulative-layout-shift': createMockAudit('cumulative-layout-shift', 11),
          'first-contentful-paint': createMockAudit('first-contentful-paint', 22),
          'first-meaningful-paint': createMockAudit('first-meaningful-paint', 33),
          'interactive': createMockAudit('interactive', 44),
          'largest-contentful-paint': createMockAudit('largest-contentful-paint', 55),
          'speed-index': createMockAudit('speed-index', 66),
          'total-blocking-time': createMockAudit('total-blocking-time', 77)
        }
      }
    })

    const result = await runLighthouseTests('https://example.com', {
      ...options,
      numberOfTests: 2
    })

    expect(result).toEqual({
      cumulativeLayoutShift: 10.5,
      firstContentfulPaint: 21,
      firstMeaningfulPaint: 31.5,
      largestContentfulPaint: 52.5,
      speedIndex: 63,
      testResults: [
        {
          cumulativeLayoutShift: 10,
          firstContentfulPaint: 20,
          firstMeaningfulPaint: 30,
          largestContentfulPaint: 50,
          speedIndex: 60,
          timeToInteractive: 40,
          totalBlockingTime: 70
        },
        {
          cumulativeLayoutShift: 11,
          firstContentfulPaint: 22,
          firstMeaningfulPaint: 33,
          largestContentfulPaint: 55,
          speedIndex: 66,
          timeToInteractive: 44,
          totalBlockingTime: 77
        }
      ],
      timeToInteractive: 42,
      totalBlockingTime: 73.5
    })
  })

  it('shuts down the browser.', async() => {
    await runLighthouseTests('https://example.com', options)

    expect(killMock).toHaveBeenCalled()
  })
})

function createMockAudit(id: AuditId, value = 0, score = 0): Audit {
  return {
    description: '',
    displayValue: '',
    id: id,
    score: score || 0,
    scoreDisplayMode: '',
    title: '',
    numericUnit: '',
    numericValue: value || 0,
  }
}
