# Brand Partner Portal Architecture Blueprint

> **Platform**: Habib University Preferred Partner Program
> **Phase**: 11
> **Status**: Complete
> **Purpose**: Self-service portal for brand partners to manage their presence, offers, and profile
> **Stack**: Next.js (Portal UI) · NestJS (API) · Prisma · PostgreSQL · AWS S3

---

## Table of Contents

- [Overview](#overview)
- [Route Architecture](#route-architecture)
- [Functional Modules](#functional-modules)
- [Ownership Model](#ownership-model)
- [Shared Components](#shared-components)
- [Security](#security)
- [Performance](#performance)
- [Accessibility](#accessibility)
- [Definition of Done](#definition-of-done)

---

## Overview

### Purpose
The Brand Partner Portal is a dedicated self-service interface that empowers approved brand partners to manage their own digital presence on the Habib University Preferred Partner platform.

### Scope
Phase 11 encompasses the frontend interface for brand managers (`/brand-portal`), integration with existing and new brand-manager-scoped API endpoints, and the security mechanics to isolate brand data.

### Target Users
Brand Managers (external stakeholders who own a partner organization profile).

### Goals
- **Autonomy**: Partners can create and manage offers without admin intervention.
- **Transparency**: Full visibility into approval statuses and engagement analytics.
- **Quality Control**: Maintain strict approval workflows via admin oversight.

---

## Route Architecture

The Brand Portal uses the Next.js App Router within the `(portal)` route group to separate its layout and error boundaries from the public site and admin dashboard.

```text
apps/web/src/app/(portal)/brand-portal/
├── layout.tsx                # Portal shell (sidebar, header, auth check)
├── loading.tsx               # Global portal skeleton
├── error.tsx                 # Portal-level error boundary
├── page.tsx                  # Dashboard Overview
├── profile/
│   ├── page.tsx              # Profile editor
│   ├── loading.tsx           # Profile form skeleton
│   └── error.tsx             # Profile error boundary
├── offers/
│   ├── page.tsx              # Offers list (DataTable)
│   ├── new/
│   │   └── page.tsx          # Create offer form
│   └── [id]/
│       ├── page.tsx          # Edit offer form
│       └── loading.tsx       # Form skeleton
├── analytics/
│   ├── page.tsx              # Engagement metrics
│   └── loading.tsx           # Chart skeletons
└── settings/
    └── page.tsx              # Account settings
```

---

## Functional Modules

### Dashboard Overview
Displays account health, pending approvals, active offers count, and recent engagement metrics. Acts as the landing page upon login.

### Partner Management (Profile)
Allows brand managers to update their organization's public-facing profile (logo, cover image, description, contact information). Integrates with S3 for asset uploads. Changes trigger an approval workflow.

### Offer Management
CRUD interface for promotional offers. Includes creation (with start/end dates, discount rules), editing, and status tracking (Draft, Pending Review, Active, Expired, Rejected).

### Analytics
Engagement tracking view showing offer views, redemptions, and historical trends over time.

### Settings
Account-level management (password reset, notification preferences).

---

## Ownership Model

### Brand Ownership
Every `User` with the `BRAND_MANAGER` role belongs to a specific `Partner` organization. All data mutations and queries must be strictly scoped to this `partnerId`.

### Data Isolation
- Brand Managers cannot view or modify data belonging to other partners.
- Queries fetching offers, analytics, or profiles implicitly filter by the authenticated user's `partnerId`.

### RBAC & Authorization Flow
1. **Frontend**: Next.js Edge Middleware checks the JWT role. If the role is `BRAND_MANAGER`, access to `/brand-portal` is granted.
2. **Backend**: NestJS `RolesGuard` verifies the role on API endpoints.
3. **Ownership Validation**: A custom interceptor or service-level check validates that the `partnerId` in the request payload matches the `partnerId` attached to the user's JWT.

### Server Action Authorization
Server Actions act as secure proxies. They must decrypt the `HttpOnly` token, verify the `BRAND_MANAGER` role, and forward the request to the NestJS API, which enforces the final ownership boundary.

---

## Shared Components

The Brand Portal heavily reuses components developed during Phase 10 (Admin Dashboard):

- **DataTable**: Generic `@tanstack/react-table` implementation with sorting and pagination used for the Offers list.
- **Form Components**: `react-hook-form` integrated with `zod` and shadcn/ui for Profile and Offer creation.
- **EmptyState**: Reusable component for lists with zero items (e.g., no active offers).
- **Skeletons**: Standardized loading shapes (e.g., `DataTableSkeleton`).
- **Dialogs**: Confirmation modals for destructive actions (e.g., archiving an offer).

---

## Security

### Authentication
Handled via HTTP-only secure cookies containing a JWT. Sessions expire after 24 hours of inactivity.

### Authorization
Strict role-based access control (RBAC). Only users with `UserRole.BRAND_MANAGER` can access the portal.

### Ownership Verification
A critical security requirement: the backend must always verify that the targeted resource (Offer, Profile) belongs to the authenticated user's `partnerId`. Never trust the client-provided `partnerId`.

### Middleware & Guards
- **Next.js Middleware**: Protects `/brand-portal/*` from unauthenticated or unauthorized roles.
- **NestJS Guards**: `@Roles(UserRole.BRAND_MANAGER)` applied to all portal-facing API controllers.

---

## Performance

### Server Components
By default, all portal pages are React Server Components. Data is fetched server-side directly through the BFF route handlers or Server Actions.

### Suspense & Streaming
Asynchronous data fetches (e.g., heavy analytics queries) are wrapped in `<Suspense>` boundaries to instantly render the portal shell and stream the content when ready.

### Caching Strategy
Portal data is highly dynamic. Ensure that `fetch` calls to the NestJS API use `cache: 'no-store'` to prevent serving stale data to brand managers. Server Actions mutating data must call `revalidatePath('/brand-portal/...')` to refresh the UI.

---

## Accessibility

The portal must meet WCAG 2.2 AA standards:
- All forms must use `aria-invalid` and `aria-describedby` for validation errors.
- Data tables must be fully navigable via keyboard.
- Modals and dialogs must trap focus.
- Contrast ratios must pass standard checks.

---

## Definition of Done (Phase 11)

- [ ] Next.js routing structure implemented under `(portal)/brand-portal`.
- [ ] Profile Management form successfully updates backend data (with asset upload).
- [ ] Offer Management CRUD operations are fully functional.
- [ ] Analytics dashboard renders engagement data correctly.
- [ ] Strict data isolation is verified: Brand A cannot access Brand B's offers.
- [ ] Server Actions securely pass JWTs and validate roles.
- [ ] Loading skeletons and error boundaries are implemented for all routes.
- [ ] Zero axe-core accessibility violations.
- [ ] Lighthouse Performance score ≥ 90.

---
> **Related Documentation**: [Admin System](./Admin-System.md) · [Frontend Guidelines](./Frontend-Guidelines.md) · [Security](./Security.md)
