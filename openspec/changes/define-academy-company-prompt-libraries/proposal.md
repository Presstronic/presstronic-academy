## Why

Company prompt libraries are a future/B2B capability that can reuse Code Prompt foundations, but tenant-specific prompt ownership should not leak into MVP content authoring. Capturing the boundary now keeps company content, assessment prompts, and Academy learning content separate.

## What Changes

- Define company-owned prompt libraries, tenant prompt visibility, assignment eligibility, review status, and versioning.
- Clarify how company prompts may reuse Code Prompt structures while staying separate from Academy learner curriculum.
- Define governance, ownership, privacy, import/export, and lifecycle boundaries.
- Keep implementation deferred until B2B assessment workflows are accepted.

## Capabilities

### New Capabilities

- `academy-company-prompt-libraries`: Future/B2B company-owned prompt libraries, prompt lifecycle, visibility, versioning, governance, and assignment boundaries.

### Modified Capabilities

- `academy-mvp-scope`: Clarifies that company prompt libraries remain future/B2B and do not ship in the first learner MVP.

## Impact

- Affects future B2B admin workflows, prompt authoring, assessment assignment, tenancy, and content governance.
- Does not implement tenant administration, prompt library UI, imports, exports, or company-specific assessment delivery.
