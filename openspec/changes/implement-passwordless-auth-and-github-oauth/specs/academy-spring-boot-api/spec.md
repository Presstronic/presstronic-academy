# Spec Delta

## MODIFIED Requirements

### Requirement: Backend Dependency Boundaries

The API scaffold SHALL include only dependencies needed for a buildable backend foundation and SHALL defer persistence, infrastructure, and service integrations until focused proposals accept them.

#### Scenario: Persistence dependencies deferred

GIVEN database schemas and migrations are not accepted yet
WHEN the API scaffold dependencies are reviewed
THEN JPA, migration tooling, repository code, and database-specific configuration are included only if needed for scaffold verification OR to satisfy an accepted persistence-bearing proposal
AND otherwise remain deferred to persistence or feature proposals.

#### Scenario: Auth-bearing persistence is permitted

GIVEN an accepted proposal introduces authentication, identity, session, or token persistence
WHEN the API workspace evolves to satisfy that proposal
THEN JPA, Flyway migrations, and the schema owned by that proposal MAY live in `apps/api`
AND the persistence code is scoped to the capability the accepting proposal owns
AND does not open a general invitation to add unrelated schemas without their own accepted proposals.

#### Scenario: External integrations deferred

GIVEN Redis, S3-compatible storage, email providers, billing providers, AI providers, or code execution systems are not yet wired
WHEN backend scaffolding is implemented
THEN those integrations remain absent or placeholder-documented
AND no credentials or production endpoints are committed
AND integrations that are wired to satisfy an accepted proposal (for example, Spring Security, an OAuth 2 client, or a Redis client used by that proposal) are permitted for the scope that proposal owns.

#### Scenario: Service extraction deferred

GIVEN future services may exist for code running, notifications, or billing
WHEN backend scaffolding is implemented
THEN `services/*`, `apps/worker`, and `apps/gateway` remain inactive unless a separate accepted proposal activates them.
