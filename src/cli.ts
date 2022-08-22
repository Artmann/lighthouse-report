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
      --debug        Output debug information.
      --head         Run in headed mode.
      --number, -n   Number of tests to run. Defaults to 3.

    Examples
      $ lighthouse-report https://www.google.com/
  `

  const cli = meow(helpText, {
    flags: {
      debug: {
        type: 'boolean'
      },
      head: {
        type: 'boolean'
      },
      number: {
        alias: 'n',
        type: 'number'
      }
    }
  })
  console.log(cli.flags)

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

  const result = await runLighthouseTests(url, {
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
