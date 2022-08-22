#!/usr/bin/env node

import { program } from 'commander'

import { runLighthouseTests } from '.'
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

  const result = await runLighthouseTests(url, {
    numberOfTests: 2
  })

  console.log(result)
}

main()

