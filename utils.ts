import fs from "fs"
import path from "path"
import PDFMerger from "pdf-merger-js"
import puppeteer, { Page } from "puppeteer-core"

require("dotenv").config()

export function sleep(time = 2000) {
  return new Promise((resolve) => setTimeout(resolve, time))
}

export async function initPuppeteerBrowser() {
  const HOST = process.env.HOST
  const USERNAME = process.env.PUPPETEER_USERNAME
  const PASSWORD = process.env.PASSWORD
  const auth = `${USERNAME}:${PASSWORD}`
  return await puppeteer.connect({
    browserWSEndpoint: `wss://${auth}@${HOST}`,
  })
}

export async function generatePdf(page: Page, fileName: string) {
  await page.pdf({
    path: `${fileName}.pdf`,
    margin: { top: "100px", right: "50px", bottom: "100px", left: "50px" },
    format: "A4",
  })
}

const merger = new PDFMerger()

function getPDFFiles(folderPath = "/") {
  const files = fs.readdirSync(folderPath)
  const pdfFiles = files.filter((file: string) => path.extname(file) === ".pdf")
  return pdfFiles
}

export default async function mergePdfs(root: string) {
  const pdfFiles = getPDFFiles(root)

  for (const file of pdfFiles) {
    await merger.add(`${root}\\${file}`)
  }

  await merger.save("merged.pdf") //save under given name and reset the internal document
}
