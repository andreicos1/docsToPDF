# docsToPDF

**docsToPDF** is a web scraping project. This project utilizes Puppeteer in JavaScript to scrape documents from various online sources and convert them into PDF format.

## Project Description

This project is designed to scrape data from numerous online sources with Puppeteer, a Node library which provides a high-level API to control Chrome or Chromium over the DevTools Protocol. The primary goal is to extract text-based documents and subsequently convert them into PDF format. The PDFs can be used with OpenAI plugins or in custom vector databases. For more info on Puppeteer go to https://brightdata.com/

## Features

- Web scraping from multiple sources with Puppeteer
- Extraction of text from various document formats
- Conversion of the extracted text into PDF format for easier offline access

## Installation

You can clone the project repository by running the following command:

```bash
git clone https://github.com/yourgithubusername/docsToPDF.git
```

To install the dependencies simply run
`yarn`

To run the files, you will need typescript and ts-node. To install these globally use:

```
npm install -g typescript
npm install -g ts-node
```

Then run the files as such: ts-node ./examples/filename.ts
