import { departmentsApi } from "@/api/departmentsApi";
import type {
  CreateDepartmentDto,
  DepartmentsQuery,
  UpdateDepartmentDto,
} from "@/types/department";

export const departmentsService = {
  loadDepartments: (query: DepartmentsQuery, signal?: AbortSignal) =>
    departmentsApi.getDepartments(query, signal),
  loadAllDepartments: () => departmentsApi.getDepartments({ pageSize: 100 }),
  loadDepartment: (id: number, signal?: AbortSignal) =>
    departmentsApi.getDepartment(id, signal),
  createDepartment: (dto: CreateDepartmentDto) => departmentsApi.createDepartment(dto),
  updateDepartment: (id: number, dto: UpdateDepartmentDto) =>
    departmentsApi.updateDepartment(id, dto),
  deleteDepartment: (id: number) => departmentsApi.deleteDepartment(id),
};
