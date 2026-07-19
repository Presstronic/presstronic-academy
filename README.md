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
spec/               OpenSpec capability specifications
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

## Documentation

- [Agent instructions](./AGENTS.md)
- [Design documentation](./docs/design/)
- [OpenSpec specifications](./spec/specs/)
- [Feature analysis](./docs/feature-analysis.md)
