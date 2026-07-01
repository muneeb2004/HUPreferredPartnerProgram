# ADR-002: Next.js with App Router for the Web Application

## Metadata

| Field       | Value                                              |
| ----------- | -------------------------------------------------- |
| **Status**  | Accepted                                           |
| **Date**    | 2025-01-15                                         |
| **Authors** | Platform Engineering Team                          |
| **Deciders**| Technical Lead, Senior Engineers                   |

---

## Context

The Habib University Preferred Partner platform requires a web application
that serves several distinct audiences and content types:

- **Public marketing pages** — landing pages, partner listings, programme
  information, and institutional content that must be highly optimised for
  search engine visibility and initial load performance.
- **Partner portal** — authenticated views where preferred partners can
  manage their profiles, view analytics, and interact with university
  programmes.
- **Admin dashboard** — internal-facing pages for university staff to
  manage partners, publish CMS content, generate newsletters, and
  oversee platform operations.

These diverse requirements impose competing constraints:

1. **SEO excellence** — marketing pages must be server-rendered or
   statically generated with full HTML delivered on the initial response
   to ensure search engine crawlers index content reliably.
2. **Interactive application behaviour** — the partner portal and admin
   dashboard require rich client-side interactivity, real-time state
   management, and responsive UI patterns that behave like a single-page
   application.
3. **Performance** — the platform must deliver fast Time to First Byte
   (TTFB) and Largest Contentful Paint (LCP) scores, particularly on
   marketing pages where performance directly affects conversion rates.
4. **Developer productivity** — the framework must support modern React
   patterns, integrate cleanly with the monorepo's shared packages, and
   provide a productive local development experience.
5. **Layout reuse** — multiple sections of the application share common
   navigation, sidebars, and footer structures that should be defined once
   and nested without redundant re-renders.

The team evaluated several React-based frameworks and rendering strategies
to find the best fit for these requirements.

---

## Decision

We will use **Next.js 14+** with the **App Router** as the framework for
the web application (`apps/web`). The App Router replaces the legacy Pages
Router and provides a fundamentally different architecture built on React
Server Components (RSC).

### Key aspects of this decision

1. **React Server Components (RSC)** — server components are the default
   in the App Router. Data fetching occurs on the server without shipping
   fetching logic or large data payloads to the client. This reduces
   client-side JavaScript bundle sizes and simplifies data access patterns.

2. **Nested layouts** — the App Router's file-system-based routing
   supports nested `layout.tsx` files that persist across navigations.
   The marketing section, partner portal, and admin dashboard each define
   their own layout hierarchy without re-rendering shared UI chrome.

3. **Streaming and Suspense** — server-rendered pages can stream HTML
   progressively using React Suspense boundaries. Slow data dependencies
   do not block the entire page response; shell UI is delivered
   immediately while dynamic content streams in.

4. **Hybrid rendering strategies** — individual routes can opt into
   static generation (`generateStaticParams`), dynamic server rendering,
   or client-side rendering as appropriate. Marketing pages are
   statically generated at build time, while dashboard pages are
   dynamically rendered per request.

5. **Server Actions** — form submissions and mutations can be handled via
   Server Actions, reducing the need for dedicated API endpoints for
   simple data mutations originating from the front-end.

6. **Middleware** — Next.js edge middleware handles authentication
   redirects, role-based access control, and request-level logging before
   the page rendering pipeline executes.

---

## Consequences

### What becomes easier or better

- **Data fetching simplicity** — server components can directly call
  database queries, internal APIs, or third-party services using standard
  `async`/`await` without the ceremony of `getServerSideProps` or
  client-side data-fetching libraries. Co-locating data fetching with the
  component that consumes the data improves readability and reduces prop
  drilling.
- **Reduced client bundle size** — dependencies used only for server-side
  data fetching (e.g., Prisma client, validation libraries, Markdown
  processors) never reach the client bundle, significantly reducing
  JavaScript shipped to the browser.
- **Nested layouts** — common navigation structures (e.g., admin sidebar,
  portal header) are defined once in a layout file and preserved during
  in-section navigations, eliminating full-page re-renders and improving
  perceived performance.
- **Streaming** — long data-fetching operations do not block the initial
  page response. Users see the page skeleton immediately while dynamic
  panels populate asynchronously, improving LCP and user experience.
- **SEO optimisation** — server-rendered HTML with complete content is
  delivered on the initial response, ensuring reliable indexing by search
  engines without requiring client-side JavaScript execution.
- **Built-in optimisations** — Next.js provides automatic image
  optimisation (`next/image`), font optimisation (`next/font`), and
  script loading strategies out of the box, reducing manual performance
  tuning effort.

### What becomes harder or worse

- **Ecosystem maturity** — the App Router is a newer paradigm, and some
  third-party libraries (particularly those relying on React context or
  client-side-only patterns) require `"use client"` directive wrappers or
  alternative approaches. Library compatibility must be verified during
  evaluation.
- **Mental model complexity** — the distinction between server components
  and client components introduces a new mental model. Developers must
  understand which components run on the server versus the client, how
  serialisation boundaries work, and when to apply `"use client"`.
