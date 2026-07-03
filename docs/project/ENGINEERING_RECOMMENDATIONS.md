# Engineering Recommendations & Technical Debt

This document tracks accumulated non-blocking recommendations, technical debt, and architectural improvements identified during Engineering Reviews across all implementation phases.

By tracking these items centrally, we ensure they are not forgotten and can be scheduled for resolution in dedicated maintenance sprints without blocking immediate feature delivery.

## Active Recommendations

| Recommendation | Originating Phase | Originating Review | Priority | Blocking | Planned Resolution |
|----------------|-------------------|--------------------|----------|----------|--------------------|
| **DeliveryLog Idempotency:** Add composite unique constraint `@@unique([issueId, subscriptionId])` and replace `findFirst` with `upsert` or `P2002` exception handling. | Phase 7 | Post-Remediation ER | High | No | Next Maintenance PR |
| **Token Cleanup Indexes:** Add `@@index([expiresAt])` to `UnsubscribeToken` and `EmailVerificationToken` to optimize future cleanup queries. | Phase 7 | Post-Remediation ER | Medium | No | Next Maintenance PR |
| **Scheduled Token Cleanup:** Implement a scheduled BullMQ job to prune expired verification and unsubscribe tokens to prevent table bloat. | Phase 7 | Post-Remediation ER | Low | No | Post Phase 10 |
| **Cursor Pagination Uniformity:** Ensure cursor-based pagination is uniformly implemented for any large dataset traversals across the codebase. | Phase 7 | Initial ER | Medium | No | Ongoing |
| **Animation Passthrough Attributes:** Standardize the passing of arbitrary HTML attributes in animation wrapper components. | Phase 3 | Implementation ER | Low | No | Ongoing |
| **EventEmitter Pattern Standardization:** Enforce strongly typed event payloads for `EventEmitter2` across all domains. | Phase 7 | Initial ER | Medium | No | Ongoing |

## Resolved Recommendations

| Recommendation | Originating Phase | Resolution Phase | Notes |
|----------------|-------------------|------------------|-------|
| Password Policy Centralization | Phase 12 | Phase 12 Hardening | Centralized in @hu-partner/utils |
| Email Change Verification | Phase 12 | Phase 12 Hardening | Implemented UserEmailChangeToken & Service |
| Notification Infrastructure | Phase 12 | Phase 12 Hardening | Created NotificationModule and Event Emitters |
| Media Upload UX Components | Phase 12 | Phase 12 Hardening | Created MediaPicker, MediaPreview, MediaSelector |
| Offer Notification Consumers | Phase 12 | Phase 12 Hardening | Implemented OfferNotificationListener |
