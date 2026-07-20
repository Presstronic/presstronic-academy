## Why

Presstronic Academy has been reset around a planned monorepo, but the repository structure is currently documented only by placeholder directories and README notes. Before scaffolding React, Spring Boot, contracts, services, or infrastructure, the project needs an authoritative OpenSpec capability that defines which top-level areas own which responsibilities and which areas are intentionally deferred.

## What Changes

- Add a new `academy-monorepo-structure` capability that defines the repository ownership model for deployable applications, shared packages, independently deployable services, infrastructure, docs, and OpenSpec artifacts.
- Specify `apps/web` and `apps/admin` as React, strict TypeScript, Vite, Tailwind CSS, and ShadCN applications.
- Specify `apps/api` as the primary Spring Boot REST and WebSocket backend.
- Specify `apps/worker` as the background job and orchestration application.
- Keep `apps/gateway` optional and deferred until a concrete edge, routing, or aggregation concern exists.
- Specify `packages/contracts`, `packages/ui`, `packages/eslint-config`, and `packages/tsconfig` as shared workspace packages with clear ownership.
- Reserve `services/code-runner`, `services/notifications`, and `services/billing` for independently deployable services only after later proposals justify each split.
- Make REST the primary API style, allow WebSockets for live workflows, and defer GraphQL until a later proposal proves a clear need.

## Capabilities

### New Capabilities

- `academy-monorepo-structure`: Repository structure, workspace ownership, application boundaries, shared package boundaries, service maturity rules, and API style defaults.

### Modified Capabilities

- None.

## Impact

- Affects future repository scaffolding under `apps/`, `packages/`, `services/`, and `infra/`.
- Establishes planning constraints for React frontend, admin, Spring Boot backend, shared UI, contracts, and future service work.
- Does not create or modify application implementation code in this proposal.
- Does not decide final service extraction timing, deployment topology, database schemas, API endpoints, or UI implementation details.
