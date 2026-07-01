# ADR 004: Domain Events Architecture for Internal Decoupling

## Context
As the platform expands (e.g., Newsletter Systems, CMS publishing, Notifications), synchronous operations spanning multiple domains result in tight coupling, sluggish API response times, and fragile transaction boundaries. For example, publishing a newsletter requires queueing emails, logging actions, generating PDFs, and notifying administrators.

## Decision
We will adopt an **EventEmitter pattern** (Domain Events) for all cross-domain operations moving forward, starting with Phase 7 Newsletters.

- State changes in a primary domain (e.g., `Newsletter` status changing to `SCHEDULED`) will mutate the database and immediately emit a typed domain event (e.g., `NewsletterSendRequested`).
- Separate modules (like the Queue Manager or Audit Logger) will listen to these events and handle side-effects asynchronously.

## Consequences
**Positive:**
- Decouples services (e.g., `NewslettersModule` doesn't need to inject `QueueModule`).
- Drastically improves API response times by offloading side effects.
- Facilitates future scalability and observability (e.g., a single metrics listener can log all system events).

**Negative:**
- Requires careful handling of eventual consistency. If the event listener fails, the primary transaction has already committed. Critical workflows must rely on resilient background queues (e.g., BullMQ) tied to the event listener to guarantee execution.
