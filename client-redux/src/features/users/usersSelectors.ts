import { createSelector } from "@reduxjs/toolkit";
import type { RootState } from "@/app/store";

export const selectUsersState = (state: RootState) => state.users;

export const selectUsersEntities = (state: RootState) => state.users.entities;
export const selectUsersMeta = (state: RootState) => state.users.meta;
export const selectUsersStatus = (state: RootState) => state.users.status;
export const selectMutationStatus = (state: RootState) => state.users.mutationStatus;
export const selectUsersError = (state: RootState) => state.users.error;
export const selectSelectedUser = (state: RootState) => state.users.selectedUser;
export const selectDataVersion = (state: RootState) => state.users.dataVersion;

export const selectIsLoading = createSelector(
  selectUsersStatus,
  (status) => status === "loading",
);

export const selectIsMutating = createSelector(
  selectMutationStatus,
  (status) => status === "loading",
);
