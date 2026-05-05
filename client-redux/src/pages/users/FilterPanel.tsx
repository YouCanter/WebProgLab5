import { Button } from "@/components/Button";
import { useUsers } from "@/hooks/useUsers";
import type { SortOrder, UserSortField } from "@/types/user";

const sortOptions: { value: UserSortField; label: string }[] = [
  { value: "createdAt", label: "Дата створення" },
  { value: "fullName", label: "ПІБ" },
  { value: "email", label: "Email" },
  { value: "position", label: "Посада" },
];

export const FilterPanel = () => {
  const { ui, setSearch, setSort, setOrder, resetFilters } = useUsers();

  return (
    <section className="card filter-panel">
      <div className="filter-panel__intro">
        <h3 className="demo-section-title">Пошук і фільтрація</h3>
        <p className="filter-panel__hint">
          Параметри зберігаються у Redux store і відновлюються після оновлення сторінки.
        </p>
      </div>
      <div className="filter-panel__controls">
        <input
          type="search"
          className="text-input"
          placeholder="Пошук за ПІБ, email або посадою"
          value={ui.search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <div className="filter-panel__row">
          <label className="filter-panel__label">
            Сортування:
            <select
              className="select-input"
              value={ui.sort}
              onChange={(e) => setSort(e.target.value as UserSortField)}
            >
              {sortOptions.map((o) => (
                <option key={o.value} value={o.value}>{o.label}</option>
              ))}
            </select>
          </label>
          <label className="filter-panel__label">
            Порядок:
            <select
              className="select-input"
              value={ui.order}
              onChange={(e) => setOrder(e.target.value as SortOrder)}
            >
              <option value="asc">за зростанням</option>
              <option value="desc">за спаданням</option>
            </select>
          </label>
          <Button variant="secondary" onClick={resetFilters}>
            Скинути фільтри
          </Button>
        </div>
      </div>
    </section>
  );
};
