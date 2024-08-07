import express, { Request, Response } from "express";
import scrapeRouter from "@routes/scrape";
import fetchRouter from "@routes/fetch";
import historyRouter from "@routes/history";
import { errorHandler, notFoundHandler } from "@middlewares/error";
const router = express.Router();

router.get("/", async (req: Request, res: Response) => {
  return res.send({ message: "We are taking over!" });
});

router.use("/scrape", scrapeRouter);
router.use("/fetch", fetchRouter);
router.use("/history", historyRouter);
router.use(notFoundHandler);
router.use(errorHandler);

export default router;
