import { Request, Response } from "express";
import { enqueueFeedback } from "../queues/enqueue";
import { successResponse } from "../lib/api-response";

export const feedbackController = {
  async addFeedback(req: Request, res: Response) {
    await enqueueFeedback(req.body.data);
    successResponse(res, "Feedback added successfully");
  },
};
