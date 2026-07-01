# ADR-003: NestJS for the Backend API Layer

## Metadata

| Field       | Value                                              |
| ----------- | -------------------------------------------------- |
| **Status**  | Accepted                                           |
| **Date**    | 2025-01-15                                         |
| **Authors** | Platform Engineering Team                          |
| **Deciders**| Technical Lead, Senior Engineers                   |

---

## Context

The Habib University Preferred Partner platform requires a robust backend
API server to handle a wide range of responsibilities:

- **Authentication and authorisation** — user registration, login,
  session management, role-based access control (RBAC) for admins,
  partners, and public users.
- **CMS operations** — creating, updating, and publishing content such as
  partner profiles, programme descriptions, news articles, and
  institutional pages.
- **Newsletter generation** — composing, scheduling, and dispatching
  email newsletters to partner mailing lists, with template rendering and
  delivery tracking.
- **Admin functionality** — user management, platform analytics, audit
  logging, and configuration management for university staff.
- **Data persistence** — all operations interact with a PostgreSQL
  database through Prisma ORM, requiring clean data access patterns and
  transaction support.
- **Third-party integrations** — email delivery services, file storage
  providers, and potentially external university systems.

The backend must be implemented in **TypeScript** to maintain type safety
across the monorepo and enable seamless sharing of types and validation
schemas with the Next.js web application via the `@hupp/types` shared
package.

Key requirements for the backend framework:

1. **Structured architecture** — the codebase must scale beyond a handful
   of routes without devolving into an unorganised collection of handler
   functions. Clear separation of concerns between routing, business
   logic, and data access is essential.
2. **Dependency injection** — services should be injected rather than
   imported directly, enabling testability, loose coupling, and the
   ability to swap implementations (e.g., mock email services in tests).
3. **Middleware and interceptor support** — cross-cutting concerns such as
   authentication, logging, request validation, and error handling must be
   applied declaratively without duplicating logic across routes.
4. **TypeScript-first** — the framework must be designed for TypeScript
   from the ground up, not a JavaScript framework with type definitions
   bolted on.
5. **Prisma compatibility** — the framework must integrate cleanly with
   Prisma for database access, supporting Prisma's client generation and
   migration workflows.

---

## Decision

We will use **NestJS** with TypeScript for the API layer, deployed as the
`apps/api` workspace within the monorepo. NestJS provides an opinionated,
Angular-inspired architecture built on top of Express.js (with the option
to swap to Fastify) that aligns with our requirements for structure,
testability, and TypeScript support.

### Key aspects of this decision

1. **Module system** — NestJS organises code into modules, each
   encapsulating a cohesive set of controllers, services, and providers.
   The platform's domain areas (auth, partners, CMS, newsletters, admin)
   each become a dedicated module with clear boundaries.

   ```
   apps/api/src/
   ├── auth/
   │   ├── auth.module.ts
   │   ├── auth.controller.ts
   │   ├── auth.service.ts
   │   └── guards/
   ├── partners/
   │   ├── partners.module.ts
   │   ├── partners.controller.ts
   │   └── partners.service.ts
   ├── cms/
   ├── newsletters/
   ├── admin/
   ├── prisma/
   │   ├── prisma.module.ts
   │   └── prisma.service.ts
   └── app.module.ts
   ```

2. **Dependency injection (DI)** — NestJS provides a built-in IoC
   (Inversion of Control) container. Services are decorated with
   `@Injectable()` and injected via constructor parameters. This enables
   straightforward unit testing with mock providers and supports
   different provider scopes (singleton, request-scoped, transient).

3. **Guards and interceptors** — authentication and authorisation are
   implemented as guards (`@UseGuards(JwtAuthGuard, RolesGuard)`) applied
   at the controller or route level. Interceptors handle cross-cutting
   concerns such as response transformation, logging, and caching.
   Exception filters provide centralised error handling.

4. **Validation via pipes** — request validation uses the `ValidationPipe`
   with `class-validator` decorators on DTO (Data Transfer Object)
   classes. Invalid requests are rejected before reaching the controller
   handler, ensuring that business logic operates on validated data.

