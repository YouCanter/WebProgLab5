import type { Request, Response } from "express";

export const notFound = (req: Request, res: Response): void => {
  res.status(404).json({
    error: {
      code: "NOT_FOUND",
      message: `Маршрут ${req.method} ${req.originalUrl} не знайдено`,
    },
  });
};
