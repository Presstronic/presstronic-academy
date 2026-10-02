# Academy Spring Boot API Specification

## Purpose

Define the primary Spring Boot API scaffold for Presstronic Academy.

This specification captures the buildable backend foundation under `apps/api`: source layout, build/test conventions, local runtime configuration, health/readiness surfaces, REST-first package conventions, WebSocket readiness, and dependency boundaries. It does not specify production learner/admin endpoints, persistence schemas, generated clients, local infrastructure, worker jobs, service extraction, deployment, or GraphQL.
## Requirements
### Requirement: Spring Boot API Workspace

The repository SHALL scaffold `apps/api` as the primary Spring Boot backend application for core Academy REST APIs, WebSocket-ready backend behavior, authentication integration, and backend orchestration.

#### Scenario: API workspace exists

GIVEN backend API scaffolding is implemented
WHEN a contributor reviews the workspace layout
THEN `apps/api` contains the primary Spring Boot application
AND the workspace can be built and tested independently from frontend app workspaces.

#### Scenario: API workspace replaces placeholder documentation

GIVEN `apps/api` previously contained only placeholder documentation
WHEN the Spring Boot scaffold is created
THEN placeholder-only files are replaced or updated to describe the actual backend workspace
AND no obsolete placeholder text remains as the primary documentation for the implemented API workspace.

#### Scenario: API remains primary backend boundary

GIVEN backend behavior is implemented before a service-specific extraction is accepted
WHEN the behavior exposes REST APIs, WebSocket workflows, authentication integration, or core backend orchestration
THEN it lives in `apps/api`
AND does not create an independently deployable service boundary.

### Requirement: Backend Build and Verification Scaffold

The API workspace SHALL provide Spring Boot build, test, and verification commands using Gradle Kotlin DSL.

#### Scenario: API build command succeeds

GIVEN backend dependencies are available
WHEN the API build command runs
THEN the Spring Boot application compiles
AND its tests run as part of build verification.

#### Scenario: API test command succeeds

GIVEN backend dependencies are available
WHEN the API test command runs
THEN the scaffolded test suite executes
AND includes at least one application context or equivalent scaffold verification test.

#### Scenario: Root scripts expose backend verification

GIVEN backend scaffolding is implemented
WHEN a contributor reviews root project scripts or documented commands
THEN routine backend build and test verification can be run from the project root
AND contributors do not need to infer backend commands from Gradle internals.

### Requirement: API Runtime Configuration Scaffold

The API workspace SHALL define local runtime configuration conventions without committing secrets or production environment assumptions.

#### Scenario: Local profile exists

GIVEN the API scaffold is implemented
WHEN local runtime configuration is reviewed
THEN a local or development profile convention exists
AND configuration values are externalized rather than hard-coded as secrets.

#### Scenario: Type-safe configuration boundary

GIVEN backend configuration grows beyond simple framework settings
WHEN application-owned configuration is introduced
THEN it uses type-safe configuration binding
AND avoids scattering raw environment access throughout domain code.

#### Scenario: Production configuration deferred

GIVEN deployment-specific configuration is required
WHEN backend scaffolding is implemented
THEN production secrets, environment provisioning, and deployment configuration remain deferred to infrastructure or deployment proposals.

### Requirement: Health and Readiness Surface

The API workspace SHALL expose a minimal health/readiness surface suitable for local verification and future infrastructure wiring.

#### Scenario: Health endpoint available

GIVEN the API application is running locally
WHEN a contributor checks the documented health surface
THEN the application reports that the scaffolded backend is running
AND the response does not depend on unavailable product databases, queues, object storage, or external services.

#### Scenario: Readiness remains scaffold-level

GIVEN future infrastructure wiring is not yet implemented
WHEN readiness behavior is reviewed
THEN readiness confirms only scaffold-level runtime availability
AND does not claim production dependency readiness before those dependencies are accepted and wired.

### Requirement: REST-First API Readiness

The API scaffold SHALL establish REST-first conventions without implementing production product endpoints.

#### Scenario: REST conventions documented

GIVEN backend scaffolding is implemented
WHEN a contributor reviews API documentation or package conventions
THEN REST controllers, request/response DTOs, validation, and error response conventions have an identified home
AND future product endpoints can follow those conventions.

