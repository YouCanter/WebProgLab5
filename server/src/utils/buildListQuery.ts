export interface ListMeta {
  page: number;
  pageSize: number;
  total: number;
  totalPages: number;
}

export interface PaginatedResult<T> {
  data: T[];
  meta: ListMeta;
}

export const buildPagination = (page: number, pageSize: number) => ({
  skip: (page - 1) * pageSize,
  take: pageSize,
});

export const buildMeta = (page: number, pageSize: number, total: number): ListMeta => ({
  page,
  pageSize,
  total,
  totalPages: pageSize > 0 ? Math.ceil(total / pageSize) : 0,
});
