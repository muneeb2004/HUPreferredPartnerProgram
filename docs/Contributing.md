# Contributing Guide

> How to contribute to the Habib University Preferred Partner Platform — for humans and AI agents alike.

---

## Table of Contents

- [Prerequisites](#prerequisites)
- [Development Environment Setup](#development-environment-setup)
- [Branch Naming Conventions](#branch-naming-conventions)
- [Commit Message Standards](#commit-message-standards)
- [Pull Request Process](#pull-request-process)
- [PR Workflow Diagram](#pr-workflow-diagram)
- [Code Review Standards](#code-review-standards)
- [AI Agent Guidelines](#ai-agent-guidelines)

---

## Prerequisites

Ensure the following tools are installed and available on your `PATH` before starting:

| Tool       | Minimum Version | Purpose                            |
| ---------- | --------------- | ---------------------------------- |
| Node.js    | 20.x LTS        | JavaScript runtime                 |
| pnpm       | 9.x             | Package manager (workspace-aware)  |
| Docker     | 24.x            | Containerization and local services|
| PostgreSQL | 15.x            | Database (or use Docker)           |
| Git        | 2.40+           | Version control                    |
| Turbo      | 2.x             | Monorepo task runner               |

### Recommended Tools

- **VS Code** with extensions: ESLint, Prettier, Prisma, Tailwind CSS IntelliSense
- **TablePlus** or **pgAdmin** for database inspection
- **Bruno** or **Insomnia** for API testing

---

## Development Environment Setup

### 1. Clone the Repository

```bash
git clone git@github.com:habib-university/preferred-partner-platform.git
cd preferred-partner-platform
```

### 2. Install Dependencies

```bash
corepack enable pnpm
pnpm install
```

### 3. Environment Configuration

Copy the example environment files and fill in local values:

```bash
cp apps/web/.env.example apps/web/.env.local
cp apps/api/.env.example apps/api/.env.local
```

Required variables for local development:

```env
# apps/api/.env.local
DATABASE_URL="postgresql://hu_admin:localdev@localhost:5432/hu_partners"
JWT_SECRET="local-dev-secret-change-me"
S3_ENDPOINT="http://localhost:9000"

# apps/web/.env.local
NEXT_PUBLIC_API_URL="http://localhost:4000"
```

### 4. Database Setup

**Option A — Docker (recommended):**

```bash
docker compose up postgres -d
pnpm --filter @hu/api prisma migrate dev
pnpm --filter @hu/api prisma db seed
```

**Option B — Local PostgreSQL:**

```bash
createdb hu_partners
pnpm --filter @hu/api prisma migrate dev
pnpm --filter @hu/api prisma db seed
```

### 5. Start Development Servers

```bash
# Start all apps in parallel via Turbo
pnpm dev

# Or start individually
pnpm --filter @hu/web dev    # http://localhost:3000
pnpm --filter @hu/api dev    # http://localhost:4000
```

### 6. Verify Setup

- Web: Open `http://localhost:3000` — you should see the landing page
- API: Open `http://localhost:4000/api/health` — should return `{ "status": "ok" }`
- Prisma Studio: `pnpm --filter @hu/api prisma studio` — database browser at `http://localhost:5555`

---

## Branch Naming Conventions

All branches must follow the `<type>/<short-description>` pattern:

| Prefix       | Purpose                                    | Example                         |
| ------------ | ------------------------------------------ | ------------------------------- |
| `feature/`   | New features or user-facing functionality  | `feature/partner-dashboard`     |
| `fix/`       | Bug fixes                                  | `fix/login-redirect-loop`       |
| `docs/`      | Documentation changes only                 | `docs/api-authentication`       |
| `chore/`     | Tooling, config, dependency updates        | `chore/upgrade-next-15`         |
| `refactor/`  | Code restructuring without behavior change | `refactor/auth-module-cleanup`  |

### Rules

- Branch from `main` for all work
- Use kebab-case for descriptions (lowercase, hyphens)
- Keep descriptions concise but descriptive (3–5 words)
- Delete branches after merge

---

## Commit Message Standards

This project follows the **Conventional Commits** specification.

### Format

```
<type>(<scope>): <subject>

[optional body]

[optional footer(s)]
```

### Types

| Type         | Description                                      |
| ------------ | ------------------------------------------------ |
| `feat`       | A new feature                                    |
| `fix`        | A bug fix                                        |
| `docs`       | Documentation only changes                       |
| `style`      | Formatting, missing semicolons (no logic change) |
| `refactor`   | Code change that neither fixes nor adds          |
| `test`       | Adding or correcting tests                       |
| `chore`      | Build process, auxiliary tool changes             |

### Scope

Use the app or package name: `web`, `api`, `ui`, `types`, `config`.

### Examples

```
feat(web): add partner search with filtering
fix(api): resolve token expiration validation
docs(api): document authentication endpoints
refactor(web): extract partner card to shared component
chore: upgrade turbo to v2.1
```

### Rules

- Subject line: imperative mood, lowercase, no period, max 72 characters
- Body: explain **what** and **why**, not **how**
- Footer: reference issues with `Closes #123` or `Fixes #456`

---

## Pull Request Process

### 1. Create the PR

- Push your branch and open a PR against `main`
- Fill out the PR template completely

### 2. PR Description Template

```markdown
## Summary
Brief description of what this PR does.

## Type of Change
- [ ] Feature
- [ ] Bug Fix
- [ ] Refactor
- [ ] Documentation
- [ ] Chore

## Related Issues
Closes #___

## Changes Made
- Change 1
- Change 2

## Screenshots / Recordings
(if applicable)

## Testing
- [ ] Unit tests added/updated
- [ ] Integration tests added/updated
- [ ] Manual testing performed

## Checklist
- [ ] Code follows project style guidelines
- [ ] Self-reviewed my own code
- [ ] Added comments for complex logic
- [ ] No new warnings or errors
- [ ] Database migrations are reversible
```

### 3. Review Requirements

- **Minimum 1 approving review** from a team member
- **All CI checks must pass** (lint, type check, tests, build)
- **No unresolved conversations**

### 4. Merge Strategy

- Use **Squash and Merge** for feature branches
- Use **Merge Commit** for release branches
- Delete the source branch after merge

---

## PR Workflow Diagram

```mermaid
flowchart TD
    A[Create Feature Branch] --> B[Develop & Commit]
    B --> C[Push Branch]
    C --> D[Open Pull Request]
    D --> E{CI Checks}

    E -->|Pass| F[Request Review]
    E -->|Fail| G[Fix Issues]
    G --> B

    F --> H{Review Outcome}
    H -->|Approved| I[Squash & Merge to main]
    H -->|Changes Requested| J[Address Feedback]
    J --> B

    I --> K[Delete Branch]
    K --> L[Auto-deploy to Staging]
    L --> M{Staging Verification}
    M -->|Pass| N[Production Deploy via Approval]
    M -->|Fail| O[Hotfix Branch]
    O --> B

    style E fill:#2d4a6f,color:#fff
    style H fill:#4a2d6f,color:#fff
    style I fill:#2d6f4a,color:#fff
    style N fill:#2d6f4a,color:#fff
```

---

## Code Review Standards

### What Reviewers Check

1. **Correctness**: Does the code do what the PR claims?
2. **Security**: Are there injection risks, exposed secrets, or auth bypasses?
3. **Performance**: Any N+1 queries, unnecessary re-renders, or memory leaks?
4. **Readability**: Is the code clear without excessive comments?
5. **Test Coverage**: Are edge cases covered? Are tests meaningful?
6. **Architecture**: Does it follow established patterns in the codebase?
7. **Types**: Is TypeScript used properly — no `any`, correct generics?

### Review Etiquette

- **Be constructive**: suggest improvements, don't just critique
- **Be specific**: point to exact lines and propose alternatives
- **Be timely**: respond to review requests within 24 hours
- **Prefix comments**: use `nit:`, `question:`, `suggestion:`, `blocking:` prefixes
- **Approve with comments**: minor nits don't need to block merges

---

## AI Agent Guidelines

This section provides conventions for AI coding agents (Copilot, Cursor, Antigravity, etc.) working in this codebase.

### General Rules

1. **Read before writing**: Always examine existing patterns in the relevant module before generating code. Match the established style exactly.
2. **Respect the monorepo**: Understand the workspace structure. Changes to shared packages (`packages/*`) affect all consumers — proceed with caution.
3. **Never modify lock files manually**: Use `pnpm install` to update `pnpm-lock.yaml`.
4. **Preserve documentation**: Do not remove or alter existing comments, JSDoc annotations, or README sections unless explicitly asked.

### File & Code Generation

- Follow the naming conventions in `docs/Code-Style.md`
- Place new files according to `docs/Folder-Structure.md`
- Always generate TypeScript (`.ts` / `.tsx`), never plain JavaScript
- Include proper type annotations — no implicit `any`
- Generate corresponding test files for all new modules

### Commit & PR Behavior

- Use Conventional Commits format for all commit messages
- Keep commits atomic: one logical change per commit
- When creating PRs, follow the PR template above
- Reference the issue number if one exists

### Safety & Boundaries

- **Do not** modify CI/CD workflows without explicit approval
- **Do not** alter database migration files after they have been committed
- **Do not** add new dependencies without justification
- **Do not** change environment variable schemas without updating `.env.example`
- **Do not** commit secrets, tokens, or credentials under any circumstance

### Contextual Awareness

When working on this codebase, AI agents should be aware of:

- **ORM**: Prisma — check `apps/api/prisma/schema.prisma` for the data model
- **Auth**: JWT-based authentication with role-based access control
- **API Style**: RESTful with DTOs validated via `class-validator`
- **State**: Server components are default in the web app; use `'use client'` sparingly
- **Testing**: Vitest for unit tests, Playwright for E2E
