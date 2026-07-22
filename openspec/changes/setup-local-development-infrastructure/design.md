## Context

PostgreSQL, Redis, and S3-compatible storage are expected infrastructure for the Academy direction, but the repository has not yet activated local service wiring. Local infrastructure should be predictable before persistence-backed features and job workflows are implemented.

## Goals / Non-Goals

**Goals:**

- Define a local Docker Compose environment for core development dependencies.
- Establish `.env` template conventions without committing secrets.
- Provide documented start, stop, health, and reset commands.
- Keep app configuration explicit and local-profile scoped.

**Non-Goals:**

- Do not define production deployment topology.
- Do not create feature database schemas or migrations.
- Do not wire real AI, billing, email, or code execution providers.
- Do not activate independent services beyond local dependencies.

## Decisions

### Decision: Keep local infrastructure under `infra/`

`infra/` is the accepted owner for infrastructure assets. Local Compose files and bootstrap scripts should live there or be clearly referenced from there.

Alternative considered: put Compose configuration at root only. Root commands can delegate, but infrastructure ownership should stay clear.

### Decision: Use templates for environment files

Environment templates document required values while keeping developer-specific values out of git.

Alternative considered: commit working `.env` files. That risks secret leakage and makes local setup less explicit.

### Decision: Defer schema-specific setup

The local database can exist before feature schemas do. Schema migrations should arrive with persistence or feature proposals.

Alternative considered: create broad starter schemas now. That would prematurely lock data shape before product workflows are implemented.

## Risks / Trade-offs

- Compose can drift from production -> label it local-only and defer production infrastructure.
- Local reset commands can delete data -> document destructive commands clearly.
- Service ports can conflict -> document defaults and override paths.
- App wiring can imply feature readiness -> keep readiness checks limited to accepted dependencies.

## Migration Plan

1. Accept this proposal.
2. Add local infrastructure files and environment templates.
3. Document startup, shutdown, health, and reset workflows.
4. Wire API local profile only to accepted local dependencies.
5. Add verification that local config parses without requiring production secrets.

## Open Questions

- Which S3-compatible local service should be used first?
- Should local infrastructure include a database admin UI, or defer it?
- Should app processes be included in Compose, or should Compose only run dependencies?
