import { httpClient } from "./httpClient";
import type { Paginated, SingleResource } from "@/types/api";
import type {
  CreateUserDto,
  UpdateUserDto,
  User,
  UsersQuery,
} from "@/types/user";

const buildQuery = (params: Record<string, unknown>): string => {
  const search = new URLSearchParams();
  for (const [key, value] of Object.entries(params)) {
    if (value === undefined || value === null || value === "") continue;
    if (typeof value === "boolean") {
      search.append(key, value ? "true" : "false");
      continue;
    }
    search.append(key, String(value));
  }
  const str = search.toString();
  return str ? `?${str}` : "";
};

export const usersApi = {
  getUsers(query: UsersQuery = {}, signal?: AbortSignal): Promise<Paginated<User>> {
    return httpClient.get<Paginated<User>>(
      `/users${buildQuery(query as Record<string, unknown>)}`,
      signal,
    );
  },
  getUser(id: number, signal?: AbortSignal): Promise<User> {
    return httpClient
      .get<SingleResource<User>>(`/users/${id}`, signal)
      .then((r) => r.data);
  },
  createUser(dto: CreateUserDto): Promise<User> {
    return httpClient.post<SingleResource<User>>(`/users`, dto).then((r) => r.data);
  },
  updateUser(id: number, dto: UpdateUserDto): Promise<User> {
    return httpClient.patch<SingleResource<User>>(`/users/${id}`, dto).then((r) => r.data);
  },
  deleteUser(id: number): Promise<void> {
    return httpClient.delete<void>(`/users/${id}`);
  },
};
