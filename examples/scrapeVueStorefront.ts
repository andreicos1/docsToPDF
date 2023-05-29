import { Browser, Page } from "puppeteer-core"
import mergePdfs, { initPuppeteerBrowser, sleep } from "../utils"

const root = "C:\\Users\\andre\\Documents\\Vue Storefront QA\\ai-docs"
const pageUrl = "https://docs.vuestorefront.io/magento/"

interface Props {
  pageUrl: string // Url of the page to scrape
  beforeScrapingCallback: (page: Page) => Promise<void> // Function to run before scraping, useful for closing cookie popups
  getLinks: (page: Page) => Promise<string[]> // Function to get all links to scrape
}

export default async function scrapeData({ pageUrl, getLinks, beforeScrapingCallback }: Props) {
  let browser: Browser
  try {
    browser = await initPuppeteerBrowser()
    const page = await browser.newPage()
    page.setDefaultNavigationTimeout(0)
    await page.goto(pageUrl)
    await beforeScrapingCallback(page)

    const links = await getLinks(page)

    // // Loop through each link and navigate to it
    for (const [index, link] of links.entries()) {
      await sleep(2000) // Wait 2 seconds to avoid being blocked
      console.log(`Navigating to: ${link}`)
      await page.goto(link)

      await savePdf(page, `pdfs/page-${index}`)
    }
  } catch (error) {
    console.log("scrape failed", error)
  } finally {
    // @ts-ignore
    await browser.close()
  }
}

async function savePdf(page: Page, name: string) {
  await page.pdf({
    path: `${name}.pdf`,
    margin: { top: "100px", right: "50px", bottom: "100px", left: "50px" },
    printBackground: true,
    format: "A4",
  })
}

async function beforeScrapingCallback(page: Page) {
  await page.click("#cky-btn-accept")
}

async function getLinks(page: Page): Promise<string[]> {
  return await page.$$eval("aside > ul > li:nth-child(4) > section > ul a", (as) => as.map((a) => a.href))
}

async function run() {
  await scrapeData({ pageUrl, beforeScrapingCallback, getLinks })
  mergePdfs(root)
}

run()
