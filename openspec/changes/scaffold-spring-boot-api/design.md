## Context

The repository currently has placeholder application and package directories plus accepted OpenSpec boundaries for frontend workspaces, monorepo structure, MVP scope, Code Prompts/Deliveries, admin content management, content health, and AI mentor guardrails. `academy-monorepo-structure` identifies `apps/api` as the primary Spring Boot backend application for REST APIs, WebSocket workflows, authentication integration, and core Academy backend orchestration before any service-specific extraction is accepted.

This change proposes the `apps/api` scaffold only. It should establish a buildable Spring Boot application foundation that later API, contract, persistence, auth, WebSocket, worker, infrastructure, and service proposals can build on.

## Goals / Non-Goals

**Goals:**

- Define the backend scaffold boundary for `apps/api` using Spring Boot and Gradle Kotlin DSL.
- Establish source, test, configuration, local profile, health/readiness, and verification expectations.
- Prepare REST-first and WebSocket-ready conventions without requiring product endpoints.
- Keep backend scaffolding aligned with accepted MVP and monorepo boundaries.
- Preserve future compatibility with `packages/contracts`, local infrastructure, worker jobs, and independently deployable services.

**Non-Goals:**

- Implement learner, admin, content, Code Prompt, Delivery, mentor, or content health API behavior.
- Define database schemas, migrations, repositories, or persistence entities.
- Generate OpenAPI clients or activate `packages/contracts`.
- Implement authentication/authorization behavior beyond preserving its future integration boundary.
- Implement worker, gateway, code-runner, notification, billing, or GraphQL behavior.
- Configure production deployment or local Docker Compose services.

## Decisions

### Use a Single Primary Spring Boot API App

`apps/api` will become the active backend application boundary before service extraction. REST controllers, WebSocket endpoints, authentication integration, and orchestration that do not yet justify separate deployment belong there.

Alternative considered: create multiple Spring Boot services immediately. That would add operational and contract complexity before the MVP learning loop proves where independent scaling or isolation is actually needed.

### Use Gradle Kotlin DSL for Backend Build Metadata

The scaffold will use Gradle Kotlin DSL for the Spring Boot application because the repository has already documented Spring Boot with Gradle Kotlin DSL as the backend direction. Root scripts may delegate to the backend build where useful, but the backend should remain understandable from `apps/api`.

Alternative considered: use Maven for the API. Maven is valid for Spring Boot, but mixing it into a repo that has selected Gradle Kotlin DSL would create unnecessary build-system divergence.

### Prefer Feature-Oriented Java Packages

The scaffold should organize future code by feature or bounded area, with shared cross-cutting support kept explicit, instead of defaulting to broad layer-only packages. Initial scaffold code can stay minimal, but documentation and package names should steer future implementation toward feature ownership.

Alternative considered: controller/service/repository top-level packages. That is familiar, but it tends to scatter feature behavior across layers and makes future OpenSpec-to-code ownership harder to trace.

### Establish Health/Readiness Before Product APIs

The scaffold should include observable health/readiness behavior so local and future deployment checks have a stable surface before product endpoints exist. This may use Spring Boot Actuator or a minimal equivalent in the implementation, but it must not imply production domain behavior.

Alternative considered: skip runtime endpoints until product APIs exist. That would make the scaffold harder to verify and harder to wire into future infrastructure work.

### Defer OpenAPI Contracts Until API Shape Exists

The scaffold should be REST-first and OpenAPI-ready, but it should not create generated clients or `packages/contracts` behavior yet. Contract scaffolding should follow once the primary API shape and local runtime conventions are established.

Alternative considered: contract-first stubs in the same change. That would blur ownership with the planned `setup-shared-api-contracts` proposal and force API design before feature-specific backend requirements are accepted.

## Risks / Trade-offs

- Framework scaffold drift -> Keep the implementation minimal, buildable, and documented; avoid placeholder product APIs that later need removal.
- Premature coupling to persistence or infrastructure -> Defer database, Redis, S3, Docker Compose, and migration behavior to focused proposals.
- WebSocket readiness mistaken for WebSocket product behavior -> Specify configuration readiness only; require later feature proposals for event contracts and lifecycle behavior.
- Backend package conventions becoming too abstract -> Use feature/domain package guidance, but let concrete feature packages emerge only when accepted product APIs are implemented.
- Root script ambiguity in a mixed frontend/backend monorepo -> Define explicit root and app-level verification commands so contributors can run backend checks without guessing.
