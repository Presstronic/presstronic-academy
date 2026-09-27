# Spec Delta

## MODIFIED Requirements

### Requirement: Frontend Dependency Boundaries
The frontend scaffold SHALL keep dependencies aligned with workspace ownership and avoid premature product implementation.

#### Scenario: Shared dependency placement
GIVEN a dependency is used only by one app
WHEN dependencies are declared
THEN it belongs to that app workspace
AND shared dependencies are placed where workspace package management can resolve them consistently.

#### Scenario: API clients deferred
GIVEN backend contracts and generated clients are not yet accepted
WHEN frontend scaffolding is implemented
THEN generated API clients remain deferred to the shared contracts proposal
AND each app may include only a hand-written transport client that implements the API's error contract and same-origin request conventions
AND feature-specific endpoint calls are added only by accepted feature proposals.

#### Scenario: Product workflows deferred
GIVEN frontend scaffolding is implemented
WHEN learner, admin, mentor, content health, or content authoring product workflows are considered
THEN the scaffold may include minimal placeholders or route shells
AND does not implement production workflow behavior before focused feature proposals accept it.

## ADDED Requirements

### Requirement: Frontend Routing Foundation
Each frontend app SHALL declare its screens through a typed, code-defined route tree using hash-based URLs, with a guard hook for protected routes.

#### Scenario: Routes are typed and centrally declared
GIVEN a contributor adds or links to a screen
WHEN they reference the route
THEN the route is declared in the app's route tree
AND a link or navigation call to an undeclared route fails type checking.

#### Scenario: Hash-based URLs
GIVEN an app is served from static hosting
WHEN a user opens or reloads any screen URL
THEN the screen is selected from the URL hash in the form `#/<screen>`
AND no server-side fallback routing is required.

#### Scenario: Protected routes run a guard before rendering
GIVEN a route is marked protected
WHEN navigation to it begins
THEN the app's guard hook runs before the screen renders
AND the guard can redirect to another route while preserving the requested destination.

### Requirement: Frontend API Client
Each frontend app SHALL call the API through one shared transport client that applies the API's request conventions and error contract.

#### Scenario: Same-origin requests with cookies
GIVEN app code calls the API
WHEN the transport client sends the request
THEN it uses a same-origin relative URL
AND includes same-origin credentials so cookie-based sessions work.

#### Scenario: Problem details become typed errors
GIVEN the API responds with an `application/problem+json` error
WHEN the transport client handles the response
THEN it raises a typed API error exposing the status, `code`, `requestId`, and any field `errors`
AND app code branches on `code` rather than on message text.

#### Scenario: Network failures are distinguishable
GIVEN the API cannot be reached or the request is aborted
WHEN the transport client handles the failure
THEN it raises an error that app code can distinguish from an API error response.

#### Scenario: Request headers are extensible
GIVEN a feature must add a header to state-changing requests (for example a CSRF token)
WHEN the feature registers the header with the transport client
THEN every applicable request includes it
AND individual call sites do not add it by hand.

### Requirement: Local API Proxy
Each frontend app's development server SHALL proxy API traffic to the local API so local development is same-origin.

#### Scenario: API paths are proxied
GIVEN a contributor runs a frontend app and the API locally
WHEN the app requests an API, authentication, OAuth, well-known, or WebSocket path
THEN the dev server forwards the request to the local API, including WebSocket upgrades
AND the browser sees the response as same-origin.

#### Scenario: Proxy target is configurable
GIVEN the API runs on a non-default host or port
WHEN a contributor sets the documented proxy target environment variable
THEN the dev server forwards to that target instead of the default.

### Requirement: Frontend Test Harness
Every frontend workspace SHALL provide a unit and component test command that runs from the root test script.

#### Scenario: Workspace tests run from the root
GIVEN frontend workspaces are installed
WHEN a contributor runs the root test command
THEN each frontend app and shared package runs its test suite
AND the command fails if any test fails.

#### Scenario: Components are tested through user-facing behavior
GIVEN a component or screen test is written
WHEN it queries and interacts with the rendered output
THEN it uses accessible roles, labels, and user events rather than implementation details.

#### Scenario: API calls are mocked at the network boundary
GIVEN a test exercises code that calls the API
WHEN the test runs
THEN API responses are provided by network-level request handlers
AND unhandled requests fail the test instead of reaching a real network.
