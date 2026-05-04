import { useState } from "react";
import { ConfirmDialog } from "@/components/ConfirmDialog";
import { ErrorMessage } from "@/components/ErrorMessage";
import { useToast } from "@/hooks/useToast";
import { useUsers } from "@/hooks/useUsers";
import type { User } from "@/types/user";
import { UserCard } from "./UserCard";

export const UserList = () => {
  const { users, status, error, selectedUser, mutating, selectUser, deleteUser } = useUsers();
  const { show } = useToast();
  const [toDelete, setToDelete] = useState<User | null>(null);

  const handleDelete = async () => {
    if (!toDelete) return;
    try {
      await deleteUser(toDelete.id);
      show(`Користувача "${toDelete.fullName}" видалено`, "success");
      setToDelete(null);
    } catch (err) {
      show((err as Error).message ?? "Помилка видалення", "error");
    }
  };

  const isLoading = status === "loading";

  return (
    <section className="card user-list">
      <div className="user-list__header">
        <h3 className="demo-section-title">Список користувачів</h3>
        <span className={`status-badge status-badge--${status}`}>{status.toUpperCase()}</span>
      </div>

      {status === "error" && <ErrorMessage message={error} />}

      {users.length === 0 && !isLoading && status !== "error" && (
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
            selected={u.id === selectedUser?.id}
            disabled={mutating}
            onEdit={selectUser}
            onDelete={setToDelete}
          />
        ))}
      </div>

      <ConfirmDialog
        open={toDelete !== null}
        title="Видалення користувача"
        message={`Видалити користувача "${toDelete?.fullName ?? ""}"? Цю дію не можна скасувати.`}
        confirmLabel="Видалити"
        loading={mutating}
        onCancel={() => setToDelete(null)}
        onConfirm={handleDelete}
      />
    </section>
  );
};
