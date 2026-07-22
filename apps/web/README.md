# Web App

Learner-facing React application for Presstronic Academy.

## Scope

`apps/web` owns public learner entry surfaces and authenticated learner app-shell routes. Shared reusable primitives come from `@presstronic-academy/ui`; backend clients, auth integration, and production learner workflows remain deferred until focused proposals accept them.

## Commands

- `pnpm --filter @presstronic-academy/web dev` starts Vite on port `5175`.
- `pnpm --filter @presstronic-academy/web build`
- `pnpm --filter @presstronic-academy/web lint`
- `pnpm --filter @presstronic-academy/web typecheck`
- `pnpm --filter @presstronic-academy/web check`
