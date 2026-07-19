# Presstronic Academy

Presstronic Academy is a branching, story-driven software learning platform.

This repository is being reset around a monorepo structure for a React frontend,
a Java Spring Boot API, shared frontend packages, and future independently
deployable services.

## Repository Structure

```text
apps/
  web/              Learner-facing React application
  admin/            Admin and instructor React application
  api/              Primary Spring Boot REST and WebSocket API
  worker/           Background jobs and orchestration
  gateway/          Optional API gateway, if needed later

packages/
  ui/               Shared ShadCN-based React components
  contracts/        OpenAPI specs, generated clients, and shared schemas
  eslint-config/    Shared frontend lint configuration
  tsconfig/         Shared TypeScript configuration

services/
  code-runner/      Independent code execution service
  notifications/    Independent notification delivery service
  billing/          Independent billing integration service

infra/
  docker/           Docker assets
  compose/          Compose files and environment overlays
  scripts/          Infrastructure scripts

docs/               Product, architecture, and design documentation
openspec/           OpenSpec capability specifications and active changes
```

## Current Status

The current branch preserves the product documentation and specification work
while removing implementation remnants from the previous frontend/backend stack.
Application scaffolds will be added in focused follow-up changes.

## Planned Stack

- Learner web app: React, TypeScript, Vite, Tailwind CSS, ShadCN
- Admin app: React, TypeScript, Vite, Tailwind CSS, ShadCN
- Primary API: Java, Spring Boot, REST, WebSockets
- Future API contracts: OpenAPI first, with GraphQL considered only where it adds clear value
- Database: PostgreSQL
- Cache: Redis
- Object storage: S3-compatible local storage
- Local infrastructure: Docker Compose

## OpenSpec Workflow

This project uses OpenSpec for spec-driven planning. Specs live in
`openspec/specs/`, and active change proposals live in `openspec/changes/`.

Use this loop for feature and architecture work:

1. Propose the change:

   ```bash
   /opsx:propose <change-name>
   ```

   This creates a change under `openspec/changes/<change-name>/` with
   `proposal.md`, `design.md`, spec deltas, and `tasks.md`.

2. Review the proposal artifacts before implementation.

3. Apply the accepted change:

   ```bash
   /opsx:apply <change-name>
   ```

   The apply step works through `tasks.md`, updates the affected specs or code,
   and marks tasks complete as work is finished.

4. Validate before opening or updating a PR:

   ```bash
   openspec validate --all --strict
   ```

5. Archive only after the implemented change has been reviewed and accepted:

   ```bash
   /opsx:archive <change-name>
   ```

   Archiving applies the accepted deltas to `openspec/specs/` and moves the
   completed change into the archive.

Recommended branch flow:

- Create or update OpenSpec artifacts on a feature, fix, or chore branch.
- Open a PR for review.
- Implementation happens on a branch and is reviewed through a PR.
- The repository owner merges PRs.
- Archive the OpenSpec change only after the implementation is accepted.

## Documentation

- [Agent instructions](./AGENTS.md)
- [Design documentation](./docs/design/)
- [OpenSpec specifications](./openspec/specs/)
- [Feature analysis](./docs/feature-analysis.md)
