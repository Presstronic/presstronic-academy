## 1. Repository and Build Setup

- [ ] 1.1 Replace the `apps/api` placeholder with a Spring Boot application scaffold using Gradle Kotlin DSL.
- [ ] 1.2 Add backend build metadata needed for Java, Spring Boot, dependency management, tests, and application packaging.
- [ ] 1.3 Wire root-level or documented commands so contributors can run API build and tests from the project root.
- [ ] 1.4 Keep `apps/worker`, `apps/gateway`, `packages/contracts`, `services/*`, and `infra/*` placeholder-only unless a separate accepted proposal activates them.

## 2. Application Source Scaffold

- [ ] 2.1 Create the main Spring Boot application entry point under an Academy-owned Java package.
- [ ] 2.2 Establish feature/domain-oriented package guidance for future REST, WebSocket, auth, and orchestration code.
- [ ] 2.3 Add minimal scaffold documentation for `apps/api`, including local run, build, test, and health-check commands.
- [ ] 2.4 Avoid adding learner, admin, content, Code Prompt, Delivery, mentor, billing, or content health product endpoints in this scaffold.

## 3. Runtime Configuration and Observability

- [ ] 3.1 Add local/development configuration conventions without committing secrets or production assumptions.
- [ ] 3.2 Add or document type-safe configuration boundaries for future application-owned settings.
- [ ] 3.3 Provide a minimal health/readiness surface that verifies scaffold runtime availability.
- [ ] 3.4 Ensure health/readiness does not require PostgreSQL, Redis, S3, queues, AI providers, billing providers, or code execution systems before those integrations are accepted.

## 4. REST and WebSocket Readiness

- [ ] 4.1 Document where future REST controllers, DTOs, validation, and API error handling conventions will live.
- [ ] 4.2 Add only scaffold-level REST behavior needed for runtime verification, if any.
- [ ] 4.3 Document where future WebSocket configuration and handlers will live.
- [ ] 4.4 Defer WebSocket event contracts, connection authorization, retries, and fallback behavior to future workflow proposals.

## 5. Testing and Verification

- [ ] 5.1 Add a scaffold test that verifies the Spring application context or equivalent backend bootstrap.
- [ ] 5.2 Run the API build command.
- [ ] 5.3 Run the API test command.
- [ ] 5.4 Run `openspec validate scaffold-spring-boot-api --strict`.
- [ ] 5.5 Run `openspec validate --all --strict`.
- [ ] 5.6 Run `git diff --check`.

## 6. Follow-Up Boundaries

- [ ] 6.1 Identify `setup-shared-api-contracts` as the next proposal candidate after Spring Boot API scaffolding is accepted and applied.
- [ ] 6.2 Confirm persistence, migrations, generated clients, local infrastructure, worker jobs, gateway behavior, microservice extraction, and GraphQL remain deferred.
