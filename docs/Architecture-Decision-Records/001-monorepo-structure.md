# ADR-001: Monorepo Structure with pnpm and Turborepo

## Metadata

| Field       | Value                                              |
| ----------- | -------------------------------------------------- |
| **Status**  | Accepted                                           |
| **Date**    | 2025-01-15                                         |
| **Authors** | Platform Engineering Team                          |
| **Deciders**| Technical Lead, Senior Engineers                   |

---

## Context

The Habib University Preferred Partner platform comprises multiple
application targets and shared code that must be developed, tested, and
deployed in a coordinated manner. Specifically, the platform includes:

- **Web application** (`apps/web`) — a Next.js front-end serving the
  public-facing marketing site, partner portal, and admin dashboard.
- **API server** (`apps/api`) — a NestJS back-end providing REST
  endpoints for authentication, CMS operations, newsletter generation,
  and administrative functionality.
- **Shared packages** (`packages/*`) — reusable libraries including
  TypeScript type definitions, validation schemas, utility functions, UI
  component libraries, and configuration presets (ESLint, TypeScript,
  Prettier).

During initial development, the team evaluated how to organise these
interdependent codebases. The key requirements were:

1. **Code sharing** — TypeScript types, validation logic, and constants
   must be shared between the web app and the API without publishing to a
   private registry or copy-pasting.
2. **Consistent tooling** — linting rules, formatting standards, and
   TypeScript configurations should be defined once and inherited by every
   package and application.
3. **Atomic changes** — a single pull request must be able to modify a
   shared type and update every consumer simultaneously, preventing
   version drift.
4. **CI/CD efficiency** — the build pipeline should be intelligent enough
   to skip unchanged packages and cache previous build outputs.
5. **Developer experience** — local development should feel seamless, with
   hot-reloading across package boundaries and minimal configuration
   overhead.
6. **Disk efficiency** — with many shared dependencies across packages,
   duplicate `node_modules` installations would waste significant disk
   space on developer machines and CI runners.

---

## Decision

We will use **pnpm workspaces** combined with **Turborepo** to manage the
project as a monorepo. The repository is structured as follows:

```
/
├── apps/
│   ├── web/          # Next.js 14+ (App Router)
│   └── api/          # NestJS API server
├── packages/
│   ├── types/        # Shared TypeScript type definitions
│   ├── utils/        # Shared utility functions
│   ├── ui/           # Shared UI component library
│   ├── config-eslint/ # Shared ESLint configuration
│   └── config-ts/    # Shared TypeScript configuration
├── pnpm-workspace.yaml
├── turbo.json
└── package.json
```

### Key aspects of this decision

1. **pnpm workspaces** handle dependency resolution and workspace linking.
   The `pnpm-workspace.yaml` file declares `apps/*` and `packages/*` as
   workspace members, enabling cross-package imports via standard package
   names.

2. **Turborepo** orchestrates build, test, and lint tasks across the
   monorepo. It provides remote caching, parallel execution, and
   intelligent task scheduling based on the dependency graph defined in
   `turbo.json`.

3. **Workspace protocol** (`workspace:*`) is used in `package.json` files
   to reference sibling packages, ensuring that local versions are always
   resolved during development and CI.

4. **Shared configuration packages** centralise ESLint rules, TypeScript
   compiler options, and Prettier settings so that every workspace member
   inherits the same standards.

---

## Consequences

### What becomes easier or better

- **Shared types and utilities** — importing `@hupp/types` or
  `@hupp/utils` from any app is as simple as adding a workspace
  dependency. No private registry or manual version bumping is needed.
- **Unified CI/CD** — a single pipeline builds, tests, and deploys the
  entire platform. Turborepo's caching ensures that unchanged packages are
  not rebuilt, reducing average CI times significantly.
- **Atomic cross-application changes** — renaming a shared API response
  type updates the NestJS controller and the Next.js consumer in one pull
  request, eliminating version drift.
- **Consistent developer experience** — every developer runs the same
  lint, format, and build commands regardless of which package they are
  working in. Onboarding scripts need only run `pnpm install` at the root.
- **Disk efficiency** — pnpm's content-addressable store deduplicates
  identical dependency versions across workspaces, saving substantial
  disk space compared to npm or Yarn Classic.

### What becomes harder or worse

- **Initial setup complexity** — configuring `pnpm-workspace.yaml`,
  `turbo.json`, and shared configuration packages requires upfront effort
  that is more involved than a single-app `create-next-app` scaffold.
- **Build pipeline configuration** — Turborepo task definitions, output
  hashing, and remote cache configuration add a layer of complexity that
  must be understood by the team maintaining the CI pipeline.
