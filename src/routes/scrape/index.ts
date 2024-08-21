import express, { Request, Response } from "express";
import { crawl } from "src/controllers/scrape/index";
import { validateUrl } from "src/utils/url";
import { saveToS3 } from "src/utils/db";
import puppeteer from "puppeteer";
import { ReqBodyProps } from "src/types";
import { validateRequest } from "src/utils/validation";

const router = express.Router();

const bucketName = "test-bucket-518646354";

router.post("/", async (req: Request, res: Response) => {
  const queryUrl = req.query.url;
  const url = validateUrl(queryUrl as string);
  const {
    type,
    whiteList,
    blackList,
    concurrency,
    Images,
    Videos,
    Audios,
    Links,
    Content,
  }: ReqBodyProps = req.body;

  try {
    validateRequest({
      url,
      type,
      whiteList,
      blackList,
      concurrency,
      Images,
      Videos,
      Audios,
      Links,
      Content,
    });
    const browser = await puppeteer.launch({
      args: ["--no-sandbox", "--disable-setuid-sandbox"],
    });
    const config = {
      browser,
      type,
      whiteList,
      blackList,
      concurrency,
      Images,
      Videos,
      Audios,
      Links,
      Content,
    };
    const scrapedData = await crawl(url, config);
    const filteredData = scrapedData.filter((item) => item.content !== "");
    res.status(200).send(filteredData);
    await saveToS3(bucketName, filteredData);
    console.log(`\nFinished Scraping for Base URL: ${url}\n`);
    await browser.close();
  } catch (error: any) {
    console.error("Error:", error);
    res.status(500).send({
      message: "An error occurred while scraping the data",
      error: error.message,
    });
  }
});

export default router;
