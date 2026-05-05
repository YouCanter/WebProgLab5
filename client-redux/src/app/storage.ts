import { initialUiState, type UiState } from "@/features/ui/uiSlice";

const STORAGE_KEY = "curs-redux-ui-v1";

const PERSISTED_KEYS = ["search", "page", "sort", "order", "selectedUserId"] as const;
type PersistedKey = (typeof PERSISTED_KEYS)[number];
type PersistedShape = Pick<UiState, PersistedKey>;

const isBrowser = typeof window !== "undefined" && typeof window.localStorage !== "undefined";

export const loadUiState = (): UiState | undefined => {
  if (!isBrowser) return undefined;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return undefined;
    const parsed = JSON.parse(raw) as Partial<PersistedShape>;
    return {
      ...initialUiState,
      ...sanitize(parsed),
    };
  } catch (err) {
    console.warn("Не вдалося відновити UI-стан із localStorage:", err);
    return undefined;
  }
};

export const saveUiState = (ui: UiState): void => {
  if (!isBrowser) return;
  try {
    const subset: PersistedShape = {
      search: ui.search,
      page: ui.page,
      sort: ui.sort,
      order: ui.order,
      selectedUserId: ui.selectedUserId,
    };
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(subset));
  } catch (err) {
    console.warn("Не вдалося зберегти UI-стан у localStorage:", err);
  }
};

const sanitize = (raw: Partial<PersistedShape>): Partial<PersistedShape> => {
  const out: Partial<PersistedShape> = {};
  if (typeof raw.search === "string") out.search = raw.search;
  if (typeof raw.page === "number" && raw.page > 0) out.page = raw.page;
  if (raw.sort && ["fullName", "email", "position", "createdAt"].includes(raw.sort)) {
    out.sort = raw.sort;
  }
  if (raw.order === "asc" || raw.order === "desc") out.order = raw.order;
  if (raw.selectedUserId === null || (typeof raw.selectedUserId === "number" && raw.selectedUserId > 0)) {
    out.selectedUserId = raw.selectedUserId;
  }
  return out;
};
