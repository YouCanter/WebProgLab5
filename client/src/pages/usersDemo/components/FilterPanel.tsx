import { Button } from "@/components/Button";
import { useUsers } from "@/state/users/useUsers";

export const FilterPanel = () => {
  const { state, setSearch, selectUser } = useUsers();

  return (
    <section className="card filter-panel">
      <div className="filter-panel__intro">
        <h3 className="demo-section-title">Пошук і фільтрація</h3>
        <p className="filter-panel__hint">
          Фільтр зберігається у стані та автоматично викликає повторне завантаження списку.
        </p>
      </div>
      <div className="filter-panel__controls">
        <input
          type="search"
          className="text-input"
          placeholder="Пошук за ім'ям, email або роллю"
          value={state.ui.search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <Button variant="secondary" onClick={() => selectUser(null)}>
          Скинути вибір
        </Button>
      </div>
    </section>
  );
};
