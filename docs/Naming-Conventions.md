# Naming Conventions

> Habib University Preferred Partner Platform — Monorepo Naming Standards

This document defines the canonical naming conventions used across the entire HU Preferred Partner
monorepo (`/apps/web`, `/apps/api`, `/packages/*`). Consistent naming reduces cognitive load,
eliminates bikeshedding in code reviews, and makes the codebase navigable to new contributors.

---

## 1. File Naming

| Context                  | Convention     | Example                          |
| ------------------------ | -------------- | -------------------------------- |
| React components         | `PascalCase`   | `BrandPartnerCard.tsx`           |
| Custom hooks             | `camelCase`    | `usePartnerOffers.ts`            |
| Utility / helper modules | `kebab-case`   | `format-date.ts`                 |
| Constants files          | `kebab-case`   | `api-endpoints.ts`               |
| Type definition files    | `kebab-case`   | `partner-types.ts`               |
| Test files               | Match source   | `BrandPartnerCard.test.tsx`      |
| Config files             | `kebab-case`   | `tailwind.config.ts`             |
| Middleware               | `kebab-case`   | `auth-middleware.ts`             |
| Database migrations      | Timestamped    | `20260315120000-create-partner.ts` |

### Why this matters

- **PascalCase components** mirror the JSX tag name — `<BrandPartnerCard />` lives in
  `BrandPartnerCard.tsx`. This one-to-one mapping makes file discovery instant.
- **kebab-case utilities** signal "this is not a component" at a glance in the file tree.
- **camelCase hooks** follow React's `use*` convention and distinguish hooks from components
  without opening the file.

---

## 2. Directory Naming

All directories use **kebab-case**, without exception.

```
apps/
  web/
    src/
      components/
        brand-partners/
        offer-cards/
      hooks/
      lib/
      styles/
  api/
    src/
      modules/
        brand-partner/
        newsletter/
packages/
  shared-types/
  ui-components/
  validation-schemas/
```

Directories describe **domains**, not implementation details. Prefer `brand-partners/` over
`cards/` — the directory name should tell you *what* the code is about, not *how* it is built.

---

## 3. Component Naming

Components use **PascalCase** and must be **descriptive and domain-specific**.

| ❌ Avoid          | ✅ Prefer                  | Rationale                          |
| ----------------- | -------------------------- | ---------------------------------- |
| `Card`            | `BrandPartnerCard`         | Ambiguous — cards are everywhere   |
| `Modal`           | `OfferDetailsModal`        | Describes content, not chrome      |
| `List`            | `PartnerOfferList`         | Searchable, self-documenting       |
| `Button`          | `SubmitOfferButton`        | Generic `Button` belongs in `ui/`  |
| `Header`          | `PlatformHeader`           | Distinguishes from section headers |

**Primitive UI components** (from `/packages/ui-components`) are the sole exception — they may use
generic names like `Button`, `Input`, `Dialog` because they are context-free by design.

### Compound component naming

For compound components, use dot notation or a shared prefix:

```tsx
// Dot notation (preferred for tightly coupled sets)
<DataTable>
  <DataTable.Header />
  <DataTable.Row />
  <DataTable.Pagination />
</DataTable>

// Prefix approach (for loosely related components)
<OfferCardImage />
<OfferCardDetails />
<OfferCardActions />
```

---

## 4. Custom Hook Naming

Hooks follow `useCamelCase` and are **domain-prefixed** to communicate scope.

| Hook                    | Domain      | Purpose                              |
| ----------------------- | ----------- | ------------------------------------ |
| `usePartnerOffers`      | Partner     | Fetches offers for a brand partner   |
| `useAuthSession`        | Auth        | Returns current session state        |
| `useNewsletterForm`     | Newsletter  | Manages newsletter compose form      |
| `useOfferFilters`       | Offers      | URL-synced offer filter state        |
| `useAdminPermissions`   | Admin       | Resolves admin-level RBAC checks     |
| `useDebounce`           | Utility     | Generic — no domain prefix needed    |

Hooks that wrap a single API call should mirror the API resource:
`GET /api/brand-partners/:id/offers` → `usePartnerOffers(partnerId)`.

