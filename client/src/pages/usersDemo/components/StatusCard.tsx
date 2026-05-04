import { useUsersState } from "@/state/users/UsersContext";
import type { RequestStatus } from "@/state/users/types";

const labels: Record<RequestStatus, { title: string; description: string }> = {
  idle: {
    title: "IDLE",
    description: "Очікування першого запиту до сервера.",
  },
  loading: {
    title: "LOADING",
    description: "Триває обмін даними із REST API.",
  },
  success: {
    title: "SUCCESS",
    description: "Зміни автоматично синхронізують список.",
  },
  error: {
    title: "ERROR",
    description: "Сталася помилка під час запиту до сервера.",
  },
};

export const StatusCard = () => {
  const state = useUsersState();
  const meta = labels[state.status];

  return (
    <aside className="status-card">
      <div className="status-card__label">Стан запиту</div>
      <div className={`status-card__value status-card__value--${state.status}`}>
        {meta.title}
      </div>
      <div className="status-card__hint">
        {state.status === "error" && state.error ? state.error : meta.description}
      </div>
    </aside>
  );
};
