// ─── API Response Types ───────────────────────────────────────

/** Standard API success/error response envelope */
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: ApiError;
  meta?: PaginationMeta;
}

/** Paginated response wrapper */
export interface PaginatedResponse<T> {
  success: boolean;
  data: T[];
  meta: PaginationMeta;
}

/** Pagination metadata */
export interface PaginationMeta {
  page: number;
  pageSize: number;
  total: number;
  totalPages: number;
}

/** Structured API error */
export interface ApiError {
  code: string;
  message: string;
  details?: unknown;
  statusCode: number;
}
