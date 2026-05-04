import type { NormalizedApiError } from "@/types/api";

interface RawApiError {
  error?: {
    code?: string;
    message?: string;
    details?: unknown;
  };
}

export const adaptApiError = (status: number, body: unknown): NormalizedApiError => {
  const raw = (body ?? {}) as RawApiError;
  const code = (raw.error?.code as NormalizedApiError["code"]) || (status === 0 ? "NETWORK_ERROR" : "UNKNOWN");
  const message = raw.error?.message || defaultMessageFor(status);

  let fieldErrors: Record<string, string[]> | undefined;
  const details = raw.error?.details as
    | { fieldErrors?: Record<string, string[]> }
    | undefined;
  if (details && typeof details === "object" && "fieldErrors" in details) {
    fieldErrors = details.fieldErrors;
  }

  return { code, message, status, fieldErrors };
};

const defaultMessageFor = (status: number): string => {
  if (status === 0) return "Не вдалося з'єднатися з сервером";
  if (status === 404) return "Запит не знайдено";
  if (status === 409) return "Конфлікт даних";
  if (status === 400) return "Некоректні дані";
  if (status >= 500) return "Помилка сервера";
  return "Невідома помилка";
};
