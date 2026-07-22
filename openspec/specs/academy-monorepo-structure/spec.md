# Academy Monorepo Structure Specification

## Purpose

Define the Presstronic Academy repository ownership model for applications, shared packages, future services, infrastructure, documentation, and OpenSpec artifacts.

This specification captures durable workspace boundaries before implementation scaffolding begins. It does not specify individual API endpoints, database schemas, deployment environments, generated code layout, or service extraction timing.

## Requirements

### Requirement: Top-Level Workspace Ownership

The repository SHALL use top-level directories with distinct ownership for deployable applications, shared packages, independently deployable services, infrastructure assets, documentation, and OpenSpec artifacts.

#### Scenario: Repository ownership areas are present

GIVEN the repository structure is prepared for implementation
WHEN a contributor reviews the project root
THEN `apps/` owns deployable application entry points
AND `packages/` owns shared workspace packages
AND `services/` owns future independently deployable backend services
AND `infra/` owns infrastructure assets
AND `docs/` owns product, architecture, and design documentation
AND `openspec/` owns baseline specifications, active changes, and archived changes.

#### Scenario: New top-level areas require justification

GIVEN a future change proposes a new top-level directory
WHEN the change is reviewed
THEN the proposal identifies the ownership boundary that is not covered by the existing top-level areas
AND avoids adding overlapping top-level directories for the same responsibility.

### Requirement: Application Workspace Boundaries

The repository SHALL treat `apps/web`, `apps/admin`, `apps/api`, `apps/worker`, and `apps/gateway` as deployable application workspaces with distinct maturity expectations.

#### Scenario: Learner web application boundary

GIVEN learner-facing frontend work is implemented
WHEN the work belongs to the public or authenticated learner experience
THEN it lives under `apps/web`
AND uses React, strict TypeScript, Vite, Tailwind CSS, and ShadCN unless a later proposal changes the frontend stack.

#### Scenario: Admin application boundary

GIVEN admin or instructor frontend work is implemented
WHEN the work belongs to operational, instructional, support, moderation, reporting, or administrative workflows
THEN it lives under `apps/admin`
AND uses React, strict TypeScript, Vite, Tailwind CSS, and ShadCN unless a later proposal changes the frontend stack.

#### Scenario: Primary API application boundary

GIVEN backend API work is implemented before a service-specific extraction is accepted
WHEN the work exposes REST APIs, WebSocket workflows, authentication integration, or core Academy backend orchestration
THEN it lives under `apps/api`
AND uses Java Spring Boot as the primary backend application.

#### Scenario: Worker application boundary

GIVEN background work is implemented outside a request lifecycle
WHEN the work performs async jobs, scheduled jobs, event processing, code-runner orchestration, email orchestration, or other background coordination
THEN it lives under `apps/worker`
AND does not create an independently deployable service boundary unless a later proposal justifies that split.

#### Scenario: Gateway remains deferred

GIVEN the repository contains `apps/gateway`
WHEN no accepted proposal defines gateway routing, aggregation, edge authorization, or cross-service edge behavior
THEN `apps/gateway` remains empty or placeholder-only
AND application traffic continues to be owned by `apps/api` or infrastructure configuration.

### Requirement: Shared Package Boundaries

The repository SHALL use `packages/` for shared workspace packages that are consumed by applications without owning application workflows.

#### Scenario: Shared UI package boundary

GIVEN reusable frontend UI components are implemented for both learner and admin applications
WHEN the components wrap or extend ShadCN primitives, shared Academy styling, accessibility behavior, or reusable component variants
THEN they live under `packages/ui`
AND app-specific screens, routes, data loading, and workflow state remain in `apps/web` or `apps/admin`.

#### Scenario: Contracts package boundary

GIVEN API contracts or generated frontend clients are introduced
WHEN the contracts describe REST schemas, OpenAPI files, generated TypeScript clients, or shared validation schemas
THEN they live under `packages/contracts`
AND endpoint behavior remains owned by backend and product capability specs.

#### Scenario: Shared frontend configuration boundary

GIVEN frontend TypeScript or lint configuration is shared across workspaces
WHEN the configuration is reusable across frontend applications or packages
THEN TypeScript configuration lives under `packages/tsconfig`
AND ESLint configuration lives under `packages/eslint-config`.

### Requirement: Independently Deployable Service Maturity

The repository SHALL reserve `services/` for backend capabilities that require independent deployment, scaling, isolation, data ownership, vendor integration, or operational ownership beyond the primary API.

#### Scenario: Service placeholder is not an active boundary

GIVEN a service directory exists under `services/`
WHEN no accepted OpenSpec proposal activates that service
THEN the directory remains placeholder-only
AND production behavior is not implemented there.

#### Scenario: Code-runner service activation

GIVEN isolated code execution needs exceed what can safely be orchestrated from `apps/api` or `apps/worker`
WHEN a later proposal activates `services/code-runner`
THEN the proposal defines sandbox isolation, execution lifecycle, API contracts, observability, and failure behavior before implementation.

#### Scenario: Notifications service activation

