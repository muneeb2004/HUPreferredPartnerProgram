# ADR 005: Email Provider Abstraction

## Context
The platform requires email delivery capabilities for verification links and bulk newsletters. While AWS SES is the chosen infrastructure, directly coupling business logic (e.g., `SubscriptionService` or `NewslettersService`) to the AWS SDK makes the system difficult to test locally, hard to mock, and vendor-locked.

## Decision
We will introduce an `EmailProvider` interface that defines the contract for sending emails (e.g., `sendTransactionalEmail`, `sendBulkEmail`). 

- The application business logic will solely depend on the `EmailProvider` interface via Dependency Injection.
- We will implement an `SESProvider` class that implements this interface.
- We will implement a `MockEmailProvider` or `LoggerEmailProvider` for local development and testing.

## Consequences
**Positive:**
- Enhances testability by completely removing network I/O from unit/integration tests.
- Prevents vendor lock-in. Switching to SendGrid or Resend in the future requires writing a new class that implements the interface, with zero changes to business logic.
- Standardizes error handling and retry mechanisms at the provider boundary.

**Negative:**
- Requires writing a small abstraction layer rather than utilizing the vendor SDK natively throughout the codebase.
