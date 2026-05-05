export type RequestStatus = "idle" | "loading" | "success" | "error";

export interface PaginationMeta {
  page: number;
  pageSize: number;
  total: number;
  totalPages: number;
}

export interface Paginated<T> {
  data: T[];
  meta: PaginationMeta;
}

export interface SingleResource<T> {
  data: T;
}

export type ApiErrorCode =
  | "VALIDATION_ERROR"
  | "NOT_FOUND"
  | "CONFLICT"
  | "BAD_REQUEST"
  | "INTERNAL"
  | "NETWORK_ERROR"
  | "UNKNOWN";

export interface NormalizedApiError {
  code: ApiErrorCode;
  message: string;
  status: number;
  fieldErrors?: Record<string, string[]>;
}
