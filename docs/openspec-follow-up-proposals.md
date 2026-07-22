# OpenSpec Follow-Up Proposals

This roadmap records the next proposal candidates after `academy-monorepo-structure`
and `academy-mvp-scope`.

## Recommended Order

1. `define-academy-code-prompts-and-deliveries` (accepted)
   - Define Code Prompts, Workspaces, Deliveries, attempts, tests/evaluation checks, basic review reports, revision flow, and learner evidence.
   - Keep hiring assessments out of MVP while preserving a compatible foundation.
   - Depends on `academy-mvp-scope`.

2. `define-academy-admin-content-management` (accepted)
   - Define admin authoring for tracks, courses, modules, lessons, challenges, Code Prompts, preview, and publish/unpublish.
   - Establish the minimum content operations needed to run the first shippable path.
   - Depends on `academy-mvp-scope`.

3. `define-academy-content-health-dashboard` (accepted)
   - Define instructor/admin visibility into stuck learners, failed attempts, prompt delivery outcomes, and content quality signals.
   - Depends on `academy-mvp-scope`.

4. `define-academy-ai-mentor-guardrails` (accepted)
   - Define no-direct-answer, hint-ladder, lesson/prompt scope, explain-don't-solve, and authored-hint fallback behavior.
   - Depends on `academy-mvp-scope`.

5. `scaffold-frontend-workspaces` (accepted)
   - Create `apps/web`, `apps/admin`, `packages/ui`, `packages/tsconfig`, and `packages/eslint-config` implementation scaffolding.
   - Establish strict TypeScript, Vite, Tailwind CSS, ShadCN, linting, formatting, and workspace scripts.
   - Depends on `academy-monorepo-structure` and should reference `academy-mvp-scope`.

6. `scaffold-spring-boot-api` (accepted)
   - Create the primary `apps/api` Spring Boot application.
   - Establish REST/WebSocket-ready backend structure, health checks, test setup, and local profile conventions.
   - Depends on `academy-monorepo-structure` and should reference `academy-mvp-scope`.

7. `setup-shared-api-contracts` (proposed)
   - Create the initial `packages/contracts` structure for OpenAPI documents, shared schemas, and generated TypeScript clients.
   - Define how frontend clients consume generated contracts.
   - Depends on `scaffold-spring-boot-api` for initial API shape or may run in parallel if using contract-first stubs.

8. `setup-local-development-infrastructure` (proposed)
   - Define Docker Compose services for PostgreSQL, Redis, S3-compatible storage, and local app wiring.
   - Establish environment file conventions without committing secrets.
   - Depends on the initial API and frontend scaffold decisions.

9. Future service activation proposals
   - `activate-code-runner-service` (proposed)
   - `activate-notifications-service` (proposed)
   - `activate-billing-service` (proposed)
   - Each service remains placeholder-only until its proposal defines deployment, data, contracts, observability, and failure behavior.

10. Future/B2B proposals
   - `define-academy-hiring-assessments` (proposed)
   - `define-academy-candidate-review-packets` (proposed)
   - `define-academy-company-prompt-libraries` (proposed)
   - These remain future/B2B until the learner Code Prompt and Delivery loop is proven.

## First Implementation Recommendation

Start with `setup-shared-api-contracts`.

Reason: `academy-spring-boot-api` will establish the primary REST/WebSocket backend scaffold. Shared API contracts should come next so frontend clients and future backend feature work can align on OpenAPI documents, shared schemas, and generated TypeScript client boundaries before product endpoints expand.

## Captured Active Changes

The remaining roadmap items are captured as OpenSpec changes:

- `setup-shared-api-contracts`
- `setup-local-development-infrastructure`
- `activate-code-runner-service`
- `activate-notifications-service`
- `activate-billing-service`
- `define-academy-hiring-assessments`
- `define-academy-candidate-review-packets`
- `define-academy-company-prompt-libraries`
