# Presstronic Academy

An interactive learning platform for branching, story-driven software mastery.

[![License: GPL-3.0-or-later](https://img.shields.io/badge/license-GPL--3.0--or--later-blue.svg)](./LICENSE.md)

## Overview

Presstronic Academy helps developers practice through guided learning paths, lessons, and coding challenges. The project is being rebuilt around a Spring Boot backend and a React frontend.

## Current Structure

```text
apps/
  frontend/   React application
docs/         Product mockups and architecture notes
```

The backend is intentionally absent while the Spring Boot service is being introduced.

## Planned Stack

- Backend: Java and Spring Boot
- Frontend: React
- Database: PostgreSQL
- Cache: Redis
- Object storage: S3-compatible storage for local development
- Infrastructure: Docker Compose for local dependencies

## Local Infrastructure

Start local dependencies:

```bash
docker compose up -d postgres redis minio
```

Stop local dependencies:

```bash
docker compose down
```

Available services:

- PostgreSQL: `localhost:5432`
- Redis: `localhost:6379`
- MinIO API: `localhost:9000`
- MinIO Console: `localhost:9001`

## Frontend

The frontend lives in `apps/frontend`.

```bash
cd apps/frontend
npm install
npm run dev
```

The development server runs at `http://localhost:5173`.

## Documentation

- [Agent instructions](./AGENTS.md)
- [Domain context](./CONTEXT.md)
- [Multi-tenancy ADR](docs/archive/adr/0001-multi-tenancy.md)
- Product mockups: `docs/pa-mockup-*.html`
