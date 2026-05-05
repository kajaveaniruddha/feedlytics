import { Router } from "express";
import { emailController } from "../controllers/email.controller";
import { validateBody } from "../lib/validate";
import { VerificationEmailSchema, PaymentEmailSchema } from "../schemas/email.schema";

const router = Router();

router.post("/get-verification-email", validateBody(VerificationEmailSchema), emailController.sendVerification);
router.post("/get-payment-email", validateBody(PaymentEmailSchema), emailController.sendPaymentConfirmation);

export default router;
