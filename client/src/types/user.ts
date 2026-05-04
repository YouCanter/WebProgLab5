import type { SortOrder } from "./api";

export interface User {
  id: number;
  fullName: string;
  email: string;
  phone: string | null;
  position: string;
  isActive: boolean;
  departmentId: number;
  department?: { id: number; name: string };
  createdAt: string;
  updatedAt: string;
}

export interface CreateUserDto {
  fullName: string;
  email: string;
  phone?: string;
  position: string;
  isActive?: boolean;
  departmentId: number;
}

export type UpdateUserDto = Partial<CreateUserDto>;

export type UserSortField = "id" | "fullName" | "email" | "position" | "createdAt";

export interface UsersQuery {
  search?: string;
  departmentId?: number;
  isActive?: boolean;
  sort?: UserSortField;
  order?: SortOrder;
  page?: number;
  pageSize?: number;
}
