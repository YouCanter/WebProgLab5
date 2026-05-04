import type { SortOrder } from "./api";

export interface Department {
  id: number;
  name: string;
  description: string | null;
  createdAt: string;
  _count?: { users: number };
}

export interface CreateDepartmentDto {
  name: string;
  description?: string;
}

export type UpdateDepartmentDto = Partial<CreateDepartmentDto>;

export type DepartmentSortField = "id" | "name" | "createdAt";

export interface DepartmentsQuery {
  search?: string;
  sort?: DepartmentSortField;
  order?: SortOrder;
  page?: number;
  pageSize?: number;
}
