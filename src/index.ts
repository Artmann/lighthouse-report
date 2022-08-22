import lighthouse from 'lighthouse'
import chromeLauncher from 'chrome-launcher'

type Options = {

}

export async function generateLighthouseReportForPage(url: string, options: Options) {
  console.log(url)
  console.log(options)

  await runLighthouseTests(url)

}

async function runLighthouseTests(url: string) {
  const chrome = await chromeLauncher.launch({
    chromeFlags: ['--headless']
  })

  try {
    const options = {
      logLevel: 'info',
      onlyCategories: ['performance'],
      port: chrome.port
    };

    const result = await lighthouse(url, options);

    console.log(result.report)


  } catch (error) {
    console.log(error)
  } finally {
    await chrome.kill()
  }
}
