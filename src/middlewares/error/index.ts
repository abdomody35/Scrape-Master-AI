import { Request, Response, NextFunction, ErrorRequestHandler } from "express";

const notFoundHandler = (req: Request, res: Response, next: NextFunction) => {
  res.status(404).json({ error: "Not Found" });
};

const errorHandler: ErrorRequestHandler = (
  err,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (res.headersSent) {
    return next(err);
  }

  res.status(500).send({
    message: "An error occurred",
    error: err.message, // Only send the error message to the client, not the full error object
  });
};

export { notFoundHandler, errorHandler };
