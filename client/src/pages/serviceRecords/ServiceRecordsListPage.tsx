import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { Button } from "@/components/Button";
import { ConfirmDialog } from "@/components/ConfirmDialog";
import { DataTable, type Column } from "@/components/DataTable";
import { ErrorMessage } from "@/components/ErrorMessage";
import { Pagination } from "@/components/Pagination";
import { SearchInput } from "@/components/SearchInput";
import { useDebouncedValue } from "@/hooks/useDebouncedValue";
import { usePaginatedList } from "@/hooks/usePaginatedList";
import { useToast } from "@/hooks/useToast";
import { serviceRecordsService } from "@/services/serviceRecordsService";
import type { SortOrder } from "@/types/api";
import {
  serviceRecordTypeLabels,
  serviceRecordTypes,
  type ServiceRecord,
  type ServiceRecordSortField,
  type ServiceRecordType,
  type ServiceRecordsQuery,
} from "@/types/serviceRecord";
import { formatDateTime } from "@/utils/formatDate";

const PAGE_SIZE = 10;

export const ServiceRecordsListPage = () => {
  const navigate = useNavigate();
  const { show } = useToast();
  const [searchParams] = useSearchParams();
  const initialUserId = searchParams.get("userId");

  const [search, setSearch] = useState("");
  const debouncedSearch = useDebouncedValue(search, 300);

  const [type, setType] = useState<ServiceRecordType | "">("");
  const [userId, setUserId] = useState<number | "">(
    initialUserId ? Number(initialUserId) : "",
  );
  const [sort, setSort] = useState<ServiceRecordSortField>("occurredAt");
  const [order, setOrder] = useState<SortOrder>("desc");
  const [page, setPage] = useState(1);

  const [toDelete, setToDelete] = useState<ServiceRecord | null>(null);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => setPage(1), [debouncedSearch, type, userId, sort, order]);

  const query = useMemo<ServiceRecordsQuery>(
    () => ({
      search: debouncedSearch || undefined,
      type: type === "" ? undefined : type,
      userId: userId === "" ? undefined : userId,
      sort,
      order,
      page,
      pageSize: PAGE_SIZE,
    }),
    [debouncedSearch, type, userId, sort, order, page],
  );

  const { data, meta, loading, error, reload } = usePaginatedList(
    serviceRecordsService.loadServiceRecords,
    query,
  );

  const handleDelete = async () => {
    if (!toDelete) return;
    setDeleting(true);
    try {
      await serviceRecordsService.deleteServiceRecord(toDelete.id);
      show("Службовий запис видалено", "success");
      setToDelete(null);
      reload();
    } catch (err) {
      show((err as Error).message, "error");
    } finally {
      setDeleting(false);
    }
  };

  const columns: Column<ServiceRecord>[] = [
    {
      key: "type",
      header: "Тип",
      sortable: true,
      render: (r) => <span className="badge">{serviceRecordTypeLabels[r.type]}</span>,
    },
    {
      key: "user",
      header: "Користувач",
      render: (r) =>
        r.user ? <Link to={`/users/${r.user.id}`}>{r.user.fullName}</Link> : "—",
    },
    {
      key: "department",
      header: "Підрозділ",
      render: (r) => r.department?.name ?? "—",
    },
    { key: "note", header: "Примітка", render: (r) => r.note ?? "—" },
    {
      key: "occurredAt",
      header: "Дата події",
      sortable: true,
      render: (r) => formatDateTime(r.occurredAt),
    },
  ];

  return (
    <div>
      <div className="page-header">
        <h1>Службові записи</h1>
        <Button variant="primary" onClick={() => navigate("/service-records/new")}>
          + Новий запис
        </Button>
      </div>
      <div className="toolbar">
        <SearchInput
          value={search}
          onChange={setSearch}
          placeholder="Пошук за приміткою або ПІБ..."
        />
        <select
          className="select-input"
          style={{ maxWidth: 220 }}
          value={type}
          onChange={(e) => setType(e.target.value as ServiceRecordType | "")}
        >
          <option value="">Усі типи</option>
          {serviceRecordTypes.map((t) => (
            <option key={t} value={t}>{serviceRecordTypeLabels[t]}</option>
          ))}
        </select>
        {userId !== "" && (
          <Button variant="ghost" onClick={() => setUserId("")}>
            Очистити фільтр за користувачем
          </Button>
        )}
      </div>

      <ErrorMessage error={error} />

      <DataTable
        columns={columns}
        rows={data}
        rowKey={(r) => r.id}
        loading={loading}
        sort={sort}
        order={order}
        onSortChange={(s, o) => {
          setSort(s as ServiceRecordSortField);
          setOrder(o);
        }}
        actions={(r) => (
          <Button variant="danger" onClick={() => setToDelete(r)}>
            Видалити
          </Button>
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
        title="Видалення службового запису"
        message="Видалити вибраний службовий запис?"
        confirmLabel="Видалити"
        loading={deleting}
        onCancel={() => setToDelete(null)}
        onConfirm={handleDelete}
      />
    </div>
  );
};
