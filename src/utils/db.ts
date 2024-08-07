import { Data } from "../types";
import dotenv from "dotenv";
import {
  S3Client,
  PutObjectCommand,
  ListObjectsCommand,
  GetObjectCommand,
} from "@aws-sdk/client-s3";

dotenv.config();

const MAX_RETRIES = 3;

const s3 = new S3Client({
  region: process.env.S3_REGION || "",
  credentials: {
    accessKeyId: process.env.S3_ACCESS_KEY_ID || "",
    secretAccessKey: process.env.S3_SECRET_ACCESS_KEY || "",
  },
});

const saveToS3 = async (bucket: string, data: Data[]) => {
  const uploadPromises = data.map(async ({ url, title, content }) => {
    const command = new PutObjectCommand({
      Bucket: bucket,
      Key: url.replace("https://", "") + ".txt",
      Body: `${title}\n${content}`,
    });
    for (let attempt = 0; attempt < MAX_RETRIES; attempt++) {
      try {
        const response = await s3.send(command);
        console.log("Saved data to S3 : ", title);
        break;
      } catch (err) {
        console.error(
          `Error saving ${title} to S3 (attempt ${attempt + 1}):`,
          err
        );
        if (attempt === MAX_RETRIES - 1) throw err;
      }
    }
  });
  await Promise.all(uploadPromises);
};

const fetchHistoryFromS3 = async (bucket: string) => {
  const command = new ListObjectsCommand({ Bucket: bucket });
  const response = await s3.send(command);
  const objects = response.Contents;
  const urls = objects?.map((object) => object.Key?.replace(".txt", ""));
  return urls;
};

const fetchObjectFromS3 = async (bucket: string, object: string) => {
  const command = new GetObjectCommand({
    Bucket: bucket,
    Key: object + ".txt",
  });
  const response = await s3.send(command);
  const data = (await response.Body?.transformToString())?.split("\n");
  return {
    title: data?.at(0)?.replace("title: ", ""),
    content: data?.at(1)?.replace("content: ", ""),
  };
};

export { saveToS3, fetchHistoryFromS3, fetchObjectFromS3 };
