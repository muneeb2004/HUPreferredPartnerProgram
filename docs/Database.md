# Database

> PostgreSQL & Prisma Database Architecture for the Habib University Preferred Partner Platform

## 1. PostgreSQL Setup

### 1.1 Version & Hosting

| Parameter       | Value                                |
| --------------- | ------------------------------------ |
| Engine          | PostgreSQL 16                        |
| Hosting         | AWS RDS (Multi-AZ deployment)        |
| Instance class  | `db.t4g.medium` (staging) / `db.r6g.large` (production) |
| Storage         | gp3, 100 GB, auto-scaling enabled    |
| Region          | `ap-south-1` (Mumbai)                |

### 1.2 Required Extensions

```sql
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";   -- UUID v4 generation
CREATE EXTENSION IF NOT EXISTS "pgcrypto";    -- Cryptographic functions (token hashing)
CREATE EXTENSION IF NOT EXISTS "pg_trgm";     -- Trigram similarity for fuzzy search
CREATE EXTENSION IF NOT EXISTS "unaccent";    -- Accent-insensitive search
```

### 1.3 Database Naming

| Environment | Database Name          | Schema    |
| ----------- | ---------------------- | --------- |
| Development | `hupartners_dev`       | `public`  |
| Staging     | `hupartners_staging`   | `public`  |
| Production  | `hupartners_prod`      | `public`  |

---

## 2. Prisma Design Principles

### 2.1 Core Guidelines

1. **Explicit models** — every table is a named Prisma model; no raw SQL for schema definitions.
2. **Explicit relations** — all foreign keys are defined with `@relation` annotations; no implicit join tables except for many-to-many via Prisma's implicit syntax.
3. **Enums over strings** — use Prisma `enum` for all finite-state fields (status, role, tier).
4. **Composite indexes** — declare `@@index` for common query patterns; avoid relying on ad-hoc query optimisation.
5. **Soft deletes** — prefer `deletedAt DateTime?` over hard deletes for audit-sensitive entities.
6. **Timestamps** — every model includes `createdAt` and `updatedAt` with `@default(now())` and `@updatedAt`.
7. **UUID primary keys** — all models use `String @id @default(uuid())` for globally unique, non-sequential identifiers.

### 2.2 Naming Conventions

| Element         | Convention              | Example                    |
| --------------- | ----------------------- | -------------------------- |
| Model name      | PascalCase singular     | `Partner`, `Offer`         |
| Field name      | camelCase               | `partnerId`, `createdAt`   |
| Enum name       | PascalCase              | `PartnerStatus`            |
| Enum value      | SCREAMING_SNAKE_CASE    | `IN_REVIEW`, `ACTIVE`      |
| Index name      | `idx_<table>_<columns>` | `idx_offer_partner_status` |
| Relation field  | camelCase noun          | `partner`, `offers`        |

---

## 3. Conceptual Data Model Overview

### 3.1 Domain Groupings

| Domain          | Models                                                        |
| --------------- | ------------------------------------------------------------- |
| **Identity**    | `User`, `Role`, `Session`, `PasswordReset`                    |
| **Partnership** | `Partner`, `PartnerTier`, `PartnerContact`, `PartnerAgreement`, `PartnerAsset`, `PartnerNote` |
| **Offers**      | `Offer`, `Category`, `OfferRedemption`                        |
| **Content**     | `Page`, `Section`, `Announcement`, `ContentVersion`, `Media`  |
| **Newsletter**  | `Newsletter`, `Edition`, `NLSection`, `Article`, `Template`, `Subscriber` |
| **System**      | `AuditLog`, `IntegrationConfig`, `SystemSetting`              |

### 3.2 Core Entity-Relationship Diagram

