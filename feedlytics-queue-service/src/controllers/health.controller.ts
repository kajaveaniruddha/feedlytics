import { Request, Response } from "express";

export const healthController = {
  health(_req: Request, res: Response) {
    res.json({ status: "ok", uptime: process.uptime() });
  },
};
