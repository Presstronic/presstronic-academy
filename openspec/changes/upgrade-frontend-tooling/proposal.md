## Why

The frontend toolchain is several majors behind, and nothing covers it. `setup-dependency-update-automation` deliberately skips majors, so without a change these would never move:

| Tool | Now | Latest |
|---|---|---|
| pnpm | 9.15 | 12.6 |
| ESLint and `@eslint/js` | 9 | 10 |
| `eslint-plugin-react-hooks` | 5 | 7 |
| `eslint-plugin-react-refresh` | 0.4 | 0.5 |
| `eslint-config-prettier` | 9 | 10 |
| `globals` | 15 | 17 |
| TypeScript | 5.9 | 6.0 (the newest `typescript-eslint` supports) |

CI (`setup-continuous-integration`) should start on the toolchain it will keep using, not on one that immediately needs a disruptive upgrade.

Separately, the root `pnpm format` command only checks the five workspace packages. Root-level config files and future `.github/` workflows are never format-checked.

## What Changes

- **BREAKING (tooling)**: Upgrade pnpm from 9.15 to the latest 12.x, pinned through `packageManager`.
  - Move any pnpm settings into `pnpm-workspace.yaml`.
  - Allow `esbuild`'s install script explicitly under pnpm's build-script policy, which pnpm 10+ enforces.
  - Regenerate the lockfile.
- **BREAKING (tooling)**: Upgrade the shared lint stack in `packages/eslint-config` to:
  - ESLint 10 and `@eslint/js` 10
  - `eslint-plugin-react-hooks` 7, using its recommended flat config, which includes the React Compiler-based lint rules
  - `eslint-plugin-react-refresh` 0.5
  - `eslint-config-prettier` 10 (its flat entry)
  - `globals` 17
  - the latest `typescript-eslint` 8.x
- **BREAKING (tooling)**: Upgrade TypeScript to 6.0 in every frontend workspace, and remove any options TypeScript 6 deprecates from `packages/tsconfig`.
- Extend format checking to root-level files (root configs, `.github/`, `infra/`) through the root `pnpm format` script. `openspec/`, `docs/`, `.claude`, `.codex`, `.pi`, the lockfile, and generated output are excluded; `openspec validate` stays the check for OpenSpec markdown.
- Add a `Frontend Toolchain Baseline` requirement to `academy-frontend-workspaces`.

## Capabilities

### New Capabilities

None.

### Modified Capabilities

- `academy-frontend-workspaces`: Add a `Frontend Toolchain Baseline` requirement covering the package manager, lint, type-checking, and formatting toolchain.

## Impact

- **Code**: root `package.json` (`packageManager`, `format` script), `pnpm-workspace.yaml`, `pnpm-lock.yaml`, `.prettierignore`, `packages/eslint-config` (`package.json`, `frontend.js`), `packages/tsconfig/*.json`, and each workspace's `typescript` dev dependency. Any lint or type fixes the new rules surface.
- **Tooling**: Contributors need pnpm 12. `corepack` or `npm i -g pnpm@12` works, and CI reads `packageManager`. pnpm 12 needs Node ≥ 18, which the Node 24 pin satisfies.
- **Other proposals**: Land before `setup-continuous-integration` (#204), so the CI frontend job starts on pnpm 12 and the extended `format` script. It's independent of `upgrade-react-19-and-vite-8`, and either can go first. `upgrade-typescript-7` follows once `typescript-eslint` supports TypeScript 7.
- **Deferred**: TypeScript 7 (`upgrade-typescript-7`), Tailwind 4 and `lucide-react` 1.x (`upgrade-tailwind-4`), and React Compiler adoption at build time.
