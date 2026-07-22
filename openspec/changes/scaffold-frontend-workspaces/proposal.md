## Why

The accepted product and architecture specs now define the learner loop, admin content operations, content health, AI mentor guardrails, visual design, and monorepo boundaries. The repository still only contains placeholder frontend directories. Before generating React code, the frontend scaffold needs an accepted plan for workspace layout, strict TypeScript, shared UI ownership, ShadCN/Tailwind conventions, and verification commands.

This proposal turns the approved frontend monorepo shape into a concrete scaffolding target while keeping implementation details reviewable before files are generated.

## What Changes

- Define `apps/web` as the learner-facing React workspace using Vite, strict TypeScript, Tailwind CSS, ShadCN-compatible components, and app-owned routes/screens.
- Define `apps/admin` as the admin/instructor React workspace using the same frontend stack and admin-owned routes/screens.
- Define `packages/ui` as the shared Academy component package for ShadCN-wrapped primitives, design tokens, accessibility behavior, and reusable variants.
- Define `packages/tsconfig` as the shared strict TypeScript configuration package.
- Define `packages/eslint-config` as the shared lint configuration package.
- Define root and workspace scripts for dev, build, lint, typecheck, test/check, and formatting where applicable.
- Define route/layout, styling, dependency, and placeholder replacement boundaries for frontend implementation.

## Capabilities

### New Capabilities

- `academy-frontend-workspaces`: Frontend workspace scaffolding for learner/admin React apps and shared frontend packages.

### Modified Capabilities

- `academy-monorepo-structure`: Adds concrete frontend scaffolding expectations under the accepted app/package boundaries.
- `academy-design-system-components`: Clarifies package ownership for shared ShadCN-based components.
- `academy-visual-design`: Clarifies that scaffolded Tailwind/theme configuration must preserve accepted visual design tokens and constraints.
- `academy-shell`: Clarifies that learner app routing/layout scaffolding must support the accepted shell boundaries.
- `academy-mvp-scope`: Recognizes frontend workspace scaffolding as the next implementation step after accepted product boundary proposals.

## Impact

- Affects future file creation under `apps/web`, `apps/admin`, `packages/ui`, `packages/tsconfig`, and `packages/eslint-config`.
- Affects root `package.json`, workspace package manifests, TypeScript configs, ESLint configs, Tailwind/PostCSS configs, Vite configs, and README guidance in a later apply/implementation step.
- Does not implement backend APIs, generated API clients, authentication integration, persistence, live AI, code execution, or production deployment.
- Leaves `apps/api`, `apps/worker`, `apps/gateway`, `packages/contracts`, `services/*`, and `infra/*` implementation to later proposals.
