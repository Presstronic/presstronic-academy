## Context

- After `upgrade-spring-boot-4`, `apps/api` is a Spring Boot 4.1 / Java 25 scaffold. `com.presstronic.academy.api.platform.rest` is reserved for shared REST support, and `platform.config` holds `AcademyApiProperties`.
- The in-flight auth proposals return `403 {"error":"reverification_required"}` and `403 {"error":"admin_step_up_required"}`, and they read `academy.web.origin` / `academy.api.origin` for a same-site startup assertion and the WebSocket `Origin` allowlist. Nothing defines those properties yet.
- The auth design depends on a same-origin deployment: `SameSite` cookies plus a double-submit CSRF header. `apps/web` runs on port 5175 and `apps/admin` on 5174 locally, and the API runs on 8080.
- Issue #203 predates the current layout. The upgrade, the auth change, and this change now split its scope.

## Goals / Non-Goals

**Goals:**

- One error body shape that the frontend client (`setup-frontend-app-foundations`) can parse once.
- Predictable path prefixes for proxying, security matchers, and future OpenAPI grouping.
- A same-origin posture that matches the auth design, with origins as typed configuration.
- Every error a user reports can be traced to server logs by request ID.

**Non-Goals:**

- Distributed tracing, metrics export, and log shipping.
- Security headers, rate limiting, authentication.
- OpenAPI generation or publishing.
- Persistence, Flyway, Testcontainers (the first persistence change owns these).

## Decisions

### 1. RFC 9457 Problem Details with `code` and `requestId` extensions

**Chosen:** Enable `spring.mvc.problemdetails.enabled` and add one `@RestControllerAdvice` extending `ResponseEntityExceptionHandler`, so framework exceptions (404 `NoResourceFoundException`, 405, 415, unreadable body) and application exceptions share the format. Add two extension members to every problem: `code`, a stable snake_case string that clients switch on, and `requestId`. Validation failures add `errors: [{ field, code, message }]`. Feature code throws a small `ApiProblemException(status, code, title)` (or a subclass) instead of building bodies by hand. `type` defaults to `about:blank` until the contracts change publishes problem type URIs.

**Alternatives considered:**
- *Ad-hoc `{"error": "..."}` bodies, as the auth drafts use*: They're simple, but every feature drifts, and there's nowhere for field errors or request IDs.
- *A custom envelope `{ success, data, error }`*: Not standard, and it fights Spring's built-in `ProblemDetail` support.

### 2. `/api/v1` prefix for product REST, not a servlet context path

**Chosen:** Product controllers declare `/api/v1/...` mappings. A shared base constant in `platform.rest` avoids typos. Auth protocol endpoints (`/auth/**`, `/oauth/**`, `/.well-known/jwks.json`) keep the paths the auth proposal defines. Actuator stays at `/actuator/**`, and WebSocket endpoints go under `/ws/**`.

**Alternatives considered:**
- *`server.servlet.context-path=/api`, as #203 proposed*: It moves actuator, OAuth callbacks, and JWKS under `/api`, which breaks the paths the auth proposal and provider registrations use, and it gives no versioning.
- *`PathMatchConfigurer.addPathPrefix` by package*: Hidden magic. Explicit mappings are easier to grep.

### 3. Same-origin via the dev proxy, and no CORS

**Chosen:** Don't register CORS mappings, so Spring's default rejects cross-origin preflights. The frontend dev servers proxy `/api`, `/auth`, `/oauth`, `/.well-known`, and `/ws` (with WebSocket upgrade) to `localhost:8080`, so local development matches production's same-origin topology. Add `AcademyOriginProperties` bound to `academy.web.origin`, `academy.admin.origin`, and `academy.api.origin`, validated as absolute `http(s)` origins with no path. Local defaults are `http://localhost:5175`, `http://localhost:5174`, and `http://localhost:8080`.

**Alternatives considered:**
- *CORS with credentials for the Vite origins, as #203 proposed*: It works locally but creates a cross-origin path production never uses, and it weakens the `SameSite`/CSRF reasoning the auth design depends on.

### 4. Request ID filter backed by MDC

**Chosen:** Add a highest-precedence `OncePerRequestFilter`. It accepts an inbound `X-Request-Id` matching `[A-Za-z0-9._-]{1,64}` and otherwise generates a UUIDv7. It puts the value in MDC under `requestId`, sets the response header, and clears MDC in `finally`. The problem-details handler reads the same value. The filter covers WebSocket handshakes; per-message correlation is left to the owning WebSocket feature.

**Alternatives considered:**
- *Micrometer Tracing (trace/span IDs)*: This is the right long-term answer, but it needs an exporter and backend decision. It belongs in the observability proposal, and the request ID can carry the trace ID later.

### 5. Spring Boot structured logging

**Chosen:** Set `logging.structured.format.console=ecs` in `application.yml`, and turn it off in `application-local.yml` so local logs stay human-readable. MDC values (including `requestId`) are included automatically.

**Alternatives considered:**
- *Logstash encoder dependency*: Boot's built-in structured logging makes it unnecessary.

## Risks / Trade-offs

- [Auth endpoints outside `/api/v1` make proxy rules longer] → Document the proxy list in one place (the frontend foundations change). Revisit only if the auth paths move.
- [Clients rely on `title` text instead of `code`] → Document that `code` is the only stable field, and keep titles generic.
- [Inbound request IDs could be used for log injection] → Strict pattern and length check, and never echo invalid values.
- [JSON logs are harder to read in shared dev environments] → Only `local` gets human-readable output. Other environments are expected to use a log viewer.

## Migration Plan

1. Land after `upgrade-spring-boot-4`.
2. Update the auth and admin-auth proposals' error bodies in the same PR as the specs (done in this change).
3. Rollback: revert. No endpoint or data depends on this yet.

## Open Questions

- Should the auth protocol endpoints move under `/api/v1/auth/**` for a single proxy prefix? This change leaves them as the auth proposal defines. The auth implementation can decide before #205 ships, since no client depends on them yet.
- When `setup-shared-api-contracts` lands, should problem `type` become resolvable URIs per `code`?
