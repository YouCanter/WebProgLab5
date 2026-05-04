interface PaginationProps {
  page: number;
  totalPages: number;
  total: number;
  pageSize: number;
  onPageChange: (page: number) => void;
}

export const Pagination = ({ page, totalPages, total, pageSize, onPageChange }: PaginationProps) => {
  if (totalPages <= 1 && total <= pageSize) {
    return (
      <div className="pagination">
        <span className="pagination__info">Усього: {total}</span>
      </div>
    );
  }

  return (
    <div className="pagination">
      <span className="pagination__info">
        Сторінка {page} з {totalPages || 1}, усього: {total}
      </span>
      <div className="pagination__controls">
        <button
          type="button"
          className="btn btn--secondary"
          onClick={() => onPageChange(page - 1)}
          disabled={page <= 1}
        >
          ‹ Попередня
        </button>
        <button
          type="button"
          className="btn btn--secondary"
          onClick={() => onPageChange(page + 1)}
          disabled={page >= totalPages}
        >
          Наступна ›
        </button>
      </div>
    </div>
  );
};
