import { Router } from "express";
import emailRoutes from "./email.routes";
import healthRoutes from "./health.routes";

const router = Router();

router.use(emailRoutes);
router.use(healthRoutes);

export default router;
