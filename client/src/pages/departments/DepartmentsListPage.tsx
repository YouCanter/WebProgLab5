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
import type { Department, DepartmentSortField, DepartmentsQuery } from "@/types/department";
import type { SortOrder } from "@/types/api";
import { formatDate } from "@/utils/formatDate";

const PAGE_SIZE = 10;

export const DepartmentsListPage = () => {
  const navigate = useNavigate();
  const { show } = useToast();

  const [search, setSearch] = useState("");
  const debouncedSearch = useDebouncedValue(search, 300);

  const [sort, setSort] = useState<DepartmentSortField>("name");
  const [order, setOrder] = useState<SortOrder>("asc");
  const [page, setPage] = useState(1);

  const [toDelete, setToDelete] = useState<Department | null>(null);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => setPage(1), [debouncedSearch, sort, order]);

  const query = useMemo<DepartmentsQuery>(
    () => ({
      search: debouncedSearch || undefined,
      sort,
      order,
      page,
      pageSize: PAGE_SIZE,
    }),
    [debouncedSearch, sort, order, page],
  );

  const { data, meta, loading, error, reload } = usePaginatedList(
    departmentsService.loadDepartments,
    query,
  );

  const handleDelete = async () => {
    if (!toDelete) return;
    setDeleting(true);
    try {
      await departmentsService.deleteDepartment(toDelete.id);
      show(`Підрозділ "${toDelete.name}" видалено`, "success");
      setToDelete(null);
      reload();
    } catch (err) {
      show((err as Error).message, "error");
    } finally {
      setDeleting(false);
    }
  };

  const columns: Column<Department>[] = [
    {
      key: "name",
      header: "Назва",
      sortable: true,
      render: (d) => <Link to={`/departments/${d.id}`}>{d.name}</Link>,
    },
    { key: "description", header: "Опис", render: (d) => d.description ?? "—" },
    { key: "users", header: "Користувачів", render: (d) => d._count?.users ?? 0 },
    {
      key: "createdAt",
      header: "Створено",
      sortable: true,
      render: (d) => formatDate(d.createdAt),
    },
  ];

  return (
    <div>
      <div className="page-header">
        <h1>Підрозділи</h1>
        <Button variant="primary" onClick={() => navigate("/departments/new")}>
          + Новий підрозділ
        </Button>
      </div>
      <div className="toolbar">
        <SearchInput value={search} onChange={setSearch} placeholder="Пошук за назвою або описом..." />
      </div>

      <ErrorMessage error={error} />

      <DataTable
        columns={columns}
        rows={data}
        rowKey={(d) => d.id}
        loading={loading}
        sort={sort}
        order={order}
        onSortChange={(s, o) => {
          setSort(s as DepartmentSortField);
          setOrder(o);
        }}
        actions={(d) => (
          <>
            <Button variant="secondary" onClick={() => navigate(`/departments/${d.id}/edit`)}>
              Редагувати
            </Button>{" "}
            <Button variant="danger" onClick={() => setToDelete(d)}>
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
        title="Видалення підрозділу"
        message={`Видалити підрозділ "${toDelete?.name ?? ""}"? Якщо в ньому є користувачі, видалення буде заборонено.`}
        confirmLabel="Видалити"
        loading={deleting}
        onCancel={() => setToDelete(null)}
        onConfirm={handleDelete}
      />
    </div>
  );
};
