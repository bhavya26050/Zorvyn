import { Router } from "express";
import {
  createRecordHandler,
  deleteRecordHandler,
  getRecordHandler,
  listRecordsHandler,
  updateRecordHandler
} from "../controllers/record.controller";
import { authorizeRoles } from "../middlewares/auth";
import { roles } from "../constants/roles";
import { validateBody, validateQuery } from "../middlewares/validate";
import { createRecordSchema, listRecordsQuerySchema, updateRecordSchema } from "../schemas/record.schema";

const router = Router();

router.get("/", authorizeRoles(roles.viewer, roles.analyst, roles.admin), validateQuery(listRecordsQuerySchema), listRecordsHandler);
router.get("/:id", authorizeRoles(roles.viewer, roles.analyst, roles.admin), getRecordHandler);
router.post("/", authorizeRoles(roles.admin), validateBody(createRecordSchema), createRecordHandler);
router.patch("/:id", authorizeRoles(roles.admin), validateBody(updateRecordSchema), updateRecordHandler);
router.delete("/:id", authorizeRoles(roles.admin), deleteRecordHandler);

export default router;
