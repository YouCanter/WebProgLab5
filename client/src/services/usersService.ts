import { usersApi } from "@/api/usersApi";
import type { CreateUserDto, UpdateUserDto, UsersQuery } from "@/types/user";

export const usersService = {
  loadUsers: (query: UsersQuery, signal?: AbortSignal) => usersApi.getUsers(query, signal),
  loadUser: (id: number, signal?: AbortSignal) => usersApi.getUser(id, signal),
  createUser: (dto: CreateUserDto) => usersApi.createUser(dto),
  updateUser: (id: number, dto: UpdateUserDto) => usersApi.updateUser(id, dto),
  deleteUser: (id: number) => usersApi.deleteUser(id),
};
