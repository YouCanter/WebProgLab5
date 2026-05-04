import { useMemo } from "react";
import { usersApi } from "@/api/usersApi";
import type { CreateUserDto, UpdateUserDto, User } from "@/types/user";
import {
  useUsersDispatch,
  useUsersReload,
  useUsersState,
} from "./UsersContext";

export interface UseUsersResult {
  state: ReturnType<typeof useUsersState>;
  setSearch: (value: string) => void;
  setPage: (page: number) => void;
  selectUser: (user: User | null) => void;
  createUser: (dto: CreateUserDto) => Promise<User>;
  updateUser: (id: number, dto: UpdateUserDto) => Promise<User>;
  deleteUser: (id: number) => Promise<void>;
}

export const useUsers = (): UseUsersResult => {
  const state = useUsersState();
  const dispatch = useUsersDispatch();
  const reload = useUsersReload();

  return useMemo<UseUsersResult>(
    () => ({
      state,
      setSearch: (value) => dispatch({ type: "SET_SEARCH", payload: value }),
      setPage: (page) => dispatch({ type: "SET_PAGE", payload: page }),
      selectUser: (user) => dispatch({ type: "SELECT_USER", payload: user }),

      createUser: async (dto) => {
        const created = await usersApi.createUser(dto);
        dispatch({ type: "USER_CREATED", payload: created });
        reload();
        return created;
      },

      updateUser: async (id, dto) => {
        const updated = await usersApi.updateUser(id, dto);
        dispatch({ type: "USER_UPDATED", payload: updated });
        dispatch({ type: "SELECT_USER", payload: null });
        reload();
        return updated;
      },

      deleteUser: async (id) => {
        await usersApi.deleteUser(id);
        dispatch({ type: "USER_DELETED", payload: id });
        reload();
      },
    }),
    [state, dispatch, reload],
  );
};
