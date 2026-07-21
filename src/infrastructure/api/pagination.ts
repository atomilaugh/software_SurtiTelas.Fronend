export interface PaginationMeta {
  totalRecords: number;
  page: number;
  limit: number;
  totalPages: number;
  nextCursor?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  meta: PaginationMeta;
}
