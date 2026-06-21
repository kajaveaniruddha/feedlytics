import { ErrorRequestHandler } from "express";
import { AppError } from "../lib/api-error";
import { logger } from "../lib/logger";

export const errorHandler: ErrorRequestHandler = (err, req, res, _next) => {
  if (err instanceof AppError) {
    logger.warn(
      {
        channel: "http",
        method: req.method,
        path: req.originalUrl,
        statusCode: err.statusCode,
        message: err.message,
      },
      "Handled HTTP error (AppError)",
    );
    res.status(err.statusCode).json({
      success: false,
      message: err.message,
      errors: err.fieldErrors,
    });
    return;
  }

  logger.error(
    { channel: "http", method: req.method, path: req.originalUrl, error: err.message, stack: err.stack },
    "Unhandled error",
  );
  res.status(500).json({ success: false, message: "Internal server error" });
};
