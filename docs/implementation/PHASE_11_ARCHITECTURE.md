# Phase 11: Brand Portal — Architecture & Implementation Plan

> **Objective:** Give partner brands a self-service portal to manage their profile, create offers, and view engagement analytics.

---

## 1. Business Requirements

1. **Self-Service:** Approved brand partners must be able to update their public profiles and submit new promotional offers without university admin intervention.
2. **Quality Control:** All new offers and significant profile changes must pass through an admin approval workflow before going live.
3. **Data Isolation:** Brand managers must only be able to view and mutate data belonging to their assigned organization.
4. **Insight:** Partners require an analytics dashboard to measure the ROI of their university partnership (views, offer redemptions).

---

## 2. User Stories

- As a **Brand Manager**, I want to log into my dedicated portal so I can manage my partnership presence.
- As a **Brand Manager**, I want to view a dashboard of my account health and pending approvals so I know what needs my attention.
- As a **Brand Manager**, I want to update my company description and logo so students see accurate branding.
- As a **Brand Manager**, I want to create a new promotional offer with specific start/end dates so I can run timely campaigns.
- As a **Brand Manager**, I want to view analytics on how many students viewed or engaged with my offers.
- As a **Platform Admin**, I want brand managers to securely submit changes into a "pending" state so I can review them before they are published.

---

## 3. RBAC Matrix

| Role | Access Level | Description |
|---|---|---|
| `ADMIN` | None (in portal) | Admins use the `/admin` dashboard, not the brand portal. |
| `BRAND_MANAGER` | Full | Can read/write data associated with their specific `partnerId`. |
| `STUDENT` | None | Denied access to `/brand-portal` routes. |
| *Unauthenticated* | None | Redirected to `/login`. |

---

## 4. Ownership Model

- **Identity**: A user's JWT contains their `userId`, `role`, and importantly, their `partnerId`.
- **Validation**: Any request to mutate a Partner profile or an Offer must have the payload's associated `partnerId` verified against the JWT's `partnerId`.
- **Data Leakage Prevention**: Database queries for lists (e.g., fetching offers or analytics) must implicitly append a `where: { partnerId: user.partnerId }` clause. The client must never dictate which partner's data to fetch.

---

## 5. Route Hierarchy (App Router)

```text
/brand-portal/
├── layout.tsx                # Sidebar navigation, User dropdown, Auth Guard
├── page.tsx                  # Dashboard Overview (Metrics, Activity Feed)
├── profile/
│   └── page.tsx              # Edit Partner Profile (Form)
├── offers/
│   ├── page.tsx              # Offers List (DataTable)
│   ├── new/
│   │   └── page.tsx          # Create Offer Form
│   └── [id]/
│       └── page.tsx          # Edit Offer Form
├── analytics/
│   └── page.tsx              # Analytics charts (Views, Engagement)
└── settings/
    └── page.tsx              # Password reset, notifications
```

---

## 6. API Endpoints

The NestJS backend will require new or expanded endpoints scoped strictly to brand managers.

| Endpoint | Method | Purpose | Auth / Guard |
|---|---|---|---|
| `/api/v1/portal/profile` | `GET` | Fetch the authenticated partner's profile | `@Roles('BRAND_MANAGER')` |
| `/api/v1/portal/profile` | `PATCH` | Update the partner's profile (triggers review) | `@Roles('BRAND_MANAGER')` |
| `/api/v1/portal/offers` | `GET` | List all offers owned by the partner | `@Roles('BRAND_MANAGER')` |
| `/api/v1/portal/offers` | `POST` | Create a new offer (Draft/Pending) | `@Roles('BRAND_MANAGER')` |
| `/api/v1/portal/offers/:id` | `PATCH` | Edit an offer | `@Roles('BRAND_MANAGER') + OwnershipCheck` |
| `/api/v1/portal/analytics`| `GET` | Fetch engagement metrics for the partner | `@Roles('BRAND_MANAGER')` |

---

## 7. Database Interactions

- **Profile Updates**: Modifying the `Partner` table. If "Review Required", changes might need to be stored in an `ApprovalQueue` or status flag before modifying the live `Partner` record (depending on the established CMS strategy).
- **Offer Creation**: Inserting into the `Offer` table with `status = "PENDING"`.
- **Analytics**: Querying the `Event` or `Metric` tables grouped by `offerId` where `Offer.partnerId = user.partnerId`.