#### Scenario: Product endpoints deferred

GIVEN learner, admin, Code Prompt, Delivery, content health, mentor, or billing API behavior is considered
WHEN only the API scaffold proposal is being implemented
THEN production product endpoints remain deferred
AND require focused proposals or tasks before implementation.

#### Scenario: Contract generation deferred

GIVEN shared generated clients are not yet accepted
WHEN the API scaffold is implemented
THEN OpenAPI documents, generated TypeScript clients, and shared schema package behavior remain deferred to a separate contracts proposal.

### Requirement: WebSocket Readiness Boundary

The API scaffold SHALL allow future WebSocket workflows while deferring concrete event contracts and live product behavior.

#### Scenario: WebSocket dependencies or conventions are bounded

GIVEN backend scaffolding includes WebSocket readiness
WHEN dependencies, configuration, or package documentation is reviewed
THEN they identify where future WebSocket configuration and handlers will live
AND do not implement live product events before an accepted workflow proposal defines them.

#### Scenario: WebSocket lifecycle deferred

GIVEN a workflow needs live progress, streaming status, collaboration, notifications, or long-running job updates
WHEN WebSocket behavior is proposed later
THEN that proposal defines authorization, connection lifecycle, event payloads, retry behavior, and fallback behavior
AND does not rely on scaffold-only requirements for product semantics.

### Requirement: Backend Dependency Boundaries

The API scaffold SHALL include only dependencies needed for a buildable backend foundation and SHALL defer persistence, infrastructure, and service integrations until focused proposals accept them.

#### Scenario: Persistence dependencies deferred

GIVEN database schemas and migrations are not accepted yet
WHEN the API scaffold dependencies are reviewed
THEN JPA, migration tooling, repository code, and database-specific configuration are included only if needed for scaffold verification
AND otherwise remain deferred to persistence or feature proposals.

#### Scenario: External integrations deferred

GIVEN Redis, S3-compatible storage, email providers, billing providers, AI providers, or code execution systems are not yet wired
WHEN backend scaffolding is implemented
THEN those integrations remain absent or placeholder-documented
AND no credentials or production endpoints are committed.

#### Scenario: Service extraction deferred

GIVEN future services may exist for code running, notifications, or billing
WHEN backend scaffolding is implemented
THEN `services/*`, `apps/worker`, and `apps/gateway` remain inactive unless a separate accepted proposal activates them.

### Requirement: Supported Platform Baseline

The API workspace SHALL build and run on a generally available Spring Boot release line that is within open-source support, on a Java LTS release supported by that line, using a build-tool version pinned in the repository.

#### Scenario: Spring Boot line is GA and supported

GIVEN the API workspace build configuration is reviewed
WHEN the Spring Boot version is inspected
THEN it is a generally available release (not a milestone, release candidate, or snapshot)
AND the release line is within its open-source support window.

#### Scenario: Java toolchain is a supported LTS

GIVEN the API workspace build configuration is reviewed
WHEN the Java toolchain version is inspected
THEN it is a Java LTS release
AND that release is within the Java range the selected Spring Boot line documents as supported.

#### Scenario: Build tool version is pinned

GIVEN a contributor builds the API from a fresh clone
WHEN they run the documented backend build command
THEN the build uses a build-tool version pinned in the repository rather than whichever version is installed globally
AND that version is one the selected Spring Boot line supports.

#### Scenario: Framework-managed libraries share one version source

GIVEN the API depends on Spring-managed libraries such as web, actuator, validation, WebSocket, security, persistence, migration, or test support
WHEN their versions are reviewed
THEN they are resolved from the selected Spring Boot line's dependency management
AND any library pinned outside that dependency management has a documented reason.

#### Scenario: Platform baseline is documented

GIVEN a contributor sets up the backend for the first time
WHEN they read the API workspace documentation
THEN it states the required Java version and how to obtain it
AND it states which Spring Boot line the API targets.

#### Scenario: Upgrade preserves existing API behavior

GIVEN the platform baseline is upgraded
WHEN the API test suite and documented health checks run
THEN the application context loads with its typed configuration
AND the health and readiness surfaces report the same scaffold-level status as before the upgrade.

