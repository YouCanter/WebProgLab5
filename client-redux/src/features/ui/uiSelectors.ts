import { createSelector } from "@reduxjs/toolkit";
import type { RootState } from "@/app/store";
import type { UsersQuery } from "@/types/user";

export const selectUi = (state: RootState) => state.ui;
export const selectSearch = (state: RootState) => state.ui.search;
export const selectPage = (state: RootState) => state.ui.page;
export const selectPageSize = (state: RootState) => state.ui.pageSize;
export const selectSort = (state: RootState) => state.ui.sort;
export const selectOrder = (state: RootState) => state.ui.order;
export const selectSelectedUserId = (state: RootState) => state.ui.selectedUserId;

export const selectUsersQuery = createSelector(
  [selectSearch, selectPage, selectPageSize, selectSort, selectOrder],
  (search, page, pageSize, sort, order): UsersQuery => ({
    search: search.trim() || undefined,
    page,
    pageSize,
    sort,
    order,
  }),
);
