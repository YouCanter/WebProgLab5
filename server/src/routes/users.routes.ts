import { Router } from "express";
import { usersController } from "../controllers/users.controller.js";
import { validate } from "../middleware/validate.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { idParamSchema } from "../schemas/common.schema.js";
import {
  createUserSchema,
  updateUserSchema,
  usersQuerySchema,
} from "../schemas/users.schema.js";

const router = Router();

router.get(
  "/",
  validate({ query: usersQuerySchema }),
  asyncHandler(usersController.list),
);

router.get(
  "/:id",
  validate({ params: idParamSchema }),
  asyncHandler(usersController.getOne),
);

router.post(
  "/",
  validate({ body: createUserSchema }),
  asyncHandler(usersController.create),
);

router.patch(
  "/:id",
  validate({ params: idParamSchema, body: updateUserSchema }),
  asyncHandler(usersController.update),
);

router.delete(
  "/:id",
  validate({ params: idParamSchema }),
  asyncHandler(usersController.remove),
);

export default router;
