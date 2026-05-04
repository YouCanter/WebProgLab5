import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { ApiError } from "@/api/httpClient";
import { Button } from "@/components/Button";
import { ConfirmDialog } from "@/components/ConfirmDialog";
import { ErrorMessage } from "@/components/ErrorMessage";
import { useToast } from "@/hooks/useToast";
import { departmentsService } from "@/services/departmentsService";
import type { Department } from "@/types/department";
import { formatDateTime } from "@/utils/formatDate";

export const DepartmentViewPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { show } = useToast();

  const [dep, setDep] = useState<Department | null>(null);
  const [loadError, setLoadError] = useState<ApiError | null>(null);
  const [askDelete, setAskDelete] = useState(false);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    if (!id) return;
    const controller = new AbortController();
    departmentsService
      .loadDepartment(Number(id), controller.signal)
      .then(setDep)
      .catch((err) => {
        if ((err as Error).name === "AbortError") return;
        setLoadError(err instanceof ApiError ? err : new ApiError({ code: "UNKNOWN", message: (err as Error).message, status: 0 }));
      });
    return () => controller.abort();
  }, [id]);

  const handleDelete = async () => {
    if (!dep) return;
    setDeleting(true);
    try {
      await departmentsService.deleteDepartment(dep.id);
      show(`Підрозділ "${dep.name}" видалено`, "success");
      navigate("/departments");
    } catch (err) {
      show((err as Error).message, "error");
      setDeleting(false);
    }
  };

  return (
    <div>
      <div className="page-header">
        <h1>Підрозділ</h1>
        <div style={{ display: "flex", gap: 8 }}>
          <Button variant="secondary" onClick={() => navigate("/departments")}>← До списку</Button>
          {dep && (
            <>
              <Button variant="primary" onClick={() => navigate(`/departments/${dep.id}/edit`)}>
                Редагувати
              </Button>
              <Button variant="danger" onClick={() => setAskDelete(true)}>
                Видалити
              </Button>
            </>
          )}
        </div>
      </div>

      <ErrorMessage error={loadError} />

      {dep && (
        <div className="card">
          <div className="detail-grid">
            <div className="detail-grid__label">ID</div>
            <div className="detail-grid__value">{dep.id}</div>
            <div className="detail-grid__label">Назва</div>
            <div className="detail-grid__value">{dep.name}</div>
            <div className="detail-grid__label">Опис</div>
            <div className="detail-grid__value">{dep.description ?? "—"}</div>
            <div className="detail-grid__label">Користувачів</div>
            <div className="detail-grid__value">{dep._count?.users ?? 0}</div>
            <div className="detail-grid__label">Створено</div>
            <div className="detail-grid__value">{formatDateTime(dep.createdAt)}</div>
          </div>
          <div style={{ marginTop: 16 }}>
            <Link to={`/users?departmentId=${dep.id}`}>Користувачі підрозділу →</Link>
          </div>
        </div>
      )}

      <ConfirmDialog
        open={askDelete}
        title="Видалення підрозділу"
        message={`Видалити підрозділ "${dep?.name ?? ""}"?`}
        confirmLabel="Видалити"
        loading={deleting}
        onCancel={() => setAskDelete(false)}
        onConfirm={handleDelete}
      />
    </div>
  );
};