---

## 8. Server Actions

Server actions are strictly proxies mapping Next.js frontend requests to the NestJS API.

- `updatePortalProfile(data: ProfileForm)` -> Validates with Zod, forwards to `PATCH /api/v1/portal/profile`. Calls `revalidatePath('/brand-portal/profile')`.
- `createPortalOffer(data: OfferForm)` -> Validates, forwards to `POST /api/v1/portal/offers`.
- `updatePortalOffer(id: string, data: OfferForm)` -> Validates, forwards to `PATCH /api/v1/portal/offers/:id`.

---

## 9. UI Wireframe Descriptions

1. **Portal Shell**: Left fixed sidebar for navigation (Dashboard, Profile, Offers, Analytics, Settings). Top header with Partner Logo and logout dropdown. Dark mode support.
2. **Dashboard Overview**: 3-4 top KPI cards (Active Offers, Pending Approvals, Total Redemptions). Below: A table of "Recent Activity" or "Offers ending soon".
3. **Offers List**: Shadcn DataTable. Columns: Title, Status (Badge), Start Date, End Date, Actions (Edit, Archive). Filterable by Status.
4. **Offer Form**: Grid layout. Left column for primary data (Title, Type, Value, Dates). Right column for metadata (Category, Cover Image upload).

---

## 10. Component Reuse Matrix

| Component | Source | Portal Usage |
|---|---|---|
| `DataTable` | Phase 10 | `/offers` list |
| `FormMessage`, `FormItem` | Phase 1 | All profile and offer forms |
| `Card`, `Badge`, `Button` | Phase 1 | Dashboards, status indicators |
| `EmptyState` | Phase 5 | Analytics with no data, zero offers |
| `Skeletons` | Phase 10 | All `/loading.tsx` states |

---

## 11. Folder Structure Updates

```text
apps/web/src/
├── app/(portal)/brand-portal/  # New App Router group
├── components/portal/          # Portal-specific UI components
│   ├── PortalSidebar.tsx
│   ├── OfferStatusBadge.tsx
│   └── DashboardMetrics.tsx
└── lib/actions/portal/         # Portal-specific Server Actions
    ├── profile.actions.ts
    └── offers.actions.ts

apps/api/src/modules/portal/    # New NestJS module
├── portal.controller.ts
├── portal.service.ts
└── portal-ownership.guard.ts   # Ownership validation
```

---

## 12. Risks and Mitigations

| Risk | Mitigation |
|---|---|
| **Cross-Tenant Data Leakage**: Brand A modifies Brand B's offer via API parameter manipulation. | Implement a strict `PortalOwnershipGuard` on all NestJS `/portal` endpoints that validates the resource ID against the JWT's `partnerId` before processing. |
| **Bypassing Approval**: Brand managers edit live offers to fundamentally change the promotion. | Any `PATCH` to an `ACTIVE` offer containing structural changes (value, dates) automatically reverts the offer to `PENDING` and removes it from the public view until re-approved. |
| **Image Upload Abuse**: Partners uploading massive or malicious files. | Strict file validation on the S3 pre-signed URL generation (Max 2MB, forced JPG/PNG formats). |

---

## 13. Commit Plan (Implementation Sequence)

| Commit | Description | Scope |
|---|---|---|
| **Commit 1** | Setup NestJS Portal Module | Backend: Create `/api/v1/portal/*` endpoints, DTOs, and `PortalOwnershipGuard`. |
| **Commit 2** | Portal Shell & Dashboard | Frontend: Create `(portal)` route group, layout, sidebar, and dashboard overview page. |
| **Commit 3** | Profile Management | Frontend/Backend: Implement profile editor form, Server Actions, and S3 upload integration. |
| **Commit 4** | Offers DataTable | Frontend: Build the offers listing page with sorting and status filtering. |
| **Commit 5** | Offer CRUD & Forms | Frontend: Build the New/Edit offer forms and link to backend validation. |
| **Commit 6** | Analytics View | Frontend/Backend: Wire up engagement metrics charting. |
| **Commit 7** | Quality Gates & Hardening | Full Stack: E2E data isolation tests, loading states, accessibility review. |

---
*Ready for Phase 11 Implementation.*
