import express, { Request } from "express";
import { fetchObjectFromS3 } from "src/utils/db";
const router = express.Router();

const bucketName = "test-bucket-518646354";

router.get("/", async (req: Request, res) => {
  const url = (req.query.url as string)
    ?.replace("https://", "")
    ?.replace("http://", "");
  try {
    if (!url) {
      return res.status(400).send({ message: "Please provide a url" });
    }
    console.log(`Fetching title: ${url}`);
    const content = await fetchObjectFromS3(bucketName, url);
    if (!content) {
      console.log(`No data found for title: ${url}`);
      return res.status(404).send({ message: "Data not found" });
    }
    console.log(`Fetched title: ${url}`);
    res.status(200).send(content);
  } catch (error) {
    console.error(`An error occurred while fetching ${url}`, error);
    res.status(500).send({
      message: "An error occurred while fetching the data",
      error,
    });
  }
});

export default router;
