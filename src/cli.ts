#!/usr/bin/env node

import chalk from 'chalk'
import { SingleBar, Presets } from 'cli-progress'
import meow from 'meow'

import { renderReport, runLighthouseTests } from '.'

async function main() {
  const helpText = `
    Usage
      $ lighthouse-report <url>

    Options
      --debug         Output debug information.
      --desktop, -d   Run in desktop mode.
      --head          Run in headed mode.
      --mobile, -m   Run in mobile mode. This is the default mode.
      --number, -n    Number of tests to run. Defaults to 3.

    Examples
      $ lighthouse-report https://www.google.com/
  `

  const cli = meow(helpText, {
    flags: {
      debug: {
        type: 'boolean'
      },
      desktop: {
        alias: 'd',
        type: 'boolean'
      },
      head: {
        type: 'boolean'
      },
      mobile: {
        alias: 'm',
        type: 'boolean'
      },
      number: {
        alias: 'n',
        type: 'number'
      }
    }
  })

  const [ url ] = cli.input

  if (!url) {
    console.log(helpText)

    process.exit(1)
  }

  const numberOfTests = cli.flags.number ?? 3

  console.log(
    chalk.bold(`Running lighthouse tests for ${ url }. \n`)
  )

  const bar = new SingleBar({
    clearOnComplete: true
  }, Presets.shades_classic)

  bar.start(numberOfTests, 0)

  const isMobile = (): boolean => {
    if (cli.flags.mobile) {
      return true
    }

    if (cli.flags.desktop) {
      return false
    }

    return true
  }

  const result = await runLighthouseTests(url, {
    isMobile: isMobile(),
    isDebugMode: cli.flags.debug ?? false,
    numberOfTests,
    runHeadless: !cli.flags.head,

    onTestCompleted: () => {
      bar.increment()
    }
  })

  bar.stop()

  renderReport(result)
}

main()
