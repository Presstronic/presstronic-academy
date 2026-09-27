## Why

The repository has no CI. Pull requests merge without an automated build, test, lint, typecheck, format, or OpenSpec validation, and the upgrades and foundations lined up next (`upgrade-spring-boot-4`, `upgrade-react-19-and-vite-8`, the API and frontend foundations, then auth) are exactly the kind of change that breaks things quietly. Issue #204 was meant to restore CI, but it describes a removed layout (`apps/backend`, `apps/frontend`, npm) and depends on #202, which is obsolete now that the repo is a pnpm workspace.

## What Changes

- Add a GitHub Actions `ci.yml` that runs on pull requests and pushes to `main`:
  - a change-detection job, so backend-only changes skip frontend jobs and vice versa
  - a **frontend** job: pinned Node from `.nvmrc`, pnpm from `packageManager`, frozen-lockfile install, then `pnpm format`, `pnpm check`, `pnpm test`, `pnpm build`
  - a **backend** job: Java 25, Gradle wrapper validation, Gradle cache, then `apps/api/gradlew -p apps/api build`, with Docker available for Testcontainers
  - an **openspec** job: `openspec validate --all --strict`
  - a single **CI status** job that aggregates the others, so branch protection needs only one check even when path-filtered jobs are skipped
- Add a CodeQL workflow for `java-kotlin` and `javascript-typescript` on pull requests, pushes to `main`, and a weekly schedule.
- Harden the workflows: read-only default token permissions, third-party actions pinned to full commit SHAs, and cancellation of superseded runs on the same PR.
- Pin the OpenSpec CLI as a root dev dependency so CI and contributors run the same version.
- Require the CI status and CodeQL checks on `main` through a repository ruleset.
- Rewrite #204 around this change, and close #202 as obsolete.

## Capabilities

### New Capabilities

- `academy-continuous-integration`: Automated pull-request verification: which checks run, when they run, what must pass before merge, and how the workflows are secured.

### Modified Capabilities

None.

## Impact

- **Code**: New `.github/workflows/ci.yml` and `.github/workflows/codeql.yml`. Root `package.json` gains `@fission-ai/openspec` as a dev dependency and an `openspec:validate` script.
- **Repository settings**: A ruleset on `main` requiring the CI status and CodeQL checks. This needs a repository admin.
- **Other proposals**: The backend job depends on `upgrade-spring-boot-4` (wrapper and Java 25). The frontend job reads the `.nvmrc` pin added by `upgrade-react-19-and-vite-8`. Until those land, the jobs use the documented fallback in design.md. `setup-dependency-update-automation` relies on this CI to check update PRs.
- **Deferred**: Deployment and CD, container image builds, end-to-end browser tests, coverage thresholds, and release automation.
