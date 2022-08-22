#!/usr/bin/env node

import { program }  from 'commander'

import { generateLighthouseReportForPage } from '.'
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

    await generateLighthouseReportForPage(url, {

    })
}

main()

