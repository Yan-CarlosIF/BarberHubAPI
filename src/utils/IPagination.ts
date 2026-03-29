interface ICursorPaginationReturn<T> {
  items: T[];
  nextCursor: string | null;
}

interface IOffsetPaginationReturn<T> {
  items: T[];
  page: number;
  limit: number;
  total: number;
  lastPage: number;
}

export type { ICursorPaginationReturn, IOffsetPaginationReturn };
