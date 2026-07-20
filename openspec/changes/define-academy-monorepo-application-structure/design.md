## Context

The repository already contains the intended top-level structure:

- `apps/web`, `apps/admin`, `apps/api`, `apps/worker`, and `apps/gateway`
- `packages/ui`, `packages/contracts`, `packages/eslint-config`, and `packages/tsconfig`
- `services/code-runner`, `services/notifications`, and `services/billing`
- `infra/docker`, `infra/compose`, and `infra/scripts`
- `docs/` and `openspec/`

This structure is directionally correct, but it needs an explicit OpenSpec contract before implementation scaffolding begins. The most important architectural risk is prematurely treating every planned service directory as an active microservice boundary. The project should start with a primary Spring Boot API and extract independently deployable services only when operational reasons exist.

## Goals / Non-Goals

**Goals:**

- Define authoritative ownership for the repo's top-level application, package, service, infrastructure, docs, and spec directories.
- Preserve the planned React learner app, React admin app, Spring Boot API, worker, and optional gateway shape.
- Make strict TypeScript and ShadCN explicit for frontend application and shared UI work.
- Keep REST as the primary contract style while allowing WebSockets and deferring GraphQL.
- Distinguish active application boundaries from future independently deployable service placeholders.

**Non-Goals:**

- Do not scaffold React, Spring Boot, Gradle, Vite, ShadCN, Docker, or CI implementation files in this change.
- Do not define API endpoints, OpenAPI schemas, database schemas, auth provider configuration, or deployment environments.
- Do not split backend behavior into microservices without later service-specific proposals.
- Do not decide whether `apps/gateway` is needed.

## Decisions

### Decision: Keep `apps/api` as the primary backend boundary

`apps/api` should own the initial Spring Boot backend for REST APIs, WebSockets, authentication, and core Academy workflows. This avoids premature service extraction while still allowing internal modular design.

Alternative considered: start immediately with `services/*` as active microservices. That would add deployment, observability, data ownership, and integration complexity before the product has implementation evidence for those splits.

### Decision: Treat `services/*` as reserved independently deployable boundaries

`services/code-runner`, `services/notifications`, and `services/billing` should remain placeholders until a later OpenSpec proposal justifies each extraction by isolation, scaling, operational, data, or vendor-integration needs.

Alternative considered: remove `services/*` until needed. Keeping placeholders is useful because the likely future boundaries are already known, but the spec must prevent accidental implementation drift.

### Decision: Keep `apps/gateway` optional and empty

`apps/gateway` should remain deferred until routing, edge authorization, aggregation, or cross-service concerns cannot cleanly live in `apps/api` or infrastructure.

Alternative considered: scaffold a gateway immediately. That would create another deployable surface before there is a concrete edge concern.

### Decision: Put cross-application frontend reuse in `packages/ui`

`packages/ui` should own shared ShadCN-based React components used by `apps/web` and `apps/admin`. App-specific screens, routing, and state stay in the consuming app.

Alternative considered: duplicate UI components in each app. That would move faster for the first screen but would make design-system consistency and accessibility harder to maintain.

### Decision: Put API contracts in `packages/contracts`

`packages/contracts` should own OpenAPI specs, generated TypeScript clients, and shared schemas. REST remains the default contract style; WebSockets are allowed for live workflows; GraphQL is deferred until a later proposal proves it adds value.

Alternative considered: generate clients independently inside each frontend app. That would couple each app to API contract generation details and increase drift risk.

## Risks / Trade-offs

- Reserved service directories may imply premature microservice work -> The capability explicitly requires later proposals before activating each service.
- Shared UI may become too broad -> `packages/ui` owns reusable components only; app workflows remain in `apps/web` and `apps/admin`.
- Contracts package could blur frontend/backend ownership -> `packages/contracts` owns schemas and generated clients, while endpoint behavior remains with API capability proposals.
- Gateway may remain unused -> This is acceptable; the spec treats it as optional and deferred.

## Migration Plan

1. Review and accept this OpenSpec proposal.
2. Apply the change by updating baseline specs and README guidance as needed.
3. Create follow-up implementation proposals for frontend workspace scaffolding, Spring Boot API scaffolding, shared contracts, and local infrastructure.
4. Keep `services/*` and `apps/gateway` empty until later proposals activate them.

Rollback is simple while this remains a proposal: remove the change directory. After archive, revert the archive commit if the structure contract needs to be removed.

## Open Questions

- Should `apps/worker` initially be a Spring Boot application, a JVM module launched separately, or a later implementation detail under `apps/api` until asynchronous workload needs are clearer?
- Should shared Java modules live under `packages/`, a future `libs/`, or inside `apps/api` until concrete reuse exists?
- Should `packages/contracts` initially store hand-authored OpenAPI files, generated clients, or both in separate subdirectories?
