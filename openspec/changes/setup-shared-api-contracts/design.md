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

### Decision: Contract-first, with a backend drift test

The OpenAPI document in `packages/contracts` is written first and reviewed as source. `apps/api` adds `springdoc-openapi` as a test-only dependency (or a build-time generation task that doesn't ship in the runtime artifact), and a test compares the API's generated document with the contract. Differences in paths, operations, status codes, or schemas fail the build, and therefore CI.

Alternative considered: code-first (generate the contract from controllers and treat that as the source). This is faster for backend-only changes, but contract diffs become a side effect of code changes rather than something reviewed first. It also lets the frontend's view of the API drift without anyone deciding it should.

### Decision: `openapi-typescript` types with an `openapi-fetch` client

`openapi-typescript` generates TypeScript types only (a `paths` type per contract), with no runtime classes. Frontend apps call endpoints through `openapi-fetch`, a small typed `fetch` wrapper. Its middleware hooks carry the same request interceptors (for example the CSRF header) and the `ApiProblem` / `NetworkError` mapping as the per-app `apiFetch` from `setup-frontend-app-foundations`, so moving a call to the generated client doesn't change error handling. TanStack Query hooks stay hand-written and thin over the typed client.

Alternative considered: `orval`, which generates TanStack Query hooks and runtime validators. It's less hand-written code, but far more generated code to review, and it would own the Query conventions instead of the apps.

Alternative considered: `@hey-api/openapi-ts`. It's capable, but it generates an SDK layer we don't need on top of the types.

### Decision: Compile-time types only, no runtime response validation

Generated types are used for compile-time checking only. The API and both frontends are owned and deployed together, the drift test catches contract mismatches before merge, and the API validates its own inputs. Runtime schema validation (for example zod generated from the contract) is deferred until the platform consumes an API it doesn't control.

### Decision: The first contract has shared components only

The initial contract defines reusable components and no endpoints:

- `Problem`: the RFC 9457 problem-details body with `code` and `requestId`, from `setup-api-platform-foundations`
- `ValidationProblem`: `Problem` plus field `errors`
- `ErrorCode`: the documented stable codes (`validation_failed`, `not_found`, `method_not_allowed`, `unsupported_media_type`, `malformed_request`, `internal_error`)

Actuator health is operational, not product API, so it stays out of the contract. The first endpoint contracts arrive with `implement-passwordless-auth-and-oauth` (#205) as contract deltas, which is also where the drift test first gets real operations to compare.

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

## Resolved Questions

- TypeScript client generator: `openapi-typescript` + `openapi-fetch` (see above).
- Runtime validation: compile-time only for now (see above).
- First contract contents: shared problem-details components only, no endpoints (see above).
