## Context

`apps/api` is now the primary Spring Boot API workspace, and `apps/web` plus `apps/admin` are active React workspaces. `packages/contracts` remains placeholder-only. Without a shared contract package, frontend code can grow around handwritten fetch shapes while backend APIs grow independently.

## Goals / Non-Goals

**Goals:**

- Establish `packages/contracts` as the shared API contract workspace.
- Define where OpenAPI documents, shared schemas, and generated TypeScript clients live.
- Make contract validation and client generation repeatable from root commands.
- Preserve backend ownership of endpoint behavior and frontend ownership of app workflows.
- Keep initial contracts scaffold-level until feature endpoint proposals accept concrete API behavior.

**Non-Goals:**

- Do not implement learner, admin, billing, mentor, content health, Code Prompt, or Delivery endpoints.
- Do not define database schemas or persistence migrations.
- Do not introduce GraphQL.
- Do not activate service-specific contracts before the related service proposals are accepted.

## Decisions

### Decision: Use OpenAPI as the REST contract source

REST remains the default API style in the accepted monorepo spec. OpenAPI gives a durable contract format for backend verification, frontend client generation, and reviewer-friendly schema diffs.

Alternative considered: handwritten TypeScript-only client types. That would help frontend development but would not give backend or external contract validation a neutral source.

### Decision: Keep generated clients inside `packages/contracts`

Generated TypeScript clients should live beside the contract source so frontend apps consume one workspace package instead of committing generated code into each app.

Alternative considered: generate clients directly into `apps/web` and `apps/admin`. That would duplicate generated artifacts and make contract changes harder to review.

### Decision: Keep product endpoint contracts deferred

The initial contracts package should prove tooling and ownership without inventing product APIs ahead of feature specs.

Alternative considered: define all first-pass product endpoints now. That would mix scaffolding with product workflow decisions that deserve focused proposals.

## Risks / Trade-offs

- Contract tooling can become heavy before endpoints exist -> start with minimal validation/generation commands.
- Generated clients can obscure API semantics -> keep OpenAPI documents source-owned and reviewable.
- Contract-first work can block feature flow if too rigid -> allow feature proposals to add focused contract deltas.
- Backend and frontend versions can drift -> make root verification include contract validation once implemented.

## Migration Plan

1. Accept this proposal.
2. Scaffold `packages/contracts` with package metadata, OpenAPI source layout, generation output layout, and validation commands.
3. Add root scripts or documented commands for contract validation/generation.
4. Use later feature proposals to add concrete endpoint contracts.

## Open Questions

- Which OpenAPI generator should be used for TypeScript clients?
- Should shared runtime validation use generated schemas immediately, or remain compile-time only until APIs exist?
- Should the first contract include only health/readiness examples, or no endpoint examples at all?
