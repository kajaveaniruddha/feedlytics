import { Request, Response } from "express";
import client from "prom-client";

export const healthController = {
  health(_req: Request, res: Response) {
    res.json({ status: "ok", uptime: process.uptime() });
  },

  async metrics(_req: Request, res: Response) {
    res.setHeader("Content-Type", client.register.contentType);
    const metrics = await client.register.metrics();
    res.send(metrics);
  },
};
