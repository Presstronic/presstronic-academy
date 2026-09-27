## 1. Repository Settings

- [ ] 1.1 Ask a repository admin to enable Dependabot alerts and Dependabot security updates, and to create the labels `dependencies`, `frontend`, `backend`, `ci`, and `infra`; verify they appear under Settings → Code security and Issues → Labels.

## 2. Configuration

- [ ] 2.1 Create `.github/dependabot.yml` (version 2) with entries for `npm` at `/`, `gradle` at `/apps/api`, `github-actions` at `/`, and `docker-compose` at `/infra/compose`, each on a weekly Monday schedule with `open-pull-requests-limit: 5`, `commit-message.prefix: chore(deps)`, and the labels from design decision #3; verify GitHub's Dependabot tab parses the file without errors.
- [ ] 2.2 Add a `groups` rule per ecosystem collecting `minor` and `patch` updates, and an `ignore` rule for `version-update:semver-major` on every ecosystem except `github-actions`; verify the first run opens at most one grouped PR per ecosystem and no major-version PRs for npm, Gradle, or Docker Compose.
- [ ] 2.3 Confirm the Gradle entry updates the `org.springframework.boot` plugin and the Gradle wrapper, and that the Actions entry updates SHA-pinned references with their version comments; verify against the first run's PRs (or Dependabot's dry-run log).

## 3. Documentation

- [ ] 3.1 Document in the root `README.md` how update PRs are grouped, that majors go through OpenSpec, the weekly triage of security alerts whose fix needs a major, and the monthly check of ignored majors; verify the README names the commands used for that check.

## 4. Verification

- [ ] 4.1 Verify the first grouped update PR runs the full required CI (`ci-status`) and can merge only when green.
- [ ] 4.2 Run `openspec validate setup-dependency-update-automation --strict` and `openspec validate --all --strict`; verify no errors.
- [ ] 4.3 Run `git diff --check`.
