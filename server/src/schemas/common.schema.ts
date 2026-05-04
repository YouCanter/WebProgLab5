import { z } from "zod";

export const idParamSchema = z.object({
  id: z.coerce.number().int().positive(),
});

export const paginationSchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  pageSize: z.coerce.number().int().positive().max(100).default(10),
});

export const sortOrderSchema = z.enum(["asc", "desc"]).default("asc");

export type IdParam = z.infer<typeof idParamSchema>;
