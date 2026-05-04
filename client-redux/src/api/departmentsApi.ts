import { httpClient } from "./httpClient";
import type { Paginated } from "@/types/api";
import type { Department } from "@/types/user";

export const departmentsApi = {
  getAllDepartments(signal?: AbortSignal): Promise<Department[]> {
    return httpClient
      .get<Paginated<Department>>(`/departments?pageSize=100`, signal)
      .then((res) => res.data);
  },
};
