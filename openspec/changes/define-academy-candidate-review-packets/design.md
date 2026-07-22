## Context

Hiring assessments produce evidence that company reviewers need to understand quickly. Review packets should curate candidate work and evaluation context without exposing unnecessary learner/candidate data or raw operational details.

## Goals / Non-Goals

**Goals:**

- Define packet ownership and contents.
- Establish derived evidence, redaction, sharing, expiration, and audit boundaries.
- Keep packet access distinct from learner profile and admin content access.

**Non-Goals:**

- Do not implement packet generation.
- Do not implement company reviewer UI.
- Do not define hiring decision automation.
- Do not activate hiring assessments themselves in this change.

## Decisions

### Decision: Packets are derived artifacts

Review packets should be generated from assessment attempts, Deliveries, rubrics, and evaluation results rather than becoming the source of truth for assessment data.

Alternative considered: store review packet as the primary assessment record. That would make revisions, redactions, and audits harder.

### Decision: Access and expiration are required

Candidate review packets can contain sensitive work evidence, so access, sharing, expiration, and audit behavior need to be part of the spec before implementation.

Alternative considered: treat packets as ordinary admin reports. That does not fit candidate privacy or company sharing needs.

## Risks / Trade-offs

- Packets can overexpose candidate data -> require redaction and scoped access.
- Derived summaries can misrepresent evidence -> preserve source references and reviewer context.
- Sharing links can leak -> require expiration and audit requirements.
- Review packets can become broad reporting -> keep scope tied to assessment evidence.

## Migration Plan

1. Accept this proposal.
2. Implement only after hiring assessments provide source attempts and Deliveries.
3. Add packet generation and sharing flows through focused implementation.
4. Validate packet content against privacy and access requirements.

## Open Questions

- Should packets be exportable as PDF, web-only, or both?
- How long should packets remain accessible by default?
- Which packet fields should candidates be able to inspect or dispute?
