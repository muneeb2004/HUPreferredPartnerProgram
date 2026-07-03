# Search Architecture & Engineering Review

## Overview

The HuPreferred Partner platform utilizes a robust, unified search architecture powered by PostgreSQL Full-Text Search (FTS) and Prisma raw SQL parameterization. It indexes both `Partner` and `Offer` records, ranking them dynamically based on text relevance, and serves them efficiently via Next.js Server Components and client-side hooks.

## 1. Database Indexing & Strategy

We leverage PostgreSQL's native `to_tsvector` and `to_tsquery` functions to execute high-performance tokenized searches across normalized string fields.

**Fields Indexed & Searched:**
- **Partners:** `name`, `description`
- **Offers:** `title`, `description`

Currently, indices are automatically handled by PostgreSQL standard constraints, but for datasets exceeding 100,000 rows, we recommend applying GIN (Generalized Inverted Index) indices to the concatenated `to_tsvector` fields directly in the Prisma migrations.

## 2. Ranking & Relevance

Ranking is computed inline using the `ts_rank` PostgreSQL function. 

**Relevance Strategy:**
1. Textual proximity and term frequency (`ts_rank` algorithm).
2. Recently created or updated content (Fallback `createdAt DESC`).
3. Featured status for partners.

By default, the API sorts queries by `relevance DESC, createdAt DESC`.

## 3. Autocomplete Pipeline

The `/api/v1/search/autocomplete` endpoint is highly optimized for `<200ms` latency during keystrokes.
- **Minimum Characters:** 2
- **Strategy:** Uses Prisma `contains` with `mode: 'insensitive'` (`ILike` operator) rather than full `tsvector` parsing. Prefix matching on indexed columns (like `name` and `title`) provides significantly faster response times for short strings.
- **Constraints:** Limits payload strictly to `id`, `title`, and `url` to prevent memory overhead.

## 4. Performance & Hardening Considerations

- **SQL Injection Prevention:** Raw SQL is executed strictly via the `Prisma.sql` tagged template literal.
- **Natural Language Parsing:** We use Postgres's `websearch_to_tsquery` instead of standard `to_tsquery` or `plainto_tsquery`. This naturally handles user typos, quoted strings, logical operators (OR, -), and strips unparseable characters gracefully without crashing the query analyzer.
- **Debouncing & AbortController:** The frontend `useSearch` hook debounces network requests by 300ms and utilizes native `AbortController` functionality to cancel stale fetches.
- **Observability:** Queries and Autocomplete operations log their total output count and latency via `performance.now()` for real-time Prometheus/Datadog monitoring.
- **Configuration Centralization:** Core tuning parameters (limits, timeout, page sizes) are centrally managed inside `search.constants.ts`.
- **Search Tests:** A dedicated test suite (`search.service.spec.ts`) automates edge case verifications, including empty strings, Unicode handling, and malicious payload stripping.

## 5. Security & Isolation

- **Archived/Soft-Deleted Entities:** Excluded implicitly (`deletedAt IS NULL` and `status != 'ARCHIVED'`).
- **RBAC Overrides:** The `SearchController` intercepts requests. If the requester lacks `ADMIN` privileges, it strictly overrides the `partnerStatus` and `offerStatus` DTO parameters to ensure only `PUBLISHED` entities are ever returned.

## 6. Known Limitations & Future Recommendations

- **Limitations:** Typo tolerance (fuzzy matching) is not natively supported by `websearch_to_tsquery`. If users misspell "Discount" as "Discuont", results won't naturally align without trigrams.
- **GIN Indices Configured:** GIN expression indices on the concatenated searchable strings have already been generated and migrated via Prisma.
- **Future Recommendation (pg_trgm):** Implement `pg_trgm` extension on the PostgreSQL instance and apply GIN indices on `name` and `title` to support native typo tolerance without relying on heavy external services like Algolia or Elasticsearch.
