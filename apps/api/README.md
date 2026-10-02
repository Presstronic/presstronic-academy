# API App

Primary Java Spring Boot application for REST APIs, WebSocket-ready workflows,
authentication integration, and core Academy backend orchestration.

This scaffold is intentionally small. It establishes the buildable backend
workspace and runtime conventions without implementing learner, admin, content,
Code Prompt, Delivery, mentor, billing, or content health product endpoints.

## Prerequisites

- Java 25 (auto-provisioned via Gradle Foojay Toolchain Resolver, or install via [SDKMAN](https://sdkman.io/) for IDE use)
- Gradle 9.8.0 (use the wrapper: `apps/api/gradlew`)


## Commands

Run from the repository root:

```bash
pnpm api:build
pnpm api:test
pnpm api:bootRun
```

Run directly from this workspace:

```bash
./gradlew build
./gradlew test
./gradlew bootRun --args='--spring.profiles.active=local'
```

Health checks are available when the app is running:

```bash
curl http://localhost:8080/actuator/health
curl http://localhost:8080/actuator/health/readiness
```

## Boundaries

- Future REST controllers, request/response DTOs, validation, and API error
  handling conventions should live with their owning feature packages and reuse
  shared support under `com.presstronic.academy.api.platform.rest`.
- Future WebSocket configuration and shared handler support belongs under
  `com.presstronic.academy.api.platform.websocket`; concrete events,
  authorization, retries, and fallbacks require focused workflow proposals.
- Application-owned configuration should use type-safe
  `@ConfigurationProperties` classes under
  `com.presstronic.academy.api.platform.config`.
- Persistence, migrations, generated contracts, local infrastructure, worker
  jobs, gateway behavior, service extraction, and GraphQL are deferred to
  separate accepted proposals.
