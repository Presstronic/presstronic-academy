## Context

- `apps/api` is a scaffold with Spring Boot 3.5.3, `io.spring.dependency-management` 1.1.7, a Java 21 toolchain, and four starters (`web`, `actuator`, `validation`, `websocket`), plus `configuration-processor` and `starter-test`. The code is one `@SpringBootApplication` class, one `@ConfigurationProperties` record, and one `@SpringBootTest` context test.
- There is no Gradle wrapper. The root `api:*` scripts and `apps/api/README.md` call a globally installed `gradle`. There is no CI workflow and no API Dockerfile.
- Spring Boot 4.1.1 is the latest GA release (4.2 is at milestones). It requires Spring Framework 7.0.9+, supports Java 17 through 26, supports Gradle 8.14+ and 9.x, and targets Jakarta EE 11 / Servlet 6.1 (Tomcat 11, Jetty 12.1).
- Java 25 is the current LTS; the next LTS is not due until September 2027. Gradle can run on Java 25 from 9.1.0.
- The in-flight changes `implement-passwordless-auth-and-oauth` and `define-admin-authentication` list Boot 3.x starter names, Testcontainers 1.x coordinates, and "Spring Boot 3.5 ships Spring Security 6.5".

## Goals / Non-Goals

**Goals:**

- `apps/api` builds, tests, and boots on Spring Boot 4.1.x with a Java 25 toolchain, and its health and readiness behavior does not change.
- One pinned Gradle version for every contributor, provided by a committed wrapper.
- All Spring-managed libraries, current and planned, take their versions from the Boot 4.1 BOM.
- In-flight proposals describe Boot 4 artifacts, so implementers don't build on 3.x names.

**Non-Goals:**

- Adopting new Boot 4.1 features (gRPC, `InetAddressFilter` SSRF mitigation, `@RedisListener`, Jackson factory callbacks, OpenTelemetry changes). Features that need them adopt them in their own proposals.
- Spring Boot 4.2 or any non-GA line.
- GraalVM native images, container images, or CI pipelines. None exist yet. When they're added they target JDK 25.
- Frontend dependency upgrades.

## Decisions

### 1. Target Spring Boot 4.1.x (4.1.1 at time of writing)

**Chosen:** Use the newest 4.1 patch release available when the work is done.

**Alternatives considered:**
- *4.0.x*: This line leaves OSS support sooner and ships older Spring Security and Hibernate versions, so we'd face a second minor upgrade soon.
- *4.2.0 milestone*: Not GA, which the new baseline requirement rules out.

### 2. Java 25 toolchain

**Chosen:** Set `languageVersion = JavaLanguageVersion.of(25)`. Java 25 is the latest LTS and is inside Boot 4.1's supported range, which tops out at 26.

**Alternatives considered:**
- *Stay on 21*: This works, but we'd need another toolchain bump before launch.
- *Java 26*: Not an LTS, and it sits at the top edge of Boot's supported range.

### 3. JDK provisioning via the Foojay toolchain resolver

**Chosen:** Apply `org.gradle.toolchains.foojay-resolver-convention` in `apps/api/settings.gradle.kts`, so a contributor without JDK 25 installed gets one provisioned by Gradle automatically. The README still documents installing JDK 25 manually (for example with SDKMAN) for IDE use.

**Alternatives considered:**
- *Require a manual JDK install*: Builds would fail with a toolchain error for anyone who hasn't upgraded. That friction isn't worth it.

### 4. Commit a Gradle 9.x wrapper

**Chosen:** Generate a wrapper under `apps/api` pinned to the latest Gradle 9.x release (9.8.0 at time of writing, and at least 9.1.0 for Java 25), with `distributionSha256Sum` set. Switch the root `api:*` scripts and docs to `apps/api/gradlew`.

**Alternatives considered:**
- *Keep the global `gradle`*: Builds would depend on whatever version each machine has installed, which the new baseline requirement rules out.
- *A root-level wrapper with `apps/api` as a subproject*: This would change the paths in every in-flight task (`./gradlew :apps:api:test`). It belongs with #203's repository-layout decision, not this upgrade. Section 5 of the tasks reconciles the command form used across proposals.

### 5. Modular starters, not the classic compatibility starters

**Chosen:** Move directly to Boot 4's modular starters: `spring-boot-starter-webmvc`, `-actuator`, `-validation`, `-websocket`, and their `*-test` companions in place of `spring-boot-starter-test`.

