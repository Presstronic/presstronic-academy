## 1. Build Tooling

- [ ] 1.1 Generate a Gradle wrapper under `apps/api` pinned to the latest Gradle 9.x release (at least 9.1.0), with `distributionSha256Sum` set in `gradle-wrapper.properties`; verify `apps/api/gradlew --version` reports the pinned version and runs on JDK 25.
- [ ] 1.2 Apply `org.gradle.toolchains.foojay-resolver-convention` in `apps/api/settings.gradle.kts`; verify a build on a machine without JDK 25 installed provisions it automatically (or `apps/api/gradlew -q javaToolchains` lists a Java 25 toolchain).
- [ ] 1.3 Switch the root `package.json` `api:build`, `api:test`, and `api:bootRun` scripts from the global `gradle` to `apps/api/gradlew -p apps/api`; verify each script runs from the repository root.

## 2. Spring Boot and Java Upgrade

- [ ] 2.1 In `apps/api/build.gradle.kts`, bump `org.springframework.boot` to the latest 4.1.x GA release, keep `io.spring.dependency-management` at its latest release, and set the Java toolchain to 25; verify `apps/api/gradlew -p apps/api dependencies --configuration runtimeClasspath` resolves Spring Framework 7.0.x, Tomcat 11, and Jackson 3 (`tools.jackson`).
- [ ] 2.2 Replace `spring-boot-starter-web` with `spring-boot-starter-webmvc`, keep `-actuator`, `-validation`, and `-websocket`, and replace `spring-boot-starter-test` with `spring-boot-starter-webmvc-test`, `spring-boot-starter-actuator-test`, `spring-boot-starter-validation-test`, and `spring-boot-starter-websocket-test`; verify `compileJava` and `compileTestJava` succeed.
- [ ] 2.3 Check whether `testRuntimeOnly("org.junit.platform:junit-platform-launcher")` is still needed with JUnit 6 under Boot 4.1's dependency management, and keep or remove it; verify tests are discovered and run.
- [ ] 2.4 Fix any compilation or API breakages in main and test sources (package relocations, removed deprecated APIs), without changing behavior; verify `apps/api/gradlew -p apps/api build` passes with no new deprecation warnings from project code.

## 3. Configuration Verification

- [ ] 3.1 Temporarily add `runtimeOnly("org.springframework.boot:spring-boot-properties-migrator")`, boot with the default profile and with `--spring.profiles.active=local`, and fix any renamed or removed property keys it reports in `application.yml` and `application-local.yml`; verify the migrator reports nothing.
- [ ] 3.2 Remove `spring-boot-properties-migrator`; verify it no longer appears in `build.gradle.kts` or the runtime classpath.
- [ ] 3.3 Run `pnpm api:bootRun` and check `curl http://localhost:8080/actuator/health` and `curl http://localhost:8080/actuator/health/readiness`; verify both return `UP` with the same scaffold-level response shape as before the upgrade.
- [ ] 3.4 Verify `AcademyApiApplicationTests` still loads the context with `AcademyApiProperties` bound, and that the configuration processor still generates `META-INF/spring-configuration-metadata.json` for `academy.api.*`.

## 4. Documentation

- [ ] 4.1 Update `apps/api/README.md`: required JDK (25) and how to get it (auto-provisioned toolchain, or SDKMAN for IDE use), the targeted Spring Boot line (4.1.x), and wrapper-based commands in place of global `gradle`; verify every documented command runs as written.
- [ ] 4.2 Update the root `README.md` backend prerequisites if it mentions a Java or Gradle version; verify there are no remaining references to Java 21, Spring Boot 3.x, or a global `gradle` requirement outside archived changes.

## 5. Align In-Flight Proposals

- [x] 5.1 In `implement-passwordless-auth-and-oauth` (`proposal.md`, `design.md`, `tasks.md`), replace Boot 3 coordinates with the Boot 4 equivalents from design decision #9 (`spring-boot-starter-security-oauth2-client`, `spring-boot-starter-flyway` + `flyway-database-postgresql`, `testcontainers-postgresql` + `spring-boot-testcontainers`, per-technology test starters), update the "Spring Boot 3.5.3 / Java 21" context line, and note that the security filter chain uses the Spring Security 7 lambda DSL; verify `grep` finds no Boot 3 starter names or 3.5 references in that change.
- [x] 5.2 In `define-admin-authentication/design.md`, replace "Spring Boot 3.5 ships Spring Security 6.5" with the Boot 4.1 / Spring Security 7.1 equivalent; verify the WebAuthn statement is still accurate for Security 7.1.
- [ ] 5.3 Update the Gradle command form in in-flight tasks (`./gradlew :apps:api:<task>`) to match the wrapper location from 1.1 (`apps/api/gradlew -p apps/api <task>` or the root `pnpm api:*` scripts); verify there are no remaining `./gradlew :apps:api:` references outside archived changes.
- [ ] 5.4 Comment on issue #203 to say that the Gradle wrapper, latest Spring Boot, and latest LTS Java items are delivered by this change; verify the comment links the change or PR.

## 6. Final Verification

- [ ] 6.1 Run `pnpm api:build` and `pnpm api:test` from a clean state (`apps/api/gradlew -p apps/api clean`); verify both pass.
- [ ] 6.2 Run `openspec validate upgrade-spring-boot-4 --strict` and `openspec validate --all`; verify no errors in this change or in the edited in-flight changes.
- [ ] 6.3 Run `git diff --check`; verify no whitespace errors.
