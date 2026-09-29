## Why

TypeScript 7 is the native (Go) rewrite of the compiler. It promises much faster type checking and editor responsiveness, and it's the current major. We can't adopt it yet: the latest `typescript-eslint` (8.70) declares support only for `typescript >=4.8.4 <6.1.0`, so every type-aware lint rule in `packages/eslint-config` would break. `upgrade-frontend-tooling` moves the repo to TypeScript 6.0, the newest version the lint stack supports. This change records the TypeScript 7 upgrade and its entry criteria, so it isn't forgotten while Dependabot skips majors.

## What Changes

- **Entry criteria.** Don't start until all of these hold:
  - A released `typescript-eslint` version declares TypeScript 7 in its peer range.
  - Vite's and Vitest's TypeScript handling works with TypeScript 7 in this repo.
  - Editor support (the TypeScript 7 language server in VS Code and JetBrains) is available to contributors.
- **BREAKING (tooling)**: Once the criteria are met, upgrade `typescript` to 7.x in every frontend workspace and `typescript-eslint` to the first version supporting it.
- Replace any `tsc`-specific scripts or options TypeScript 7 drops, keeping every strictness flag.
- Add a `Type Checking Toolchain Compatibility` requirement to `academy-frontend-workspaces`, so the type checker is never upgraded past what the lint parser supports.

## Capabilities

### New Capabilities

None.

### Modified Capabilities

- `academy-frontend-workspaces`: Add a `Type Checking Toolchain Compatibility` requirement.

## Impact

- **Code**: `typescript` and `typescript-eslint` versions in all frontend workspaces and `packages/eslint-config`, `packages/tsconfig` options, and `typecheck` scripts if the compiler binary or flags change.
- **Tooling**: Contributors' editors must use the workspace TypeScript version.
- **Other proposals**: Follows `upgrade-frontend-tooling`. Not scheduled. A monthly check of ignored majors (`setup-dependency-update-automation`) re-evaluates the entry criteria.
- **Deferred**: Nothing beyond the entry criteria. If they're met, this change is small.
