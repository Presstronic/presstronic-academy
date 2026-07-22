## ADDED Requirements

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
