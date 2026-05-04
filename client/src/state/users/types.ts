import type { User } from "@/types/user";

export type RequestStatus = "idle" | "loading" | "success" | "error";

export interface UsersMeta {
  page: number;
  pageSize: number;
  total: number;
  totalPages: number;
}

export interface UsersState {
  data: {
    users: User[];
    selectedUser: User | null;
    meta: UsersMeta | null;
  };
  ui: {
    search: string;
    page: number;
    pageSize: number;
  };
  status: RequestStatus;
  error: string | null;
}

export type UsersAction =
  | { type: "LOAD_START" }
  | { type: "LOAD_SUCCESS"; payload: { users: User[]; meta: UsersMeta } }
  | { type: "LOAD_ERROR"; payload: string }
  | { type: "SELECT_USER"; payload: User | null }
  | { type: "SET_SEARCH"; payload: string }
  | { type: "SET_PAGE"; payload: number }
  | { type: "USER_CREATED"; payload: User }
  | { type: "USER_UPDATED"; payload: User }
  | { type: "USER_DELETED"; payload: number };

export const initialUsersState: UsersState = {
  data: {
    users: [],
    selectedUser: null,
    meta: null,
  },
  ui: {
    search: "",
    page: 1,
    pageSize: 4,
  },
  status: "idle",
  error: null,
};
