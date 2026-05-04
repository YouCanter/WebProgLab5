import { z } from "zod";
import { sortOrderSchema } from "./common.schema.js";

export const serviceRecordTypes = ["HIRE", "PROMOTION", "TRANSFER", "DISMISSAL", "NOTE"] as const;
export const serviceRecordSortFields = ["id", "occurredAt", "createdAt", "type"] as const;

export const createServiceRecordSchema = z.object({
  userId: z.coerce.number().int().positive(),
  departmentId: z.coerce.number().int().positive().optional(),
  type: z.enum(serviceRecordTypes),
  note: z.string().max(500).optional().or(z.literal("").transform(() => undefined)),
  occurredAt: z.coerce.date().optional(),
});

export const updateServiceRecordSchema = createServiceRecordSchema.partial();

export const serviceRecordsQuerySchema = z.object({
  search: z.string().trim().optional(),
  userId: z.coerce.number().int().positive().optional(),
  departmentId: z.coerce.number().int().positive().optional(),
  type: z.enum(serviceRecordTypes).optional(),
  sort: z.enum(serviceRecordSortFields).default("occurredAt"),
  order: sortOrderSchema.default("desc"),
  page: z.coerce.number().int().positive().default(1),
  pageSize: z.coerce.number().int().positive().max(100).default(10),
});

export type CreateServiceRecordDto = z.infer<typeof createServiceRecordSchema>;
export type UpdateServiceRecordDto = z.infer<typeof updateServiceRecordSchema>;
export type ServiceRecordsQuery = z.infer<typeof serviceRecordsQuerySchema>;
