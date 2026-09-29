## Context

- A root `docker-compose.yml` already defines three services:
  - `postgres:17-alpine` with hard-coded `academy_user` / `academy_password` / `academy`
  - `redis:7-alpine` with AOF enabled
  - `minio/minio:latest` with `minioadmin` defaults

  All three have health checks and named volumes.
- MinIO stopped publishing community Docker images in October 2025, and its repository was archived in April 2026. `latest` won't get fixes, and fresh pulls can break without notice.
- `.gitignore` already ignores `.env` and `*.local`. There is no `.env.example`.
- The auth proposal expects Postgres on 5432 with the current credentials, Redis on 6379, and an `.env.example` it can extend. The platform and frontend foundations changes introduce `ACADEMY_*_ORIGIN` and `ACADEMY_API_PROXY_TARGET`.
- `infra/compose/`, `infra/docker/`, and `infra/scripts/` contain only READMEs.

## Goals / Non-Goals

**Goals:**

- One documented, reproducible local environment that anyone starts with one command.
- Pinned, maintained images.
- One `.env` file drives both the containers and local app wiring.

**Non-Goals:**

- Production deployment topology.
- Feature database schemas, migrations, buckets, or queues.
- Real AI, billing, email, or code execution providers.
- Running the apps themselves in Compose.

## Decisions

### Decision: Compose lives in `infra/compose/`, and a root `compose.yaml` includes it

`infra/compose/docker-compose.yml` holds the services. A root `compose.yaml` contains only `include: [infra/compose/docker-compose.yml]`, so `docker compose up -d` from the root keeps working and `infra/` owns the definition. The `env_file` and variable interpolation read the root `.env`.

Alternative considered: keep the file at the root. That's simpler, but it contradicts the accepted `infra/` ownership boundary.

### Decision: Pin images to explicit version tags

Use exact tags on the latest majors: PostgreSQL `18.x-alpine` and Redis `8.x.y-alpine`. Pick the current patch when implementing. Dependabot (`setup-dependency-update-automation`) bumps patches and minors. Future majors go through an OpenSpec change.

Alternative considered: floating major tags such as `18-alpine`. Contributors would silently end up on different patches.

### Decision: Move to PostgreSQL 18 and Redis 8 now

There's no local or production data yet, so moving up a major costs only a volume reset now. It would cost a real migration later.

- **PostgreSQL 17 → 18.** The 18 image changed its data layout: `PGDATA` is version-specific under `/var/lib/postgresql`. The named volume therefore mounts at `/var/lib/postgresql` instead of `/var/lib/postgresql/data`, and existing 17 volumes must be removed (`pnpm infra:reset`). The Testcontainers images in `implement-passwordless-auth-and-oauth` use the same major.
- **Redis 7 → 8.** The 7.x images are no longer refreshed. Redis 8 is licensed under RSALv2, SSPLv1, or AGPLv3. That doesn't matter for local development. The production engine and license (Redis 8, a managed service, or the BSD-licensed Valkey fork) is decided in the deployment proposal, and the application only uses the Redis protocol through Spring Data Redis, so any of them works.

Alternative considered: stay on PostgreSQL 17 and Redis 7.4. Both are supported, but staying back means a major upgrade soon anyway, and it runs against the platform baseline of current supported majors.

### Decision: SeaweedFS replaces MinIO for local S3

Run SeaweedFS (`chrislusf/seaweedfs`, pinned tag) in single-container `server -s3` mode, exposing the S3 API on `9000`. Credentials come from `.env`: Compose maps `ACADEMY_S3_ACCESS_KEY` / `ACADEMY_S3_SECRET_KEY` onto the container's `AWS_ACCESS_KEY_ID` / `AWS_SECRET_ACCESS_KEY`, which SeaweedFS reads directly, so no identity config file is needed. Environment-variable credentials were broken in SeaweedFS 3.97, so the pinned tag must be one where they're verified to work (task 1.3). The health check hits the S3 endpoint. It's actively maintained, Apache-2.0 licensed, and needs one container with no bootstrap commands.

Alternatives considered:
- *Garage*: Lightweight and maintained, but it needs a config file plus `garage layout assign` bootstrap before first use.
- *RustFS*: A MinIO-compatible drop-in, but a younger project.
- *LocalStack*: Heavier, and it emulates far more than we need.
- *Keep MinIO pinned to its last image*: Unmaintained, so no security fixes.

### Decision: Credentials and ports from `.env` with safe local defaults

Compose uses `${VAR:-default}` for every credential and host port. The defaults match today's values (Postgres `academy_user` / `academy_password` / `academy` on 5432, Redis 6379, S3 9000), so the auth proposal's assumptions still hold. `.env.example` lists every variable with those defaults and comments.

### Decision: The API `local` profile imports the root `.env`

`application-local.yml` adds `spring.config.import: optional:file:../../.env[.properties]`, resolved from `apps/api` (the `bootRun` working directory). An imported file doesn't get environment-variable relaxed binding, so the local profile maps each key explicitly with placeholders (for example `academy.web.origin: ${ACADEMY_WEB_ORIGIN:http://localhost:5175}`). Those placeholders resolve from `.env`, real environment variables, or the default, in that order of precedence (environment variables win). Other profiles never import `.env`.

Alternative considered: `direnv` or exporting variables manually. That adds per-contributor setup the repo can't verify.

### Decision: Root `infra:*` scripts, with reset marked destructive

`infra:up` (`docker compose up -d --wait`), `infra:down`, `infra:ps`, `infra:logs`, and `infra:reset` (`docker compose down -v`). The README marks `infra:reset` as destructive: it deletes all local data volumes. No check or CI job ever runs it.

### Resolved open questions

- Local S3 service: SeaweedFS (above).
- Database admin UI: deferred. Contributors can use `psql` via `docker compose exec postgres psql` or their own client.
- Apps in Compose: no. Compose runs dependencies only, and apps run with `pnpm dev` / `pnpm api:bootRun`.

## Risks / Trade-offs

- [SeaweedFS S3 compatibility gaps relative to AWS] → Local-only. Features that use S3 test against the S3 API subset they need, and production behavior is verified in the deployment proposal.
- [Moving the Compose file breaks muscle memory or scripts that use `-f docker-compose.yml`] → The root `compose.yaml` keeps plain `docker compose` working. Update the docs.
- [Existing local MinIO volumes are orphaned] → Document `docker volume rm presstronic-academy-minio-data`. There's no data worth keeping.
- [Reset deletes data] → Documented as destructive and never run automatically.
- [Port conflicts] → Every host port can be overridden through `.env`.

## Migration Plan

1. Merge. Contributors run `cp .env.example .env` and then `pnpm infra:up`.
2. Contributors with the old stack run `docker compose down` first and optionally remove the MinIO volume.
3. Rollback: revert. The Postgres and Redis volumes keep their names, so no data is lost.
