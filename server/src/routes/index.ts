import { Router } from "express";
import usersRoutes from "./users.routes.js";
import departmentsRoutes from "./departments.routes.js";
import serviceRecordsRoutes from "./serviceRecords.routes.js";

const router = Router();

router.get("/health", (_req, res) => {
  res.json({ status: "ok" });
});

router.use("/users", usersRoutes);
router.use("/departments", departmentsRoutes);
router.use("/service-records", serviceRecordsRoutes);

export default router;
