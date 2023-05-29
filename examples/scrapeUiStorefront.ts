import { Browser, Frame, Page } from "puppeteer-core"
import mergePdfs, { generatePdf, initPuppeteerBrowser, sleep } from "../utils"

const root = "C:\\Users\\andre\\Documents\\scraping\\docs\\pdfs"

async function beforeScrapingCallback(page: Page) {
  try {
    await page.click("#cky-btn-accept")
  } catch (error) {}
}

async function getLinks(page: Page, browser: Browser): Promise<any> {
  // Expand navigation to make all links visible
  const mainNavigationButtonsIds = [
    "components-atoms",
    "components-templates",
    "components-pages",
    "components-organisms",
    "utilities-transitions",
  ]
  for (const id of mainNavigationButtonsIds) {
    await sleep(1000)
    await page.click(`#${id}`)
  }
  let buttonsContent: (string | null)[] = []
  // Get all links
  for (const id of mainNavigationButtonsIds) {
    const buttonContent = await page.$$eval(
      `[data-parent-id="${id}"]`,
      (elements, id) => {
        return elements.map((element) => {
          return `${id}-${element.textContent?.toLowerCase()}--${element.textContent?.toLowerCase()}`
        })
      },
      id
    )
    buttonsContent.push(...buttonContent)
  }

  for (const id of buttonsContent) {
    if (!id) continue
    // The id is not always the same, so we try two options
    const idOption2 = id.replace(/--.*$/, "")
    const elementHandle = await Promise.any([
      page.waitForSelector(`#${id}`, { visible: true }),
      page.waitForSelector(`#${idOption2}`, { visible: true }),
    ])
    await elementHandle.click()
    await sleep(4000)
    // The content we are interested in is in a frame
    const frameHtml = await getIframeToText(page)
    const newPage = await browser.newPage()
    await newPage.setContent(frameHtml)
    await generatePdf(newPage, `${root}/${id}`)

    await newPage.close()
  }
}

async function getIframeToText(page: Page) {
  const frameId = "storybook-preview-iframe"
  const frame = page.frames().find((frame: Frame) => frame.name() === frameId)
  const frameHtml = (await frame?.content()) || ""
  return frameHtml
}

async function run() {
  let browser: Browser
  try {
    browser = await initPuppeteerBrowser()
    const page = await browser.newPage()
    page.goto("https://docs.storefrontui.io/v1/?path=/story/welcome--page")
    await sleep(5000)
    await beforeScrapingCallback(page)

    await getLinks(page, browser)
  } catch (error) {
    console.log({ error })
  } finally {
    // @ts-ignore
    await browser.close()
  }
  mergePdfs(root)
}

run()
