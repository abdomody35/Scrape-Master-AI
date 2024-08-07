import { checkLists } from "@utils/list_checker";
import { ValidateRequestProps } from "../types";

function validateRequest({
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
}: ValidateRequestProps) {
  if (!url && !whiteList?.length) {
    throw new Error("Please provide a valid URL");
  }

  if (type && !["link", "regex", "scope", "crawl"].includes(type)) {
    throw new Error(
      "Invalid type. Must be 'link', 'regex', 'scope', or 'crawl'."
    );
  }

  validateList(whiteList, "white list");
  validateList(blackList, "black list");

  if (whiteList && blackList && !checkLists(whiteList, blackList)) {
    throw new Error("White list and black list cannot contain the same items");
  }

  if ((whiteList?.length || blackList?.length) && !type) {
    throw new Error("Please provide a type for the scraping");
  }

  validatePositiveInteger(concurrency, "Concurrency");
  validateBoolean(Content, "Content");
  validateBoolean(Images, "Images");
  validateBoolean(Videos, "Videos");
  validateBoolean(Audios, "Audios");
  validateBoolean(Links, "Links");

  if (
    !(Content || Images || Videos || Audios || Links) &&
    Content !== undefined
  ) {
    throw new Error("Please enable at least one of the extraction options");
  }
}

function validateList(list: any, listName: string) {
  if (list !== undefined) {
    if (!Array.isArray(list)) {
      throw new Error(`${listName} must be an array`);
    }
    if (!list.every((item) => typeof item === "string")) {
      throw new Error(`${listName} must contain only strings`);
    }
  }
}

function validatePositiveInteger(value: any, name: string) {
  if (value !== undefined) {
    if (!Number.isInteger(value)) {
      throw new Error(`${name} must be an integer`);
    }
    if (value <= 0) {
      throw new Error(`${name} must be positive`);
    }
  }
}

function validateBoolean(value: any, name: string) {
  if (value !== undefined && typeof value !== "boolean") {
    throw new Error(`${name} must be a boolean`);
  }
}

export { validateRequest };
