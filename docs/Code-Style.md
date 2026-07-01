# Code Style Guide

> TypeScript, React, and NestJS conventions for the Habib University Preferred Partner Platform.

---

## Table of Contents

- [TypeScript Configuration](#typescript-configuration)
- [Naming Conventions](#naming-conventions)
- [Import Ordering](#import-ordering)
- [React Component Structure](#react-component-structure)
- [Component Size Limits](#component-size-limits)
- [Custom Hooks](#custom-hooks)
- [Error Handling](#error-handling)
- [Logging Conventions](#logging-conventions)
- [API Conventions (NestJS)](#api-conventions-nestjs)
- [NestJS Architecture Patterns](#nestjs-architecture-patterns)

---

## TypeScript Configuration

### Strict Mode — Non-Negotiable

All projects in this monorepo enforce TypeScript strict mode. The following compiler options are **required** across all `tsconfig.json` files:

```json
{
  "compilerOptions": {
    "strict": true,
    "noUncheckedIndexedAccess": true,
    "noImplicitReturns": true,
    "noFallthroughCasesInSwitch": true,
    "forceConsistentCasingInFileNames": true,
    "exactOptionalPropertyTypes": true
  }
}
```

### Rules

| Rule                                   | Enforcement |
| -------------------------------------- | ----------- |
| No `any` type                          | ESLint error (`@typescript-eslint/no-explicit-any`) |
| Explicit return types on public APIs   | ESLint warning (enforced on exported functions) |
| No non-null assertions (`!`)           | ESLint warning — prefer optional chaining or type guards |
| Prefer `unknown` over `any`            | Code review enforcement |
| Use `satisfies` for type narrowing     | Preferred over `as` casts |
| Discriminated unions over optional fields | Preferred for state modeling |

### Type Assertions

```typescript
// ❌ Avoid
const user = data as User;

// ✅ Prefer type guard
function isUser(data: unknown): data is User {
  return typeof data === 'object' && data !== null && 'id' in data;
}

// ✅ Prefer satisfies
const config = {
  port: 4000,
  host: 'localhost',
} satisfies ServerConfig;
```

---

## Naming Conventions

| Element               | Convention           | Example                        |
| --------------------- | -------------------- | ------------------------------ |
| React Components      | PascalCase           | `PartnerCard`, `DashboardLayout` |
| Functions / Variables  | camelCase            | `fetchPartners`, `isLoading`   |
| Constants             | UPPER_SNAKE_CASE     | `MAX_UPLOAD_SIZE`, `API_BASE_URL` |
| Types / Interfaces    | PascalCase           | `PartnerProfile`, `AuthState`  |
| Enums                 | PascalCase (members too) | `Role.Admin`, `Status.Active` |
| Files — Components    | PascalCase           | `PartnerCard.tsx`              |
| Files — Utilities     | kebab-case           | `date-helpers.ts`              |
| Files — Hooks         | camelCase with `use` | `usePartnerSearch.ts`          |
| Files — Tests         | Match source + `.test` | `PartnerCard.test.tsx`       |
| CSS Modules           | kebab-case           | `partner-card.module.css`      |
| Database tables       | snake_case (plural)  | `partner_profiles`             |
| Database columns      | snake_case           | `created_at`, `is_active`      |
| API endpoints         | kebab-case (plural)  | `/api/partner-profiles`        |
| Environment variables | UPPER_SNAKE_CASE     | `DATABASE_URL`                 |

### Boolean Naming

Prefix boolean variables and properties with auxiliary verbs:

```typescript
// ✅ Good
const isLoading = true;
const hasPermission = false;
const canEdit = user.role === Role.Admin;
const shouldRefetch = staleTime > MAX_STALE;

// ❌ Bad
const loading = true;
const permission = false;
```

---

## Import Ordering

Organize imports in the following order, separated by blank lines:

```typescript
// 1. React & Next.js
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

// 2. Third-party libraries
import { z } from 'zod';
import { format } from 'date-fns';

// 3. Internal packages (monorepo)
import { Button, Card } from '@hu/ui';
import type { Partner } from '@hu/types';

// 4. Relative imports (parent → sibling → index)
import { usePartnerSearch } from '../../hooks/usePartnerSearch';
import { formatPartnerName } from './helpers';
import type { PartnerCardProps } from './types';
```

### Rules

- Use `import type` for type-only imports — enforced by ESLint
- Never use wildcard imports (`import * as ...`) except for namespaced utilities
- Barrel exports (`index.ts`) are allowed in `packages/*` but discouraged in `apps/*`
- ESLint plugin `eslint-plugin-import` auto-sorts and enforces this order

---

## React Component Structure

Every React component file should follow this internal ordering:

```typescript
// ─── 1. Imports ───────────────────────────────────────────────
import { useState } from 'react';
import { Card } from '@hu/ui';
import type { Partner } from '@hu/types';
import styles from './PartnerCard.module.css';

// ─── 2. Types ─────────────────────────────────────────────────
interface PartnerCardProps {
  partner: Partner;
  onSelect: (id: string) => void;
  isCompact?: boolean;
}

// ─── 3. Component ─────────────────────────────────────────────
export function PartnerCard({ partner, onSelect, isCompact = false }: PartnerCardProps) {
  const [isHovered, setIsHovered] = useState(false);

  const handleClick = () => {
    onSelect(partner.id);
  };

  return (
    <Card
      className={styles.card}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={handleClick}
    >
      <h3>{partner.name}</h3>
      {!isCompact && <p>{partner.description}</p>}
    </Card>
  );
}

// ─── 4. Helper Functions (private to this file) ──────────────
function formatPartnerTier(tier: string): string {
  return tier.charAt(0).toUpperCase() + tier.slice(1).toLowerCase();
}

// ─── 5. Default Export (if needed for lazy loading) ───────────
export default PartnerCard;
```

### Rules

- Prefer **named exports** for components; use default exports only when required by Next.js or React.lazy
- Destructure props in the function signature
- Define event handlers inside the component, prefixed with `handle`
- Keep JSX clean — extract complex conditional rendering into sub-components

---

## Component Size Limits

| Metric          | Limit  | Action When Exceeded                         |
| --------------- | ------ | -------------------------------------------- |
| Component lines | 150    | Extract logic into hooks, sub-components     |
| JSX depth       | 5 levels | Extract nested sections into components     |
| Props count     | 7      | Group related props into an object type       |
| useState calls  | 4      | Consolidate into useReducer or custom hook    |

When a component exceeds these limits, refactor by:
1. Extracting a custom hook for stateful logic
2. Creating sub-components for distinct UI sections
3. Moving complex computations to utility functions

---

## Custom Hooks

### Naming

- **Always** prefix with `use` — this is a React requirement, not a suggestion
- Name should describe the **capability** provided, not the implementation detail

```typescript
// ✅ Good
usePartnerSearch()     // Provides partner search functionality
useDebounce(value, ms) // Provides a debounced value
useAuth()              // Provides authentication state and actions

// ❌ Bad
useData()              // Too vague
useEffect2()           // Implementation detail
useStuff()             // Meaningless
```

### Single Responsibility

Each hook should do **one thing well**:

```typescript
// ✅ Focused hook
function usePartnerFilters() {
  const [filters, setFilters] = useState<PartnerFilters>(DEFAULT_FILTERS);

  const updateFilter = (key: keyof PartnerFilters, value: string) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const resetFilters = () => setFilters(DEFAULT_FILTERS);

  return { filters, updateFilter, resetFilters } as const;
}
```

### Hook File Location

- **App-specific hooks**: `apps/web/src/hooks/`
- **Feature-specific hooks**: Co-locate with the feature (`features/partners/hooks/`)
- **Shared hooks**: `packages/ui/src/hooks/` (if used across apps)

---

## Error Handling

### Strategy by Layer

| Layer             | Pattern                | Implementation                            |
| ----------------- | ---------------------- | ----------------------------------------- |
| React Components  | Error Boundaries       | Wrap route segments with error boundaries |
| Server Actions    | try-catch + Result     | Return `{ success, data?, error? }`      |
| API Controllers   | Exception Filters      | NestJS global exception filter            |
| API Services      | Result Pattern         | Return typed Result objects               |
| Data Access       | Prisma Error Mapping   | Map Prisma errors to domain errors        |

### Result Pattern (API Services)

```typescript
type Result<T, E = AppError> =
  | { success: true; data: T }
  | { success: false; error: E };

// Usage in service
async function findPartner(id: string): Promise<Result<Partner>> {
  try {
    const partner = await prisma.partner.findUniqueOrThrow({ where: { id } });
    return { success: true, data: partner };
  } catch (error) {
    return { success: false, error: AppError.notFound('Partner', id) };
  }
}
```

### Error Boundaries (Next.js)

Each route segment should have an `error.tsx` file that gracefully handles rendering failures:

```typescript
'use client';

export default function ErrorBoundary({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div role="alert">
      <h2>Something went wrong</h2>
      <button onClick={reset}>Try again</button>
    </div>
  );
}
```

---

## Logging Conventions

### Structured Logging

All log output must be structured JSON for CloudWatch Insights compatibility:

```typescript
// ✅ Structured logging with context
logger.info('Partner created', {
  partnerId: partner.id,
  createdBy: user.id,
  tier: partner.tier,
  duration: Date.now() - startTime,
});

// ❌ Unstructured string interpolation
console.log(`Partner ${partner.id} created by ${user.id}`);
```

### Log Levels

| Level   | Usage                                          |
| ------- | ---------------------------------------------- |
| `error` | Unrecoverable failures requiring attention     |
| `warn`  | Degraded state, potential issues               |
| `info`  | Significant business events (creation, auth)   |
| `debug` | Detailed flow for development troubleshooting  |

### Rules

- Never log sensitive data (passwords, tokens, PII)
- Always include a correlation ID / request ID in API logs
- Use the shared logger from `@hu/config` — never use raw `console.log` in production code

---

## API Conventions (NestJS)

### DTOs with Validation

All request bodies must use class-validator decorators:

```typescript
import { IsString, IsEmail, IsEnum, IsOptional, MaxLength } from 'class-validator';

export class CreatePartnerDto {
  @IsString()
  @MaxLength(255)
  name: string;

  @IsEmail()
  contactEmail: string;

  @IsEnum(PartnerTier)
  tier: PartnerTier;

  @IsOptional()
  @IsString()
  @MaxLength(1000)
  description?: string;
}
```

### Consistent Response Shape

All API responses follow a unified envelope:

```typescript
interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: {
    code: string;
    message: string;
    details?: unknown;
  };
  meta?: {
    page: number;
    pageSize: number;
    total: number;
  };
}
```

---

## NestJS Architecture Patterns

### Module Structure

Each domain is a self-contained NestJS module:

```
src/modules/partners/
  ├── partners.module.ts       # Module definition
  ├── partners.controller.ts   # HTTP layer
  ├── partners.service.ts      # Business logic
  ├── partners.repository.ts   # Data access (Prisma)
  ├── dto/                     # Request/response DTOs
  │   ├── create-partner.dto.ts
  │   └── update-partner.dto.ts
  ├── entities/                # Domain entities
  │   └── partner.entity.ts
  └── __tests__/               # Module tests
      ├── partners.controller.spec.ts
      └── partners.service.spec.ts
```

### Dependency Injection

- **Always** inject dependencies via constructor injection
- Use `@Injectable()` on all services and repositories
- Register providers in the module's `providers` array
- Export services that other modules need via the `exports` array

```typescript
@Injectable()
export class PartnersService {
  constructor(
    private readonly partnersRepo: PartnersRepository,
    private readonly eventsService: EventsService,
    private readonly logger: LoggerService,
  ) {}
}
```

### Controller Rules

- Controllers handle **HTTP concerns only**: parsing, validation, status codes
- Business logic belongs in **services**
- Data access belongs in **repositories**
- Use `@ApiTags()`, `@ApiOperation()`, and `@ApiResponse()` decorators for Swagger documentation
