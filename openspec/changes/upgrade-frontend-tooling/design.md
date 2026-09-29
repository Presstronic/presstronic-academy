## Context

- The root `package.json` pins `packageManager: pnpm@9.15.0`. There is no `pnpm-workspace.yaml` settings block and no `.npmrc`. `esbuild` (through Vite) has a postinstall script.
- `packages/eslint-config/frontend.js` exports `createFrontendConfig({ tsconfigRootDir })`, built with `tseslint.config(...)`. It spreads `reactHooks.configs.recommended.rules`, configures `react-refresh/only-export-components`, and ends with `eslint-config-prettier`. Every workspace consumes it.
- TypeScript is declared `^5.5.4` and resolves to 5.9.x. The latest `typescript-eslint` (8.70) declares `typescript >=4.8.4 <6.1.0`, so TypeScript 6.0 is supported and TypeScript 7 is not. `packages/tsconfig/base.json` already uses modern options (`moduleResolution: Bundler`, `module: ESNext`, `target: ES2022`, `strict`).
- Root `format` runs `pnpm -r --if-present format`, so only the five workspaces are checked. A root-wide Prettier check currently flags 280 files, nearly all of them OpenSpec markdown, design HTML, the lockfile, and tool-local directories.
- `main` is currently green for `format`, `check`, `build`, `test`, and `api:build`.

## Goals / Non-Goals

**Goals:**

- The package manager and lint and type tooling on current majors (or the newest supported by their peers), before CI hardens around them.
- Format checking that covers everything contributors hand-edit, except OpenSpec markdown, which `openspec validate` owns.

**Non-Goals:**

- TypeScript 7 (blocked by `typescript-eslint`).
- Tailwind 4 and `lucide-react` 1.x.
- Build-time React Compiler adoption. Only its lint rules are enabled here.
- Reformatting OpenSpec markdown or design mockups.

## Decisions

### 1. pnpm 12, with pnpm 11 as the fallback

**Chosen:** Pin the latest `pnpm@12.x` in `packageManager`. pnpm 12 is a Rust rewrite, declared stable, that keeps pnpm 11's commands, settings, and lockfile format. The migration is the pnpm 10 → 11 configuration change: settings move out of `package.json#pnpm` and `.npmrc` into `pnpm-workspace.yaml`. We have none today, so the only new setting is the build-script allowlist for `esbuild`, under the key pnpm's migration guide names for 12.x. If pnpm 12 hits a blocking bug, pin the latest 11.x. The configuration and lockfile are the same, so nothing else changes.

**Alternatives considered:**
- *Stay on pnpm 11*: It's more mature, but we'd need another major bump soon.
- *pnpm 10*: It already needs the build-script policy migration, and it's two majors behind.

### 2. ESLint 10 family in the shared config only

**Chosen:** Upgrade in `packages/eslint-config` and keep `createFrontendConfig` as the single consumer-facing export. Switch to each plugin's flat-config entry: `reactHooks.configs` flat recommended (v7 includes the React Compiler lint rules, which also catch unsafe patterns without adopting the compiler), `react-refresh`'s 0.5 config API, and `eslint-config-prettier/flat`. `typescript-eslint` stays on its latest 8.x, which supports ESLint 10. Workspaces keep their one-line `eslint.config.js`.

**Alternatives considered:**
- *Leave react-hooks on 5 to avoid compiler rules*: The rules flag real hook misuse and cost nothing now, while there's almost no code.

### 3. TypeScript 6.0 now, 7 gated

**Chosen:** Upgrade to TypeScript 6.0.x in every frontend workspace. Remove any option TypeScript 6 deprecates or errors on, and keep strictness unchanged. TypeScript 7 gets its own change, `upgrade-typescript-7`, gated on `typescript-eslint` supporting it.

**Alternatives considered:**
- *Jump straight to 7*: Linting would break, because `typescript-eslint` rejects 7.

### 4. Root format coverage with explicit exclusions

**Chosen:** The root `format` script runs `prettier --check .` from the root with an extended `.prettierignore`: `openspec/`, `docs/`, `pnpm-lock.yaml`, `.claude/`, `.codex/`, `.pi/`, `.idea/`, `apps/api/` (Java isn't Prettier-formatted), plus the existing build directories. The workspaces' own `format` scripts are removed, because the single root run covers them. Add a `format:write` for fixing. Files the new coverage flags (for example root JSON and YAML) are fixed in the same PR.

**Alternatives considered:**
- *Also format OpenSpec markdown*: It would rewrite 200+ spec files and risk churning the Given/When/Then layout that `openspec validate` parses. Validation already gates those files.

## Risks / Trade-offs

- [The pnpm 12 Rust rewrite has edge-case regressions] → The fallback to 11.x is a one-line change with the same lockfile format. CI catches install differences.
- [New react-hooks compiler rules flag existing code] → The scaffold is tiny. Fix the code rather than disabling rules. Any disabled rule needs a comment explaining why.
- [TypeScript 6 deprecations surface in the tsconfig or dependencies' types] → `skipLibCheck` already isolates dependency types. Fix our config and document anything deferred to the TypeScript 7 change.
- [Contributors still have pnpm 9 installed globally] → `packageManager` plus corepack enforces the version. Document `corepack enable` in the README.

## Migration Plan

1. Land before #204 (CI).
2. Contributors run `corepack enable` (or install pnpm 12), then `pnpm install`.
3. Rollback: revert the commit and lockfile.
