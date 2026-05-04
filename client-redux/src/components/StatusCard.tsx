import type { RequestStatus } from "@/types/api";

interface StatusCardProps {
  status: RequestStatus;
  error: string | null;
}

const labels: Record<RequestStatus, { title: string; description: string }> = {
  idle: { title: "IDLE", description: "Очікуємо першого завантаження." },
  loading: { title: "LOADING", description: "Триває обмін даними з REST API." },
  success: { title: "SUCCESS", description: "Дані синхронізовані з сервером." },
  error: { title: "ERROR", description: "Сталася помилка під час запиту." },
};

export const StatusCard = ({ status, error }: StatusCardProps) => {
  const meta = labels[status];
  return (
    <aside className="status-card">
      <div className="status-card__label">Стан запиту</div>
      <div className={`status-card__value status-card__value--${status}`}>{meta.title}</div>
      <div className="status-card__hint">
        {status === "error" && error ? error : meta.description}
      </div>
    </aside>
  );
};
