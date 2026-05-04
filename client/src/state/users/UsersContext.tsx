import {
  createContext,
  useContext,
  useEffect,
  useReducer,
  useState,
  type Dispatch,
  type ReactNode,
} from "react";
import { ApiError } from "@/api/httpClient";
import { usersApi } from "@/api/usersApi";
import { useDebouncedValue } from "@/hooks/useDebouncedValue";
import { initialUsersState, type UsersAction, type UsersState } from "./types";
import { usersReducer } from "./reducer";

const UsersStateContext = createContext<UsersState | null>(null);
const UsersDispatchContext = createContext<Dispatch<UsersAction> | null>(null);
const UsersReloadContext = createContext<(() => void) | null>(null);

interface UsersProviderProps {
  children: ReactNode;
}

export const UsersProvider = ({ children }: UsersProviderProps) => {
  const [state, dispatch] = useReducer(usersReducer, initialUsersState);
  const [reloadToken, setReloadToken] = useState(0);

  const debouncedSearch = useDebouncedValue(state.ui.search, 300);

  useEffect(() => {
    const controller = new AbortController();
    dispatch({ type: "LOAD_START" });

    usersApi
      .getUsers(
        {
          search: debouncedSearch || undefined,
          page: state.ui.page,
          pageSize: state.ui.pageSize,
          sort: "createdAt",
          order: "desc",
        },
        controller.signal,
      )
      .then((res) => {
        dispatch({ type: "LOAD_SUCCESS", payload: { users: res.data, meta: res.meta } });
      })
      .catch((err: unknown) => {
        if ((err as Error).name === "AbortError") return;
        const message = err instanceof ApiError ? err.message : (err as Error).message;
        dispatch({ type: "LOAD_ERROR", payload: message });
      });

    return () => controller.abort();
  }, [debouncedSearch, state.ui.page, state.ui.pageSize, reloadToken]);

  const reload = () => setReloadToken((n) => n + 1);

  return (
    <UsersStateContext.Provider value={state}>
      <UsersDispatchContext.Provider value={dispatch}>
        <UsersReloadContext.Provider value={reload}>
          {children}
        </UsersReloadContext.Provider>
      </UsersDispatchContext.Provider>
    </UsersStateContext.Provider>
  );
};

export const useUsersState = (): UsersState => {
  const ctx = useContext(UsersStateContext);
  if (!ctx) throw new Error("useUsersState must be used within <UsersProvider>");
  return ctx;
};

export const useUsersDispatch = (): Dispatch<UsersAction> => {
  const ctx = useContext(UsersDispatchContext);
  if (!ctx) throw new Error("useUsersDispatch must be used within <UsersProvider>");
  return ctx;
};

export const useUsersReload = (): (() => void) => {
  const ctx = useContext(UsersReloadContext);
  if (!ctx) throw new Error("useUsersReload must be used within <UsersProvider>");
  return ctx;
};
