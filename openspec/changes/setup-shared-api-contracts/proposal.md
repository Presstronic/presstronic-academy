## Why

Frontend and backend scaffolds are now active, but there is still no accepted contract boundary between `apps/api`, frontend clients, and future services. Shared API contracts should be defined before feature APIs expand so REST schemas, generated clients, and validation ownership do not drift.

## What Changes

- Define `packages/contracts` as the source-owned workspace for OpenAPI documents, shared schemas, and generated TypeScript clients.
- Establish REST contract ownership between Spring Boot endpoint behavior and frontend consumption.
- Define contract generation, versioning, validation, and documentation expectations.
- Defer production learner/admin/product endpoints to focused feature proposals.
- Keep GraphQL, persistence schemas, service extraction, and external integrations out of this setup.

## Capabilities

### New Capabilities

- `academy-api-contracts`: Shared REST/OpenAPI contract source, generated frontend client boundaries, schema validation ownership, versioning, and verification.

### Modified Capabilities

- `academy-monorepo-structure`: Activates `packages/contracts` while preserving app/service ownership boundaries.
- `academy-spring-boot-api`: Clarifies how the API scaffold relates to contract documents and generated clients.

## Impact

- Affects future files under `packages/contracts`.
- Affects future backend/frontend API work by requiring contract-first or contract-synced schemas.
- May add build tooling for OpenAPI validation and TypeScript client generation in a later implementation step.
- Does not implement production product endpoints, database models, authentication flows, live WebSocket contracts, or GraphQL.
