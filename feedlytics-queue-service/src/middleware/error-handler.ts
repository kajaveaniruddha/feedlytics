import { ErrorRequestHandler } from "express";
import { AppError } from "../lib/api-error";
import { logger } from "../lib/logger";

export const errorHandler: ErrorRequestHandler = (err, _req, res, _next) => {
  if (err instanceof AppError) {
    res.status(err.statusCode).json({
      success: false,
      message: err.message,
      errors: err.fieldErrors,
    });
    return;
  }

  logger.error({ error: err.message, stack: err.stack }, "Unhandled error");
  res.status(500).json({ success: false, message: "Internal server error" });
};