- **Caching behaviour** — the App Router's multi-layer caching system
  (full-route cache, data cache, router cache) is powerful but complex.
  Misunderstanding cache invalidation can lead to stale content in
  development or production. The team must invest in understanding the
  caching documentation thoroughly.
- **Debugging complexity** — errors that span the server/client boundary
  can be harder to trace. Stack traces may reference server-side code
  that is not visible in the browser's developer tools.

### Risks and mitigations

| Risk | Likelihood | Impact | Mitigation |
| --- | --- | --- | --- |
| Third-party UI libraries incompatible with RSC | Medium | Medium | Evaluate libraries early; maintain a compatibility matrix; wrap incompatible components with `"use client"` boundary |
| Developers misuse caching, causing stale data in production | Medium | High | Document caching strategies in team wiki; add cache revalidation to deployment checklist |
| App Router API changes in future Next.js versions | Low | Medium | Pin Next.js version; follow upgrade guides during planned dependency update windows |

---

## Alternatives Considered

### Alternative 1: Next.js Pages Router

**Description:** The original Next.js routing paradigm using the `pages/`
directory with `getServerSideProps`, `getStaticProps`, and client-side
data fetching.

**Pros:**
- Mature and battle-tested with extensive community resources.
- Simpler mental model — all components are client components by default.
- Broader third-party library compatibility.

**Cons:**
- No support for React Server Components or streaming.
- Data fetching is co-located at the page level only, not at the
  component level, leading to prop drilling or client-side fetching in
  nested components.
- Layouts must be implemented manually and re-render on every navigation.
- Officially designated as the legacy pattern by the Next.js team, with
  new features prioritised for the App Router.

**Reason for rejection:** The Pages Router is a legacy architecture that
will receive diminishing investment. The App Router's server components,
nested layouts, and streaming capabilities directly address our
requirements for SEO performance, layout reuse, and reduced client bundle
size. Starting with the App Router avoids a future migration.

### Alternative 2: Remix

**Description:** A full-stack React framework focused on web standards,
progressive enhancement, and nested routing with loader/action patterns.

**Pros:**
- Excellent data loading model with nested route loaders.
- Strong focus on progressive enhancement and web standards.
- Built-in form handling with optimistic UI patterns.

**Cons:**
- Smaller ecosystem and community compared to Next.js.
- Fewer deployment targets and hosting integrations.
- No React Server Components support at the time of evaluation.
- Fewer learning resources and third-party integrations.

**Reason for rejection:** While Remix's architectural philosophy is
compelling, its smaller ecosystem would increase the burden of finding
compatible libraries, hiring experienced developers, and resolving issues
through community support. Next.js's larger ecosystem and Vercel's
investment in the App Router provide a more sustainable foundation.

### Alternative 3: Vite + React (SPA)

**Description:** A client-side single-page application built with Vite
as the build tool and React for the UI, with a separate API server
handling all data operations.

**Pros:**
- Simple development model with no server-side rendering complexity.
- Fast Hot Module Replacement (HMR) via Vite.
- Full control over routing (React Router) and state management.

**Cons:**
- No server-side rendering out of the box, severely impacting SEO for
  marketing pages.
- Requires additional tooling (e.g., Helmet, prerender services) to
  achieve baseline SEO compliance.
- Larger client bundles since all rendering logic runs in the browser.
- Slower initial page loads compared to server-rendered alternatives.

**Reason for rejection:** The platform's marketing pages require
excellent SEO performance, which is fundamentally difficult to achieve
with a client-side SPA without bolting on pre-rendering solutions. A
server-rendered framework provides this capability natively.

### Alternative 4: Astro

**Description:** A content-focused web framework that ships zero
JavaScript by default and supports multiple UI frameworks via "islands"
architecture.

**Pros:**
- Exceptional performance for static, content-heavy sites.
- Zero client-side JavaScript by default.
- Framework-agnostic — can embed React, Vue, or Svelte components.

**Cons:**
- Designed primarily for content sites, not interactive applications.
- The islands architecture is poorly suited for complex, stateful
  application UIs like admin dashboards and partner portals.
- Limited support for application-level patterns such as authentication
  flows, complex form handling, and real-time updates.

**Reason for rejection:** Astro excels at content sites but is not
designed for the interactive, application-heavy pages that constitute
the partner portal and admin dashboard. The platform requires a
framework that handles both content and application use cases.

---

## References

- [Next.js App Router documentation](https://nextjs.org/docs/app)
- [React Server Components RFC](https://github.com/reactjs/rfcs/blob/main/text/0188-server-components.md)
- [Next.js Caching documentation](https://nextjs.org/docs/app/building-your-application/caching)
- [Remix documentation](https://remix.run/docs)
- [Astro documentation](https://docs.astro.build)
- [ADR-001: Monorepo Structure](./001-monorepo-structure.md)

---

## Revision History

| Date       | Author                    | Change description     |
| ---------- | ------------------------- | ---------------------- |
| 2025-01-15 | Platform Engineering Team | Initial proposal and acceptance |
