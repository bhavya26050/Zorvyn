import { Router } from "express";
import {
  createUserHandler,
  getUsersHandler,
  updateUserRoleHandler,
  updateUserStatusHandler
} from "../controllers/user.controller";
import { authorizeRoles } from "../middlewares/auth";
import { validateBody } from "../middlewares/validate";
import { createUserSchema, updateRoleSchema, updateStatusSchema } from "../schemas/user.schema";
import { roles } from "../constants/roles";

const router = Router();

router.get("/", authorizeRoles(roles.admin), getUsersHandler);
router.post("/", authorizeRoles(roles.admin), validateBody(createUserSchema), createUserHandler);
router.patch("/:id/role", authorizeRoles(roles.admin), validateBody(updateRoleSchema), updateUserRoleHandler);
router.patch("/:id/status", authorizeRoles(roles.admin), validateBody(updateStatusSchema), updateUserStatusHandler);

export default router;
