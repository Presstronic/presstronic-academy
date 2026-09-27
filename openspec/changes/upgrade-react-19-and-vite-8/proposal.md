## Why

`apps/web`, `apps/admin`, and `packages/ui` are on React 18.3 and Vite 5, and both have a newer current major (React 19.3 and Vite 8.3 at time of writing). The frontend is still a two-screen scaffold, so upgrading is as cheap now as it will ever be. Vite also blocks the next step: the current Vitest line (5.x) needs Vite 6.4 or newer, so the test setup in `setup-frontend-app-foundations` would otherwise start on an outdated test runner. Every library the auth and foundation work adds (router, data fetching, Testing Library, Vitest) should be picked and written against React 19 and Vite 8 from the start.

## What Changes

- **BREAKING (dependencies)**: Upgrade `react` and `react-dom` to the latest React 19 release in `apps/web` and `apps/admin`, and `@types/react` / `@types/react-dom` to 19 in all three frontend workspaces.
- **BREAKING (build)**: Upgrade `vite` to the latest 8.x release and `@vitejs/plugin-react` to 6.x in both apps. Vite 8 bundles with Rolldown and requires Node `^20.19.0 || >=22.12.0`.
- Pin the Node version for the frontend toolchain (`.nvmrc` and root `engines`) to a Node LTS line that satisfies Vite 8. `setup-continuous-integration` uses the same pin.
- Narrow `packages/ui`'s React peer range from `^18.3.1 || ^19.0.0` to `^19`, so shared components can rely on React 19 behavior (for example `ref` as a regular prop).
- Update `packages/ui` components to React 19 idioms where the types changed. `Button` takes `ComponentProps<"button">`, so a `ref` passes through without `forwardRef`.
- Fix any type or config errors surfaced by React 19 types or Vite 8 config changes.
- Leave libraries that already work with React 19 and Vite 8 at their current major (`lucide-react`, `eslint-plugin-react-hooks`, Tailwind 3 via PostCSS, TypeScript 5).
- Add a frontend platform baseline requirement to `academy-frontend-workspaces`: every frontend workspace uses one supported React major and one supported Vite major, on a pinned Node version.

## Capabilities

### New Capabilities

None.

### Modified Capabilities

- `academy-frontend-workspaces`: Add a `Frontend Platform Baseline` requirement.

## Impact

- **Code**: `apps/web` and `apps/admin` (`package.json`, `vite.config.ts`), `packages/ui` (`package.json`, `src/components/*`), root `package.json`, a new `.nvmrc`, and `pnpm-lock.yaml`.
- **Tooling**: Contributors need a Node version that satisfies the pin. The local dev ports (5175 web, 5174 admin) and the `dev`, `build`, and `preview` scripts don't change.
- **APIs**: None.
- **Other proposals**: `setup-frontend-app-foundations` depends on this change (Vitest 5 needs Vite ≥ 6.4). `setup-continuous-integration` reads the Node pin. `implement-passwordless-auth-and-oauth` frontend tasks (#207) inherit React 19 and Vite 8.
- **Deferred**: React Compiler (and the `eslint-plugin-react-hooks` 7 compiler rules), Tailwind 4, TypeScript 7, and `lucide-react` 1.x. Each is its own change if wanted.
