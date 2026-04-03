import { Router } from "express";
import {
  getCategoryBreakdownHandler,
  getRecentActivityHandler,
  getSummaryHandler,
  getTrendsHandler
} from "../controllers/dashboard.controller";
import { authorizeRoles } from "../middlewares/auth";
import { roles } from "../constants/roles";
import { validateQuery } from "../middlewares/validate";
import { trendsQuerySchema } from "../schemas/dashboard.schema";

const router = Router();

router.get("/summary", authorizeRoles(roles.viewer, roles.analyst, roles.admin), getSummaryHandler);
router.get("/category-breakdown", authorizeRoles(roles.viewer, roles.analyst, roles.admin), getCategoryBreakdownHandler);
router.get("/recent-activity", authorizeRoles(roles.viewer, roles.analyst, roles.admin), getRecentActivityHandler);
router.get("/trends", authorizeRoles(roles.viewer, roles.analyst, roles.admin), validateQuery(trendsQuerySchema), getTrendsHandler);

export default router;