---

## 5. Types & Interfaces

- Use **PascalCase** for all type and interface names.
- **Do not** prefix interfaces with `I` (e.g., ~~`IPartner`~~ → `Partner`).
- Component props types use the **`Props`** suffix.
- API response types use the **`Response`** suffix.
- Form data types use the **`FormData`** suffix.

```typescript
// Domain types
type Partner = { id: string; name: string; tier: PartnerTier };
type Offer = { id: string; title: string; partnerId: string };

// Component props
type BrandPartnerCardProps = { partner: Partner; onSelect: (id: string) => void };

// API responses
type PartnerListResponse = { data: Partner[]; pagination: PaginationMeta };

// Form data
type CreateOfferFormData = { title: string; description: string; expiresAt: Date };
```

---

## 6. Enums

Enum names use **PascalCase**. Enum values use **UPPER_SNAKE_CASE**.

```typescript
enum PartnerTier {
  PLATINUM = 'PLATINUM',
  GOLD = 'GOLD',
  SILVER = 'SILVER',
}

enum OfferStatus {
  DRAFT = 'DRAFT',
  PENDING_REVIEW = 'PENDING_REVIEW',
  ACTIVE = 'ACTIVE',
  EXPIRED = 'EXPIRED',
  ARCHIVED = 'ARCHIVED',
}

enum UserRole {
  ADMIN = 'ADMIN',
  BRAND_PARTNER = 'BRAND_PARTNER',
  PUBLIC = 'PUBLIC',
}
```

Prefer **string enums** over numeric enums for serialization safety and debuggability.

---

## 7. Constants

Constants use **UPPER_SNAKE_CASE** and live in dedicated `constants/` or `constants.ts` files.

```typescript
// constants/api-endpoints.ts
export const API_BASE_URL = '/api/v1';
export const PARTNER_OFFERS_ENDPOINT = '/brand-partners/:id/offers';
export const MAX_OFFERS_PER_PAGE = 20;

// constants/cache-keys.ts
export const CACHE_KEY_PARTNERS = 'partners:list';
export const CACHE_KEY_OFFERS = 'offers:list';
export const REVALIDATION_INTERVAL = 3600; // seconds
```

Never scatter magic numbers or string literals across components — extract them to constants.

---

## 8. API Endpoints

All API paths use **kebab-case** and follow RESTful resource naming.

| Method   | Endpoint                                | Purpose                    |
| -------- | --------------------------------------- | -------------------------- |
| `GET`    | `/api/brand-partners`                   | List all partners          |
| `GET`    | `/api/brand-partners/:id`               | Get partner by ID          |
| `POST`   | `/api/brand-partners`                   | Create a partner           |
| `PATCH`  | `/api/brand-partners/:id`               | Update a partner           |
| `DELETE` | `/api/brand-partners/:id`               | Delete a partner           |
| `GET`    | `/api/brand-partners/:id/offers`        | List offers for a partner  |
| `POST`   | `/api/brand-partners/:id/offers`        | Create offer for a partner |
| `GET`    | `/api/newsletters`                      | List newsletters           |
| `POST`   | `/api/newsletters/:id/send`             | Send a newsletter          |

**Rules:**

- Use **plural nouns** for collection resources (`/brand-partners`, not `/brand-partner`).
- Use **path nesting** for sub-resources (max two levels deep).
- Use **verbs only** for non-CRUD actions (`/send`, `/verify`, `/archive`).
- Version the API via path prefix: `/api/v1/...`.

---

## 9. Database Naming

All database identifiers use **snake_case**. Tables are **singular**.

```sql
-- Tables (singular)
CREATE TABLE partner (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name          VARCHAR(255) NOT NULL,
  slug          VARCHAR(255) NOT NULL UNIQUE,
  tier          partner_tier NOT NULL DEFAULT 'SILVER',
  contact_email VARCHAR(255) NOT NULL,
  logo_url      TEXT,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Indexes: prefixed with idx_
CREATE INDEX idx_partner_slug ON partner (slug);
CREATE INDEX idx_partner_tier ON partner (tier);

-- Foreign keys: prefixed with fk_
ALTER TABLE offer
  ADD CONSTRAINT fk_offer_partner
  FOREIGN KEY (partner_id) REFERENCES partner (id);

-- Unique constraints: prefixed with uq_
ALTER TABLE "user"
  ADD CONSTRAINT uq_user_email UNIQUE (email);
```

