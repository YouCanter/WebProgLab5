import { Button } from "@/components/Button";
import type { User } from "@/types/user";

interface UserCardProps {
  user: User;
  selected: boolean;
  onEdit: (user: User) => void;
  onDelete: (user: User) => void;
}

export const UserCard = ({ user, selected, onEdit, onDelete }: UserCardProps) => {
  return (
    <article className={`user-card${selected ? " user-card--selected" : ""}`}>
      <div className="user-card__main">
        <div className="user-card__name">{user.fullName}</div>
        <div className="user-card__email">{user.email}</div>
        <div className="user-card__role">
          <span className="role-badge">{user.position}</span>
        </div>
      </div>
      <div className="user-card__actions">
        <Button variant="secondary" onClick={() => onEdit(user)}>
          Редагувати
        </Button>
        <Button variant="danger" onClick={() => onDelete(user)}>
          Видалити
        </Button>
      </div>
    </article>
  );
};