GIVEN notification delivery needs independent scaling, delivery guarantees, provider integration, or operational ownership
WHEN a later proposal activates `services/notifications`
THEN the proposal defines message sources, delivery channels, retry behavior, observability, and ownership boundaries before implementation.

#### Scenario: Billing service activation

GIVEN billing integration needs independent deployment, provider isolation, compliance controls, or operational ownership outside `apps/api`
WHEN a later proposal activates `services/billing`
THEN the proposal defines billing contracts, entitlement synchronization, provider webhooks, observability, and failure behavior before implementation.

### Requirement: API Style Defaults

The repository SHALL use REST as the primary API style, allow WebSockets for live workflows, and defer GraphQL until a later proposal establishes a concrete need.

#### Scenario: REST-first contract

GIVEN frontend or external clients need backend data or commands
WHEN API behavior is specified
THEN REST endpoints and OpenAPI contracts are the default approach
AND shared contract artifacts live under `packages/contracts`.

#### Scenario: WebSocket workflow

GIVEN a workflow needs live progress, streaming status, collaboration, notifications, or long-running job updates
WHEN request-response REST polling is not sufficient
THEN the proposal may specify WebSocket behavior
AND defines connection lifecycle, authorization, events, retry behavior, and fallback behavior.

#### Scenario: GraphQL remains deferred

GIVEN a future change proposes GraphQL
WHEN the proposal is reviewed
THEN it identifies query composition, client data-shaping, or schema federation needs that REST and WebSockets do not satisfy
AND defines how GraphQL coexists with existing REST contracts.

### Requirement: Implementation Proposal Sequencing

The repository SHALL separate structure approval from implementation scaffolding and SHALL require focused follow-up proposals for major implementation surfaces.

#### Scenario: Structure proposal precedes scaffolding

GIVEN this monorepo structure proposal is still active
WHEN implementation work is planned
THEN React, Spring Boot, contracts, service, infrastructure, and CI scaffolding are deferred to follow-up proposals or tasks
AND this proposal remains focused on ownership boundaries.

#### Scenario: Follow-up implementation proposals

GIVEN the structure proposal is accepted
WHEN work begins on frontend, backend, contracts, local infrastructure, or a future service extraction
THEN each substantial implementation area references the accepted structure capability
AND defines its own affected files, verification commands, and acceptance criteria.

### Requirement: Frontend Scaffolding Application

The monorepo structure capability SHALL allow accepted frontend scaffolding to activate `apps/web`, `apps/admin`, `packages/ui`, `packages/tsconfig`, and `packages/eslint-config` while preserving other placeholder boundaries.

#### Scenario: Frontend placeholders become workspaces

GIVEN `scaffold-frontend-workspaces` is accepted and applied
WHEN frontend implementation scaffolding is created
THEN `apps/web`, `apps/admin`, `packages/ui`, `packages/tsconfig`, and `packages/eslint-config` become active pnpm workspaces
AND their ownership remains consistent with application and shared package boundaries.

#### Scenario: Backend and service placeholders stay inactive

GIVEN frontend scaffolding is implemented
WHEN a contributor reviews `apps/api`, `apps/worker`, `apps/gateway`, `packages/contracts`, or `services/*`
THEN those areas remain placeholder-only unless a separate accepted proposal activates them
AND frontend scaffolding does not introduce backend implementation there.

#### Scenario: Workspace metadata matches active packages

GIVEN frontend scaffolding is implemented
WHEN root workspace metadata and package manifests are reviewed
THEN they include the active frontend apps and packages
AND do not include stale package references for directories that remain placeholder-only.

### Requirement: Spring Boot API Scaffolding Application

The monorepo structure capability SHALL allow accepted backend scaffolding to activate `apps/api` as the primary Spring Boot backend workspace while preserving other backend, contract, service, and infrastructure boundaries.

#### Scenario: API placeholder becomes active workspace

GIVEN `scaffold-spring-boot-api` is accepted and applied
WHEN backend implementation scaffolding is created
THEN `apps/api` becomes an active Spring Boot workspace
AND its ownership remains consistent with the primary API application boundary.

#### Scenario: Worker gateway and services stay inactive

GIVEN Spring Boot API scaffolding is implemented
WHEN a contributor reviews `apps/worker`, `apps/gateway`, or `services/*`
THEN those areas remain placeholder-only unless a separate accepted proposal activates them
AND API scaffolding does not introduce independently deployable service behavior there.

#### Scenario: Contracts and infrastructure stay separate

GIVEN Spring Boot API scaffolding is implemented
WHEN a contributor reviews `packages/contracts` or `infra/*`
THEN those areas remain placeholder-only or documentation-only unless separate accepted proposals activate them
AND API scaffolding does not implement generated clients, Docker Compose dependencies, deployment assets, or environment provisioning.

#### Scenario: Workspace metadata matches backend activation

GIVEN Spring Boot API scaffolding is implemented
WHEN root workspace metadata and project documentation are reviewed
THEN they include the active API app where applicable
AND do not include stale backend package references for directories that remain placeholder-only.
