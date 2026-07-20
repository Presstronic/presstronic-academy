# OpenSpec Follow-Up Proposals

This roadmap records the next proposal candidates after `academy-monorepo-structure`.

## Recommended Order

1. `scaffold-frontend-workspaces`
   - Create `apps/web`, `apps/admin`, `packages/ui`, `packages/tsconfig`, and `packages/eslint-config` implementation scaffolding.
   - Establish strict TypeScript, Vite, Tailwind CSS, ShadCN, linting, formatting, and workspace scripts.
   - Depends on `academy-monorepo-structure`.

2. `scaffold-spring-boot-api`
   - Create the primary `apps/api` Spring Boot application.
   - Establish REST/WebSocket-ready backend structure, health checks, test setup, and local profile conventions.
   - Depends on `academy-monorepo-structure`.

3. `setup-shared-api-contracts`
   - Create the initial `packages/contracts` structure for OpenAPI documents, shared schemas, and generated TypeScript clients.
   - Define how frontend clients consume generated contracts.
   - Depends on `scaffold-spring-boot-api` for initial API shape or may run in parallel if using contract-first stubs.

4. `setup-local-development-infrastructure`
   - Define Docker Compose services for PostgreSQL, Redis, S3-compatible storage, and local app wiring.
   - Establish environment file conventions without committing secrets.
   - Depends on the initial API and frontend scaffold decisions.

5. Future service activation proposals
   - `activate-code-runner-service`
   - `activate-notifications-service`
   - `activate-billing-service`
   - Each service remains placeholder-only until its proposal defines deployment, data, contracts, observability, and failure behavior.

## First Implementation Recommendation

Start with `scaffold-frontend-workspaces`.

Reason: the user-facing and admin React apps, shared UI package, TypeScript configuration, and linting conventions establish the highest-volume development surface. The backend and contracts proposals can then align around the frontend contract needs without prematurely extracting services.
