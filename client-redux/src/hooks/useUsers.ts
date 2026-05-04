import { useCallback } from "react";
import { uiActions } from "@/features/ui/uiSlice";
import {
  selectOrder,
  selectPage,
  selectPageSize,
  selectSearch,
  selectSelectedUserId,
  selectSort,
  selectUsersQuery,
} from "@/features/ui/uiSelectors";
import {
  selectDataVersion,
  selectIsMutating,
  selectSelectedUser,
  selectUsersEntities,
  selectUsersError,
  selectUsersMeta,
  selectUsersStatus,
} from "@/features/users/usersSelectors";
import { usersActions } from "@/features/users/usersSlice";
import {
  createUser as createUserThunk,
  deleteUser as deleteUserThunk,
  fetchUserById as fetchUserByIdThunk,
  fetchUsers as fetchUsersThunk,
  updateUser as updateUserThunk,
} from "@/features/users/usersThunks";
import type { CreateUserDto, SortOrder, UpdateUserDto, User, UserSortField, UsersQuery } from "@/types/user";
import { useAppDispatch } from "./useAppDispatch";
import { useAppSelector } from "./useAppSelector";

export const useUsers = () => {
  const dispatch = useAppDispatch();

  const search = useAppSelector(selectSearch);
  const page = useAppSelector(selectPage);
  const pageSize = useAppSelector(selectPageSize);
  const sort = useAppSelector(selectSort);
  const order = useAppSelector(selectOrder);
  const selectedUserId = useAppSelector(selectSelectedUserId);
  const query = useAppSelector(selectUsersQuery);

  const users = useAppSelector(selectUsersEntities);
  const meta = useAppSelector(selectUsersMeta);
  const status = useAppSelector(selectUsersStatus);
  const mutating = useAppSelector(selectIsMutating);
  const error = useAppSelector(selectUsersError);
  const selectedUser = useAppSelector(selectSelectedUser);
  const dataVersion = useAppSelector(selectDataVersion);

  const setSearch = useCallback((value: string) => dispatch(uiActions.setSearch(value)), [dispatch]);
  const setPage = useCallback((value: number) => dispatch(uiActions.setPage(value)), [dispatch]);
  const setSort = useCallback((value: UserSortField) => dispatch(uiActions.setSort(value)), [dispatch]);
  const setOrder = useCallback((value: SortOrder) => dispatch(uiActions.setOrder(value)), [dispatch]);
  const toggleSort = useCallback((value: UserSortField) => dispatch(uiActions.toggleSort(value)), [dispatch]);
  const resetFilters = useCallback(() => dispatch(uiActions.resetFilters()), [dispatch]);

  const selectUser = useCallback(
    (user: User | null) => {
      dispatch(uiActions.setSelectedUserId(user?.id ?? null));
      dispatch(usersActions.setSelectedUser(user));
    },
    [dispatch],
  );

  const loadUsers = useCallback(
    (q: UsersQuery = query) => dispatch(fetchUsersThunk(q)),
    [dispatch, query],
  );

  const loadUserById = useCallback(
    (id: number) => dispatch(fetchUserByIdThunk(id)),
    [dispatch],
  );

  const createUser = useCallback(
    async (dto: CreateUserDto) => {
      const result = await dispatch(createUserThunk(dto)).unwrap();
      return result;
    },
    [dispatch],
  );

  const updateUser = useCallback(
    async (id: number, dto: UpdateUserDto) => {
      const result = await dispatch(updateUserThunk({ id, dto })).unwrap();
      dispatch(uiActions.setSelectedUserId(null));
      return result;
    },
    [dispatch],
  );

  const deleteUser = useCallback(
    async (id: number) => {
      await dispatch(deleteUserThunk(id)).unwrap();
      dispatch(uiActions.setSelectedUserId(null));
    },
    [dispatch],
  );

  return {
    ui: { search, page, pageSize, sort, order, selectedUserId },
    query,
    users,
    meta,
    status,
    mutating,
    error,
    selectedUser,
    dataVersion,
    setSearch,
    setPage,
    setSort,
    setOrder,
    toggleSort,
    resetFilters,
    selectUser,
    loadUsers,
    loadUserById,
    createUser,
    updateUser,
    deleteUser,
  };
};
