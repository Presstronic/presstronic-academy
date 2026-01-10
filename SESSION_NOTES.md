# Session notes - rename to Presstronic Academy

Context

- User wants to rename the project to "Presstronic Academy".
- Goal: rename repo, update docs, UI copy, package names, docker names, and other identifiers.

Proposed approach (from prior session)

- Rename the GitHub repository first (Settings -> Repository name), then update remote URLs and badges.
- Rename the local folder and update the `origin` remote URL.
- Replace branding in docs/UI and technical identifiers (e.g., `presstronic-academy`, `@presstronic/*`, docker container names, S3 bucket defaults, badges).
- Decide whether to rename legacy asset filenames like `docs/presstronic-academy-*.png`.

Known matches that likely need updates

- Package/workspace names and filters:
  - `package.json` (root name: `presstronic-academy`)
  - `apps/backend/package.json` (`@presstronic/backend`)
  - `apps/frontend/package.json` (`@presstronic/frontend`)
  - `packages/shared/package.json` (`@presstronic/shared`)
  - `pnpm-workspace.yaml`, `tsconfig` path mappings, Dockerfile pnpm filters
- Docker/dev infra:
  - `docker-compose.yml`, `docker-compose.dev.yml` (container names, volumes, `S3_BUCKET_NAME` default)
  - `apps/backend/.env.example` (`S3_BUCKET_NAME=presstronic-academy`)
  - `scripts/ensure-infra.sh`, `scripts/docker-dev.sh`
- Docs/UI and tests:
  - `README.md`, `docs/*.md`, `apps/frontend/README.md`
  - `apps/frontend/src/pages/*` and related tests
  - `LICENSE.md`
- Misc:
  - `tools/license-header*.txt` references "Presstronic Academy"
  - `eslint.config.js` name labels
  - `apps/backend/src/main.ts` (OpenAPI title/description)
  - `apps/backend/src/common/services/storage/s3-storage.service.ts` default bucket name
  - Images under `docs/` named `presstronic-academy-*.png`

Open questions to resolve before applying the rename

1. NPM scope: should packages become `@presstronic/*` or another scope?
2. Docker/S3 naming: rename container names and S3 bucket defaults to `presstronic-academy`?
3. Assets: rename docs image filenames or leave them as-is?

Notes

- The repository root now appears to be `/Users/demian/Documents/development/product-project/presstronic-academy`.
