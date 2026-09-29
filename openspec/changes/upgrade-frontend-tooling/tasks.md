## 1. Package Manager

- [ ] 1.1 Pin the latest `pnpm@12.x` in root `packageManager`, move any pnpm settings into `pnpm-workspace.yaml`, and allow `esbuild`'s build script using the key from pnpm's current migration guide; verify `pnpm install` regenerates the lockfile and `pnpm install --frozen-lockfile` then succeeds with no blocked-script warnings.
- [ ] 1.2 Verify that `pnpm build` and `pnpm dev` still work (esbuild's binary is present) and that `pnpm peers check` reports no issues.
- [ ] 1.3 If pnpm 12 has a blocking defect, pin the latest `pnpm@11.x` instead and record the defect in this change's design; verify the same checks pass.

## 2. Lint Stack

- [ ] 2.1 In `packages/eslint-config`, upgrade `eslint` and `@eslint/js` to 10, `eslint-plugin-react-hooks` to 7, `eslint-plugin-react-refresh` to 0.5, `eslint-config-prettier` to 10, `globals` to 17, and `typescript-eslint` to the latest 8.x, and bump the `eslint` dev dependency and peer range in every workspace; verify `pnpm install` reports no peer warnings.
- [ ] 2.2 Update `frontend.js` to each plugin's flat-config entry (react-hooks flat recommended, react-refresh 0.5 API, `eslint-config-prettier/flat`), keeping the `createFrontendConfig({ tsconfigRootDir })` signature; verify `pnpm check` passes in all workspaces.
- [ ] 2.3 Fix any code the new rules flag rather than disabling rules; any rule that is disabled has an inline justification; verify `pnpm check` has no warnings from project code.

## 3. TypeScript

- [ ] 3.1 Upgrade `typescript` to the latest 6.0.x in every frontend workspace; verify `pnpm why typescript` resolves a single 6.0.x version within `typescript-eslint`'s declared peer range.
- [ ] 3.2 Remove or replace any `packages/tsconfig` options TypeScript 6 deprecates, keeping all strictness flags; verify `pnpm typecheck` passes with no deprecation diagnostics.

## 4. Formatting Coverage

- [ ] 4.1 Change root `format` to `prettier --check .` and add `format:write`, extend `.prettierignore` with `openspec/`, `docs/`, `pnpm-lock.yaml`, `.claude/`, `.codex/`, `.pi/`, `.idea/`, and `apps/api/`, and remove the per-workspace `format` scripts; verify `pnpm format` checks root config files and workspace sources.
- [ ] 4.2 Fix any files the extended coverage flags; verify `pnpm format` passes.

## 5. Documentation

- [ ] 5.1 Document `corepack enable` and pnpm 12 in the root `README.md`, and the lint and TypeScript versions in `packages/eslint-config/README.md` and `packages/tsconfig/README.md`; verify the documented commands work.

## 6. Verification

- [ ] 6.1 Run `pnpm install --frozen-lockfile`, `pnpm format`, `pnpm check`, `pnpm test`, and `pnpm build`; verify all pass.
- [ ] 6.2 Run `openspec validate upgrade-frontend-tooling --strict` and `openspec validate --all --strict`; verify no errors.
- [ ] 6.3 Run `git diff --check`.
