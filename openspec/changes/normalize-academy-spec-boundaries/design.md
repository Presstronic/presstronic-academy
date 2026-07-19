## Context

The Academy specs were imported as a broad baseline before application implementation begins. They cover the expected learner-facing product surfaces, shared UI primitives, visual direction, auth, billing, privacy, and progression systems.

The current baseline is useful, but some specs mix two levels of responsibility:

- Surface specs sometimes define shared behavior in detail instead of delegating to the owning shared capability.
- Shared specs sometimes imply app-level behavior outside their component or system boundary.
- Visual rules appear both globally and inside individual screen specs.
- Navigation and persistence expectations appear in several feature specs without an explicit ownership rule.

This change introduces explicit responsibility boundaries so future implementation proposals can edit each capability with a clear owner and delegation model.

## Goals / Non-Goals

**Goals:**

- Establish one authoritative capability for each cross-cutting behavior.
- Make screen specs responsible for observable screen behavior and entry points.
- Make shared specs responsible for reusable behavior that crosses screens.
- Make future implementation planning easier by reducing duplicate or conflicting requirements.
- Preserve the current product intent and avoid changing user-facing behavior in this proposal.

**Non-Goals:**

- Do not scaffold or implement frontend, backend, or service code.
- Do not decide final backend service boundaries.
- Do not rewrite every existing requirement in this proposal.
- Do not introduce new product features.
- Do not remove the current baseline specs until follow-up normalization tasks are applied and validated.

## Decisions

### Decision: Add explicit boundary requirements before editing bulk spec content

Add a responsibility-boundary requirement to each affected capability. This creates a low-risk contract that can be validated before larger baseline edits.

Alternative considered: rewrite all affected requirements immediately. That would produce a very large change, mix many unrelated wording edits, and make review harder.

### Decision: Use shared capabilities as owners for cross-cutting behavior

Privacy, visual design, shell routing, and reusable component behavior should each have one authoritative spec. Surface specs may expose entry points, actions, or visual participation, but they should not own full shared behavior.

Alternative considered: allow each surface to fully define its own privacy, visual, and navigation details. That keeps individual specs self-contained, but it creates duplicate contracts that will drift.

### Decision: Treat this as documentation/specification normalization only

The change should not require app, API, database, or infrastructure changes. Implementation follow-ups can apply the normalized boundaries when scaffolding `apps/web`, `apps/admin`, `apps/api`, and shared packages.

Alternative considered: combine this cleanup with app scaffolding. That would obscure whether changes are spec cleanup or implementation behavior.

### Decision: Keep volatile literals out of boundary requirements

Boundary requirements should define ownership and delegation, not copy-specific metrics, design values, or temporary mockup content. Volatile literals can be revisited in follow-up deltas that decide whether they are contractual.

Alternative considered: harden every literal in the existing specs. That would prematurely turn mockup content into long-lived product contract.

## Risks / Trade-offs

- Large number of affected capabilities -> Keep this proposal focused on boundary requirements and defer bulk requirement rewrites to tasks.
- Boundary requirements can feel abstract -> Each added requirement includes scenarios that define observable delegation behavior.
- Some duplication remains after this proposal -> Tasks explicitly include follow-up edits to remove or modify duplicated baseline requirements.
- Reviewers may expect full normalization immediately -> The proposal states this is the first step and avoids hidden behavior changes.

## Migration Plan

1. Add boundary requirements as OpenSpec deltas.
2. Validate the change.
3. In follow-up implementation of this spec change, update baseline specs to remove duplicated shared behavior and align surface specs with the boundary requirements.
4. Re-run OpenSpec validation after baseline spec updates.

Rollback is simple: remove the change directory before archiving, or revert the archive commit if the deltas have already been applied.

## Open Questions

- Should visual-design boundary references use exact token names in surface specs, or should surfaces only refer to the visual-design capability by name?
- Should future API/client contract ownership live in `packages/contracts` as a new capability, or remain outside product OpenSpec until API scaffolding begins?
