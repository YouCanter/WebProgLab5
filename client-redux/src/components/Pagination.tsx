import { Button } from "./Button";

interface PaginationProps {
  page: number;
  totalPages: number;
  total: number;
  onPageChange: (page: number) => void;
}

export const Pagination = ({ page, totalPages, total, onPageChange }: PaginationProps) => {
  return (
    <div className="pagination">
      <span className="pagination__info">
        Усього записів: {total}. Поточна сторінка: {page} із {Math.max(totalPages, 1)}.
      </span>
      <div className="pagination__controls">
        <Button
          variant="secondary"
          onClick={() => onPageChange(page - 1)}
          disabled={page <= 1}
        >
          Попередня
        </Button>
        <Button
          variant="secondary"
          onClick={() => onPageChange(page + 1)}
          disabled={page >= totalPages}
        >
          Наступна
        </Button>
      </div>
    </div>
  );
};
