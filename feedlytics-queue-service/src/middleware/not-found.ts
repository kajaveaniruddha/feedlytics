import { Request, Response } from "express";
import { logger } from "../lib/logger";

export function notFoundHandler(req: Request, res: Response) {
  logger.warn({ channel: "http", method: req.method, path: req.originalUrl }, "HTTP 404 route not found");
  res.status(404).json({ success: false, message: "Route not found" });
}
