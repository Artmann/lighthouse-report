#!/usr/bin/env node

import chalk from 'chalk'
import { SingleBar, Presets } from 'cli-progress'
import { program } from 'commander'


import { renderReport, runLighthouseTests } from '.'
import packageInfo from '../package.json'

async function main() {
  program.name('lighthouse-report')
    .description('')
    .version(packageInfo.version)

  program.argument('url')

  program.parse()

  const [ url ] = program.args

  if (!url) {
    throw new Error('An URL is required.')
  }

  console.log(
    chalk.bold(`Running lighthouse tests for ${ url }. \n`)
  )

  const bar = new SingleBar({
    clearOnComplete: true
  }, Presets.shades_classic)

  bar.start(3, 0)

  const result = await runLighthouseTests(url, {
    numberOfTests: 3,
    onTestCompleted: () => {
      bar.increment()
    }
  })

  bar.stop()

  renderReport(result)
}

main()
