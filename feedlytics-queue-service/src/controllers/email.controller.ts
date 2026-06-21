import { Request, Response } from "express";
import { enqueueVerificationEmail, enqueuePaymentEmail } from "../queues/enqueue";
import { successResponse } from "../lib/api-response";
import { logger } from "../lib/logger";

export const emailController = {
  async sendVerification(req: Request, res: Response) {
    const job = await enqueueVerificationEmail(req.body.data);
    logger.info(
      { channel: "http", route: "POST /get-verification-email", bullJobId: job.id },
      "Accepted verification email enqueue request",
    );
    successResponse(res, "Verification Mail sent successfully");
  },

  async sendPaymentConfirmation(req: Request, res: Response) {
    const job = await enqueuePaymentEmail(req.body.data);
    logger.info(
      { channel: "http", route: "POST /get-payment-email", bullJobId: job.id },
      "Accepted payment confirmation email enqueue request",
    );
    successResponse(res, "Payment Mail sent successfully");
  },
};
