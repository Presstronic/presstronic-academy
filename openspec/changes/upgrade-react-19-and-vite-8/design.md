## Context

- `apps/web` and `apps/admin` depend on `react`/`react-dom` `^18.3.1`, `@types/react` `^18.3.5`, `vite` `^5.4.2`, `@vitejs/plugin-react` `^4.3.1`, Tailwind 3 through PostCSS (`postcss.config.js` with `tailwindcss` and `autoprefixer`), and `lucide-react` 0.468. `packages/ui` declares a React peer range of `^18.3.1 || ^19.0.0`.
- Both apps already use `ReactDOM.createRoot`. There is no `forwardRef`, `defaultProps`, `propTypes`, string refs, legacy context, or `ReactDOM.render` in the codebase. `vite.config.ts` only sets the React plugin and a dev port.
- Latest stable versions: React 19.3, Vite 8.3 (Rolldown-based, Node `^20.19.0 || >=22.12.0`), and `@vitejs/plugin-react` 6.1, which peers on Vite 8. Vitest 5 peers on Vite `^6.4 || ^7 || ^8`.
- There is no Node version pin today (`.nvmrc` and `engines` are both absent). The root `package.json` pins only `packageManager: pnpm@9.15.0`.

## Goals / Non-Goals

**Goals:**

- All frontend workspaces on React 19 and Vite 8, with matching type definitions and plugin.
- A pinned Node version that satisfies Vite 8 and is shared with CI.
- Shared components written for React 19 (ref as a prop).
- No behavior change in either app.

**Non-Goals:**

- React Compiler adoption.
- Tailwind 4, TypeScript 7, `lucide-react` 1.x.
- Server Components, Actions, or `use()` adoption. Features adopt these when they need them.
- Adding a test runner (`setup-frontend-app-foundations`).

## Decisions

### 1. React 19 and Vite 8 together, nothing else

**Chosen:** Bump `react`, `react-dom`, `@types/react`, `@types/react-dom`, `vite`, and `@vitejs/plugin-react`. Leave every other dependency at its current major, because each one works with React 19 and Vite 8. Tailwind 3 keeps running through `postcss.config.js`, which Vite 8 still honors.

**Alternatives considered:**
- *React 19 only, Vite later*: The foundations change would have to start on Vitest 3.2 or wait. Vite 5's config surface is small here, so combining them costs little.
- *Also Tailwind 4, TypeScript 7, and `lucide-react` 1.x*: Each has its own migration (Tailwind 4 moves config into CSS, `lucide-react` 1.x renames icons). Bundling them makes a failure hard to bisect.

### 2. Node 24 LTS pinned in `.nvmrc` and `engines`

**Chosen:** Add `.nvmrc` with `24` and a root `engines.node` of `>=24 <25`. Node 24 is the active LTS line and satisfies Vite 8's `>=22.12.0`. CI reads `.nvmrc`, so there's one pin.

**Alternatives considered:**
- *Node 22*: It satisfies Vite 8 but moves to maintenance sooner.
- *Engines only*: `setup-node` and `nvm` both read `.nvmrc` directly.

### 3. Narrow the `packages/ui` peer range to `^19`

**Chosen:** Change the peer range to `react: ^19.0.0` and `react-dom: ^19.0.0`.

**Alternatives considered:**
- *Keep `^18.3.1 || ^19.0.0`*: That would stop shared components from using `ref` as a prop and would advertise support nobody tests.

### 4. `ComponentProps<"button">` for `Button`

**Chosen:** Type `ButtonProps` as `ComponentProps<"button">` plus `variant`, so a `ref` passes through to the DOM node. This is the React 19 replacement for `forwardRef`, and dialogs and tooltips need it for focus management.

## Risks / Trade-offs

- [Rolldown output differs from Rollup (chunking, CSS ordering)] → Compare `vite build` output sizes before and after, and smoke-test both apps with `vite preview`.
- [Contributors on Node < 22.12 can't run Vite 8] → The `.nvmrc` pin and README note, plus a clear `engines` error. Local development is already on Node 22.20.
- [Transitive packages declare React 18-only peers] → Run `pnpm install` with strict peer dependency checks. Any peer warning blocks merge until it's resolved or documented.
- [React 19 type changes break future copied ShadCN snippets] → The shared ESLint and TypeScript configs catch them. Document "use `ComponentProps`, not `forwardRef`" in `packages/ui/README.md`.

## Migration Plan

1. Land before `setup-frontend-app-foundations`.
2. Contributors switch to Node 24 (`nvm use`) and run `pnpm install`.
3. Rollback: revert the commit and lockfile.