---

## 10. Environment Variables

Environment variables use **UPPER_SNAKE_CASE** with a **category prefix**.

| Prefix          | Scope                          | Example                        |
| --------------- | ------------------------------ | ------------------------------ |
| `NEXT_PUBLIC_`  | Client-exposed (Next.js)       | `NEXT_PUBLIC_API_URL`          |
| `DATABASE_`     | Database connection            | `DATABASE_URL`                 |
| `AWS_`          | AWS services                   | `AWS_S3_BUCKET`                |
| `SMTP_`         | Email service                  | `SMTP_HOST`                    |
| `JWT_`          | Authentication secrets         | `JWT_ACCESS_SECRET`            |
| `REDIS_`        | Cache / session store          | `REDIS_URL`                    |
| `SENTRY_`       | Error tracking                 | `SENTRY_DSN`                   |

> **Security rule:** Never prefix secrets with `NEXT_PUBLIC_`. Only values safe for the browser
> should carry that prefix.

---

## 11. CSS & Tailwind

- **Custom CSS** follows a BEM-like convention: `.block__element--modifier`.
- **Tailwind classes** are preferred for all styling; custom CSS is the escape hatch.
- Use **semantic class names** when custom CSS is unavoidable.

```css
/* BEM-like custom CSS */
.partner-card { }
.partner-card__logo { }
.partner-card__logo--rounded { }
.partner-card__title { }
.partner-card__actions { }
```

Tailwind `@apply` is permitted only inside `/packages/ui-components` for design-token abstraction.

---

## 12. Test Naming

- `describe` blocks match the **module or component** under test.
- `it` blocks describe **observable behavior**, not implementation.

```typescript
describe('BrandPartnerCard', () => {
  it('renders the partner name and logo', () => { /* ... */ });
  it('navigates to the partner detail page on click', () => { /* ... */ });
  it('shows a premium badge for platinum-tier partners', () => { /* ... */ });
});

describe('usePartnerOffers', () => {
  it('returns an empty list when the partner has no offers', () => { /* ... */ });
  it('paginates results using the page search param', () => { /* ... */ });
  it('revalidates the cache after a new offer is created', () => { /* ... */ });
});
```

---

## Quick Reference Table

| Element              | Convention         | Example                          |
| -------------------- | ------------------ | -------------------------------- |
| Component file       | `PascalCase`       | `OfferDetailsModal.tsx`          |
| Hook file            | `camelCase`        | `usePartnerOffers.ts`            |
| Utility file         | `kebab-case`       | `format-currency.ts`             |
| Directory            | `kebab-case`       | `brand-partners/`                |
| Component name       | `PascalCase`       | `BrandPartnerCard`               |
| Hook name            | `useCamelCase`     | `useAuthSession`                 |
| Type / Interface     | `PascalCase`       | `PartnerListResponse`            |
| Props type           | `PascalCase+Props` | `BrandPartnerCardProps`          |
| Enum name            | `PascalCase`       | `OfferStatus`                    |
| Enum value           | `UPPER_SNAKE`      | `PENDING_REVIEW`                 |
| Constant             | `UPPER_SNAKE`      | `MAX_OFFERS_PER_PAGE`            |
| API path             | `kebab-case`       | `/api/brand-partners/:id/offers` |
| DB table             | `snake_case`       | `partner`                        |
| DB column            | `snake_case`       | `contact_email`                  |
| DB index             | `idx_` prefix      | `idx_partner_slug`               |
| Env variable         | `UPPER_SNAKE`      | `DATABASE_URL`                   |
| CSS class (custom)   | `BEM-like`         | `.partner-card__title`           |
| Test `describe`      | Module name        | `describe('BrandPartnerCard')`   |
| Test `it`            | Behavior           | `it('renders the partner name')` |
