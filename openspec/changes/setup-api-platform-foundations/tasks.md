## 1. Error Contract

- [ ] 1.1 Enable `spring.mvc.problemdetails.enabled` and add an `ApiProblemException` (status, `code`, title) plus a problem factory in `com.presstronic.academy.api.platform.rest` that sets `code` and `requestId` on every `ProblemDetail`; verify unit tests assert both extension members are present.
- [ ] 1.2 Add a global `@RestControllerAdvice` extending `ResponseEntityExceptionHandler` that maps framework exceptions (404 unknown path, 405, 415, unreadable body) and `ApiProblemException` to problem details with stable codes (`not_found`, `method_not_allowed`, `unsupported_media_type`, `malformed_request`); verify a `@WebMvcTest` covers each status and asserts `application/problem+json`.
- [ ] 1.3 Map `MethodArgumentNotValidException` and `HandlerMethodValidationException` to 400 `validation_failed` with an `errors` list of `{ field, code, message }`; verify a test controller in the test sources exercises a record DTO with multiple invalid fields.
- [ ] 1.4 Map any unhandled exception to 500 `internal_error` with a generic title, and log the full exception at ERROR with the request ID; verify a test asserts the body has no exception class, message, or stack trace and that the log line carries `requestId`.

## 2. Path and Origin Conventions

- [ ] 2.1 Add an `ApiPaths` constant (`/api/v1`) in `platform.rest`, and document the path layout (`/api/v1/**`, `/api/v1/admin/**`, auth protocol paths, `/actuator/**`, `/ws/**`) in `apps/api/README.md`; verify the README matches the spec.
- [ ] 2.2 Add `AcademyOriginProperties` bound to `academy.web.origin`, `academy.admin.origin`, and `academy.api.origin` with validation (absolute `http`/`https` origin, no path) and local defaults `http://localhost:5175`, `http://localhost:5174`, `http://localhost:8080`; verify a binding test passes for valid values and fails startup for an origin with a path.
- [ ] 2.3 Confirm no CORS mappings are registered; verify a `@WebMvcTest` preflight from `https://evil.example` receives no `Access-Control-Allow-Origin` header.

## 3. Request Correlation and Logging

- [ ] 3.1 Add a highest-precedence `RequestIdFilter` in `com.presstronic.academy.api.platform.web` that accepts inbound `X-Request-Id` matching `[A-Za-z0-9._-]{1,64}`, otherwise generates a UUIDv7, sets MDC `requestId` and the response header, and clears MDC afterwards; verify tests cover a generated ID, an accepted inbound ID, and a rejected malformed or oversized inbound ID (not echoed).
- [ ] 3.2 Verify `/actuator/health` responses also carry `X-Request-Id`.
- [ ] 3.3 Set `logging.structured.format.console=ecs` in `application.yml` and override it off in `application-local.yml`; verify a non-local boot prints single-line JSON including `requestId` for a request, and a `local` boot prints human-readable lines.

## 4. Align In-Flight Proposals

- [x] 4.1 In `implement-passwordless-auth-and-oauth` (`design.md`, `tasks.md`), replace `{"error":"reverification_required"}` with a 403 problem detail whose `code` is `reverification_required`, and note that the security entry point and access-denied handler emit problem details.
- [x] 4.2 In `define-admin-authentication/design.md`, replace `{"error":"admin_step_up_required"}` with a 403 problem detail whose `code` is `admin_step_up_required`.

## 5. Documentation and Issue Hygiene

- [ ] 5.1 Document the error contract (members, stable codes, "switch on `code`, never on `title`") in `apps/api/README.md`; verify the example body matches a real response from a test.
- [x] 5.2 Close or rewrite #203 so it tracks only this change's scope, linking `upgrade-spring-boot-4` (#259) and #205 for the superseded items; verify no open issue still asks for `apps/backend`, Spring Session, or CORS for `localhost:5173`.

## 6. Verification

- [ ] 6.1 Run `pnpm api:build`; verify all tests pass.
- [ ] 6.2 Run `openspec validate setup-api-platform-foundations --strict` and `openspec validate --all`; verify no errors.
- [ ] 6.3 Run `git diff --check`.
