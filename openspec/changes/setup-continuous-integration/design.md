## Context

- The repo is a pnpm 9 workspace (`apps/web`, `apps/admin`, `packages/*`) plus a Gradle-built `apps/api`. Root scripts: `format`, `check` (lint and typecheck), `test`, `build`, and `api:*`.
- There is no `.github/` directory. The pre-rewrite `ci.yml` and `codeql.yml` were deleted with the old monorepo.
- `upgrade-spring-boot-4` adds `apps/api/gradlew` and Java 25. `upgrade-react-19-and-vite-8` adds `.nvmrc` (Node 24). `setup-frontend-app-foundations` adds workspace `test` scripts. The auth change adds Testcontainers.
- The OpenSpec CLI (`@fission-ai/openspec`, 1.6.0 locally) is installed globally, not in the repo. All current specs and changes pass `openspec validate --all --strict`.

## Goals / Non-Goals

**Goals:**

- Every PR is verified with the same commands contributors run locally.
- One required status check that works with path filtering.
- Least-privilege, SHA-pinned workflows.

**Non-Goals:**

- CD, deployments, image builds, or preview environments.
- Coverage gates. Add them once there's meaningful code to measure.
- End-to-end browser tests.

## Decisions

### 1. One `ci.yml` with path-filtered jobs and an aggregate status job

**Chosen:** A `changes` job uses `dorny/paths-filter` to emit `frontend`, `backend`, and `openspec` outputs:
- `frontend`: `apps/web/**`, `apps/admin/**`, `packages/**`, root `package.json`, `pnpm-lock.yaml`, `pnpm-workspace.yaml`, `.nvmrc`, `.prettierignore`
- `backend`: `apps/api/**`
- `openspec`: `openspec/**`

Changes to `.github/workflows/**` set all three. Each verification job runs `if:` its output is true. A final `ci-status` job (`if: always()`, `needs:` all jobs) fails if any needed job's result is `failure` or `cancelled`. `ci-status` is the only required check.

**Alternatives considered:**
- *Workflow-level `on.paths` filters*: A skipped workflow never reports its checks, so required checks hang as "expected" forever.
- *Separate workflows per stack*: Same required-check problem, and it duplicates setup.

### 2. Toolchains come from repository pins

**Chosen:** The frontend job uses `pnpm/action-setup` (reads `packageManager`) and `actions/setup-node` with `node-version-file: .nvmrc` and `cache: pnpm`, then runs `pnpm install --frozen-lockfile`. The backend job uses `actions/setup-java` (Temurin, Java 25), `gradle/actions/wrapper-validation`, and `gradle/actions/setup-gradle` for caching, then runs `apps/api/gradlew -p apps/api build`. GitHub-hosted `ubuntu-latest` runners include Docker, so Testcontainers works without extra services.

**Fallback until prerequisites land:** If this change merges before `upgrade-react-19-and-vite-8`, the frontend job uses `node-version: 24` inline, with a `TODO` referencing that change. If it merges before `upgrade-spring-boot-4`, the backend job is added but guarded with `if: hashFiles('apps/api/gradlew') != ''`. Both fallbacks are removed by a task once the prerequisites merge.

### 3. OpenSpec CLI as a pinned root dev dependency

**Chosen:** Add `@fission-ai/openspec` to root `devDependencies` and a root `openspec:validate` script (`openspec validate --all --strict`). The `openspec` job runs `pnpm install --frozen-lockfile` and then that script.

**Alternatives considered:**
- *`npx @fission-ai/openspec@latest` in CI*: The version isn't pinned, so a CLI release could break unrelated PRs.

### 4. CodeQL with no-build Java extraction

**Chosen:** A separate `codeql.yml` with a matrix of `java-kotlin` (`build-mode: none`) and `javascript-typescript`. It runs on PRs to `main`, pushes to `main`, and a weekly cron. `security-events: write` is granted only to the analyze job.

**Alternatives considered:**
- *Autobuild for Java*: It would need JDK 25 and the wrapper in the CodeQL job and slows every PR. No-build extraction is enough for the scaffold. Switch to `manual` if coverage turns out to be poor.

### 5. Hardening

**Chosen:** Top-level `permissions: contents: read`. Every third-party action is pinned to a full SHA with a `# vX.Y.Z` comment, and Dependabot keeps them current (`setup-dependency-update-automation`). `concurrency: { group: ci-${{ github.ref }}, cancel-in-progress: ${{ github.event_name == 'pull_request' }} }`. `pull_request` is used, never `pull_request_target`.

### 6. Branch protection via a repository ruleset

**Chosen:** A ruleset on `main` requires PRs, the `ci-status` check, and the CodeQL analysis checks, and blocks force pushes. It's applied by a repository admin after the first green run, so the check names exist when the rule is created.

## Risks / Trade-offs

- [Path filters miss a cross-cutting file and skip a needed job] → Workflow changes run everything. Review the filter lists whenever root tooling files are added.
- [Testcontainers makes backend CI slow or flaky] → Gradle build cache and container image pulls on hosted runners. Revisit if job time goes over 10 minutes.
- [Required checks block urgent fixes] → Admins can bypass the ruleset. Record any bypass in the PR.

## Migration Plan

1. Merge the workflows. Confirm the first PR run is green, with each job exercised at least once.
2. The admin creates the `main` ruleset.
3. Remove any prerequisite fallbacks once `upgrade-spring-boot-4` and `upgrade-react-19-and-vite-8` merge.
4. Rollback: delete the workflows and ruleset.
