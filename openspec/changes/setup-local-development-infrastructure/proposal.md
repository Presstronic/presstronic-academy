## Why

The app and API scaffolds are active, but local infrastructure isn't settled. A root `docker-compose.yml` already runs PostgreSQL, Redis, and MinIO, but it has problems:

- It isn't owned by `infra/`.
- It uses unpinned or floating image tags.
- It hard-codes credentials.
- It has no environment template.
- It depends on `minio/minio:latest`, which is no longer maintained: MinIO stopped publishing community images in October 2025 and archived the project in April 2026.

The auth change (#205) and every persistence-bearing feature after it need a predictable, documented local environment first.

## What Changes

- Move the Compose definition to `infra/compose/`, with a root `compose.yaml` that includes it, so `docker compose up` keeps working from the repo root.
- Pin every local service image to an explicit version tag (PostgreSQL 17, Redis 7.4).
- **BREAKING (local only)**: Replace MinIO with SeaweedFS's S3 gateway as the local S3-compatible store. It uses the same default port (9000) and credentials come from the environment. Existing local MinIO volumes are discarded.
- Add a root `.env.example` listing every variable used by the Compose services and local app wiring: service credentials and ports, API origins (`ACADEMY_WEB_ORIGIN`, `ACADEMY_ADMIN_ORIGIN`, `ACADEMY_API_ORIGIN`), and the frontend proxy target (`ACADEMY_API_PROXY_TARGET`). Real `.env` files stay ignored.
- Have the API's `local` profile import the root `.env` as optional properties, so local wiring is in one file.
- Add root `infra:up`, `infra:down`, `infra:ps`, `infra:logs`, and `infra:reset` scripts. `infra:reset` is documented as destructive.
- Keep production deployment, cloud provisioning, CI environments, and feature schemas out of scope.

## Capabilities

### New Capabilities

- `academy-local-development-infrastructure`: Local Docker Compose services, environment conventions, service health, reset behavior, and app wiring boundaries.

### Modified Capabilities

- `academy-monorepo-structure`: Activates local infrastructure assets under `infra/` without implying production deployment.
- `academy-spring-boot-api`: Clarifies how the API may consume local infrastructure configuration after the local environment is accepted.

## Impact

- **Files**: `infra/compose/docker-compose.yml` (moved from root), new root `compose.yaml`, `.env.example`, `infra/compose/README.md`, root `package.json` scripts, `apps/api/src/main/resources/application-local.yml`, and root and API READMEs.
- **Other proposals**: `implement-passwordless-auth-and-oauth` adds its auth keys to this `.env.example`. `setup-api-platform-foundations` and `setup-frontend-app-foundations` read the origin and proxy variables. `setup-dependency-update-automation` bumps the pinned image tags.
- Does not implement database schemas, migrations, production secrets, cloud infrastructure, bucket layouts, or feature-specific integrations.
