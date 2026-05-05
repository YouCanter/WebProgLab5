import { Button } from "@/components/Button";
import type { User } from "@/types/user";

interface UserCardProps {
  user: User;
  selected: boolean;
  disabled?: boolean;
  onEdit: (user: User) => void;
  onDelete: (user: User) => void;
}

export const UserCard = ({ user, selected, disabled, onEdit, onDelete }: UserCardProps) => {
  return (
    <article className={`user-card${selected ? " user-card--selected" : ""}`}>
      <div className="user-card__main">
        <div className="user-card__name">{user.fullName}</div>
        <div className="user-card__email">{user.email}</div>
        <div className="user-card__role">
          <span className="role-badge">{user.position}</span>
          {user.department && (
            <span className="dep-badge">{user.department.name}</span>
          )}
          {!user.isActive && (
            <span className="status-badge status-badge--error">Неактивний</span>
          )}
        </div>
      </div>
      <div className="user-card__actions">
        <Button variant="secondary" onClick={() => onEdit(user)} disabled={disabled}>
          Редагувати
        </Button>
        <Button variant="danger" onClick={() => onDelete(user)} disabled={disabled}>
          Видалити
        </Button>
      </div>
    </article>
  );
};
