# Habib University Preferred Partner — Documentation

> Engineering documentation for the Habib University Preferred Partner platform.
> A museum-quality digital experience showcasing brand partnerships.

---

## Project Overview

The **HU Preferred Partner** platform is a full-stack web application that showcases Habib University's brand partnerships. It provides students with curated offers, gives partners a branded portal to manage their presence, and equips the university with a CMS-driven admin dashboard for content and analytics.

| Layer | Technology | Location |
|-------|-----------|----------|
| Frontend | Next.js App Router, React, TypeScript | `/apps/web` |
| Backend | NestJS, Prisma, PostgreSQL | `/apps/api` |
| Shared | Types, utilities, configs | `/packages/*` |
| Infrastructure | Docker, AWS (ECS, RDS, S3, CloudFront) | `/infra` |

---

## Quick Start

```bash
# Clone and install
git clone <repo-url> && cd HuPrefferedPartner
pnpm install

# Set up environment
cp apps/web/.env.example apps/web/.env.local
cp apps/api/.env.example apps/api/.env

# Start database
docker compose up -d postgres

# Run migrations
pnpm --filter api prisma migrate dev

# Start development
pnpm dev
```

**Prerequisites:** Node.js ≥ 20, pnpm ≥ 9, Docker, PostgreSQL 16

---

## Documentation Map

### Foundation

| Document | Description |
|----------|-------------|
| [Vision](./Vision.md) | Mission, target outcomes, success metrics, phased roadmap |
| [Architecture](./Architecture.md) | System design, data flow, AWS deployment, monorepo structure |
| [Tech Stack](./Tech-Stack.md) | Every technology with version, purpose, rationale, alternatives |
| [Design Principles](./Design-Principles.md) | Anti AI-Slop rules, typography-first, whitespace, editorial philosophy |

### Development Guidelines

| Document | Description |
|----------|-------------|
| [Frontend Guidelines](./Frontend-Guidelines.md) | Next.js conventions, RSC, data fetching, Tailwind, shadcn/ui |
| [Backend Guidelines](./Backend-Guidelines.md) | NestJS patterns, DTOs, Prisma, API versioning, RBAC |
| [Animation Guidelines](./Animation-Guidelines.md) | Motion hierarchy, durations, easings, library policies, anti-patterns |
| [Three.js Guidelines](./ThreeJS-Guidelines.md) | 3D usage criteria, performance budgets, mobile fallbacks, memory |

### Quality & Compliance

| Document | Description |
|----------|-------------|
| [Accessibility](./Accessibility.md) | WCAG 2.2 AA, semantic HTML, ARIA, keyboard nav, screen readers |
| [Performance](./Performance.md) | Core Web Vitals targets, bundle budgets, caching, monitoring |
| [Security](./Security.md) | Auth, RBAC, XSS/CSRF/SQLi prevention, CSP, secrets management |

---

## Core Principles

1. **Performance First** — Animations never reduce usability. Respect `prefers-reduced-motion`. Lazy-load everything. Minimize JavaScript.
2. **Anti AI-Slop** — Typography-driven, generous whitespace, intentional animation. Every design decision must be justifiable. Museum-quality or nothing.
3. **Data Integrity** — Never fabricate data. Use empty states. If a brand has no offers, say so clearly.

---

## Monorepo Structure

```
HuPrefferedPartner/
├── apps/
│   ├── web/          # Next.js App Router frontend
│   └── api/          # NestJS backend API
├── packages/
│   ├── types/        # Shared TypeScript types
│   ├── utils/        # Shared utilities
│   ├── config/       # Shared configs (ESLint, TSConfig, Prettier)
│   └── ui/           # Shared UI primitives (if needed)
├── prisma/           # Database schema, migrations, seeds
├── infra/            # Docker, AWS CDK/Terraform
├── docs/             # This documentation
└── scripts/          # Build, deploy, maintenance scripts
```

---

## Contributing to Documentation

- **When to update:** Any architectural change, new technology addition, or pattern change requires a docs update in the same PR.
- **Format:** Use Markdown with Mermaid diagrams. Keep files between 100–300 lines.
- **Cross-reference:** Link related docs. Don't duplicate content across files.
- **Be specific:** Write for THIS project, not generic advice. Include code examples from our codebase.
- **Decision rationale:** Always document WHY, not just WHAT.

---

## Documentation Maintenance

| Trigger | Action |
|---------|--------|
| New dependency added | Update [Tech Stack](./Tech-Stack.md) |
| Architecture change | Update [Architecture](./Architecture.md) |
| New component pattern | Update [Frontend Guidelines](./Frontend-Guidelines.md) |
| New API endpoint | Update [Backend Guidelines](./Backend-Guidelines.md) |
| Animation added | Verify against [Animation Guidelines](./Animation-Guidelines.md) |
| 3D element added | Verify against [ThreeJS Guidelines](./ThreeJS-Guidelines.md) |
| Accessibility audit | Update [Accessibility](./Accessibility.md) |
| Performance regression | Update [Performance](./Performance.md) budgets |
| Security incident | Update [Security](./Security.md) |

---

*Last updated: July 2026*
*Maintained by: HU Preferred Partner Engineering Team*
