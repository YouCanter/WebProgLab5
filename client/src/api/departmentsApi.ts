import { httpClient } from "./httpClient";
import type { Paginated, SingleResource } from "@/types/api";
import type {
  CreateDepartmentDto,
  Department,
  DepartmentsQuery,
  UpdateDepartmentDto,
} from "@/types/department";
import { buildQueryString } from "@/utils/buildQueryString";

export const departmentsApi = {
  getDepartments(query: DepartmentsQuery = {}, signal?: AbortSignal): Promise<Paginated<Department>> {
    return httpClient.get<Paginated<Department>>(`/departments${buildQueryString(query)}`, signal);
  },
  getDepartment(id: number, signal?: AbortSignal): Promise<Department> {
    return httpClient
      .get<SingleResource<Department>>(`/departments/${id}`, signal)
      .then((r) => r.data);
  },
  createDepartment(dto: CreateDepartmentDto): Promise<Department> {
    return httpClient.post<SingleResource<Department>>(`/departments`, dto).then((r) => r.data);
  },
  updateDepartment(id: number, dto: UpdateDepartmentDto): Promise<Department> {
    return httpClient.patch<SingleResource<Department>>(`/departments/${id}`, dto).then((r) => r.data);
  },
  deleteDepartment(id: number): Promise<void> {
    return httpClient.delete<void>(`/departments/${id}`);
  },
};
