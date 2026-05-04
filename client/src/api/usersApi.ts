import { httpClient } from "./httpClient";
import type { Paginated, SingleResource } from "@/types/api";
import type {
  CreateUserDto,
  UpdateUserDto,
  User,
  UsersQuery,
} from "@/types/user";
import { buildQueryString } from "@/utils/buildQueryString";

export const usersApi = {
  getUsers(query: UsersQuery = {}, signal?: AbortSignal): Promise<Paginated<User>> {
    return httpClient.get<Paginated<User>>(`/users${buildQueryString(query)}`, signal);
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
