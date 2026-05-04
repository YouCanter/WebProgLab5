import type { NormalizedApiError } from "@/types/api";

const BASE_URL = import.meta.env.VITE_API_BASE_URL ?? "/api";

export class ApiError extends Error {
  public readonly status: number;
  public readonly code: NormalizedApiError["code"];
  public readonly fieldErrors?: Record<string, string[]>;

  constructor(normalized: NormalizedApiError) {
    super(normalized.message);
    this.name = "ApiError";
    this.status = normalized.status;
    this.code = normalized.code;
    this.fieldErrors = normalized.fieldErrors;
  }
}

interface RequestOptions {
  method?: "GET" | "POST" | "PATCH" | "PUT" | "DELETE";
  body?: unknown;
  signal?: AbortSignal;
}

interface RawApiError {
  error?: {
    code?: string;
    message?: string;
    details?: unknown;
  };
}

const adaptError = (status: number, body: unknown): NormalizedApiError => {
  const raw = (body ?? {}) as RawApiError;
  const code = (raw.error?.code as NormalizedApiError["code"]) || (status === 0 ? "NETWORK_ERROR" : "UNKNOWN");
  const message = raw.error?.message || defaultMessageFor(status);

  let fieldErrors: Record<string, string[]> | undefined;
  const details = raw.error?.details as { fieldErrors?: Record<string, string[]> } | undefined;
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

const request = async <T>(path: string, options: RequestOptions = {}): Promise<T> => {
  const { method = "GET", body, signal } = options;

  let response: Response;
  try {
    response = await fetch(`${BASE_URL}${path}`, {
      method,
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: body !== undefined ? JSON.stringify(body) : undefined,
      signal,
    });
  } catch (err) {
    if ((err as Error).name === "AbortError") throw err;
    throw new ApiError(adaptError(0, { error: { code: "NETWORK_ERROR", message: (err as Error).message } }));
  }

  if (response.status === 204) {
    return undefined as T;
  }

  let payload: unknown = null;
  const text = await response.text();
  if (text) {
    try {
      payload = JSON.parse(text);
    } catch {
      payload = { error: { code: "INTERNAL", message: text } };
    }
  }

  if (!response.ok) {
    throw new ApiError(adaptError(response.status, payload));
  }

  return payload as T;
};

export const httpClient = {
  get: <T>(path: string, signal?: AbortSignal) => request<T>(path, { method: "GET", signal }),
  post: <T>(path: string, body: unknown) => request<T>(path, { method: "POST", body }),
  patch: <T>(path: string, body: unknown) => request<T>(path, { method: "PATCH", body }),
  delete: <T>(path: string) => request<T>(path, { method: "DELETE" }),
};
