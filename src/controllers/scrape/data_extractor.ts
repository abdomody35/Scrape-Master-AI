import { Data } from "src/types";
import { cleanup } from "src/utils/data_cleaner";
import { checkHttp, checkRoute, validateUrl } from "src/utils/url";
import { load } from "cheerio";
import { Page } from "puppeteer";
import pdf from "pdf-parse";

const extractMediaUrls = async (
  page: Page,
  baseUrl: string,
  selector: string,
  mediaType: string,
  pages: Data[]
) => {
  console.log(`Extracting ${mediaType} from:`, baseUrl);
  page.setDefaultTimeout(100000);
  let retries = 3;
  while (retries > 0) {
    try {
      await page.goto(checkHttp(baseUrl), { waitUntil: "load" });

      const mediaUrls = await page.evaluate((selector: string) => {
        const mediaElements = Array.from(
          document.querySelectorAll(selector)
        ) as HTMLMediaElement[];
        return mediaElements.map((element: HTMLMediaElement) => element.src);
      }, selector);

      const processedMediaUrls = mediaUrls
        .map((url) => checkRoute(url, baseUrl))
        .map(checkHttp)
        .filter(validateUrl);

      console.log(`Found ${processedMediaUrls.length} ${mediaType}`);

      const mediaPageIndex = pages.findIndex(
        (p) => p.title === baseUrl + ` - ${mediaType}`
      );
      if (mediaPageIndex !== -1) {
        pages[mediaPageIndex].content +=
          (pages[mediaPageIndex].content ? "," : "") +
          processedMediaUrls.join(",");
      } else {
        pages.push({
          url: baseUrl,
          title: baseUrl + ` - ${mediaType}`,
          content: processedMediaUrls.join(","),
        });
      }
      return;
    } catch (error) {
      console.error(`Error extracting ${mediaType} from ${baseUrl}:`, error);
      retries--;
      if (retries === 0) {
        console.error(
          `Failed to extract ${mediaType} from ${baseUrl} after 3 attempts`
        );
        return;
      }
      console.log(`Retrying... (${retries} attempts left)`);
    }
  }
};

const extractImages = (page: Page, baseUrl: string, pages: Data[]) =>
  extractMediaUrls(page, baseUrl, "img", "images", pages);

const extractVideos = (page: Page, baseUrl: string, pages: Data[]) =>
  extractMediaUrls(page, baseUrl, "video", "videos", pages);

const extractAudio = (page: Page, baseUrl: string, pages: Data[]) =>
  extractMediaUrls(page, baseUrl, "audio", "audios", pages);

const dataFromHTML = async (html: string, url: string) => {
  console.log(`scraping ${url}...`);
  const $ = load(html);
  const title = cleanup($("title").text());
  const unwanted = ["script", "style", "head"];
  unwanted.forEach((tag) => $(tag).remove()); // remove the unwanted tags
  const content = cleanup($("body").text()); // clean the data
  return { title, content };
};

const dataFromPdf = async (buffer: Buffer) => {
  try {
    const data = await pdf(buffer);
    return cleanup(data.text);
  } catch (error) {
    console.error("Error extracting PDF content:", error, "\n");
    return "";
  }
};

export {
  extractImages,
  extractVideos,
  extractAudio,
  dataFromHTML,
  dataFromPdf,
};
