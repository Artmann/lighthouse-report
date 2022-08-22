import chalk from 'chalk'
import CliTable3 from 'cli-table3'

import { AggregatedTestResult } from '../lighthouse'

export function renderReport(result: AggregatedTestResult): void {
  const table = new CliTable3({
    head: [
      chalk.hex('#A3BB77').bold('TTI'),
      chalk.hex('#A3BB77').bold('LCP'),
      chalk.hex('#A3BB77').bold('CLS'),
      chalk.hex('#A3BB77').bold('FMP'),
      chalk.hex('#A3BB77').bold('FCP'),
      chalk.hex('#A3BB77').bold('SI'),
      chalk.hex('#A3BB77').bold('TBT')
    ],
    style: {
      head: []
    }
  })

  result.testResults.forEach(testResult => {
    table.push([
      formatTime(testResult.timeToInteractive),
      formatTime(testResult.largestContentfulPaint),
      formatNumber(testResult.cumulativeLayoutShift),
      formatTime(testResult.firstMeaningfulPaint),
      formatTime(testResult.firstContentfulPaint),
      formatTime(testResult.speedIndex),
      formatTime(testResult.totalBlockingTime)
    ])
  })

  table.push([
    {
      colSpan: 7,
      content: chalk.bold('Average'),
      hAlign: 'center'
    }
  ])

  table.push([
    chalk.bold(formatTime(result.timeToInteractive)),
    chalk.bold(formatTime(result.largestContentfulPaint)),
    chalk.bold(formatNumber(result.cumulativeLayoutShift)),
    chalk.bold(formatTime(result.firstMeaningfulPaint)),
    chalk.bold(formatTime(result.firstContentfulPaint)),
    chalk.bold(formatTime(result.speedIndex)),
    chalk.bold(formatTime(result.totalBlockingTime))
  ])

  console.log(table.toString())
}

function formatNumber(value: number): string {
  return value.toFixed(2)
}

function formatTime(value: number): string {
  return `${ value.toFixed(2) }s`
}
