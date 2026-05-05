import { createAsyncThunk } from "@reduxjs/toolkit";
import { ApiError } from "@/api/httpClient";
import { usersApi } from "@/api/usersApi";
import type { Paginated } from "@/types/api";
import type {
  CreateUserDto,
  UpdateUserDto,
  User,
  UsersQuery,
} from "@/types/user";

const extractMessage = (err: unknown): string => {
  if (err instanceof ApiError) return err.message;
  return (err as Error)?.message ?? "Невідома помилка";
};

export const fetchUsers = createAsyncThunk<Paginated<User>, UsersQuery, { rejectValue: string }>(
  "users/fetchUsers",
  async (query, { rejectWithValue, signal }) => {
    try {
      return await usersApi.getUsers(query, signal);
    } catch (err) {
      if ((err as Error).name === "AbortError") throw err;
      return rejectWithValue(extractMessage(err));
    }
  },
);

export const fetchUserById = createAsyncThunk<User, number, { rejectValue: string }>(
  "users/fetchUserById",
  async (id, { rejectWithValue, signal }) => {
    try {
      return await usersApi.getUser(id, signal);
    } catch (err) {
      if ((err as Error).name === "AbortError") throw err;
      return rejectWithValue(extractMessage(err));
    }
  },
);

export const createUser = createAsyncThunk<User, CreateUserDto, { rejectValue: string }>(
  "users/createUser",
  async (dto, { rejectWithValue }) => {
    try {
      return await usersApi.createUser(dto);
    } catch (err) {
      return rejectWithValue(extractMessage(err));
    }
  },
);

export const updateUser = createAsyncThunk<
  User,
  { id: number; dto: UpdateUserDto },
  { rejectValue: string }
>("users/updateUser", async ({ id, dto }, { rejectWithValue }) => {
  try {
    return await usersApi.updateUser(id, dto);
  } catch (err) {
    return rejectWithValue(extractMessage(err));
  }
});

export const deleteUser = createAsyncThunk<number, number, { rejectValue: string }>(
  "users/deleteUser",
  async (id, { rejectWithValue }) => {
    try {
      await usersApi.deleteUser(id);
      return id;
    } catch (err) {
      return rejectWithValue(extractMessage(err));
    }
  },
);
