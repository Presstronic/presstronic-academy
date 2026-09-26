## Why

`apps/api` is on Spring Boot 3.5.3, and OSS support for the 3.5 line ends well before the platform launches. The auth, admin-auth, account-lifecycle, and service-activation changes are about to add Spring Security, JPA, Flyway, OAuth2, Redis, and Testcontainers, and each one written against 3.x is more code to migrate later. The API is still a bare scaffold, so upgrading now to the current GA Spring Boot 4.x line and the latest Java LTS costs as little as it ever will.

## What Changes

- **BREAKING (build)**: Upgrade `apps/api` from Spring Boot 3.5.3 to the latest GA 4.x release (4.1.1 at time of writing), bringing Spring Framework 7, Jakarta EE 11 / Servlet 6.1, Tomcat 11, Jackson 3, Hibernate Validator 9, and JUnit 6 through Boot dependency management.
- **BREAKING (build)**: Move the Java toolchain from 21 to Java 25, the latest LTS release and one Spring Boot 4.1 supports.
- Adopt Spring Boot 4's modular starters: `spring-boot-starter-web` → `spring-boot-starter-webmvc`, and replace the monolithic `spring-boot-starter-test` with per-technology test starters (`-webmvc-test`, `-actuator-test`, `-validation-test`, `-websocket-test`).
- Commit a Gradle wrapper pinned to a Gradle 9.x release that supports both Spring Boot 4.1 and running on Java 25, and route root `api:*` scripts and docs through `./gradlew` so everyone builds on the same Gradle version.
- Update the `io.spring.dependency-management` plugin and any other build plugins to versions compatible with Boot 4.1.
- Verify no deprecated or migrated configuration properties remain, using `spring-boot-properties-migrator` temporarily during the upgrade.
- Update in-flight OpenSpec changes that name Boot 3.x artifacts or versions (`implement-passwordless-auth-and-oauth`, `define-admin-authentication`) so they target the Boot 4 starter names, Testcontainers 2 coordinates, Flyway starter, and Spring Security 7.
- Add a platform-baseline requirement to `academy-spring-boot-api` so the supported Spring Boot line and Java LTS are part of the documented contract.

## Capabilities

### New Capabilities

None.

### Modified Capabilities

- `academy-spring-boot-api`: Add a `Supported Platform Baseline` requirement: the API builds on a GA Spring Boot release line that is within OSS support, runs on a Java LTS supported by that line, uses a committed build-tool wrapper, and documents the baseline for contributors. Existing health, configuration, and boundary requirements are unchanged and must continue to pass after the upgrade.

## Impact

- **Code**: `apps/api/build.gradle.kts`, `apps/api/settings.gradle.kts`, new `apps/api/gradlew`, `gradlew.bat`, and `gradle/wrapper/*`, test sources where Boot 4 test APIs differ, and `application*.yml` if any property keys moved.
- **Tooling**: Contributors need JDK 25 locally, or toolchain auto-provisioning. Root `package.json` `api:*` scripts switch from a global `gradle` to the wrapper. There is no CI workflow yet; when one is added it must use JDK 25.
- **APIs**: No endpoint changes. `/actuator/health` and `/actuator/health/readiness` must behave exactly as before.
- **Dependencies**: Spring Boot 4.1.x BOM (Spring Framework 7.0.x, Spring Security 7.1, Spring Data 2026.0, Hibernate 7.4, Flyway 12, Jackson 3, Testcontainers 2, JUnit 6) becomes the version source for all current and future Spring-managed libraries.
- **Other proposals**: `implement-passwordless-auth-and-oauth` and `define-admin-authentication` have their dependency lists and version assumptions edited in this change. Issue #203 (Gradle wrapper and build scaffold) is partly satisfied by the wrapper added here. This change should land before any auth implementation work starts.
- **Deferred**: Spring Boot 4.2 (not GA), GraalVM native images, and adopting new 4.1 features (gRPC, `InetAddressFilter` SSRF mitigation, `@RedisListener`) are out of scope. Features that need them adopt them in their own proposals.
