import { Request, Response } from "express";
import { enqueueVerificationEmail, enqueuePaymentEmail } from "../queues/enqueue";
import { successResponse } from "../lib/api-response";

export const emailController = {
  async sendVerification(req: Request, res: Response) {
    await enqueueVerificationEmail(req.body.data);
    successResponse(res, "Verification Mail sent successfully");
  },

  async sendPaymentConfirmation(req: Request, res: Response) {
    await enqueuePaymentEmail(req.body.data);
    successResponse(res, "Payment Mail sent successfully");
  },
};
