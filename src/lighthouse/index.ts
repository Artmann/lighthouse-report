import lighthouse, { AuditId } from 'lighthouse'
import desktopConfig from 'lighthouse/lighthouse-core/config/desktop-config'
import mobileConfig from 'lighthouse/lighthouse-core/config/lr-mobile-config'

//eslint-disable-next-line @typescript-eslint/no-var-requires
const chromeLauncher = require('chrome-launcher')

type LighthouseOptions = {
  isDebugMode: boolean
  isMobile: boolean
  runHeadless: boolean
  numberOfTests: number

  onTestCompleted?: (index: number) => void
}

interface TestResult {
  cumulativeLayoutShift: number
  firstContentfulPaint: number
  firstMeaningfulPaint: number
  timeToInteractive: number
  largestContentfulPaint: number
  speedIndex: number
  totalBlockingTime: number
}

export interface AggregatedTestResult extends TestResult {
  testResults: TestResult[]
}

/**
 * Runs a set of lighouse tests sequentially. Returns the aggregated results.
 */
export async function runLighthouseTests(url: string, options: LighthouseOptions): Promise<AggregatedTestResult> {
  const chromeFlags: string[] = []

  if (options.runHeadless) {
    chromeFlags.push('--headless')
  }

  const chrome = await chromeLauncher.launch({ chromeFlags })

  try {
    const results: TestResult[] = []

    for (let i = 0; i < options.numberOfTests; i++) {
      const result = await runLighthouseTest(url, chrome.port, options)

      results.push(result)

      if (options.onTestCompleted) {
        options.onTestCompleted(i)
      }
    }

    return {
      cumulativeLayoutShift: average(results.map(result => result.cumulativeLayoutShift)),
      firstContentfulPaint: average(results.map(result => result.firstContentfulPaint)),
      firstMeaningfulPaint: average(results.map(result => result.firstMeaningfulPaint)),
      timeToInteractive: average(results.map(result => result.timeToInteractive)),
      largestContentfulPaint: average(results.map(result => result.largestContentfulPaint)),
      speedIndex: average(results.map(result => result.speedIndex)),
      totalBlockingTime: average(results.map(result => result.totalBlockingTime)),
      testResults: results
    }
  } finally {
    await chrome.kill()
  }
}

function average(values: number[]): number {
  if (values.length === 0) {
    return 0
  }

  return values.reduce((a, b) => a + b, 0) / values.length
}

async function runLighthouseTest(
  url: string,
  chromePort: number,
  userOptions: LighthouseOptions
): Promise<TestResult> {
   const options = {
      logLevel: userOptions.isDebugMode ? 'debug' : 'silent',
      onlyCategories: [ 'performance' ],
      port: chromePort
    }
    const settings = userOptions.isMobile ? mobileConfig : desktopConfig

    const result = await lighthouse(url, options, settings)

    const getAuditValue = (id: AuditId): number => {
      const audit = result.lhr.audits[id]

      if (audit.numericUnit === 'unitless') {
        return audit.numericValue
      }

      if (audit.numericUnit === 'millisecond') {
        return audit.numericValue / 1000
      }

      return audit.numericValue
    }

    return {
      cumulativeLayoutShift: getAuditValue('cumulative-layout-shift'),
      firstContentfulPaint: getAuditValue('first-contentful-paint'),
      firstMeaningfulPaint: getAuditValue('first-meaningful-paint'),
      timeToInteractive: getAuditValue('interactive'),
      largestContentfulPaint: getAuditValue('largest-contentful-paint'),
      speedIndex: getAuditValue('speed-index'),
      totalBlockingTime: getAuditValue('total-blocking-time')
    }
}
