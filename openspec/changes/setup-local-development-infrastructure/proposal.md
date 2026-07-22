## Why

The app and API scaffolds are active, but local infrastructure remains placeholder-only. Before persistence, Redis-backed workflows, object storage, or integration-heavy features are implemented, contributors need an accepted local environment contract.

## What Changes

- Define local development infrastructure for PostgreSQL, Redis, S3-compatible storage, and app wiring.
- Establish environment file conventions without committing secrets.
- Define health, readiness, reset, and documentation expectations for local services.
- Keep production deployment, cloud provisioning, CI environments, and feature persistence schemas out of scope.

## Capabilities

### New Capabilities

- `academy-local-development-infrastructure`: Local Docker Compose services, environment conventions, service health, reset behavior, and app wiring boundaries.

### Modified Capabilities

- `academy-monorepo-structure`: Activates local infrastructure assets under `infra/` without implying production deployment.
- `academy-spring-boot-api`: Clarifies how the API may consume local infrastructure configuration after the local environment is accepted.

## Impact

- Affects future files under `infra/`, root documentation, `.env` templates, and local app configuration.
- May affect `apps/api` local profile conventions and root scripts.
- Does not implement database schemas, migrations, production secrets, cloud infrastructure, or feature-specific service integrations.