5. **Prisma integration** — a `PrismaModule` wraps the Prisma client as a
   NestJS provider, making it injectable into any service. The module
   handles client lifecycle (connection and disconnection) and exposes
   the typed Prisma client for database operations.

6. **OpenAPI documentation** — NestJS's `@nestjs/swagger` package
   generates OpenAPI specifications from controller decorators and DTO
   classes, providing automatic API documentation that stays synchronised
   with the implementation.

---

## Consequences

### What becomes easier or better

- **Structured, scalable architecture** — the module/controller/service
  pattern enforces separation of concerns from the start. As the platform
  grows, new domain areas are added as self-contained modules without
  disrupting existing code.
- **Built-in dependency injection** — services are loosely coupled and
  easily testable. Swapping a real email service for a mock in tests
  requires only a provider override, not code changes in business logic.
- **Declarative auth and middleware** — guards, interceptors, and pipes
  applied via decorators reduce boilerplate and ensure that cross-cutting
  concerns are handled consistently across all routes.
- **Excellent TypeScript support** — NestJS is written in TypeScript and
  leverages decorators, generics, and type inference throughout its API.
  The development experience in TypeScript-aware editors is first-class.
- **Prisma integration** — wrapping Prisma as a NestJS provider is
  well-documented and widely practiced. The typed Prisma client provides
  end-to-end type safety from the database schema to the API response.
- **Auto-generated API documentation** — the `@nestjs/swagger` module
  produces accurate OpenAPI specs from the existing codebase, reducing
  the burden of maintaining separate API documentation.
- **Testing utilities** — NestJS provides a `Test.createTestingModule()`
  utility that creates an isolated module context for unit and
  integration tests, with built-in support for overriding providers.

### What becomes harder or worse

- **Boilerplate overhead** — NestJS requires more files and ceremony
  compared to a minimal Express.js application. Each domain area
  typically involves a module, controller, service, DTOs, and guards.
  For simple CRUD endpoints, this can feel excessive.
- **Decorator-heavy syntax** — NestJS relies extensively on TypeScript
  decorators (`@Controller`, `@Get`, `@Injectable`, `@Body`, etc.). While
  powerful, the decorator syntax can obscure control flow and make code
  harder to read for developers unfamiliar with the pattern.
- **Learning curve for DI patterns** — developers without experience in
  Angular or other DI frameworks need time to understand provider scopes,
  circular dependency resolution, and dynamic modules. Incorrect DI
  configuration can produce runtime errors that are difficult to debug.
- **Framework coupling** — business logic becomes intertwined with NestJS
  abstractions (decorators, modules, pipes). Migrating away from NestJS
  in the future would require significant refactoring, though this risk
  is acceptable given the framework's maturity and active development.

### Risks and mitigations

| Risk | Likelihood | Impact | Mitigation |
| --- | --- | --- | --- |
| Decorator-based DI errors surface only at runtime | Medium | Medium | Enable strict mode in the NestJS CLI; write integration tests for module wiring; use `onModuleInit` lifecycle hooks for early validation |
| NestJS major version upgrades introduce breaking changes | Low | Medium | Pin NestJS version; follow the official migration guide during scheduled dependency updates |
| Prisma client regeneration causes type mismatches with NestJS DTOs | Low | Low | Run `prisma generate` as part of the build pipeline; share Prisma-generated types via the `@hupp/types` package |
| Performance bottlenecks from Express.js under high load | Low | Medium | Profile with realistic load tests; swap to Fastify adapter if Express becomes a bottleneck (NestJS supports both) |

---

## Alternatives Considered

### Alternative 1: Express.js (with TypeScript)

**Description:** Use Express.js directly with TypeScript, organising
routes and middleware manually or with a lightweight structure library.

**Pros:**
- Minimal framework overhead — full control over application structure.
- Largest ecosystem of middleware and community resources.
- Low learning curve for developers already familiar with Node.js.

**Cons:**
- No built-in architectural conventions — structure is entirely the
  team's responsibility, and consistency degrades as the codebase grows.
- No dependency injection — services must be imported directly or
  managed through a custom DI solution, reducing testability.
- No built-in validation pipeline — request validation must be
  implemented manually or via third-party middleware.
