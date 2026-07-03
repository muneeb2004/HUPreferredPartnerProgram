# Offer Lifecycle

Offers on the HU Preferred Partner Platform move through a structured lifecycle represented by the `ContentStatus` enum: `DRAFT`, `REVIEW`, `PUBLISHED`, `ARCHIVED`, and `EXPIRED`.

## States

1. **DRAFT**: Offer is being worked on by the Partner. Not visible to admins or users.
2. **REVIEW**: Offer has been submitted for Admin approval.
3. **PUBLISHED**: Offer is approved and visible to users (subject to start and end dates).
4. **ARCHIVED**: Offer has been manually archived by a Partner or Admin. No longer visible to users.
5. **EXPIRED**: A `PUBLISHED` offer whose `endDate` has passed. Handled dynamically on the frontend and backend queries (status remains `PUBLISHED` but logic filters it out or marks it as expired).

## Transitions
- Brand Portal users can create offers (defaulting to `REVIEW` or `DRAFT`).
- Any update to a `PUBLISHED` offer by a Brand Partner resets the status to `REVIEW`.
- Admins can transition offers from `REVIEW` to `PUBLISHED`.
- Automated scheduler emits `offer.expiring_soon` notifications before an offer reaches its `endDate`.