```mermaid
erDiagram
    User ||--o{ AuditLog : "generates"
    User ||--o{ OfferRedemption : "redeems"
    User }o--|| Role : "assigned"

    Partner ||--o{ Offer : "provides"
    Partner ||--o{ PartnerContact : "has"
    Partner ||--o{ PartnerAsset : "uploads"
    Partner ||--o{ PartnerAgreement : "signs"
    Partner ||--o{ PartnerNote : "has"
    Partner }o--|| PartnerTier : "belongs to"
    Partner }o--o{ Category : "tagged with"

    Offer }o--|| Category : "categorised as"
    Offer ||--o{ OfferRedemption : "tracks"

    Newsletter ||--o{ Edition : "contains"
    Edition ||--o{ NLSection : "contains"
    NLSection ||--o{ Article : "contains"
    Edition }o--|| Template : "uses"

    Page ||--o{ ContentVersion : "versioned by"
    Page ||--o{ Media : "references"

    User {
        string id PK
        string email
        string passwordHash
        string firstName
        string lastName
        string roleId FK
        datetime createdAt
        datetime updatedAt
        datetime deletedAt
    }

    Role {
        string id PK
        string name
        json permissions
    }

    Partner {
        string id PK
        string name
        string slug
        string tierId FK
        string status
        string logoUrl
        text description
        datetime partnerSince
        datetime deletedAt
    }

    PartnerTier {
        string id PK
        string name
        int sortOrder
        json benefits
    }

    Offer {
        string id PK
        string partnerId FK
        string categoryId FK
        string title
        text description
        string offerType
        string status
        datetime startsAt
        datetime expiresAt
    }

    Category {
        string id PK
        string name
        string slug
        int sortOrder
    }

    Newsletter {
        string id PK
        string name
        text description
    }

    Edition {
        string id PK
        string newsletterId FK
        string title
        int volumeNumber
        int issueNumber
        string status
        datetime publishedAt
    }

    Page {
        string id PK
        string title
        string slug
        string status
        json seoMeta
    }

    AuditLog {
        string id PK
        string userId FK
        string action
        string entityType
        string entityId
        json changes
        datetime createdAt
    }
```

---

## 4. Migration Strategy

### 4.1 Tooling

All schema changes are managed through **Prisma Migrate**, which generates SQL migration files from Prisma schema diffs.

### 4.2 Workflow

```
1. Modify `schema.prisma`
2. Run `npx prisma migrate dev --name <migration-name>`
3. Review generated SQL in `prisma/migrations/<timestamp>_<name>/migration.sql`
4. Commit migration files to version control
5. CI pipeline runs `npx prisma migrate deploy` against staging/production
```

### 4.3 Migration Naming

Migrations follow a descriptive naming convention:

```
YYYYMMDDHHMMSS_<action>_<entity>_<detail>
```

| Example                                  | Description                         |
| ---------------------------------------- | ----------------------------------- |
| `20260701120000_create_partner_table`     | Initial partner model               |
| `20260715090000_add_offer_expiry_index`   | Performance index on offers         |
| `20260801140000_alter_user_add_avatar`    | New field on existing model         |

### 4.4 Review Process

- All migration PRs require **at least one backend reviewer**.
- Destructive changes (column drops, type changes) require **DBA sign-off** and must include a rollback migration.
- Data migrations are written as separate, idempotent scripts — never mixed with schema migrations.

---

## 5. Seeding

### 5.1 Development Seeds

The `prisma/seed.ts` script populates the development database with realistic fixture data:

| Entity         | Seed Count | Notes                                    |
| -------------- | ---------- | ---------------------------------------- |
| Users          | 10         | Includes admin, reviewer, author roles   |
| Partners       | 15         | Spread across all tiers                  |
| Offers         | 40         | Mix of active, expired, draft            |
| Categories     | 8          | Food, Tech, Retail, Health, etc.         |
| Newsletter     | 2          | With 3 editions each                     |
| Pages          | 5          | About, FAQ, Terms, Privacy, Contact      |

### 5.2 Staging Fixtures

Staging uses a curated subset of anonymised production-like data. The `prisma/seed-staging.ts` script is run manually after each staging database reset.

### 5.3 Running Seeds

```bash
# Development
npx prisma db seed

# Staging (requires STAGING_DATABASE_URL)
DATABASE_URL=$STAGING_DATABASE_URL npx ts-node prisma/seed-staging.ts
```

---

## 6. Connection Pooling

### 6.1 Strategy

Production uses **PgBouncer** as a connection pool proxy between the NestJS application and RDS.

### 6.2 Configuration

| Parameter            | Value           | Rationale                              |
| -------------------- | --------------- | -------------------------------------- |
| Pool mode            | `transaction`   | Compatible with Prisma's query model   |
| Default pool size    | 20              | Matches ECS task count × 2             |
| Max client connections | 200           | Headroom for burst traffic             |
| Idle timeout         | 300s            | Release idle connections               |
| Server connect timeout | 5s            | Fail fast on RDS issues                |

### 6.3 Prisma Configuration

```env
# .env (production)
DATABASE_URL="postgresql://user:pass@pgbouncer-host:6432/hupartners_prod?pgbouncer=true&connection_limit=10"
```

The `?pgbouncer=true` flag tells Prisma to disable prepared statements, which are incompatible with PgBouncer's transaction pooling mode.

### 6.4 Development

In development, Prisma connects directly to PostgreSQL (via Docker Compose) without PgBouncer:

```env
# .env (development)
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/hupartners_dev"
```

---

## 7. Backup Strategy

### 7.1 Automated Backups (RDS)

