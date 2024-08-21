import { GetLinksProps, HandleLinksProps } from "../../types";
import { checkRegex } from "../../utils/list_checker";
import { validateUrl, checkRoute, checkHttp } from "../../utils/url";

const isValidLink = (link: string, baseUrl: string) => {
  return (
    (link.startsWith(baseUrl) || link.endsWith(".pdf")) &&
    link.indexOf("#") === -1 &&
    validateUrl(link)
  );
};

const handleLinks = async ({
  page,
  pages,
  baseUrl,
  whiteList,
  blackList,
  type,
  Links,
}: HandleLinksProps) => {
  const newLinks = await getLinks({
    page,
    baseUrl,
    whiteList,
    blackList,
    type,
  });
  if (Links) {
    console.log(`Extracting links from ${baseUrl}...`);
    const mediaPageIndex = pages.findIndex(
      (p) => p.title === baseUrl + " - links"
    );
    if (mediaPageIndex !== -1) {
      pages[mediaPageIndex].content +=
        (pages[mediaPageIndex].content ? "," : "") + newLinks.join(",");
    } else {
      pages.push({
        url: baseUrl,
        title: baseUrl + " - links",
        content: newLinks.join(","),
      });
    }
  }
  return newLinks;
};

const getLinks = async ({
  page,
  baseUrl,
  whiteList,
  blackList,
  type,
}: GetLinksProps) => {
  const links = await page.evaluate(() =>
    Array.from(document.querySelectorAll("a")).map((a) => a.href)
  );

  const validLinks = links
    .map((link) => checkRoute(link, baseUrl))
    .map(checkHttp)
    .filter((link) => isValidLink(link, baseUrl));

  switch (type) {
    case "link":
      return validLinks.filter(
        (link) =>
          (whiteList.includes(link) || !whiteList?.length) &&
          !blackList.includes(link)
      );
    case "regex":
      return validLinks.filter((link) =>
        checkRegex(link, whiteList, blackList)
      );
    case "scope":
      return validLinks.filter(
        (link) =>
          whiteList.some((scope) => link.startsWith(scope)) &&
          !blackList.some((scope) => link.startsWith(scope))
      );
    default:
      return validLinks;
  }
};

export { handleLinks };
