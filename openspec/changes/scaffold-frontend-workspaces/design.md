## Context

The repository has been reset to a monorepo skeleton with placeholder app and package directories. The accepted `academy-monorepo-structure` spec says learner frontend work belongs in `apps/web`, admin/instructor frontend work belongs in `apps/admin`, shared UI belongs in `packages/ui`, TypeScript config belongs in `packages/tsconfig`, and ESLint config belongs in `packages/eslint-config`.

The frontend scaffold should provide enough structure to start real UI work without overbuilding application behavior. It should make the first implementation branch mechanically reliable: installable packages, strict type checking, linting, build commands, Vite app shells, Tailwind/ShadCN conventions, and shared package import paths.

## Goals / Non-Goals

**Goals:**

- Define the exact frontend workspace boundaries before implementation.
- Establish strict TypeScript across frontend apps and shared packages.
- Use Vite for both React apps.
- Use Tailwind CSS and ShadCN-compatible component conventions.
- Use `packages/ui` for reusable UI primitives and Academy component wrappers.
- Use shared TSConfig and ESLint packages to keep workspace behavior consistent.
- Keep learner routes/screens in `apps/web` and admin routes/screens in `apps/admin`.
- Define practical verification commands for the scaffold.

**Non-Goals:**

- Do not implement production learner or admin workflows in this change proposal.
- Do not define final route trees, data loaders, API clients, auth integration, or state management libraries beyond scaffold needs.
- Do not implement backend APIs, contracts, database, local infrastructure, live AI, code runner, or deployment.
- Do not introduce a UI framework other than React/Vite/Tailwind/ShadCN unless a later proposal changes the stack.

## Decisions

### Decision: Use two Vite React apps

`apps/web` and `apps/admin` should be separate deployable React apps. They share configuration and UI packages, but routes, screens, and workflow state stay app-owned.

Alternative considered: one app with learner/admin route partitions. Separate apps match the accepted monorepo boundary and keep future deployment/access policies cleaner.

### Decision: Keep shared UI low-level at scaffold time

`packages/ui` should start with tokens, primitives, utilities, and a small proof component surface. It should not absorb page layouts, app routes, or domain workflows.

Alternative considered: move all UI composition into `packages/ui`. That would make the shared package too broad before the app surfaces are implemented.

### Decision: Centralize TypeScript and lint configuration

Strict TypeScript and shared lint rules should be implemented through workspace packages so both apps and future packages inherit the same defaults.

Alternative considered: duplicate config in each app. That is faster initially but makes strictness drift likely as the monorepo grows.

### Decision: Scaffold for ShadCN compatibility, not a hidden component vendor

ShadCN components are source-owned. The scaffold should support ShadCN conventions, Tailwind tokens, class utilities, and component composition without treating ShadCN as a runtime dependency boundary.

Alternative considered: wrap everything in a generic design system abstraction immediately. That adds indirection before the first real UI flows exist.

## Risks / Trade-offs

- Scaffold can sprawl into product implementation -> Keep the first implementation to buildable apps, shared config, and minimal example surfaces.
- Shared UI can become too broad -> Keep app workflows app-owned and shared package reusable.
- Strict TypeScript can slow setup if configs are too clever -> Prefer clear configs and explicit workspace references.
- Tailwind/ShadCN setup can diverge between apps -> Share theme tokens and conventions through `packages/ui` plus documented app config.

## Migration Plan

1. Accept this proposal.
2. Apply the `academy-frontend-workspaces` baseline spec and related boundary deltas.
3. Implement the scaffold in a follow-up code PR that creates package manifests, configs, minimal app entry points, and verification scripts.
4. After frontend scaffolding is implemented and archived, continue with Spring Boot API scaffolding or shared API contracts based on dependency order.

## Open Questions

- Should the first scaffold use Vitest from day one, or only typecheck/lint/build until components gain behavior?
- Should routing start with React Router immediately, or remain implementation-defined until first screen work?
- Should `packages/ui` own Tailwind preset/config directly, or expose CSS/tokens consumed by app-level Tailwind configs?
- Should Storybook be deferred until reusable UI components are more mature?