**Alternatives considered:**
- *`spring-boot-starter-classic` / `spring-boot-starter-test-classic`*: These exist to make big codebases easier to migrate. The API has three classes, so they'd only postpone the same work.

### 6. Keep the `io.spring.dependency-management` plugin

**Chosen:** Keep the plugin (1.1.7 is still the latest release and works with Boot 4.x) so the build stays in the existing idiom.

**Alternatives considered:**
- *Gradle-native `platform(SpringBootPlugin.BOM_COORDINATES)`*: This is lighter-weight, but it's a style change that doesn't need to happen in this upgrade.

### 7. Jackson 3 with no Jackson 2 bridge

**Chosen:** Accept Jackson 3 (`tools.jackson.*`) as the only JSON stack. The API has no direct Jackson code today. Don't add `spring-boot-jackson2`: it's deprecated, and adding it would make future feature code pick between two stacks.

### 8. Temporary properties migrator

**Chosen:** During the upgrade, add `spring-boot-properties-migrator` as `runtimeOnly`, boot the app with the default and `local` profiles, fix any reported keys, then remove the dependency before merging.

### 9. Update in-flight proposals in this change

**Chosen:** Edit the planning artifacts of dependent changes in this change so nobody implements against stale names:

| Change | Stale reference | Boot 4 replacement |
|---|---|---|
| `implement-passwordless-auth-and-oauth` | `spring-boot-starter-oauth2-client` | `spring-boot-starter-security-oauth2-client` |
| `implement-passwordless-auth-and-oauth` | `org.flywaydb:flyway-core` alone | `spring-boot-starter-flyway` + `org.flywaydb:flyway-database-postgresql` |
| `implement-passwordless-auth-and-oauth` | `org.testcontainers:postgresql` | `org.testcontainers:testcontainers-postgresql` (Testcontainers 2), plus `spring-boot-testcontainers` |
| `implement-passwordless-auth-and-oauth` | implicit `spring-boot-starter-test` | per-technology test starters (`-security-test`, `-data-jpa-test`, `-flyway-test`, `-data-redis-test`, `-security-oauth2-client-test`) |
| `implement-passwordless-auth-and-oauth` | "bare Spring Boot 3.5.3 / Java 21 scaffold" | Spring Boot 4.1 / Java 25 |
| `define-admin-authentication` | "Spring Boot 3.5 ships Spring Security 6.5" | Spring Boot 4.1 ships Spring Security 7.1, which keeps WebAuthn relying-party support |

These are version and coordinate edits only. No behavior in those proposals changes.

## Risks / Trade-offs

- **Contributors on JDK 21 only** → The Foojay resolver provisions JDK 25 automatically. The README documents the requirement, and the wrapper runs the build on a supported Gradle.
- **Third-party libraries lagging on Jakarta EE 11 / Jackson 3 / Java 25** (Bucket4j, JWT libraries planned by the auth change) → Bucket4j's `jdk17` artifacts run on 25 and don't depend on Jackson. Nimbus JOSE comes through Spring Security's BOM. Any library pinned outside the BOM needs a documented reason, per the spec.
- **Spring Security 7 API removals** (for example, the non-lambda DSL and `and()` chaining are gone) → No security code exists yet. The updated auth proposal notes that its filter chain must use the Security 7 lambda DSL.
- **Hidden behavior change in `@SpringBootTest`** (MockMvc and TestRestTemplate are no longer auto-provided) → The current test doesn't use them. Future web tests must add `@AutoConfigureMockMvc` or `@AutoConfigureRestTestClient` explicitly.
- **Wrapper location later conflicts with #203's layout** → The wrapper sits under `apps/api` to match today's `gradle -p apps/api` usage. If #203 moves to a root build, the wrapper moves with it.

## Migration Plan

1. Land this change before any task of `implement-passwordless-auth-and-oauth` begins.
2. Contributors pull, then run `pnpm api:build`. Toolchain provisioning handles JDK 25.
3. Rollback: revert the commit. No data, schema, or API contract depends on the platform version.

## Open Questions

- Spring Security 7 adds built-in multi-factor authentication support. `define-admin-authentication` and the planned `add-mfa-and-webauthn` should decide in their own designs whether to use it. That decision is out of scope here.
