import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { PaginationMeta, RequestStatus } from "@/types/api";
import type { User } from "@/types/user";
import {
  createUser,
  deleteUser,
  fetchUserById,
  fetchUsers,
  updateUser,
} from "./usersThunks";

export interface UsersState {
  entities: User[];
  meta: PaginationMeta | null;
  selectedUser: User | null;
  status: RequestStatus;
  mutationStatus: RequestStatus;
  error: string | null;
  dataVersion: number;
}

const initialState: UsersState = {
  entities: [],
  meta: null,
  selectedUser: null,
  status: "idle",
  mutationStatus: "idle",
  error: null,
  dataVersion: 0,
};

const usersSlice = createSlice({
  name: "users",
  initialState,
  reducers: {
    invalidateUsers(state) {
      state.dataVersion += 1;
    },
    clearSelectedUser(state) {
      state.selectedUser = null;
    },
    setSelectedUser(state, action: PayloadAction<User | null>) {
      state.selectedUser = action.payload;
    },
    clearError(state) {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchUsers.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(fetchUsers.fulfilled, (state, action) => {
        state.status = "success";
        state.entities = action.payload.data;
        state.meta = action.payload.meta;
      })
      .addCase(fetchUsers.rejected, (state, action) => {
        if (action.meta.aborted) return;
        state.status = "error";
        state.error = action.payload ?? action.error.message ?? "Помилка завантаження";
      })

      .addCase(fetchUserById.fulfilled, (state, action) => {
        state.selectedUser = action.payload;
      })
      .addCase(fetchUserById.rejected, (state, action) => {
        if (action.meta.aborted) return;
        state.selectedUser = null;
      })

      .addCase(createUser.pending, (state) => {
        state.mutationStatus = "loading";
      })
      .addCase(createUser.fulfilled, (state) => {
        state.mutationStatus = "success";
        state.dataVersion += 1;
      })
      .addCase(createUser.rejected, (state, action) => {
        state.mutationStatus = "error";
        state.error = action.payload ?? action.error.message ?? "Помилка створення";
      })

      .addCase(updateUser.pending, (state) => {
        state.mutationStatus = "loading";
      })
      .addCase(updateUser.fulfilled, (state, action) => {
        state.mutationStatus = "success";
        state.selectedUser = action.payload;
        state.dataVersion += 1;
      })
      .addCase(updateUser.rejected, (state, action) => {
        state.mutationStatus = "error";
        state.error = action.payload ?? action.error.message ?? "Помилка оновлення";
      })

      .addCase(deleteUser.pending, (state) => {
        state.mutationStatus = "loading";
      })
      .addCase(deleteUser.fulfilled, (state, action) => {
        state.mutationStatus = "success";
        state.dataVersion += 1;
        if (state.selectedUser?.id === action.payload) {
          state.selectedUser = null;
        }
      })
      .addCase(deleteUser.rejected, (state, action) => {
        state.mutationStatus = "error";
        state.error = action.payload ?? action.error.message ?? "Помилка видалення";
      });
  },
});

export const usersActions = usersSlice.actions;
export const usersReducer = usersSlice.reducer;
