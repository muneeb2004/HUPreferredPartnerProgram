# Architectural Context

## Summary
The platform uses a decoupled frontend-backend monorepo structure.
- **Frontend**: Next.js App Router, hosted on AWS ECS / Vercel.
- **Backend**: NestJS, hosted on AWS ECS.
- **Database**: PostgreSQL (AWS RDS) managed via Prisma.

## Key Decisions
- **Turborepo** for monorepo orchestration.
- **Prisma** for type-safe database access.
- **Tailwind + shadcn/ui** for consistent, un-opinionated styling.

## System Boundaries
- Frontend NEVER connects directly to the database.
- Backend NEVER serves HTML pages (only REST / GraphQL / WebSockets).

## Data Flow
Client -> CloudFront -> Next.js (SSR/ISR) -> NestJS API -> PostgreSQL.
