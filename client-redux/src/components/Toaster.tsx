import { useToast } from "@/hooks/useToast";

export const Toaster = () => {
  const { toasts, dismiss } = useToast();
  return (
    <div className="toaster">
      {toasts.map((t) => (
        <div key={t.id} className={`toast toast--${t.kind}`} onClick={() => dismiss(t.id)}>
          {t.message}
        </div>
      ))}
    </div>
  );
};