- **New team member onboarding** — developers unfamiliar with monorepo
  tooling (pnpm workspaces, Turborepo pipelines) need additional ramp-up
  time. This is mitigated by documentation in the repository's
  `CONTRIBUTING.md` and a guided setup script.
- **IDE performance** — large monorepos can slow down TypeScript language
  server and IDE indexing. Project references and `tsconfig` path
  mappings must be carefully maintained.

### Risks and mitigations

| Risk | Likelihood | Impact | Mitigation |
| --- | --- | --- | --- |
| Turborepo caching invalidation issues cause stale builds | Low | Medium | Pin Turborepo version; add `--force` flag to nightly CI builds |
| pnpm major version upgrade introduces breaking workspace behaviour | Low | High | Lock pnpm version via `packageManager` field in root `package.json` |
| Developers bypass workspace protocol with direct file references | Medium | Low | Enforce workspace protocol via ESLint rule and PR review checklist |

---

## Alternatives Considered

### Alternative 1: Nx

**Description:** Nx is a full-featured monorepo build system with
built-in code generators, dependency graph visualisation, and deep
framework integrations for Angular, React, and Node.js.

**Pros:**
- Rich plugin ecosystem with generators for NestJS and Next.js.
- Advanced computation caching and distributed task execution.
- Built-in affected-command analysis for CI optimisation.

**Cons:**
- Significantly more opinionated — imposes its own project structure and
  configuration philosophy, which can conflict with framework defaults.
- Heavier runtime footprint and steeper learning curve.
- Plugin lock-in: upgrading Nx major versions often requires migrating
  plugin configurations across the entire repository.

**Reason for rejection:** The added opinions and weight of Nx were
disproportionate to our needs. Turborepo provides the caching and task
orchestration we require with a thinner abstraction layer, allowing us
to retain full control over project structure and tooling choices.

### Alternative 2: Lerna

**Description:** Lerna is one of the original JavaScript monorepo tools,
focused on versioning and publishing multiple packages from a single
repository.

**Pros:**
- Well-known in the ecosystem with extensive community documentation.
- Good support for independent and fixed versioning strategies.

**Cons:**
- Maintenance has been inconsistent — the project changed stewardship
  multiple times and development velocity slowed considerably.
- Lerna delegates to npm or Yarn for workspace resolution, so it does not
  provide the disk-efficiency benefits of pnpm.
- Task orchestration capabilities are limited compared to Turborepo's
  caching and parallel execution.

**Reason for rejection:** Lerna's uncertain maintenance trajectory and
lack of built-in caching made it a riskier long-term choice. Turborepo
offers a more modern and actively maintained alternative.

### Alternative 3: Separate repositories

**Description:** Maintain each application and shared package in its own
Git repository, coordinated via a private npm registry or Git submodules.

**Pros:**
- Clear ownership boundaries per repository.
- Independent deployment pipelines with no cross-project build
  interference.

**Cons:**
- Shared code requires publishing to a private registry, introducing
  version management overhead and release coordination friction.
- Cross-repository changes (e.g., updating a shared type) span multiple
  pull requests and require careful sequencing to avoid breaking consumers.
- Duplicated tooling configuration across repositories leads to drift.

**Reason for rejection:** The platform's tight coupling between the web
app, API, and shared packages makes separate repositories impractical.
The coordination overhead would negate the benefits of independent
repositories.

### Alternative 4: Yarn workspaces (Berry / v4)

**Description:** Use Yarn Berry with its built-in workspace support and
Plug'n'Play (PnP) module resolution.

**Pros:**
- Mature workspace support with zero-install capabilities via PnP.
- Good community adoption and active maintenance.

**Cons:**
- PnP requires additional configuration and can cause compatibility
  issues with tools that assume a `node_modules` directory structure.
- Disk efficiency, while improved with PnP, still does not match pnpm's
  content-addressable storage for projects that opt out of PnP.
- Yarn Berry's configuration model (`.yarnrc.yml`, plugins) adds
  complexity that does not provide proportional benefits for our use case.

**Reason for rejection:** pnpm provides superior disk efficiency through
its content-addressable store, faster installation times in benchmarks,
and a simpler mental model for workspace resolution. The team's existing
familiarity with pnpm further reduced the adoption cost.

---

## References

- [pnpm Workspaces documentation](https://pnpm.io/workspaces)
- [Turborepo Handbook](https://turbo.build/repo/docs)
- [Monorepo Explained — monorepo.tools](https://monorepo.tools)
- [Nx documentation](https://nx.dev)
- [Lerna repository](https://github.com/lerna/lerna)
- [Yarn Berry documentation](https://yarnpkg.com/features/workspaces)

---

## Revision History

| Date       | Author                    | Change description     |
| ---------- | ------------------------- | ---------------------- |
| 2025-01-15 | Platform Engineering Team | Initial proposal and acceptance |
