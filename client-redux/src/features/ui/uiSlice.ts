import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { SortOrder, UserSortField } from "@/types/user";

export interface UiState {
  search: string;
  page: number;
  pageSize: number;
  sort: UserSortField;
  order: SortOrder;
  selectedUserId: number | null;
}

export const initialUiState: UiState = {
  search: "",
  page: 1,
  pageSize: 5,
  sort: "createdAt",
  order: "desc",
  selectedUserId: null,
};

const uiSlice = createSlice({
  name: "ui",
  initialState: initialUiState,
  reducers: {
    setSearch(state, action: PayloadAction<string>) {
      state.search = action.payload;
      state.page = 1;
    },
    setPage(state, action: PayloadAction<number>) {
      state.page = Math.max(1, action.payload);
    },
    setSort(state, action: PayloadAction<UserSortField>) {
      state.sort = action.payload;
      state.page = 1;
    },
    setOrder(state, action: PayloadAction<SortOrder>) {
      state.order = action.payload;
    },
    toggleSort(state, action: PayloadAction<UserSortField>) {
      if (state.sort === action.payload) {
        state.order = state.order === "asc" ? "desc" : "asc";
      } else {
        state.sort = action.payload;
        state.order = "asc";
      }
      state.page = 1;
    },
    setSelectedUserId(state, action: PayloadAction<number | null>) {
      state.selectedUserId = action.payload;
    },
    resetFilters(state) {
      state.search = "";
      state.page = 1;
      state.sort = "createdAt";
      state.order = "desc";
      state.selectedUserId = null;
    },
  },
});

export const uiActions = uiSlice.actions;
export const uiReducer = uiSlice.reducer;
