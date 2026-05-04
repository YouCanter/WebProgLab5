import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/Button";
import { ConfirmDialog } from "@/components/ConfirmDialog";
import { DataTable, type Column } from "@/components/DataTable";
import { ErrorMessage } from "@/components/ErrorMessage";
import { Pagination } from "@/components/Pagination";
import { SearchInput } from "@/components/SearchInput";
import { useDebouncedValue } from "@/hooks/useDebouncedValue";
import { usePaginatedList } from "@/hooks/usePaginatedList";
import { useToast } from "@/hooks/useToast";
import { departmentsService } from "@/services/departmentsService";
import { usersService } from "@/services/usersService";
import type { Department } from "@/types/department";
import type { SortOrder } from "@/types/api";
import type { User, UserSortField, UsersQuery } from "@/types/user";
import { formatDate } from "@/utils/formatDate";

const PAGE_SIZE = 10;

export const UsersListPage = () => {
  const navigate = useNavigate();
  const { show } = useToast();

  const [search, setSearch] = useState("");
  const debouncedSearch = useDebouncedValue(search, 300);

  const [departmentId, setDepartmentId] = useState<number | "">("");
  const [activeFilter, setActiveFilter] = useState<"all" | "true" | "false">("all");
  const [sort, setSort] = useState<UserSortField>("createdAt");
  const [order, setOrder] = useState<SortOrder>("desc");
  const [page, setPage] = useState(1);

  const [departments, setDepartments] = useState<Department[]>([]);
  const [toDelete, setToDelete] = useState<User | null>(null);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    departmentsService
      .loadAllDepartments()
      .then((res) => setDepartments(res.data))
      .catch(() => setDepartments([]));
  }, []);

  useEffect(() => {
    setPage(1);
  }, [debouncedSearch, departmentId, activeFilter, sort, order]);

  const query = useMemo<UsersQuery>(
    () => ({
      search: debouncedSearch || undefined,
      departmentId: departmentId === "" ? undefined : departmentId,
      isActive: activeFilter === "all" ? undefined : activeFilter === "true",
      sort,
      order,
      page,
      pageSize: PAGE_SIZE,
    }),
    [debouncedSearch, departmentId, activeFilter, sort, order, page],
  );

  const { data, meta, loading, error, reload } = usePaginatedList(
    usersService.loadUsers,
    query,
  );

  const handleDelete = async () => {
    if (!toDelete) return;
    setDeleting(true);
    try {
      await usersService.deleteUser(toDelete.id);
      show(`Користувача "${toDelete.fullName}" видалено`, "success");
      setToDelete(null);
      reload();
    } catch (err) {
      show((err as Error).message, "error");
    } finally {
      setDeleting(false);
    }
  };

  const columns: Column<User>[] = [
    {
      key: "fullName",
      header: "ПІБ",
      sortable: true,
      render: (u) => <Link to={`/users/${u.id}`}>{u.fullName}</Link>,
    },
    { key: "email", header: "Email", sortable: true, render: (u) => u.email },
    { key: "position", header: "Посада", sortable: true, render: (u) => u.position },
    {
      key: "department",
      header: "Підрозділ",
      render: (u) => u.department?.name ?? "—",
    },
    {
      key: "isActive",
      header: "Статус",
      render: (u) => (
        <span className={`badge ${u.isActive ? "badge--active" : "badge--inactive"}`}>
          {u.isActive ? "Активний" : "Неактивний"}
        </span>
      ),
    },
    {
      key: "createdAt",
      header: "Створено",
      sortable: true,
      render: (u) => formatDate(u.createdAt),
    },
  ];

  return (
    <div>
      <div className="page-header">
        <h1>Користувачі</h1>
        <Button variant="primary" onClick={() => navigate("/users/new")}>
          + Новий користувач
        </Button>
      </div>

      <div className="toolbar">
        <SearchInput
          value={search}
          onChange={setSearch}
          placeholder="Пошук за ПІБ, email або посадою..."
        />
        <select
          className="select-input"
          style={{ maxWidth: 220 }}
          value={departmentId}
          onChange={(e) => setDepartmentId(e.target.value === "" ? "" : Number(e.target.value))}
        >
          <option value="">Всі підрозділи</option>
          {departments.map((d) => (
            <option key={d.id} value={d.id}>{d.name}</option>
          ))}
        </select>
        <select
          className="select-input"
          style={{ maxWidth: 180 }}
          value={activeFilter}
          onChange={(e) => setActiveFilter(e.target.value as typeof activeFilter)}
        >
          <option value="all">Усі статуси</option>
          <option value="true">Лише активні</option>
          <option value="false">Лише неактивні</option>
        </select>
      </div>

      <ErrorMessage error={error} />

      <DataTable
        columns={columns}
        rows={data}
        rowKey={(u) => u.id}
        loading={loading}
        sort={sort}
        order={order}
        onSortChange={(s, o) => {
          setSort(s as UserSortField);
          setOrder(o);
        }}
        actions={(u) => (
          <>
            <Button variant="secondary" onClick={() => navigate(`/users/${u.id}/edit`)}>
              Редагувати
            </Button>{" "}
            <Button variant="danger" onClick={() => setToDelete(u)}>
              Видалити
            </Button>
          </>
        )}
      />

      <Pagination
        page={meta?.page ?? page}
        totalPages={meta?.totalPages ?? 1}
        total={meta?.total ?? 0}
        pageSize={PAGE_SIZE}
        onPageChange={setPage}
      />

      <ConfirmDialog
        open={toDelete !== null}
        title="Видалення користувача"
        message={`Ви дійсно хочете видалити користувача "${toDelete?.fullName ?? ""}"? Цю дію не можна скасувати.`}
        confirmLabel="Видалити"
        loading={deleting}
        onCancel={() => setToDelete(null)}
        onConfirm={handleDelete}
      />
    </div>
  );
};
