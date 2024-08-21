# cmnd-webscraper-knowledge-base

## Overview

This API provides a powerful tool for scraping and retrieving web content. It offers three main endpoints: `/scrape`, `/fetch`, and `/history`. Below is a detailed explanation of each endpoint and how they work.

## Deployment

The API is deployed on [Render](https://render.com), and you can access it using the following link:

[https://scrape-master-ai.onrender.com/api](https://scrape-master-ai.onrender.com/api)

## Endpoints

### 1. `/scrape`

This endpoint allows you to initiate the scraping process for a specific URL. You need to send a POST request with a query parameter named `url` which represents the link you want to start scraping from.

#### Types of Scraping

- **link**: Scrapes only the links provided in the white list and avoids those in the black list.
- **crawl**: Crawls every page under the base URL provided in the white list and avoids those in the black list.
- **scope**: Uses the links in the white and black lists to guide the crawling process.
- **regex**: Similar to `scope`, but it allows the use of regular expressions in the white and black lists to guide the crawling process.

#### Modes

You can choose from five different modes to scrape different types of content. The default mode is `Content`.

- **Content**: Scrapes all text from the page.
- **Images**: Retrieves all image links on the page.
- **Videos**: Retrieves all video links on the page.
- **Audios**: Retrieves all audio links on the page.
- **Links**: Retrieves all links on the page that lead to a new page (excluding image, video, or audio links).

If the scraper encounters a PDF file, it will treat it like a normal page but will only extract text from it.

#### Concurrency

You can specify how many processes should run in parallel using the `concurrency` property. The default value is `5`.

### 2. `/fetch`

This endpoint allows you to retrieve the content you have previously scraped for a given URL. You need to provide the URL as a query parameter.

### 3. `/history`

This endpoint returns a list of all the URLs that you have scraped before.

## Installation and Setup

1. Clone the repository.
2. Run `npm install` to install the required dependencies.
3. Create a `.env` file in the root directory and add your environment variables:
   ```
   PORT=your-port
   S3_REGION=your-region
   S3_ACCESS_KEY_ID=your-access-key-id
   S3_SECRET_ACCESS_KEY=your-secret-access-key
   ```
4. Run the server using `npm start`.

The server will be running at `http://localhost:<PORT>`.

### Usage

#### 1. `/scrape`

- **Query Parameter:**
  - `url`: The URL to start the scraping process from.

- **Request Body:**
  - `type`: (optional) Defines the scraping strategy. Possible values are:
    - `"link"`: Scrape only the links in the whitelist and avoid the ones in the blacklist.
    - `"crawl"`: Crawl all pages under the base URL for all links in the whitelist and avoid the ones in the blacklist.
    - `"scope"`: Guide the crawling process using the links in the lists.
    - `"regex"`: Guide the crawling process using regular expressions in the lists.
  - `whiteList`: (optional) An array of URLs or patterns to include in the scraping.
  - `blackList`: (optional) An array of URLs or patterns to exclude from the scraping.
  - `concurrency`: (optional) Number of parallel processes to run during scraping. Default is 5.
  - `Content`: (optional) `true` to extract all text content from the page.
  - `Images`: (optional) `true` to extract all image URLs from the page.
  - `Videos`: (optional) `true` to extract all video URLs from the page.
  - `Audios`: (optional) `true` to extract all audio URLs from the page.
  - `Links`: (optional) `true` to extract all hyperlinks leading to new pages.

- **Example Request:**

  ```
  POST http://localhost:6969/api/scrape?url=example.com
  {
  "type": "scope",
  "whiteList": ["example.com/p"],
  "blackList": ["example.com/pa"],
  "concurrency": 10,
  "Content": true,
  "Images": false,
  "Videos": false,
  "Audios": false,
  "Links": false
  }
  ```
  
  Above example will scrape only the text from example.com and any page that starts with example.com/p excluding the ones that start with example.com/pa
 
#### 2. `/fetch`

- **Query Parameter:**
  - `url`: The URL to start the scraping process from.

- **Example Request:**

  ```
  GET http://localhost:6969/api/fetch?url=example.com
  ```
  
#### 3. `/history`

- **Example Request:**

  ```
  GET http://localhost:6969/api/history
  ```

## Notes

- This API uses AWS S3 for storing scraped data.
- Ensure that you have configured your S3 credentials in the `.env` file.
- The API is designed to handle a variety of web pages, but performance may vary depending on the complexity of the site being scraped.
