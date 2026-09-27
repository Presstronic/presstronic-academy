## Why

Every feature proposal lined up for `apps/api` (auth first) assumes platform conventions the scaffold doesn't define yet: one error response shape, a path layout for REST endpoints, a browser origin policy, and request IDs that tie a client error to a log line. If each feature invents these, the frontend ends up with several error formats and support can't trace a failed request. Issue #203 was meant to cover this, but it was written for an `apps/backend` layout and a Spring Session design that have since been replaced. This change keeps the platform parts of #203 that still apply and drops the rest.

## What Changes

- Define one error contract for REST endpoints: RFC 9457 Problem Details (`application/problem+json`) with a stable machine-readable `code` and the request's `requestId`, plus a field-level `errors` list for validation failures. No stack traces or internal exception text reach clients.
- Define path conventions: versioned product REST endpoints live under `/api/v1/**`. Protocol endpoints owned by accepted auth proposals keep the paths those proposals define. Actuator stays at `/actuator/**`, and WebSocket endpoints live under `/ws/**`.
- Define a same-origin browser policy: the API does not enable CORS. Local frontends reach the API through their dev-server proxy (owned by `setup-frontend-app-foundations`). Allowed browser origins become typed configuration (`academy.web.origin`, `academy.admin.origin`, `academy.api.origin`) that later security features read.
- Add request correlation: accept a well-formed inbound `X-Request-Id` or generate one, return it on every response, put it in the logging context, and include it in problem details.
- Add structured JSON console logging for non-local profiles, and keep human-readable logs in `local`.
- Update the in-flight auth and admin-auth proposals so their ad-hoc `{"error": "..."}` bodies use the Problem Details `code` member.
- **Superseded #203 scope**, recorded here so it isn't lost:
  - The `apps/backend` path, Gradle wrapper and latest-version items: delivered by the existing `apps/api` scaffold and `upgrade-spring-boot-4`.
  - Spring Session: replaced by JWT access plus rotating refresh tokens in `implement-passwordless-auth-and-oauth`.
  - Flyway, PostgreSQL, Redis and the Testcontainers smoke test: these arrive with the first persistence-bearing change (#205).
  - CORS for `localhost:5173`: replaced by the same-origin dev proxy.

## Capabilities

### New Capabilities

None.

### Modified Capabilities

- `academy-spring-boot-api`: Add `API Error Response Contract`, `API Path Conventions`, `Browser Origin Policy`, and `Request Correlation and Structured Logs` requirements.

## Impact

- **Code**: new shared support under `com.presstronic.academy.api.platform.rest` (exception handler, problem factory), `platform.web` (request ID filter), and `platform.config` (origin properties). Adds `application.yml` logging and problem-details settings. Adds tests for each.
- **APIs**: No product endpoints. Unknown paths and framework errors now return `application/problem+json`. Every response carries `X-Request-Id`.
- **Other proposals**: `implement-passwordless-auth-and-oauth` and `define-admin-authentication` switch their error bodies to Problem Details `code` values (`reverification_required`, `admin_step_up_required`). Their security entry points and access-denied handlers must emit the same contract. `setup-frontend-app-foundations` consumes the contract and the path layout.
- **Dependencies**: None beyond Spring Boot 4.1 starters already present. Depends on `upgrade-spring-boot-4` (#259) landing first.
- **Deferred**: Distributed tracing and metrics export (observability proposal), security headers (`harden-web-security-headers`), OpenAPI documents (`setup-shared-api-contracts`), and rate limiting (auth).
