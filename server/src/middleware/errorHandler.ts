import type { NextFunction, Request, Response } from "express";
import { Prisma } from "@prisma/client";
import { ZodError } from "zod";
import { AppError } from "../errors/AppError.js";

interface ApiErrorPayload {
  error: {
    code: string;
    message: string;
    details?: unknown;
  };
}

export const errorHandler = (
  err: unknown,
  _req: Request,
  res: Response,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  _next: NextFunction,
): void => {
  if (err instanceof ZodError) {
    const payload: ApiErrorPayload = {
      error: {
        code: "VALIDATION_ERROR",
        message: "Помилка валідації даних",
        details: err.flatten(),
      },
    };
    res.status(400).json(payload);
    return;
  }

  if (err instanceof AppError) {
    const payload: ApiErrorPayload = {
      error: {
        code: err.code,
        message: err.message,
        details: err.details,
      },
    };
    res.status(err.status).json(payload);
    return;
  }

  if (err instanceof Prisma.PrismaClientKnownRequestError) {
    if (err.code === "P2002") {
      const target = (err.meta?.target as string[] | undefined)?.join(", ");
      res.status(409).json({
        error: {
          code: "CONFLICT",
          message: `Запис із такими унікальними полями вже існує${target ? `: ${target}` : ""}`,
          details: err.meta,
        },
      } satisfies ApiErrorPayload);
      return;
    }
    if (err.code === "P2025") {
      res.status(404).json({
        error: {
          code: "NOT_FOUND",
          message: "Запис не знайдено",
        },
      } satisfies ApiErrorPayload);
      return;
    }
    if (err.code === "P2003") {
      res.status(409).json({
        error: {
          code: "CONFLICT",
          message: "Порушено зв'язок між таблицями (FK)",
          details: err.meta,
        },
      } satisfies ApiErrorPayload);
      return;
    }
  }

  console.error("Unhandled error:", err);
  res.status(500).json({
    error: {
      code: "INTERNAL",
      message: "Внутрішня помилка сервера",
    },
  } satisfies ApiErrorPayload);
};
