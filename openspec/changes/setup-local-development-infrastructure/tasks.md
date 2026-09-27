## 1. Local Service Definition

- [ ] 1.1 Move `docker-compose.yml` to `infra/compose/docker-compose.yml` and add a root `compose.yaml` that only `include`s it; verify `docker compose config` from the repo root renders all services.
- [ ] 1.2 Pin PostgreSQL to the current `17.x-alpine` tag and Redis to the current `7.4.x-alpine` tag, keep the existing container names, volume names, and health checks, and read credentials and host ports from `${VAR:-default}` with today's values as defaults; verify `docker compose up -d --wait` reports both healthy.
- [ ] 1.3 Replace the MinIO service with SeaweedFS (`chrislusf/seaweedfs`, pinned tag) in `server -s3` mode on host port `9000`, with S3 credentials mapped from `ACADEMY_S3_ACCESS_KEY` / `ACADEMY_S3_SECRET_KEY` to the container's `AWS_ACCESS_KEY_ID` / `AWS_SECRET_ACCESS_KEY` (pick a tag where environment credentials work; 3.97 had a regression), a named volume, and an S3 health check; verify with `aws s3 --endpoint-url http://localhost:9000 mb s3://smoke` and `ls` using the `.env` credentials, then remove the bucket.
- [ ] 1.4 Keep provider-specific production integrations absent; verify no production hostnames or credentials appear under `infra/`.

## 2. Environment and Documentation

- [ ] 2.1 Add root `.env.example` with every Compose variable (Postgres user, password, database, and port; Redis port; S3 access key, secret key, and port) and local app variables (`ACADEMY_WEB_ORIGIN=http://localhost:5175`, `ACADEMY_ADMIN_ORIGIN=http://localhost:5174`, `ACADEMY_API_ORIGIN=http://localhost:8080`, `ACADEMY_API_PROXY_TARGET=http://localhost:8080`), each commented; verify `.env` is still ignored and `cp .env.example .env && docker compose config` succeeds.
- [ ] 2.2 Add root scripts `infra:up` (`docker compose up -d --wait`), `infra:down`, `infra:ps`, `infra:logs`, and `infra:reset` (`docker compose down -v`); verify each runs from the repo root.
- [ ] 2.3 Write `infra/compose/README.md` documenting each service's purpose, port, credentials source, health check, and override variables, and mark `infra:reset` as destructive; link it from the root `README.md`.
- [ ] 2.4 Document migrating from the old MinIO stack (`docker compose down`, optional `docker volume rm presstronic-academy-minio-data`).

## 3. App Wiring Boundaries

- [ ] 3.1 Add `spring.config.import: optional:file:../../.env[.properties]` to `apps/api/src/main/resources/application-local.yml` only, and map each `ACADEMY_*` key the API reads with an explicit placeholder and local default (for example `academy.web.origin: ${ACADEMY_WEB_ORIGIN:http://localhost:5175}`); verify `pnpm api:bootRun` with and without a root `.env` starts, and a value set in `.env` (for example `ACADEMY_WEB_ORIGIN`) is visible to the app.
- [ ] 3.2 Avoid adding feature schemas, migrations, buckets, queues, or object layouts; verify the diff contains none.
- [ ] 3.3 Keep frontend apps independent of local infrastructure except through the API and the documented proxy target.

## 4. Verification

- [ ] 4.1 Run `docker compose config` and `pnpm infra:up`; verify all services report healthy.
- [ ] 4.2 Run `pnpm api:build`; verify the tests still pass.
- [ ] 4.3 Run `openspec validate setup-local-development-infrastructure --strict`.
- [ ] 4.4 Run `openspec validate --all --strict`.
- [ ] 4.5 Run `git diff --check`.
