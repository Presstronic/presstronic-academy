## Why

Nothing in the repository keeps dependencies current, so the API drifted to Spring Boot 3.5.3 and the frontend to React 18 and Vite 5 before anyone noticed. That required two dedicated upgrade changes. Patch and minor releases (including security fixes) should arrive continuously as small, CI-verified PRs. Major upgrades should keep going through the OpenSpec process, as the Spring Boot and React upgrades did.

## What Changes

- Add a Dependabot configuration covering:
  - the pnpm workspace (root, `apps/web`, `apps/admin`, `packages/*`)
  - the Gradle build in `apps/api`, including the Spring Boot plugin and the Gradle wrapper
  - GitHub Actions (SHA-pinned actions from `setup-continuous-integration`)
  - Docker Compose images
- Group patch and minor updates per ecosystem into one weekly PR, and open separate PRs for security updates as soon as advisories are published.
- Don't open version-update PRs for major versions of application dependencies. Major upgrades are proposed as OpenSpec changes. The exception is GitHub Actions: their major bumps are mechanical, so they get PRs.
- Label and prefix update PRs consistently (`dependencies` plus an ecosystem label, commit prefix `chore(deps)`), so they're easy to find and triage.
- Enable Dependabot security alerts and security updates in the repository settings.

## Capabilities

### New Capabilities

- `academy-dependency-updates`: How dependency updates are proposed, grouped, and verified, and which updates must go through an OpenSpec change instead of an automated PR.

### Modified Capabilities

None.

## Impact

- **Code**: New `.github/dependabot.yml`.
- **Repository settings**: Dependabot alerts and security updates are enabled, and the `dependencies`, `frontend`, `backend`, `ci`, and `infra` labels exist. This needs a repository admin.
- **Other proposals**: Depends on `setup-continuous-integration`, so every update PR is verified. It should be enabled after `upgrade-spring-boot-4` and `upgrade-react-19-and-vite-8` merge, so the first update PRs don't collide with the manual upgrades.
- **Deferred**: Auto-merge of passing patch updates. Revisit once CI has run reliably for a few weeks.
