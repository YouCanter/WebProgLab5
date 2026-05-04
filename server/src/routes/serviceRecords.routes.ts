import { Router } from "express";
import { serviceRecordsController } from "../controllers/serviceRecords.controller.js";
import { validate } from "../middleware/validate.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { idParamSchema } from "../schemas/common.schema.js";
import {
  createServiceRecordSchema,
  serviceRecordsQuerySchema,
  updateServiceRecordSchema,
} from "../schemas/serviceRecords.schema.js";

const router = Router();

router.get(
  "/",
  validate({ query: serviceRecordsQuerySchema }),
  asyncHandler(serviceRecordsController.list),
);

router.get(
  "/:id",
  validate({ params: idParamSchema }),
  asyncHandler(serviceRecordsController.getOne),
);

router.post(
  "/",
  validate({ body: createServiceRecordSchema }),
  asyncHandler(serviceRecordsController.create),
);

router.patch(
  "/:id",
  validate({ params: idParamSchema, body: updateServiceRecordSchema }),
  asyncHandler(serviceRecordsController.update),
);

router.delete(
  "/:id",
  validate({ params: idParamSchema }),
  asyncHandler(serviceRecordsController.remove),
);

export default router;
