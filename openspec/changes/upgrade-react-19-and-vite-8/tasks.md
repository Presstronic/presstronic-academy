## 1. Node Pin

- [ ] 1.1 Add `.nvmrc` containing `24` and root `package.json` `engines.node` `>=24 <25`; verify `nvm use` selects Node 24 and `pnpm install` on Node 24 succeeds.

## 2. Dependency Upgrade

- [ ] 2.1 Record `vite build` output sizes for both apps on the current versions as a baseline.
- [ ] 2.2 Bump `react` and `react-dom` to the latest React 19 release in `apps/web` and `apps/admin`, and `@types/react` / `@types/react-dom` to 19 in `apps/web`, `apps/admin`, and `packages/ui`; verify `pnpm why react` resolves a single 19.x version.
- [ ] 2.3 Bump `vite` to the latest 8.x and `@vitejs/plugin-react` to the latest 6.x in both apps; verify `pnpm why vite` resolves a single 8.x version.
- [ ] 2.4 Narrow `packages/ui` `peerDependencies` to `react: ^19.0.0` and `react-dom: ^19.0.0`; verify `pnpm install` finishes with no peer-dependency warnings.

## 3. Code and Config Updates

- [ ] 3.1 Update `apps/*/vite.config.ts` for any Vite 8 or plugin-react 6 config changes, keeping ports 5175 (web) and 5174 (admin); verify `pnpm dev` starts both apps on those ports.
- [ ] 3.2 Confirm Tailwind 3 still runs through `postcss.config.js` under Vite 8; verify Academy tokens (for example `bg-graphite-950`, `text-cyan-100`) render in both apps.
- [ ] 3.3 Change `ButtonProps` in `packages/ui/src/components/button.tsx` to `ComponentProps<"button">` plus `variant`, and apply the same pattern to other components that wrap a DOM element; verify a typecheck-only usage passing `ref={useRef<HTMLButtonElement>(null)}` compiles.
- [ ] 3.4 Fix any type errors from the React 19 types (global `JSX` → `React.JSX`, `useRef` requires an argument, `ReactElement` props are `unknown`); verify `pnpm typecheck` passes.

## 4. Documentation

- [ ] 4.1 Document the Node 24 requirement and `nvm use` in the root `README.md` and both app READMEs; verify the documented commands work.
- [ ] 4.2 Document in `packages/ui/README.md` that shared components target React 19 and pass `ref` as a prop instead of using `forwardRef`.

## 5. Verification

- [ ] 5.1 Run `pnpm check` and `pnpm build`; verify both pass with no new warnings from project code, and compare build output sizes against the 2.1 baseline (explain any change over 10%).
- [ ] 5.2 Run `pnpm dev` and each app's `preview` script; verify both scaffold screens render with no console errors or warnings.
- [ ] 5.3 Run `openspec validate upgrade-react-19-and-vite-8 --strict` and `openspec validate --all`; verify no errors.
- [ ] 5.4 Run `git diff --check`.
