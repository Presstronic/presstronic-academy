## Context

Academy learning content and future company assessment prompts share prompt structure, but they have different ownership, visibility, review, and lifecycle needs. Company prompt libraries should be captured as future/B2B before tenant-specific content is implemented.

## Goals / Non-Goals

**Goals:**

- Define company-owned prompt library boundaries.
- Preserve reuse of Code Prompt structure where appropriate.
- Establish versioning, governance, visibility, and assignment eligibility.
- Keep company content separate from Academy learner curriculum.

**Non-Goals:**

- Do not implement company prompt authoring.
- Do not implement tenant administration.
- Do not implement assessment assignment or candidate delivery.
- Do not define final import/export formats.

## Decisions

### Decision: Company prompts reuse Code Prompt structure

Shared prompt shape keeps future B2B prompts compatible with Delivery and evaluation systems.

Alternative considered: create a fully separate company prompt model. That would duplicate prompt and Delivery foundations too early.

### Decision: Company prompt visibility is tenant-scoped

Company prompts should not appear in public Academy catalog or learner curriculum unless explicitly promoted through a later workflow.

Alternative considered: store all prompts in one global library. That risks content leakage and ownership confusion.

## Risks / Trade-offs

- Tenant content can leak into learner surfaces -> require visibility boundaries.
- Company prompts can drift from evaluable structures -> preserve Code Prompt compatibility.
- Versioning can become complex -> require version snapshots before assignment.
- Imports can bring unsafe content -> require validation and review before use.

## Migration Plan

1. Accept this proposal.
2. Implement only after B2B assessment workflows are accepted.
3. Add company prompt library storage, review, and assignment behavior through focused changes.
4. Keep Academy learner curriculum separate unless explicit promotion is accepted.

## Open Questions

- Should company prompt libraries support private templates, shared templates, or both?
- Who can review and approve company prompts before assignment?
- Should company prompts be exportable or importable in OpenAPI/JSON/YAML formats?
