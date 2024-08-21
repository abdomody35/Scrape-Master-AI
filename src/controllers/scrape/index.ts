import axios from "axios";
import { checkHttp, isAudio, isImage, isVideo, validateUrl } from "../../utils/url";
import { validateLists } from "../../utils/list_checker";
import {
  CrawlPagesProps,
  Data,
  ScrapePageProps,
  ScraperConfig,
  ScrapeWhiteListProps,
} from "src/types";
import {
  extractImages,
  dataFromPdf,
  dataFromHTML,
  extractVideos,
  extractAudio,
} from "src/controllers/scrape/data_extractor";
import { handleLinks } from "src/controllers/scrape/link_extractor";

const crawl = async (
  baseUrl: any,
  {
    browser,
    type = "link",
    whiteList = [],
    blackList = [],
    concurrency = 5,
    Images = false,
    Videos = false,
    Audios = false,
    Links = false,
    Content = true,
  }: ScraperConfig
) => {
  validateLists(whiteList, blackList);
  const updatedWhiteList = whiteList.map(checkHttp);
  const updatedBlackList = blackList.map(checkHttp);

  console.log("Started Scraping for: ");
  console.log("Base URL: ", baseUrl);
  console.log("Type: ", type);
  console.log("White list: ", updatedWhiteList);
  console.log("Black list: ", updatedBlackList);
  console.log("Concurrency: ", concurrency);
  console.log("Extract Images: ", Images);
  console.log("Extract Videos: ", Videos);
  console.log("Extract Audios: ", Audios);
  console.log("Extract Links: ", Links);
  console.log("Extract Content: ", Content);
  console.log("----------------------------------------");
  const visited = new Set<string>();
  const pages: Data[] = [];

  switch (type) {
    case "link":
      if (updatedWhiteList.length === 0) {
        const page = await browser.newPage();
        await scrapePage({
          page,
          pages,
          uncheckedUrl: baseUrl,
          Images,
          Videos,
          Audios,
          Links,
          Content,
        });
        await page.close();
      } else {
        await scrapeWhiteList({
          browser,
          pages,
          whiteList: [...new Set([baseUrl, ...updatedWhiteList])],
          Images,
          Videos,
          Audios,
          Links,
          Content,
        });
      }
      break;

    case "crawl":
      for (const url of [...new Set([baseUrl, ...updatedWhiteList])]) {
        await crawlPages({
          baseUrl: url,
          browser,
          pages,
          visited,
          whiteList: [],
          blackList: updatedBlackList,
          type,
          concurrency,
          Images,
          Videos,
          Audios,
          Links,
          Content,
        });
      }
      break;

    case "scope":
    case "regex":
      await crawlPages({
        baseUrl,
        browser,
        pages,
        visited,
        whiteList: updatedWhiteList,
        blackList: updatedBlackList,
        type,
        concurrency,
        Images,
        Videos,
        Audios,
        Links,
        Content,
      });
      break;

    default:
      console.error("Invalid scrape type: defaulting to a single page scrape");
      const page = await browser.newPage();
      await scrapePage({
        page,
        pages,
        uncheckedUrl: baseUrl,
        Images,
        Videos,
        Audios,
        Links,
        Content,
      });
      await page.close();
  }

  return pages;
};

const crawlPages = async ({
  baseUrl,
  browser,
  pages,
  visited,
  whiteList,
  blackList,
  type,
  concurrency,
  Images,
  Videos,
  Audios,
  Links,
  Content,
}: CrawlPagesProps) => {
  const queue: string[] = [baseUrl];
  while (queue.length > 0) {
    const batch = queue.splice(0, concurrency);
    const promises = batch.map(async (url) => {
      if (visited.has(url)) return;
      visited.add(url);

      try {
        const page = await browser.newPage();
        await scrapePage({
          page,
          pages,
          uncheckedUrl: url,
          Images,
          Videos,
          Audios,
          Links,
          Content,
        });
        const newLinks = await handleLinks({
          page,
          pages,
          baseUrl,
          whiteList,
          blackList,
          type,
          Links: Links || false,
        });
        queue.push(...newLinks.filter((link) => !visited.has(link)));
        await page.close();
      } catch (error) {
        console.error(`Error crawling ${url}:`, error);
      }
    });

    await Promise.all(promises);
  }
};

const scrapeWhiteList = async ({
  browser,
  pages,
  whiteList,
  Images,
  Videos,
  Audios,
  Links,
  Content,
}: ScrapeWhiteListProps) => {
  const promises = whiteList.map(async (url) => {
    const page = await browser.newPage();
    await scrapePage({
      page,
      pages,
      uncheckedUrl: url,
      Images,
      Videos,
      Audios,
      Links,
      Content,
    });
    await page.close();
  });
  await Promise.all(promises);
};

const scrapePage = async ({
  page,
  pages,
  uncheckedUrl,
  Images,
  Videos,
  Audios,
  Links,
  Content,
}: ScrapePageProps) => {
  const url = validateUrl(uncheckedUrl);

  if (!url) {
    console.error(`Invalid URL: ${uncheckedUrl}`);
    return;
  }

  page.setDefaultTimeout(100000);
  let retries = 3;
  while (retries > 0) {
    try {
      await page.goto(checkHttp(url), { waitUntil: "load" });
      if (url.endsWith(".pdf")) {
        const response = await axios.get(url, { responseType: "arraybuffer" });
        const buffer = Buffer.from(response.data);
        const content = await dataFromPdf(buffer);
        const title = url.substring(url.lastIndexOf("/") + 1, url.length - 4);
        pages.push({ url, title, content });
        return;
      }
      if (isImage(url) && Images) {
        const image = pages.find((page) => page.title.endsWith(" - imgaes"));
        if (image) image.content += (image.content ? "," : "") + url;
      }
      if (isVideo(url) && Videos) {
        const video = pages.find((page) => page.title.endsWith(" - videos"));
        if (video) video.content += (video.content ? "," : "") + url;
      }
      if (isAudio(url) && Audios) {
        const audio = pages.find((page) => page.title.endsWith(" - audios"));
        if (audio) audio.content += (audio.content ? "," : "") + url;
      }
      if (Images) await extractImages(page, url, pages);
      if (Videos) await extractVideos(page, url, pages);
      if (Audios) await extractAudio(page, url, pages);
      await handleLinks({
        page,
        pages,
        baseUrl: url,
        whiteList: [],
        blackList: [],
        type: "",
        Links: Links || false,
      });
      if (Content) {
        const html = await page.content();
        const { title, content } = Content
          ? await dataFromHTML(html, url)
          : { title: "", content: "" };
        pages.push({ url, title: title || url, content });
      }
      return;
    } catch (error) {
      console.error(`Error scraping ${url}:`, error, "\n");
      retries--;
      if (retries === 0) {
        console.error(`Failed to scrape ${url} after 3 attempts`);
        return;
      }
      console.log(`Retrying... (${retries} attempts left)`);
    }
  }
};

export { crawl };
