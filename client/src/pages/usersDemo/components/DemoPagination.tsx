import { Button } from "@/components/Button";
import { useUsers } from "@/state/users/useUsers";

export const DemoPagination = () => {
  const { state, setPage } = useUsers();
  const meta = state.data.meta;

  const total = meta?.total ?? 0;
  const page = meta?.page ?? state.ui.page;
  const totalPages = meta?.totalPages ?? 1;

  return (
    <section className="card demo-pagination">
      <div className="demo-pagination__info">
        <h3 className="demo-section-title">Пагінація</h3>
        <p className="demo-pagination__hint">
          Усього записів: {total}. Поточна сторінка: {page} із {Math.max(totalPages, 1)}.
        </p>
      </div>
      <div className="demo-pagination__controls">
        <Button
          variant="secondary"
          onClick={() => setPage(Math.max(1, page - 1))}
          disabled={page <= 1}
        >
          Попередня
        </Button>
        <Button
          variant="secondary"
          onClick={() => setPage(page + 1)}
          disabled={page >= totalPages}
        >
          Наступна
        </Button>
      </div>
    </section>
  );
};
