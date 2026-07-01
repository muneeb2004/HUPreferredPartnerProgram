# Definition of Done

> Feature completion criteria for the Habib University Preferred Partner platform.
> Use this checklist in every Pull Request to verify a feature is truly **done**.

---

## Table of Contents

- [Overview](#overview)
- [How to Use This Checklist](#how-to-use-this-checklist)
- [Definition of Done Checklist](#definition-of-done-checklist)
  - [Code Complete](#1-code-complete)
  - [Type Safety](#2-type-safety)
  - [Testing](#3-testing)
  - [Code Review](#4-code-review)
  - [Documentation](#5-documentation)
  - [Accessibility](#6-accessibility)
  - [Performance](#7-performance)
  - [Security](#8-security)
  - [Responsive Design](#9-responsive-design)
  - [Cross-Browser Compatibility](#10-cross-browser-compatibility)
  - [Database](#11-database)
  - [Deployment](#12-deployment)
  - [Monitoring & Observability](#13-monitoring--observability)
- [PR Template Snippet](#pr-template-snippet)
- [Exceptions & Waivers](#exceptions--waivers)

---

## Overview

The **Definition of Done (DoD)** is a shared understanding of what it means for a feature or user story to be considered complete. Every feature merged into `main` must satisfy all applicable criteria listed below.

This document serves as the single source of truth for quality gates across the entire monorepo:

| Package          | Path              | Tech Stack |
| ---------------- | ----------------- | ---------- |
| Web Application  | `/apps/web`       | Next.js    |
| API Server       | `/apps/api`       | NestJS     |
| Shared Packages  | `/packages/*`     | TypeScript |

### Why a Definition of Done?

- **Consistency** — Every team member applies the same quality bar.
- **Predictability** — Stakeholders know exactly what "done" means.
- **Quality** — Prevents incomplete work from reaching production.
- **Accountability** — Clear criteria make code reviews objective.

---

## How to Use This Checklist

1. **Before opening a PR**, review every section below.
2. **Mark items as complete** using the checkboxes `[x]` in the PR description.
3. **Mark items as N/A** with a brief justification if a section does not apply (e.g., "N/A — no UI changes").
4. **Reviewers** should verify that all applicable items are checked before approving.

---

## Definition of Done Checklist

### 1. Code Complete

> The implementation fully satisfies the acceptance criteria defined in the ticket.

- [ ] Implementation matches all acceptance criteria in the user story / ticket
- [ ] Edge cases are handled (empty states, error states, loading states)
- [ ] No TODO or FIXME comments left unresolved (or tracked in follow-up tickets)
- [ ] Code follows established project conventions and patterns
- [ ] No unnecessary console logs, commented-out code, or debug statements
- [ ] Feature works correctly in both development and production builds

### 2. Type Safety

> The codebase maintains strict TypeScript discipline with zero tolerance for unsafe types.

- [ ] `tsc --noEmit` passes with zero errors across all affected packages
- [ ] No usage of `any` type — use `unknown`, generics, or specific types instead
- [ ] No `@ts-ignore` or `@ts-expect-error` comments without a linked issue
- [ ] All function parameters and return types are explicitly typed
- [ ] Shared interfaces and types are defined in `/packages/shared-types`
- [ ] API request/response DTOs are properly typed with class-validator decorators

### 3. Testing

> Adequate test coverage ensures the feature works correctly and prevents regressions.

- [ ] **Unit tests** pass — `npm run test` exits with zero failures
- [ ] **Integration tests** pass — API endpoints tested with real database interactions
- [ ] **E2E tests** added for critical user paths (login, registration, partner workflows)
- [ ] New code has **≥ 80% line coverage** (check with `npm run test:cov`)
- [ ] Tests are deterministic — no flaky tests introduced
- [ ] Test descriptions clearly describe the expected behavior
- [ ] Mocked dependencies are realistic and well-documented

### 4. Code Review

> Peer review ensures code quality, knowledge sharing, and consistency.

- [ ] PR approved by **at least one reviewer** (two reviewers for critical paths)
- [ ] All review comments addressed — resolved or discussed
- [ ] PR title follows [Conventional Commits](https://www.conventionalcommits.org/) format
- [ ] PR description includes:
  - Summary of changes
  - Link to the ticket/issue
  - Screenshots or recordings for UI changes
  - Testing instructions for the reviewer
- [ ] Changeset file added (`npx changeset`) for user-facing changes

### 5. Documentation

> Documentation keeps the team informed and onboards future contributors effectively.

- [ ] `README.md` updated if setup steps, environment variables, or architecture changed
- [ ] Public API functions and classes have **JSDoc comments** with `@param`, `@returns`, and `@example`
- [ ] **Storybook stories** added or updated for new/modified UI components
- [ ] API endpoint changes reflected in **Swagger/OpenAPI** documentation
- [ ] Database schema changes documented in migration files with descriptive names
- [ ] Architecture Decision Records (ADRs) created for significant technical decisions

### 6. Accessibility

> The platform must be usable by everyone, meeting WCAG 2.1 Level AA standards.

- [ ] **Keyboard navigation** works correctly (Tab, Shift+Tab, Enter, Escape)
- [ ] **Focus management** is logical and visible (focus ring, focus trapping in modals)
- [ ] **Screen reader** announces content correctly (tested with NVDA or VoiceOver)
- [ ] Semantic HTML elements used (`<nav>`, `<main>`, `<button>`, `<form>`, etc.)
- [ ] All images have meaningful `alt` text (or `alt=""` for decorative images)
- [ ] Color contrast ratios meet **WCAG 2.1 AA** minimums (4.5:1 for normal text)
- [ ] ARIA attributes used correctly where semantic HTML is insufficient
- [ ] Form inputs have associated `<label>` elements
- [ ] Error messages are programmatically associated with their form fields

### 7. Performance

> Features must not degrade the user experience through slow load times or excessive bundle sizes.

- [ ] **Lighthouse score** shows no regression from baseline (Performance ≥ 90)
- [ ] **Bundle size** checked — no unexpected increases (`npm run analyze`)
- [ ] Images optimized (Next.js `<Image>` component, WebP format, proper sizing)
- [ ] No unnecessary re-renders (verified with React DevTools Profiler)
- [ ] API responses are paginated for list endpoints
- [ ] Database queries are optimized — no N+1 queries, proper indexes in place
- [ ] Lazy loading implemented for below-the-fold content and non-critical routes
- [ ] Caching strategy applied where appropriate (HTTP cache headers, Redis)

### 8. Security

> Every feature must be secure by default with defense-in-depth applied at every layer.

- [ ] `npm audit` reports **no high or critical vulnerabilities**
- [ ] All user inputs are **validated and sanitized** (both client and server side)
- [ ] Authentication checks enforced on protected API routes
- [ ] Authorization checks enforce **role-based access control (RBAC)**
- [ ] Sensitive data is not exposed in API responses, logs, or error messages
- [ ] CSRF protection is active for state-changing requests
- [ ] SQL injection prevented (parameterized queries via TypeORM)
- [ ] XSS prevented (React's default escaping, CSP headers configured)
- [ ] Rate limiting applied to authentication and public-facing endpoints

### 9. Responsive Design

> The platform must provide a great experience across all device sizes.

- [ ] **Mobile** (320px – 767px) — layout, readability, and interactions verified
- [ ] **Tablet** (768px – 1023px) — layout adapts correctly
- [ ] **Desktop** (1024px+) — full layout utilized
- [ ] Touch targets are at least **44×44px** on mobile
- [ ] No horizontal scrolling on any viewport width
- [ ] Text remains readable without zooming on mobile devices
- [ ] Navigation is accessible on all breakpoints (hamburger menu on mobile)

### 10. Cross-Browser Compatibility

> The platform must work consistently across all major browsers.

- [ ] **Google Chrome** (latest 2 versions) — tested and verified
- [ ] **Mozilla Firefox** (latest 2 versions) — tested and verified
- [ ] **Apple Safari** (latest 2 versions) — tested and verified
- [ ] **Microsoft Edge** (latest 2 versions) — tested and verified
- [ ] No browser-specific CSS hacks without a documented reason
- [ ] Progressive enhancement applied — core features work without JavaScript where feasible

### 11. Database

> Schema changes must be safe, reversible, and well-documented.

- [ ] Migrations reviewed by at least one team member
- [ ] Migrations are **idempotent** and safe to re-run
- [ ] Reverse (down) migrations are provided and tested
- [ ] Seed data updated to reflect new schema requirements
- [ ] No destructive changes without an approved migration plan
- [ ] Indexes added for columns used in WHERE, JOIN, and ORDER BY clauses
- [ ] Foreign key constraints are properly defined
- [ ] Migration tested in staging before production deployment

### 12. Deployment

> The feature can be deployed safely with proper configuration and rollback capability.

- [ ] **Feature flag** configured if the feature requires gradual rollout
- [ ] New **environment variables** documented in `.env.example` and README
- [ ] Environment variables added to all deployment environments (dev, staging, prod)
- [ ] CI/CD pipeline passes — build, lint, test, and deploy stages all green
- [ ] Deployment does not require manual intervention or downtime
- [ ] Rollback plan is documented for high-risk changes

### 13. Monitoring & Observability

> The feature must be observable in production to enable rapid debugging and incident response.

- [ ] **Structured logging** added for key operations (use the project logger, not `console.log`)
- [ ] **Error tracking** configured — errors reported to Sentry or equivalent
- [ ] Log levels used appropriately (`info` for flow, `warn` for recoverable, `error` for failures)
- [ ] No sensitive data (passwords, tokens, PII) appears in logs
- [ ] Health check endpoints remain functional
- [ ] Alerts configured for critical failure modes (if applicable)
- [ ] Key business metrics tracked (e.g., partner registration rate, API latency)

---

## PR Template Snippet

Copy the checklist below into your PR description. Mark items as `[x]` (done), `[ ]` (not done), or ~~strikethrough~~ with "N/A" for items that don't apply.

```markdown
## Definition of Done

### Code
- [ ] Implementation matches acceptance criteria
- [ ] No TODO/FIXME left unresolved
- [ ] `tsc --noEmit` passes with zero errors
- [ ] No `any` types

### Testing
- [ ] Unit tests pass
- [ ] Integration tests pass
- [ ] E2E tests for critical paths
- [ ] ≥ 80% coverage on new code

### Review & Docs
- [ ] PR approved by ≥ 1 reviewer
- [ ] JSDoc for public APIs
- [ ] README updated if needed
- [ ] Storybook stories if UI change

### Quality
- [ ] Accessibility (keyboard, screen reader, WCAG 2.1 AA)
- [ ] Performance (Lighthouse ≥ 90, bundle size checked)
- [ ] Security (no vulnerabilities, input validation, auth)
- [ ] Responsive (mobile, tablet, desktop)
- [ ] Cross-browser (Chrome, Firefox, Safari, Edge)

### Infrastructure
- [ ] Database migrations reviewed
- [ ] Feature flag configured if needed
- [ ] Env vars documented
- [ ] Logging and error tracking added
```

---

## Exceptions & Waivers

In rare cases, a DoD item may not apply or may need to be deferred. When this happens:

1. **Document the exception** in the PR description with a clear justification.
2. **Create a follow-up ticket** for any deferred items.
3. **Get approval** from the tech lead for any security or accessibility waivers.
4. **Time-box the waiver** — deferred items must be completed within the next sprint.

> **⚠️ Note**: Security and accessibility waivers require explicit tech lead approval and must include a remediation timeline.

---

## Related Documents

- [Release Process](./Release-Process.md)
- [Architecture Decision Records](./Architecture-Decision-Records/README.md)
