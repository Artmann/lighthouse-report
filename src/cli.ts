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
      --debug   Output debug information.
      --head    Run in headed mode.

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
      }
    }
  })

  const [ url ] = cli.input

  if (!url) {
    console.log(helpText)

    process.exit(1)
  }

  console.log(
    chalk.bold(`Running lighthouse tests for ${ url }. \n`)
  )

  const bar = new SingleBar({
    clearOnComplete: true
  }, Presets.shades_classic)

  bar.start(3, 0)

  const result = await runLighthouseTests(url, {
    isDebugMode: cli.flags.debug ?? false,
    numberOfTests: 3,
    runHeadless: !cli.flags.head,

    onTestCompleted: () => {
      bar.increment()
    }
  })

  bar.stop()

  renderReport(result)
}

main()
