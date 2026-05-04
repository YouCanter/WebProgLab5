import { useState } from "react";
import { ConfirmDialog } from "@/components/ConfirmDialog";
import { useToast } from "@/hooks/useToast";
import { useUsers } from "@/state/users/useUsers";
import type { User } from "@/types/user";
import { UserCard } from "./UserCard";

export const UserList = () => {
  const { state, selectUser, deleteUser } = useUsers();
  const { show } = useToast();
  const [toDelete, setToDelete] = useState<User | null>(null);
  const [deleting, setDeleting] = useState(false);

  const handleDelete = async () => {
    if (!toDelete) return;
    setDeleting(true);
    try {
      await deleteUser(toDelete.id);
      show(`Користувача "${toDelete.fullName}" видалено`, "success");
      setToDelete(null);
    } catch (err) {
      show((err as Error).message, "error");
    } finally {
      setDeleting(false);
    }
  };

  const isLoading = state.status === "loading";
  const users = state.data.users;
  const selectedId = state.data.selectedUser?.id ?? null;

  return (
    <section className="card user-list">
      <div className="user-list__header">
        <h3 className="demo-section-title">Список користувачів</h3>
        <span className={`status-badge status-badge--${state.status}`}>
          {state.status.toUpperCase()}
        </span>
      </div>

      {state.status === "error" && (
        <div className="error-banner" role="alert">
          <strong>Помилка:</strong> {state.error}
        </div>
      )}

      {users.length === 0 && !isLoading && state.status !== "error" && (
        <div className="empty-state">Користувачів не знайдено.</div>
      )}

      {isLoading && users.length === 0 && (
        <div className="empty-state">Завантаження…</div>
      )}

      <div className="user-list__items">
        {users.map((u) => (
          <UserCard
            key={u.id}
            user={u}
            selected={u.id === selectedId}
            onEdit={selectUser}
            onDelete={setToDelete}
          />
        ))}
      </div>

      <ConfirmDialog
        open={toDelete !== null}
        title="Видалення користувача"
        message={`Видалити користувача "${toDelete?.fullName ?? ""}"?`}
        confirmLabel="Видалити"
        loading={deleting}
        onCancel={() => setToDelete(null)}
        onConfirm={handleDelete}
      />
    </section>
  );
};
