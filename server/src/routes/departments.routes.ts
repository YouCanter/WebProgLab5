import { Router } from "express";
import { departmentsController } from "../controllers/departments.controller.js";
import { validate } from "../middleware/validate.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { idParamSchema } from "../schemas/common.schema.js";
import {
  createDepartmentSchema,
  departmentsQuerySchema,
  updateDepartmentSchema,
} from "../schemas/departments.schema.js";

const router = Router();

router.get(
  "/",
  validate({ query: departmentsQuerySchema }),
  asyncHandler(departmentsController.list),
);

router.get(
  "/:id",
  validate({ params: idParamSchema }),
  asyncHandler(departmentsController.getOne),
);

router.post(
  "/",
  validate({ body: createDepartmentSchema }),
  asyncHandler(departmentsController.create),
);

router.patch(
  "/:id",
  validate({ params: idParamSchema, body: updateDepartmentSchema }),
  asyncHandler(departmentsController.update),
);

router.delete(
  "/:id",
  validate({ params: idParamSchema }),
  asyncHandler(departmentsController.remove),
);

export default router;
