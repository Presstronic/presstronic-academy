## Context

- Ecosystems in the repo:
  - a pnpm 9 workspace (a single `pnpm-lock.yaml` at the root covering `apps/web`, `apps/admin`, and `packages/*`)
  - Gradle Kotlin DSL in `apps/api`, with a wrapper after `upgrade-spring-boot-4`
  - GitHub Actions, SHA-pinned per `setup-continuous-integration`
  - the Compose file under `infra/compose/` (Postgres, Redis, and the local S3 store's images)
- Spring-managed library versions come from the Spring Boot BOM, so the Spring Boot plugin version is the one lever for them.
- The team's rule is that significant changes go through OpenSpec. The Spring Boot 4 and React 19 upgrades were each proposed as changes.

## Goals / Non-Goals

**Goals:**

- Patch, minor, and security updates arrive as a small number of CI-verified PRs.
- Majors never show up as surprise PRs. They go through OpenSpec.

**Non-Goals:**

- Auto-merge.
- License compliance scanning.

## Decisions

### 1. Dependabot, not Renovate

**Chosen:** Dependabot version updates and security updates via `.github/dependabot.yml`. It's built into GitHub, needs no app installation, supports pnpm workspaces, Gradle, GitHub Actions (including SHA-pinned references), and Docker Compose, and supports `groups`.

**Alternatives considered:**
- *Renovate*: Richer grouping and monorepo presets, but it needs a GitHub App installation and its own config surface. Dependabot covers our needs today.

### 2. Weekly grouped minor and patch updates, majors ignored except Actions

**Chosen:**
- Each ecosystem entry has a weekly schedule (Monday), a `groups` rule collecting `minor` and `patch` updates, and an `ignore` rule for `update-types: ["version-update:semver-major"]` on every ecosystem except `github-actions`.
- Dependabot applies `ignore` rules to security updates too. Patch and minor security fixes still open PRs right away, but a fix that exists only in a new major is suppressed. Dependabot **alerts** are separate from PRs and still fire, so a major-only fix shows up as an alert and is triaged within a week into an OpenSpec upgrade change or a documented risk acceptance.
- Entries:
  - `npm` at `/` (pnpm is detected from the lockfile)
  - `gradle` at `/apps/api`
  - `github-actions` at `/`
  - `docker-compose` at `/infra/compose`

### 3. Labels and commit messages

**Chosen:** `labels: ["dependencies", "<frontend|backend|ci|infra>"]` and `commit-message: { prefix: "chore(deps)" }`, matching the repo's conventional-commit style. `open-pull-requests-limit: 5` per ecosystem.

### 4. Enable after the manual upgrades

**Chosen:** Merge the config only after `upgrade-spring-boot-4` and `upgrade-react-19-and-vite-8`. Otherwise the first run opens minor bumps against the pre-upgrade manifests and conflicts with those branches.

## Risks / Trade-offs

- [Grouped PRs fail and hide which dependency broke] → CI logs show the failing workspace. Dependabot can split a group on request (`@dependabot recreate` after narrowing the group), and failed groups are triaged within the week.
- [A major-only security fix gets no automatic PR] → The alert still fires. Weekly alert triage is part of the README process, and the alert is the trigger for an OpenSpec change.
- [Ignoring majors lets frameworks fall behind again] → A monthly check of ignored majors (`pnpm outdated -r` for the frontend, and the Spring Boot and Gradle release pages for the backend, which has no outdated-report plugin) feeds OpenSpec proposals. This is documented in the README.
- [Floating image tags give Dependabot nothing to bump] → `setup-local-development-infrastructure` pins images to explicit tags first.

## Migration Plan

1. Merge after both upgrade changes and CI are in place.
2. The admin enables Dependabot alerts and security updates and creates the labels.
3. Rollback: delete `.github/dependabot.yml`.