- No automatic API documentation generation.

**Reason for rejection:** Express.js provides too little structure for a
backend of this complexity. Without enforced conventions, the codebase
would likely accumulate inconsistencies and become difficult to maintain
as the team and feature set grow. NestJS provides the architectural
guardrails that Express lacks while still using Express under the hood.

### Alternative 2: Fastify (standalone)

**Description:** Use Fastify as the HTTP framework, leveraging its
schema-based validation and plugin architecture for building a structured
API.

**Pros:**
- Superior raw HTTP performance compared to Express.js.
- Built-in schema-based request and response validation using JSON Schema.
- Encapsulated plugin system for organising application code.

**Cons:**
- Smaller ecosystem of plugins and middleware compared to Express.
- No built-in dependency injection — must implement or adopt a
  third-party DI library.
- Plugin encapsulation model is less intuitive than NestJS's module system
  for organising large applications.
- TypeScript support, while improved, is not as deeply integrated as
  NestJS's TypeScript-first design.

**Reason for rejection:** Fastify's performance advantages are not a
primary concern for this platform's expected load. NestJS can optionally
use Fastify as its HTTP adapter, giving us the option to adopt Fastify's
performance characteristics without sacrificing NestJS's architectural
benefits. Using Fastify standalone would sacrifice DI, guards, and
interceptors that NestJS provides.

### Alternative 3: Next.js API Routes

**Description:** Implement backend logic directly within Next.js API
routes (`app/api/` directory), eliminating the need for a separate
backend application.

**Pros:**
- No separate deployment — frontend and backend share a single Next.js
  application.
- Simplified development setup with one fewer application to configure.
- Shared middleware and authentication logic between pages and API routes.

**Cons:**
- API routes lack the architectural structure needed for complex backend
  logic — no modules, no DI, no guards or interceptors.
- Mixing frontend and backend concerns in a single deployment creates
  scaling limitations — API traffic and page-rendering traffic cannot be
  scaled independently.
- Long-running operations (newsletter generation, batch processing) are
  poorly suited to Next.js's serverless-oriented API route model.
- Testing API routes in isolation requires Next.js's test infrastructure,
  adding coupling.

**Reason for rejection:** The platform's backend requirements — auth,
CMS, newsletter generation, admin operations — are too complex for
Next.js API routes. A dedicated backend application with proper
architectural structure, dependency injection, and independent scaling is
necessary.

### Alternative 4: Hono

**Description:** Hono is a lightweight, edge-first web framework for
building HTTP APIs with TypeScript, designed for Cloudflare Workers,
Deno, and Node.js runtimes.

**Pros:**
- Extremely lightweight with minimal overhead.
- Excellent TypeScript support with type-safe routing.
- Runs on multiple runtimes including edge environments.

**Cons:**
- Too minimal for a complex backend — no built-in DI, module system, or
  architectural conventions.
- Smaller ecosystem with fewer integrations for PostgreSQL, email
  services, and enterprise patterns.
- Designed primarily for edge/serverless workloads, not traditional
  long-running server applications.
- Would require building or adopting most infrastructure (DI, validation,
  guards) from scratch.

**Reason for rejection:** Hono's minimalism is a strength for lightweight
edge APIs but a liability for a platform backend with significant
business logic. The effort required to build DI, validation, guards, and
module organisation on top of Hono would effectively recreate what NestJS
provides out of the box.

---

## References

- [NestJS documentation](https://docs.nestjs.com)
- [NestJS Prisma recipe](https://docs.nestjs.com/recipes/prisma)
- [NestJS OpenAPI (Swagger) module](https://docs.nestjs.com/openapi/introduction)
- [Express.js documentation](https://expressjs.com)
- [Fastify documentation](https://fastify.dev)
- [Hono documentation](https://hono.dev)
- [ADR-001: Monorepo Structure](./001-monorepo-structure.md)
- [ADR-002: Next.js App Router](./002-nextjs-app-router.md)

---

## Revision History

| Date       | Author                    | Change description     |
| ---------- | ------------------------- | ---------------------- |
| 2025-01-15 | Platform Engineering Team | Initial proposal and acceptance |
