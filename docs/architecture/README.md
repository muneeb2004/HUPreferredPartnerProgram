# Habib University Preferred Partner Platform: Architecture Root

Welcome to the Architectural Root of the HU Preferred Partner Platform. 

As the project progresses through its 20-phase Master Implementation Plan, this document serves as the **single entry point** for understanding the platform's architectural evolution, patterns, and abstractions. Future contributors (human and AI) MUST reference this index to prevent regressions or redundant implementations.

---

## 1. Active Architectural Patterns
The repository strictly adheres to the following core patterns:

1. **React Server Components (RSC) Default:** Next.js UI is rendered strictly on the server by default. `"use client"` boundaries are aggressively pushed to the leaf nodes of the component tree.
2. **NestJS Modular Monolith:** The backend is divided into discrete domain modules (`NewslettersModule`, `PartnersModule`) interacting through strict Service/Provider boundaries.
3. **Event-Driven Side Effects:** Synchronous API requests solely mutate data and return responses; cross-domain side effects (like email delivery or audit logging) are triggered asynchronously via the **EventEmitter** pattern.
4. **"Museum-Quality" Motion:** UI animations are governed strictly by the Phase 3 Animation Framework, utilizing GPU-accelerated CSS properties and explicit wrapper primitives (`<FadeIn>`) rather than ad-hoc `useEffect` spam.
5. **Defense in Depth:** The backend enforces global authentication (`APP_GUARD`) via JWTs, requiring explicit `@Public()` decorators to opt-out. Roles are enforced via `RBAC`.

---

## 2. Repository-Wide Abstractions
To prevent vendor lock-in and increase testability, the following abstractions are mandated:

- **`EmailProvider` Interface:** Business logic must not interact directly with AWS SES. All email capabilities rely on injection of this abstract interface (currently implemented by `SESProvider`).
- **Prisma Repository Pattern:** Direct Prisma client access is typically encapsulated within dedicated Repository/Service classes to ensure complex queries and `deletedAt` soft-delete constraints are applied uniformly.
- **Response Envelope:** All API responses are intercepted and mapped into a standard `{ data, meta, errors }` format via the global `ResponseInterceptor`.

---

## 3. Architecture Decision Records (ADRs) Index
Significant structural choices are documented via ADRs located in `docs/architecture/adr/`. 

| ADR ID | Decision | Status | Context Phase |
|--------|----------|--------|---------------|
| [ADR-004](./adr/ADR_004_DOMAIN_EVENTS.md) | Adopt EventEmitter pattern for Domain Events | Active | Phase 7 |
| [ADR-005](./adr/ADR_005_EMAIL_PROVIDER.md) | Introduce abstract `EmailProvider` interface | Active | Phase 7 |
| *(Legacy)* | *Previous decisions captured in phase blueprints* | Active | Phases 1-6, 8-9 |

---

## 4. Domain Event Catalog
Events emitted by the `EventEmitter` across the system:

| Event Name | Emitted By | Purpose |
|------------|------------|---------|
| `NewsletterPublished` | `NewslettersModule` | Triggers indexing and archive regeneration |
| `NewsletterSendRequested` | `NewslettersModule` | Triggers background queue assignment |
| `NewsletterQueued` | Job Queue | Analytics / Observability logging |
| `NewsletterSending` | Job Queue | Updates database state machine |
| `DeliveryCompleted` | Email Provider | Finalizes dispatch, records `DeliveryLog` |
| `BounceReceived` | Webhook (SES) | Marks subscription as bounced/invalid |
| `ComplaintReceived` | Webhook (SES) | Hard-deletes subscription, flags reputation |
| `SubscriptionVerified` | `SubscriptionModule` | Transitions user from pending to active |
| `SubscriptionUnsubscribed` | `SubscriptionModule` | Soft-deletes user preferences |

---

## 5. Cross-Phase Architectural Boundaries
- **Phase 8 (CMS) ↔ Phase 7 (Newsletters):** The CMS provides structured content JSON which Phase 7's canonical rendering pipeline transforms into HTML and Plain Text. 
- **Phase 9 (Auth) ↔ Phase 10/11 (Admin/Portal):** Phase 9 established the HttpOnly cookies and global `@RolesGuard`. Future admin phases will solely consume this boundary and not implement custom authentication states.
- **Phase 3 (Animation) ↔ All Phases:** Marketing and UI pages must use the established primitive wrappers (`apps/web/src/components/motion/`) and never implement raw GSAP timelines inside page layouts.

---

## 6. Document Ownership & Governance
- **Ownership:** The `docs/architecture` directory is owned by the **Principal Systems Architect** agent role. 
- **Updates:** Any architectural shifts proposed by engineers during Implementation must be formally proposed as an ADR or an update to the respective Phase blueprint.
- **Status Tracking:** Always refer to `docs/project/IMPLEMENTATION_STATUS.md` before assuming the current progress of a phase.
