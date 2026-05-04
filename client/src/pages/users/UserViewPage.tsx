import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { ApiError } from "@/api/httpClient";
import { Button } from "@/components/Button";
import { ConfirmDialog } from "@/components/ConfirmDialog";
import { ErrorMessage } from "@/components/ErrorMessage";
import { useToast } from "@/hooks/useToast";
import { usersService } from "@/services/usersService";
import type { User } from "@/types/user";
import { formatDateTime } from "@/utils/formatDate";

export const UserViewPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { show } = useToast();

  const [user, setUser] = useState<User | null>(null);
  const [loadError, setLoadError] = useState<ApiError | null>(null);
  const [askDelete, setAskDelete] = useState(false);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    if (!id) return;
    const controller = new AbortController();
    usersService
      .loadUser(Number(id), controller.signal)
      .then(setUser)
      .catch((err) => {
        if ((err as Error).name === "AbortError") return;
        setLoadError(err instanceof ApiError ? err : new ApiError({ code: "UNKNOWN", message: (err as Error).message, status: 0 }));
      });
    return () => controller.abort();
  }, [id]);

  const handleDelete = async () => {
    if (!user) return;
    setDeleting(true);
    try {
      await usersService.deleteUser(user.id);
      show(`Користувача "${user.fullName}" видалено`, "success");
      navigate("/users");
    } catch (err) {
      show((err as Error).message, "error");
      setDeleting(false);
    }
  };

  return (
    <div>
      <div className="page-header">
        <h1>Профіль користувача</h1>
        <div style={{ display: "flex", gap: 8 }}>
          <Button variant="secondary" onClick={() => navigate("/users")}>← До списку</Button>
          {user && (
            <>
              <Button variant="primary" onClick={() => navigate(`/users/${user.id}/edit`)}>
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

      {user && (
        <div className="card">
          <div className="detail-grid">
            <div className="detail-grid__label">ID</div>
            <div className="detail-grid__value">{user.id}</div>

            <div className="detail-grid__label">ПІБ</div>
            <div className="detail-grid__value">{user.fullName}</div>

            <div className="detail-grid__label">Email</div>
            <div className="detail-grid__value">{user.email}</div>

            <div className="detail-grid__label">Телефон</div>
            <div className="detail-grid__value">{user.phone ?? "—"}</div>

            <div className="detail-grid__label">Посада</div>
            <div className="detail-grid__value">{user.position}</div>

            <div className="detail-grid__label">Підрозділ</div>
            <div className="detail-grid__value">
              {user.department ? (
                <Link to={`/departments/${user.department.id}`}>{user.department.name}</Link>
              ) : "—"}
            </div>

            <div className="detail-grid__label">Статус</div>
            <div className="detail-grid__value">
              <span className={`badge ${user.isActive ? "badge--active" : "badge--inactive"}`}>
                {user.isActive ? "Активний" : "Неактивний"}
              </span>
            </div>

            <div className="detail-grid__label">Створено</div>
            <div className="detail-grid__value">{formatDateTime(user.createdAt)}</div>

            <div className="detail-grid__label">Оновлено</div>
            <div className="detail-grid__value">{formatDateTime(user.updatedAt)}</div>
          </div>

          <div style={{ marginTop: 16 }}>
            <Link to={`/service-records?userId=${user.id}`}>Переглянути службові записи →</Link>
          </div>
        </div>
      )}

      <ConfirmDialog
        open={askDelete}
        title="Видалення користувача"
        message={`Ви дійсно хочете видалити користувача "${user?.fullName ?? ""}"?`}
        confirmLabel="Видалити"
        loading={deleting}
        onCancel={() => setAskDelete(false)}
        onConfirm={handleDelete}
      />
    </div>
  );
};
