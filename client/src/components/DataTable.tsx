import type { ReactNode } from "react";
import type { SortOrder } from "@/types/api";

export interface Column<T> {
  key: string;
  header: string;
  sortable?: boolean;
  sortKey?: string;
  render: (row: T) => ReactNode;
  width?: string;
}

interface DataTableProps<T> {
  columns: Column<T>[];
  rows: T[];
  rowKey: (row: T) => string | number;
  loading?: boolean;
  emptyText?: string;
  sort?: string;
  order?: SortOrder;
  onSortChange?: (sort: string, order: SortOrder) => void;
  actions?: (row: T) => ReactNode;
}

export const DataTable = <T,>({
  columns,
  rows,
  rowKey,
  loading,
  emptyText = "Записів не знайдено",
  sort,
  order,
  onSortChange,
  actions,
}: DataTableProps<T>) => {
  const handleSort = (col: Column<T>) => {
    if (!col.sortable || !onSortChange) return;
    const key = col.sortKey ?? col.key;
    if (sort === key) {
      onSortChange(key, order === "asc" ? "desc" : "asc");
    } else {
      onSortChange(key, "asc");
    }
  };

  return (
    <div className="data-table-wrapper">
      <table className="data-table">
        <thead>
          <tr>
            {columns.map((col) => {
              const key = col.sortKey ?? col.key;
              const isSorted = sort === key;
              return (
                <th
                  key={col.key}
                  style={col.width ? { width: col.width } : undefined}
                  className={col.sortable ? "data-table__th data-table__th--sortable" : "data-table__th"}
                  onClick={() => handleSort(col)}
                >
                  {col.header}
                  {col.sortable && (
                    <span className="data-table__sort-indicator">
                      {isSorted ? (order === "asc" ? " ▲" : " ▼") : ""}
                    </span>
                  )}
                </th>
              );
            })}
            {actions && <th className="data-table__th" style={{ width: "1%" }}>Дії</th>}
          </tr>
        </thead>
        <tbody>
          {loading && rows.length === 0 && (
            <tr>
              <td colSpan={columns.length + (actions ? 1 : 0)} className="data-table__placeholder">
                Завантаження…
              </td>
            </tr>
          )}
          {!loading && rows.length === 0 && (
            <tr>
              <td colSpan={columns.length + (actions ? 1 : 0)} className="data-table__placeholder">
                {emptyText}
              </td>
            </tr>
          )}
          {rows.map((row) => (
            <tr key={rowKey(row)}>
              {columns.map((col) => (
                <td key={col.key} className="data-table__td">{col.render(row)}</td>
              ))}
              {actions && <td className="data-table__td data-table__td--actions">{actions(row)}</td>}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
