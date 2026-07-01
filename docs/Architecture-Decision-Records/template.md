# ADR-NNN: [Short Title of the Decision]

## Metadata

| Field       | Value                                              |
| ----------- | -------------------------------------------------- |
| **Status**  | Proposed \| Accepted \| Deprecated \| Superseded   |
| **Date**    | YYYY-MM-DD                                         |
| **Authors** | [List the authors or decision-makers]              |
| **Deciders**| [List stakeholders who approved the decision]      |

---

## Context

<!--
  Describe the forces at play, including technological, political, social,
  and project-specific constraints. This section should be value-neutral —
  it simply states facts about the situation that led to this decision.

  Good context sections answer questions such as:
  - What is the current state of the system or process?
  - What problem or opportunity are we responding to?
  - What requirements or constraints must the solution satisfy?
  - Are there any time pressures or deadlines that influenced the decision?
  - What assumptions are we making?

  Keep this section factual. Save opinions for the Decision section.
-->

[Describe the issue motivating this decision or change. Include relevant
background information, technical constraints, business requirements, and
any other forces that shaped the discussion. Reference existing systems,
pain points, or opportunities that make this decision necessary.]

---

## Decision

<!--
  State the decision clearly and concisely. Use active voice:
  "We will use X" rather than "X was chosen." If appropriate, include a
  brief rationale summarising *why* this option was selected over the
  alternatives (detailed alternative analysis belongs in the next section).

  If the decision has multiple parts, use a numbered list or sub-headings
  to break them apart. Each sub-decision should be independently
  understandable.
-->

We will [describe the change, action, or architectural direction being
taken]. This decision applies to [scope — e.g., a specific service, the
entire platform, the CI/CD pipeline].

### Key aspects of this decision

1. **[Aspect 1]** — Brief explanation of what this entails.
2. **[Aspect 2]** — Brief explanation of what this entails.
3. **[Aspect 3]** — Brief explanation of what this entails.

---

## Consequences

<!--
  Every decision has trade-offs. Be honest and thorough here — future
  readers will use this section to understand *why* things are the way
  they are and whether the trade-offs are still acceptable.

  Organise consequences into "what becomes easier" and "what becomes
  harder" to make the trade-offs scannable.
-->

### What becomes easier or better

- [Positive consequence 1 — e.g., improved developer experience, faster
  builds, reduced duplication.]
- [Positive consequence 2]
- [Positive consequence 3]

### What becomes harder or worse

- [Negative consequence 1 — e.g., increased onboarding complexity, new
  infrastructure dependency.]
- [Negative consequence 2]
- [Negative consequence 3]

### Risks and mitigations

| Risk                        | Likelihood | Impact | Mitigation                        |
| --------------------------- | ---------- | ------ | --------------------------------- |
| [Risk description]          | Low/Med/Hi | Low/Med/Hi | [How we plan to mitigate it]  |
| [Risk description]          | Low/Med/Hi | Low/Med/Hi | [How we plan to mitigate it]  |

---

## Alternatives Considered

<!--
  List every alternative that was seriously evaluated. For each one,
  provide a brief description and the reason(s) it was rejected. This
  helps future readers understand the decision landscape and prevents
  re-litigating settled questions.

  Use the format below for consistency.
-->

### Alternative 1: [Name]

**Description:** [What this alternative entails.]

**Pros:**
- [Pro 1]
- [Pro 2]

**Cons:**
- [Con 1]
- [Con 2]

**Reason for rejection:** [Why this alternative was not selected.]

---

### Alternative 2: [Name]

**Description:** [What this alternative entails.]

**Pros:**
- [Pro 1]
- [Pro 2]

**Cons:**
- [Con 1]
- [Con 2]

**Reason for rejection:** [Why this alternative was not selected.]

---

### Alternative 3: [Name]

**Description:** [What this alternative entails.]

**Pros:**
- [Pro 1]

**Cons:**
- [Con 1]

**Reason for rejection:** [Why this alternative was not selected.]

---

## References

<!--
  Include links to relevant documentation, RFCs, blog posts, library
  homepages, prior ADRs, or any other material that informed this
  decision. Use descriptive link text rather than bare URLs.
-->

- [Reference 1 title](https://example.com)
- [Reference 2 title](https://example.com)
- [Prior ADR if superseding](./000-example.md)

---

## Revision History

<!--
  Track significant updates to this ADR after its initial acceptance.
  Minor typo fixes do not need to be logged.
-->

| Date       | Author       | Change description            |
| ---------- | ------------ | ----------------------------- |
| YYYY-MM-DD | [Author]     | Initial proposal              |
| YYYY-MM-DD | [Author]     | [Description of revision]     |

---

> **How to use this template**
>
> 1. Copy this file and rename it following the pattern `NNN-short-title.md`
>    (e.g., `004-authentication-strategy.md`).
> 2. Replace all placeholder text (in square brackets and HTML comments)
>    with your actual content.
> 3. Set the **Status** to `Proposed` and open a pull request.
> 4. After team review and approval, update the **Status** to `Accepted`.
> 5. If a future decision supersedes this one, update the **Status** to
>    `Superseded` and link to the new ADR.
>
> **Status lifecycle:** `Proposed` → `Accepted` → `Deprecated` or `Superseded`
