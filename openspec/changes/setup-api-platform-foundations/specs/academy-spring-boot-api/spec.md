# Spec Delta

## ADDED Requirements

### Requirement: API Error Response Contract

The API SHALL return every error response from REST endpoints in one documented format based on RFC 9457 Problem Details, so clients can handle errors without parsing endpoint-specific bodies.

#### Scenario: Error responses use problem details

GIVEN a client calls a REST endpoint
WHEN the request fails with a 4xx or 5xx status
THEN the response content type is `application/problem+json`
AND the body includes `type`, `title`, `status`, a stable machine-readable `code`, and the request's `requestId`.

#### Scenario: Validation failures identify fields

GIVEN a client sends a request that fails bean validation
WHEN the API rejects it
THEN the response status is 400 with `code` `validation_failed`
AND the body includes an `errors` list naming each invalid field with a machine-readable reason.

#### Scenario: Feature-specific error codes

GIVEN a feature needs a client-actionable failure such as `reverification_required`
WHEN the API returns that failure
THEN the value is carried in the problem detail's `code` member
AND the feature does not define a separate error body shape.

#### Scenario: Unknown paths and framework errors

GIVEN a client requests a path that does not exist or triggers a framework-level error (unsupported method, unreadable body, unsupported media type)
WHEN the API responds
THEN the response uses the same problem details format with an appropriate status and `code`.

#### Scenario: Internal details are not exposed

GIVEN an unexpected server error occurs
WHEN the API responds
THEN the response is a 500 problem detail with `code` `internal_error` and a generic title
AND it contains no stack trace, exception class name, SQL, or internal message
AND the full error is logged server-side with the same `requestId`.

### Requirement: API Path Conventions

The API SHALL group its HTTP surface by stable path prefixes so clients, proxies, and security rules can target each surface predictably.

#### Scenario: Product REST endpoints are versioned

GIVEN a feature proposal adds a learner or admin REST endpoint
WHEN the endpoint is implemented
THEN its path starts with `/api/v1/`
AND admin endpoints live under `/api/v1/admin/`.

#### Scenario: Protocol and operational endpoints keep their own prefixes

GIVEN authentication protocol endpoints, health endpoints, or WebSocket endpoints exist
WHEN their paths are reviewed
THEN authentication protocol endpoints use the paths defined by the accepted proposal that owns them
AND health and readiness remain under `/actuator/`
AND WebSocket endpoints live under `/ws/`.

### Requirement: Browser Origin Policy

The API SHALL serve browser clients same-origin and SHALL NOT grant cross-origin access by default.

#### Scenario: Cross-origin requests are not granted

GIVEN a browser page on an origin other than the configured web, admin, or API origin
WHEN it sends a cross-origin request to the API
THEN the API does not return CORS headers that allow the request.

#### Scenario: Local development is same-origin

GIVEN a contributor runs a frontend app and the API locally
WHEN the frontend calls the API
THEN requests go through the frontend dev server's proxy
AND the browser treats them as same-origin without a CORS configuration.

#### Scenario: Allowed origins are typed configuration

GIVEN a feature needs to validate a browser origin (for example a WebSocket handshake, OAuth redirect, or same-site assertion)
WHEN it reads the allowed origins
THEN it uses the API's typed configuration for the web, admin, and API origins
AND the values are externalized per environment with local defaults.

### Requirement: Request Correlation and Structured Logs

The API SHALL give every request an identifier that links client-visible responses to server logs.

#### Scenario: Request ID is returned

GIVEN any HTTP request reaches the API
WHEN the API responds
THEN the response includes an `X-Request-Id` header.

#### Scenario: Inbound request ID is honored only when well-formed

GIVEN a request arrives with an `X-Request-Id` header
WHEN the value is well-formed and within the allowed length
THEN the API uses it as the request ID
AND otherwise the API generates a new request ID and does not echo the invalid value.

#### Scenario: Logs carry the request ID

GIVEN the API logs a message while handling a request
WHEN the log entry is written
THEN it includes the request ID.

#### Scenario: Non-local logs are structured

GIVEN the API runs outside the `local` profile
WHEN it writes console logs
THEN each entry is a single-line structured JSON document
AND the `local` profile keeps human-readable console output.
