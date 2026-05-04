import type { UsersAction, UsersState } from "./types";

export const usersReducer = (state: UsersState, action: UsersAction): UsersState => {
  switch (action.type) {
    case "LOAD_START":
      return { ...state, status: "loading", error: null };

    case "LOAD_SUCCESS":
      return {
        ...state,
        status: "success",
        error: null,
        data: {
          ...state.data,
          users: action.payload.users,
          meta: action.payload.meta,
        },
      };

    case "LOAD_ERROR":
      return { ...state, status: "error", error: action.payload };

    case "SELECT_USER":
      return {
        ...state,
        data: { ...state.data, selectedUser: action.payload },
      };

    case "SET_SEARCH":
      return {
        ...state,
        ui: { ...state.ui, search: action.payload, page: 1 },
      };

    case "SET_PAGE":
      return {
        ...state,
        ui: { ...state.ui, page: action.payload },
      };

    case "USER_CREATED":
      return {
        ...state,
        data: {
          ...state.data,
          users: [action.payload, ...state.data.users],
        },
      };

    case "USER_UPDATED":
      return {
        ...state,
        data: {
          ...state.data,
          users: state.data.users.map((u) =>
            u.id === action.payload.id ? action.payload : u,
          ),
          selectedUser:
            state.data.selectedUser?.id === action.payload.id
              ? action.payload
              : state.data.selectedUser,
        },
      };

    case "USER_DELETED":
      return {
        ...state,
        data: {
          ...state.data,
          users: state.data.users.filter((u) => u.id !== action.payload),
          selectedUser:
            state.data.selectedUser?.id === action.payload
              ? null
              : state.data.selectedUser,
        },
      };

    default:
      return state;
  }
};
