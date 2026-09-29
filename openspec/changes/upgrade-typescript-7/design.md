## Context

- After `upgrade-frontend-tooling`, all frontend workspaces use TypeScript 6.0.x with `typescript-eslint` 8.x, whose peer range is `typescript >=4.8.4 <6.1.0`.
- TypeScript 7.0 is the native Go port. Its `tsc` and language server are much faster. The JavaScript compiler API that `typescript-eslint`'s type-aware rules use differs from 6.x, which is why lint support lags.
- The shared lint config uses `tseslint.configs.recommendedTypeChecked`, so type information is required for linting.

## Goals / Non-Goals

**Goals:**

- Adopt TypeScript 7 as soon as the lint, build, and test stack supports it, without dropping type-aware linting.

**Non-Goals:**

- Dropping type-aware lint rules to unblock TypeScript 7 early.
- Running two TypeScript versions side by side long term.

## Decisions

### 1. Gate on `typescript-eslint`, not on the calendar

**Chosen:** Start only when a released `typescript-eslint` includes TypeScript 7 in its peer range. The monthly ignored-majors check from `setup-dependency-update-automation` checks this with `npm view typescript-eslint peerDependencies`.

**Alternatives considered:**
- *Use TypeScript 7 for `tsc --noEmit` and keep TypeScript 6 for ESLint*: It's faster, but the two compilers can disagree on types and it doubles version management. Revisit only if lint support stalls for months.
- *Drop `recommendedTypeChecked`*: It loses the rules that catch floating promises and unsafe `any`, which matter most in the auth code.

### 2. Keep strictness identical

**Chosen:** Keep every `packages/tsconfig` strictness flag. Replace any option TypeScript 7 removes with its documented equivalent.

## Risks / Trade-offs

- [Lint support takes a long time] → We stay on TypeScript 6.0, which is supported. The cost is slower type checking, not correctness.
- [Editor and CI differ on TypeScript versions] → Document "use workspace version" for VS Code and JetBrains when this change lands.

## Migration Plan

1. The monthly check finds the entry criteria met, and this change is scheduled into a sprint.
2. Rollback: revert the version bumps.
