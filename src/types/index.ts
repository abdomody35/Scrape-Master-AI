import { Browser, Page } from "puppeteer";

interface ReqBodyProps {
  type?: string;
  whiteList?: string[];
  blackList?: string[];
  concurrency?: number;
  Images?: boolean;
  Videos?: boolean;
  Audios?: boolean;
  Links?: boolean;
  Content: boolean;
}

interface Data {
  url: string;
  title: string;
  content: string;
}

interface ScraperConfig {
  browser: Browser;
  type?: string;
  whiteList?: string[];
  blackList?: string[];
  concurrency?: number;
  Images?: boolean;
  Videos?: boolean;
  Audios?: boolean;
  Links?: boolean;
  Content: boolean;
}

interface SaveProps {
  db: string;
  url: string;
  title: string;
  content: string;
}

interface CrawlPagesProps {
  baseUrl: string;
  browser: Browser;
  pages: Data[];
  visited: Set<string>;
  whiteList: string[];
  blackList: string[];
  type: string;
  concurrency: number;
  Images?: boolean;
  Videos?: boolean;
  Audios?: boolean;
  Links?: boolean;
  Content: boolean;
}

interface ScrapeWhiteListProps {
  browser: Browser;
  pages: Data[];
  whiteList: string[];
  Images?: boolean;
  Videos?: boolean;
  Audios?: boolean;
  Links?: boolean;
  Content: boolean;
}

interface ScrapePageProps {
  page: Page;
  pages: Data[];
  uncheckedUrl: string;
  Images?: boolean;
  Videos?: boolean;
  Audios?: boolean;
  Links?: boolean;
  Content: boolean;
}

interface GetLinksProps {
  page: Page;
  baseUrl: string;
  whiteList: string[];
  blackList: string[];
  type: string;
}

interface ValidateRequestProps {
  url: any;
  type?: string;
  whiteList?: string[];
  blackList?: string[];
  concurrency?: number;
  Images?: boolean;
  Videos?: boolean;
  Audios?: boolean;
  Links?: boolean;
  Content: boolean;
}

interface HandleLinksProps {
  page: Page;
  pages: Data[];
  baseUrl: string;
  whiteList: string[];
  blackList: string[];
  type: string;
  Links: boolean;
}

export {
  ReqBodyProps,
  Data,
  ScraperConfig,
  SaveProps,
  CrawlPagesProps,
  ScrapeWhiteListProps,
  ScrapePageProps,
  GetLinksProps,
  ValidateRequestProps,
  HandleLinksProps,
};
