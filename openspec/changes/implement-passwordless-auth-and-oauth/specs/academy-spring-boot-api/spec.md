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

## ADDED Requirements

### Requirement: Authenticated WebSocket Connections
WHERE `apps/api` accepts WebSocket connections,
the system SHALL authenticate each connection at the handshake, reject cross-site connection attempts, and close connections whose session is no longer valid.

#### Scenario: Unauthenticated handshake is rejected
GIVEN a client opens a WebSocket connection without a valid authenticated session
WHEN the handshake is processed
THEN the system rejects the connection before it is established
AND no channel data is sent to the client.

#### Scenario: Cross-site handshake is rejected
GIVEN a WebSocket handshake arrives with an Origin that is not a configured Academy web origin
WHEN the handshake is processed
THEN the system rejects the connection
AND does so even when the request carries a valid session cookie.

#### Scenario: Connection is bound to one session
GIVEN a WebSocket handshake succeeds
WHEN the connection is established
THEN the connection is associated with the authenticated account and session that opened it
AND messages on that connection are attributed to that account.

#### Scenario: Revoked session closes the connection
GIVEN a WebSocket connection is open
WHEN its session is revoked by sign-out, sign-out everywhere, suspension, or refresh-reuse detection
THEN the system closes the connection promptly with a close reason that tells the client to re-authenticate
AND does not deliver further channel data on that connection.

#### Scenario: Access token expiry does not drop a valid session
GIVEN a WebSocket connection is open
AND the access token used at the handshake has expired
AND the session itself is still valid
WHEN the connection remains in use
THEN the system keeps the connection open
AND a reconnect after a drop requires a currently valid access token.

#### Scenario: Channel access is decided by the owning capability
GIVEN an authenticated connection subscribes to a channel such as a runner job stream
WHEN the subscription is processed
THEN the capability that owns the channel decides whether the account may subscribe
AND handshake authentication alone does not grant channel access.
