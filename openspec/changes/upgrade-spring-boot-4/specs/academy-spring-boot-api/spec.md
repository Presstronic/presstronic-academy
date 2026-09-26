# Spec Delta

## ADDED Requirements

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
