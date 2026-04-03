import { Router } from "express";
import userRoutes from "./user.routes";
import recordRoutes from "./record.routes";
import dashboardRoutes from "./dashboard.routes";

const router = Router();

router.use("/users", userRoutes);
router.use("/records", recordRoutes);
router.use("/dashboard", dashboardRoutes);

export default router;
