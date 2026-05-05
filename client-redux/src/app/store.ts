import { configureStore } from "@reduxjs/toolkit";
import { uiReducer } from "@/features/ui/uiSlice";
import { usersReducer } from "@/features/users/usersSlice";
import { loadUiState, saveUiState } from "./storage";

const persistedUi = loadUiState();

export const store = configureStore({
  reducer: {
    users: usersReducer,
    ui: uiReducer,
  },
  preloadedState: persistedUi ? { ui: persistedUi } : undefined,
});

let saveTimer: number | undefined;
let lastSavedUi = store.getState().ui;

store.subscribe(() => {
  const currentUi = store.getState().ui;
  if (currentUi === lastSavedUi) return;
  lastSavedUi = currentUi;

  if (saveTimer !== undefined) window.clearTimeout(saveTimer);
  saveTimer = window.setTimeout(() => {
    saveUiState(currentUi);
  }, 200);
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
