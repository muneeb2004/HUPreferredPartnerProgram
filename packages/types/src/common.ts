// ─── Common Base Types ────────────────────────────────────────

/** Branded type for UUID strings */
export type UUID = string & { readonly __brand: 'UUID' };

/** ISO 8601 timestamp string */
export type Timestamp = string & { readonly __brand: 'Timestamp' };

/** Base entity with common audit fields */
export interface BaseEntity {
  id: UUID;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}
