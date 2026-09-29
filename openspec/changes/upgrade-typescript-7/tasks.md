## 1. Entry Criteria

- [ ] 1.1 Confirm a released `typescript-eslint` declares TypeScript 7 in its peer range (`npm view typescript-eslint peerDependencies`); record the version in design.md.
- [ ] 1.2 Confirm Vite, Vitest, and `@vitejs/plugin-react` work with TypeScript 7 in this repo on a spike branch; verify `pnpm build` and `pnpm test` pass there.
- [ ] 1.3 Confirm TypeScript 7 editor support in VS Code and JetBrains; document the setting that selects the workspace version.

## 2. Upgrade

- [ ] 2.1 Upgrade `typescript` to the latest 7.x in every frontend workspace and `typescript-eslint` to the first version supporting it; verify `pnpm why typescript` resolves a single 7.x version.
- [ ] 2.2 Replace any `packages/tsconfig` options or `typecheck` script flags TypeScript 7 removes, keeping every strictness flag; verify `pnpm typecheck` passes with no diagnostics.
- [ ] 2.3 Fix any new lint or type errors without disabling rules; verify `pnpm check` passes.

## 3. Documentation

- [ ] 3.1 Update `packages/tsconfig/README.md` and the root `README.md` with the TypeScript version and editor setup.

## 4. Verification

- [ ] 4.1 Run `pnpm format`, `pnpm check`, `pnpm test`, and `pnpm build`; verify all pass.
- [ ] 4.2 Run `openspec validate upgrade-typescript-7 --strict` and `openspec validate --all --strict`; verify no errors.
- [ ] 4.3 Run `git diff --check`.
