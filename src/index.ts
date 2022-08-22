import ChromeLauncher from 'chrome-launcher'
import lighthouse from 'lighthouse'

type Options = {

}

export async function generateLighthouseReportForPage(url: string, options: Options) {
  await runLighthouseTests(url)

}

async function runLighthouseTests(url: string) {
  console.log({ l: ChromeLauncher })
  const chrome = await ChromeLauncher.launch({
    chromeFlags: ['--headless']
  })

  try {
    const options = {
      logLevel: 'info',
      onlyCategories: ['performance'],
      port: chrome.port
    }

    const result = await lighthouse(url, options)

    console.log(result.report)


  } catch (error) {
    console.log(error)
  } finally {
    await chrome.kill()
  }
}
