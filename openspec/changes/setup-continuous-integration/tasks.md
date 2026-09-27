## 1. Tooling Pins

- [ ] 1.1 Add `@fission-ai/openspec` (current release) to root `devDependencies` and a root `openspec:validate` script running `openspec validate --all --strict`; verify `pnpm openspec:validate` passes locally.

## 2. CI Workflow

- [ ] 2.1 Create `.github/workflows/ci.yml` triggered on `pull_request` to `main` and `push` to `main`, with top-level `permissions: contents: read` and PR-scoped `concurrency` that cancels in-progress runs; verify `actionlint` reports no errors.
- [ ] 2.2 Add the `changes` job using `dorny/paths-filter` with `frontend`, `backend`, and `openspec` filters as listed in design decision #1, where workflow-file changes set all three; verify on a test branch that backend-only, frontend-only, and workflow-only commits produce the expected outputs.
- [ ] 2.3 Add the `frontend` job (`pnpm/action-setup`, `actions/setup-node` with `node-version-file: .nvmrc` and pnpm cache, `pnpm install --frozen-lockfile`, `pnpm format`, `pnpm check`, `pnpm test`, `pnpm build`); verify it passes on a frontend-only PR and fails on a deliberately broken lint rule.
- [ ] 2.4 Add the `backend` job (`actions/setup-java` Temurin 25, `gradle/actions/wrapper-validation`, `gradle/actions/setup-gradle`, `apps/api/gradlew -p apps/api build`); verify it passes on a backend-only PR and that a second run hits the Gradle cache.
- [ ] 2.5 Add the `openspec` job (pnpm install, `pnpm openspec:validate`); verify it fails on a deliberately malformed scenario header.
- [ ] 2.6 Add the `ci-status` aggregate job (`if: always()`, needs all jobs, fails on any `failure` or `cancelled` result, treats `skipped` as success); verify it passes when jobs are skipped and fails when any executed job fails.
- [ ] 2.7 Pin every third-party action to a full commit SHA with a trailing `# vX.Y.Z` comment; verify `grep -E 'uses: [^.].*@v[0-9]' .github/workflows/*.yml` returns nothing.
- [ ] 2.8 If `upgrade-spring-boot-4` or `upgrade-react-19-and-vite-8` has not merged yet, apply the fallbacks from design decision #2 and add a task comment on the relevant issue to remove them; verify CI is green on `main` either way.

## 3. Code Scanning

- [ ] 3.1 Create `.github/workflows/codeql.yml` with a `java-kotlin` (`build-mode: none`) and `javascript-typescript` matrix on PRs to `main`, pushes to `main`, and a weekly cron, with `security-events: write` only on the analyze job and SHA-pinned actions; verify the first run uploads results for both languages to the Security tab.

## 4. Merge Gate

- [ ] 4.1 After the first green run, ask a repository admin to create a `main` ruleset requiring pull requests, the `ci-status` check, and the CodeQL analysis checks, and blocking force pushes; verify a PR with a failing job cannot be merged.

## 5. Documentation and Issue Hygiene

- [ ] 5.1 Document the CI jobs, path filters, the required check, and how to reproduce each job locally in the root `README.md`; verify the local commands match the workflow steps.
- [x] 5.2 Rewrite #204 around this change, and close #202 as obsolete (the repo is a pnpm workspace with no `apps/frontend`); verify both issues link the replacement.

## 6. Verification

- [ ] 6.1 Open a PR that touches frontend, backend, and OpenSpec files; verify every job runs and `ci-status` is green.
- [ ] 6.2 Run `openspec validate setup-continuous-integration --strict` and `openspec validate --all --strict`; verify no errors.
- [ ] 6.3 Run `git diff --check`.
