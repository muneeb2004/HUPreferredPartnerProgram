# Analytics Architecture & Engineering Strategy

## Overview

The HuPreferred Partner platform requires a robust, scalable, and privacy-conscious analytics engine (Phase 14) to track user engagement, partner portal insights, and offer performance. The architecture utilizes PostgreSQL as the primary data store for both raw event ingestion and materialized aggregations, leveraging NestJS background queues for high-throughput non-blocking ingestion.

## 1. Analytics Events Taxonomy

The system captures high-value platform interactions without recording invasive session-replay or PII (Personally Identifiable Information).

### Core Events:
- **`PAGE_VIEW`**: Generic traversal (e.g., viewing the Marketing homepage).
- **`SEARCH_QUERY`**: Tracks search strings, result counts, and zero-result instances.
- **`PARTNER_VIEW`**: Viewing a specific Partner's profile page.
- **`OFFER_VIEW`**: Viewing a specific Offer's detail page.
- **`OFFER_CLICK`**: Outbound conversion clicks on an Offer (e.g., clicking to claim).
- **`NEWSLETTER_SUBSCRIBE`**: Successful opt-in actions.

*Note: All event names adhere strictly to `UPPER_SNAKE_CASE` to ensure consistency.*

## 2. Event Ingestion Strategy

To ensure zero impact on end-user response times, event ingestion must be **asynchronous and non-blocking**.

**Architecture Flow:**
1. **Frontend (Next.js):** Client-side triggers push lightweight JSON payloads to the `/api/v1/analytics/events` endpoint using `navigator.sendBeacon` (for unmount events) or standard `fetch` without awaiting the response in critical UI paths.
2. **Backend (NestJS API):**
   - The Analytics Controller validates payloads using strict Zod/class-validator DTOs (validating `entityId` as UUID, `eventType` as Enum, strictly typed `metadata`, optional `sessionId` UUID, and `version` integer). No free-form payloads are accepted.
   - The API immediately responds with `202 Accepted`.
   - Validated payloads are published to an asynchronous **Message Queue** (`AnalyticsQueue` powered by BullMQ).
3. **Worker:** 
   - A dedicated `AnalyticsWorker` drains the queue in batches and bulk-inserts records into the PostgreSQL `Event` table. 
   - **Idempotency:** Events include a client-generated `eventId` (UUID). The worker uses `ON CONFLICT DO NOTHING` on `eventId` to ignore duplicate submissions (e.g., double clicks, network retries).
   - **Retry Policy:** The queue enforces a 5-attempt retry limit with exponential backoff. Failed jobs are routed to a Dead Letter Queue (DLQ).

## 3. Data Model

Analytics requires a high-write, heavy-read architecture. We decouple raw ingestion from dashboard reads.

### A. Raw Events Table (`AnalyticsEvent`)
Appends only. Designed for high write throughput. Never updating analytics events simplifies concurrency and auditing.
- `id` (UUID, PK) - Client-generated `eventId` for idempotency.
- `version` (Int) - Schema version for the event (e.g., `1`), allowing future evolution.
- `eventType` (Enum) - e.g., `OFFER_CLICK`
- `entityId` (String, nullable)
- `entityType` (Enum, nullable)
- `metadata` (JSONB) - Strongly typed based on event type.
- `sessionId` (String, hashed/anonymized)
- `createdAt` (Timestamp, indexed)

### B. Typed Metadata Schema
Instead of unrestricted JSON, `metadata` adheres to explicit TypeScript/Zod schemas depending on `eventType`:
- **Common:** `referrer`, `page`, `deviceType`, `source`, `campaign`.
- **Search Analytics (`SEARCH_QUERY`):** `searchQuery`, `resultsReturned`, `duration`, `clickedResult`, `resultType`.

### C. Aggregation Tables / Materialized Views
To serve sub-200ms dashboard queries, we utilize scheduled rollup tables.
- **`DailyPartnerStats`**: Rolled up metrics per Partner (Views, Clicks).
- **`DailyOfferStats`**: Rolled up metrics per Offer.
- **`SearchAnalytics`**: Frequent queries and zero-result patterns.

*Note: Future support may include `Hourly`, `Weekly`, and `Monthly` tables, but only `Daily` is implemented initially.*

## 4. Privacy Model & Retention

Privacy is a non-negotiable principle. The system must comply with modern data protection standards.
- **No PII in Events:** `metadata` must strictly exclude IP addresses, emails, or exact geographic coordinates.
- **Session Anonymization:** `sessionId` is generated client-side as a temporary, rolling UUID that rotates every 24 hours. It cannot be tied back to an authenticated user's `User` record unless they explicitly trigger an authenticated action (which we actively avoid linking to general traffic).
- **Data Retention:** Raw `AnalyticsEvent` records are hard-deleted after 90 days. Aggregated rollup tables persist indefinitely as they contain no granular session data.

## 5. Aggregation Strategy

Dashboard reads must never query the raw `AnalyticsEvent` table directly.
- **Scheduled Rollups:** A NestJS Cron job (`@Cron()`) runs hourly (or nightly) to execute aggregate SQL functions over the raw events table.
- **Storage:** Results are UPSERTed into `DailyPartnerStats` and `DailyOfferStats`.
- **Concurrency:** Uses database-level locks (`SELECT FOR UPDATE`) during UPSERT to prevent race conditions during cron overlaps.

## 6. Dashboard APIs

Two primary analytics consumers exist:

1. **Brand Portal (`/api/v1/portal/analytics`)**:
   - Access: Authenticated Brand Partners.
   - Visibility: Strictly scoped to their own `partnerId`.
   - Endpoints: Timeline charts (Views vs Clicks over time), Top Performing Offers, Click-Through Rates.
2. **Admin Portal (`/api/v1/admin/analytics`)**:
   - Access: Super Admins.
   - Visibility: Global platform health.
   - Endpoints: Total platform traffic, top performing partners globally, search term trends, zero-result search analytics.

**Caching Strategy:**
Dashboard endpoints sit behind a Redis cache with a TTL of 30–60 seconds to avoid unnecessary aggregate queries during peak usage.

## 7. Modular Separation

The implementation will strictly follow a modular NestJS architecture to isolate concerns:
- `AnalyticsModule`: The root module.
- `AnalyticsController`: Accepts and validates incoming DTOs.
- `AnalyticsQueue`: Manages BullMQ job creation.
- `AnalyticsWorker`: Processes jobs, enforces idempotency, handles DLQ.
- `AnalyticsAggregationService`: Cron-driven scheduler for Daily rollups.
- `AnalyticsReportingService`: Serves Dashboard API queries via Redis Cache.

## 8. Performance Expectations

- **Ingestion Latency:** API endpoints must return `202 Accepted` within `<50ms`.
- **Database Writes:** Queue processors must use `Prisma.createMany` to batch insert 100-500 events per transaction.
- **Query Latency:** Portal dashboard endpoints must return aggregated statistical data in `<300ms` via direct indexed reads from roll-up tables, never scanning raw event rows.
- **Index Strategy:** Heavy indexing on `AnalyticsEvent(createdAt, eventType, entityId)` is required for efficient batch aggregations.
