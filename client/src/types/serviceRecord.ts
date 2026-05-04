import type { SortOrder } from "./api";

export const serviceRecordTypes = ["HIRE", "PROMOTION", "TRANSFER", "DISMISSAL", "NOTE"] as const;
export type ServiceRecordType = (typeof serviceRecordTypes)[number];

export const serviceRecordTypeLabels: Record<ServiceRecordType, string> = {
  HIRE: "Прийом на роботу",
  PROMOTION: "Підвищення",
  TRANSFER: "Переведення",
  DISMISSAL: "Звільнення",
  NOTE: "Примітка",
};

export interface ServiceRecord {
  id: number;
  userId: number;
  user?: { id: number; fullName: string; email: string };
  departmentId: number | null;
  department?: { id: number; name: string } | null;
  type: ServiceRecordType;
  note: string | null;
  occurredAt: string;
  createdAt: string;
}

export interface CreateServiceRecordDto {
  userId: number;
  departmentId?: number;
  type: ServiceRecordType;
  note?: string;
  occurredAt?: string;
}

export type UpdateServiceRecordDto = Partial<CreateServiceRecordDto>;

export type ServiceRecordSortField = "id" | "occurredAt" | "createdAt" | "type";

export interface ServiceRecordsQuery {
  search?: string;
  userId?: number;
  departmentId?: number;
  type?: ServiceRecordType;
  sort?: ServiceRecordSortField;
  order?: SortOrder;
  page?: number;
  pageSize?: number;
}
