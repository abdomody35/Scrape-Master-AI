/* eslint-disable no-undef */
/* eslint-disable no-console */
import express, { Express } from "express";
import dotenv from "dotenv";
import cors from "cors";
import bodyParser from "body-parser";
import "module-alias/register";
import router from "./routes";

dotenv.config();

const app: Express = express();

app.use(cors());

const PORT = process.env.PORT || 6969;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use("/api", router);

app.listen(PORT, () => {
  console.log(`[server]: Server is running at http://localhost:${PORT}`);
});