| Parameter                | Value                    |
| ------------------------ | ------------------------ |
| Automated backup window  | 03:00–04:00 UTC daily    |
| Retention period         | 14 days                  |
| Multi-AZ                 | Enabled (production)     |
| Encrypted                | Yes (AWS KMS)            |

### 7.2 Point-in-Time Recovery

RDS supports point-in-time recovery (PITR) with a granularity of **5 minutes**. Recovery creates a new RDS instance from the backup, which is then promoted.

### 7.3 Manual Snapshots

- A manual snapshot is taken **before every production migration**.
- Snapshots are tagged with the migration name and date.
- Snapshots older than 90 days are reviewed and pruned quarterly.

### 7.4 Disaster Recovery

| Scenario                | Recovery Method                     | RTO        | RPO       |
| ----------------------- | ----------------------------------- | ---------- | --------- |
| Accidental data deletion | PITR to 5 min before incident      | ~30 min    | ~5 min    |
| Full region outage       | Cross-region read replica promotion | ~60 min    | ~1 min    |
| Corrupted migration      | Restore from pre-migration snapshot | ~20 min    | 0         |

---

## 8. Performance

### 8.1 Indexing Strategy

| Index                              | Type        | Purpose                                |
| ---------------------------------- | ----------- | -------------------------------------- |
| `idx_partner_status`               | B-tree      | Filter active partners                 |
| `idx_partner_tier`                 | B-tree      | Filter by tier                         |
| `idx_offer_partner_status`         | Composite   | Partner offers by status               |
| `idx_offer_expires_at`             | B-tree      | Expiry-based queries and cron jobs     |
| `idx_offer_category`               | B-tree      | Category filtering                     |
| `idx_user_email`                   | Unique      | Login lookups                          |
| `idx_edition_newsletter_status`    | Composite   | Published editions per newsletter      |
| `idx_audit_log_entity`             | Composite   | Entity-specific audit trails           |
| `idx_partner_name_trgm`           | GIN (pg_trgm) | Fuzzy search on partner names        |

### 8.2 Query Optimisation Guidelines

1. **Use `select` and `include` sparingly** — only fetch the fields and relations needed by the current operation.
2. **Avoid N+1 queries** — use Prisma's `include` for known relation traversals; batch unknown lookups with `findMany` + `in` filters.
3. **Paginate everything** — use cursor-based pagination (`cursor`, `take`, `skip`) for all list endpoints.
4. **Use `count` wisely** — prefer `_count` relation aggregation over separate count queries.
5. **Raw queries for analytics** — complex aggregations (e.g., monthly redemption trends) use `prisma.$queryRaw` with hand-tuned SQL.

### 8.3 N+1 Prevention

Prisma's query engine batches relation queries automatically in many cases, but developers must be vigilant:

```typescript
// ❌ N+1: fetching offers in a loop
const partners = await prisma.partner.findMany();
for (const partner of partners) {
  const offers = await prisma.offer.findMany({ where: { partnerId: partner.id } });
}

// ✅ Eager load: single query with include
const partners = await prisma.partner.findMany({
  include: { offers: { where: { status: 'ACTIVE' } } },
});
```

### 8.4 Monitoring

| Metric                          | Tool                  | Alert Threshold       |
| ------------------------------- | --------------------- | --------------------- |
| Query duration (p95)            | CloudWatch + RDS PI   | > 500ms               |
| Active connections              | CloudWatch            | > 80% of pool         |
| Replication lag (read replicas) | CloudWatch            | > 10 seconds          |
| Disk IOPS                       | CloudWatch            | > 80% of provisioned  |
| Slow query log                  | RDS slow query log    | > 1 second            |

---

## 9. Environment-Specific Configuration

| Setting                | Development              | Staging                  | Production               |
| ---------------------- | ------------------------ | ------------------------ | ------------------------ |
| Database               | Docker Compose (local)   | RDS (single-AZ)         | RDS (multi-AZ)           |
| Connection pooler      | None                     | Prisma pool (limit=5)   | PgBouncer (pool=20)      |
| Backups                | None                     | 7-day retention         | 14-day retention          |
| Encryption             | None                     | AWS KMS                 | AWS KMS                   |
| Read replicas          | None                     | None                    | 1 (cross-AZ)              |
| Seed data              | Full dev seeds           | Anonymised fixtures     | None (production data)    |

---

## 10. Future Considerations

- **Read replicas for analytics** — route reporting queries to a dedicated read replica.
- **Row-level security** — implement PostgreSQL RLS policies for multi-tenant isolation if the platform expands beyond Habib University.
- **Prisma Accelerate** — evaluate Prisma's managed connection pooling and caching layer as an alternative to self-managed PgBouncer.
- **TimescaleDB** — consider the time-series extension for high-volume redemption analytics.
- **Database branching** — adopt Neon or similar for per-PR preview databases in CI.
