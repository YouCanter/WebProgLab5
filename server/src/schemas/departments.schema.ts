import { z } from "zod";
import { sortOrderSchema } from "./common.schema.js";

export const departmentSortFields = ["id", "name", "createdAt"] as const;

export const createDepartmentSchema = z.object({
  name: z.string().min(2).max(120),
  description: z.string().max(500).optional().or(z.literal("").transform(() => undefined)),
});

export const updateDepartmentSchema = createDepartmentSchema.partial();

export const departmentsQuerySchema = z.object({
  search: z.string().trim().optional(),
  sort: z.enum(departmentSortFields).default("name"),
  order: sortOrderSchema,
  page: z.coerce.number().int().positive().default(1),
  pageSize: z.coerce.number().int().positive().max(100).default(50),
});

export type CreateDepartmentDto = z.infer<typeof createDepartmentSchema>;
export type UpdateDepartmentDto = z.infer<typeof updateDepartmentSchema>;
export type DepartmentsQuery = z.infer<typeof departmentsQuerySchema>;
