import { z } from "zod";
import { sortOrderSchema } from "./common.schema.js";

export const userSortFields = ["id", "fullName", "email", "position", "createdAt"] as const;

export const createUserSchema = z.object({
  fullName: z.string().min(2, "Мінімум 2 символи").max(120),
  email: z.string().email("Некоректний email"),
  phone: z
    .string()
    .trim()
    .max(32)
    .optional()
    .or(z.literal("").transform(() => undefined)),
  position: z.string().min(2).max(120),
  isActive: z.boolean().optional().default(true),
  departmentId: z.coerce.number().int().positive(),
});

export const updateUserSchema = createUserSchema.partial();

export const usersQuerySchema = z.object({
  search: z.string().trim().optional(),
  departmentId: z.coerce.number().int().positive().optional(),
  isActive: z
    .union([z.literal("true"), z.literal("false"), z.boolean()])
    .optional()
    .transform((v) => (v === undefined ? undefined : v === true || v === "true")),
  sort: z.enum(userSortFields).default("createdAt"),
  order: sortOrderSchema,
  page: z.coerce.number().int().positive().default(1),
  pageSize: z.coerce.number().int().positive().max(100).default(10),
});

export type CreateUserDto = z.infer<typeof createUserSchema>;
export type UpdateUserDto = z.infer<typeof updateUserSchema>;
export type UsersQuery = z.infer<typeof usersQuerySchema>;
