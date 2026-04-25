import { Router } from "express";
import { feedbackController } from "../controllers/feedback.controller";
import { validateBody } from "../lib/validate";
import { AddFeedbackSchema } from "../schemas/feedback.schema";

const router = Router();

router.post("/add-feedback", validateBody(AddFeedbackSchema), feedbackController.addFeedback);

export default router;
