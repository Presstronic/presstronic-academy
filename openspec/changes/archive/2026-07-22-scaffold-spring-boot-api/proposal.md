## Why

Presstronic Academy needs the primary backend application boundary established before shared API contracts, local infrastructure wiring, and feature-specific API work can be implemented coherently. The monorepo already defines `apps/api` as the Spring Boot home for REST APIs, WebSocket workflows, authentication integration, and core backend orchestration, so the next step is to specify that scaffold without prematurely implementing product behavior.

## What Changes

- Define a new `academy-spring-boot-api` capability for the primary backend scaffold under `apps/api`.
- Specify Spring Boot and Gradle Kotlin DSL scaffold expectations, including source layout, test layout, strict build verification, local profile conventions, and health/readiness behavior.
- Establish REST-first and WebSocket-ready boundaries while deferring concrete product endpoints, GraphQL, generated clients, persistence schemas, and infrastructure activation.
- Update monorepo structure requirements so `apps/api` can become an active backend workspace while `apps/worker`, `apps/gateway`, `packages/contracts`, `services/*`, and infrastructure areas remain placeholder or separately proposed.
- Update MVP scope requirements so backend scaffolding is recognized as the next foundation after frontend workspace scaffolding, without implementing learner/admin workflows.

## Capabilities

### New Capabilities

- `academy-spring-boot-api`: Primary Spring Boot API scaffold, build/test conventions, local runtime profile, health/readiness surfaces, REST/WebSocket readiness, and backend dependency boundaries.

### Modified Capabilities

- `academy-monorepo-structure`: Adds the backend scaffold activation boundary for `apps/api` and keeps worker, gateway, service, contract, and infrastructure areas separate.
- `academy-mvp-scope`: Adds the MVP sequencing boundary for Spring Boot API scaffolding after frontend workspace scaffolding and before feature-specific backend API implementation.

## Impact

- Affected future code areas: `apps/api`, root build/workspace metadata as needed, backend test configuration, local runtime configuration, and project documentation.
- Affected future systems: Spring Boot application runtime, health/readiness checks, REST controller conventions, WebSocket configuration readiness, and local development profile conventions.
- Explicitly deferred: production learner/admin APIs, authentication implementation, database schemas and migrations, generated API contracts, worker jobs, gateway behavior, microservice extraction, Docker Compose service wiring, and GraphQL.
