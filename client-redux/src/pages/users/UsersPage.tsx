import { useEffect, useRef } from "react";
import { Pagination } from "@/components/Pagination";
import { StatusCard } from "@/components/StatusCard";
import { useDebouncedValue } from "@/hooks/useDebouncedValue";
import { useUsers } from "@/hooks/useUsers";
import { FilterPanel } from "./FilterPanel";
import { UserForm } from "./UserForm";
import { UserList } from "./UserList";

const DemoHeader = ({ status, error }: { status: ReturnType<typeof useUsers>["status"]; error: string | null }) => (
  <header className="demo-page-header card">
    <div className="demo-page-header__intro">
      <div className="demo-page-header__eyebrow">ПРАКТИЧНА РОБОТА 06</div>
      <h1 className="demo-page-header__title">
        Адміністрування користувачів — Redux Toolkit
      </h1>
      <p className="demo-page-header__lead">
        Єдине джерело істини: <code>configureStore</code> + два slice (
        <code>users</code>, <code>ui</code>) + async thunks. Параметри пошуку, сортування
        та вибраного користувача зберігаються у localStorage і відновлюються після
        оновлення сторінки.
      </p>
    </div>
    <StatusCard status={status} error={error} />
  </header>
);

export const UsersPage = () => {
  const {
    ui,
    query,
    meta,
    status,
    error,
    selectedUser,
    dataVersion,
    setPage,
    loadUsers,
    loadUserById,
  } = useUsers();

  const debouncedSearch = useDebouncedValue(ui.search, 300);

  useEffect(() => {
    const promise = loadUsers({ ...query, search: debouncedSearch.trim() || undefined });
    return () => {
      promise.abort();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedSearch, ui.page, ui.pageSize, ui.sort, ui.order, dataVersion]);

  const hydrated = useRef(false);
  useEffect(() => {
    if (hydrated.current) return;
    hydrated.current = true;
    if (ui.selectedUserId !== null && !selectedUser) {
      void loadUserById(ui.selectedUserId);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const total = meta?.total ?? 0;
  const totalPages = meta?.totalPages ?? 1;
  const page = meta?.page ?? ui.page;

  return (
    <div className="users-demo">
      <DemoHeader status={status} error={error} />
      <FilterPanel />
      <div className="demo-grid">
        <UserList />
        <UserForm />
      </div>
      <section className="card">
        <Pagination
          page={page}
          totalPages={totalPages}
          total={total}
          onPageChange={setPage}
        />
      </section>
    </div>
  );
};
