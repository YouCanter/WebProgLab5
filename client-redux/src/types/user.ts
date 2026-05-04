export type SortOrder = "asc" | "desc";
export type UserSortField = "fullName" | "email" | "position" | "createdAt";

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

export interface UsersQuery {
  search?: string;
  page?: number;
  pageSize?: number;
  sort?: UserSortField;
  order?: SortOrder;
  departmentId?: number;
  isActive?: boolean;
}

export interface Department {
  id: number;
  name: string;
}
