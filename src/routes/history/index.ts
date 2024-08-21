import express, { Request } from "express";
import { fetchHistoryFromS3 } from "../../utils/db";
const router = express.Router();

const bucketName = "test-bucket-518646354";

router.get("/", async (req: Request, res) => {
  console.log("Fetching history");
  try {
    const content = await fetchHistoryFromS3(bucketName);
    console.log("Fetched history");
    res.send(content);
  } catch (error) {
    console.error(error);
    res.status(500).send({
      message: "An error occurred while fetching the data",
      error,
    });
  }
});

export default router;
