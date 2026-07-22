## ADDED Requirements

### Requirement: MVP Spring Boot API Scaffolding Sequence
The MVP scope SHALL allow primary Spring Boot API scaffolding after frontend workspace boundaries are accepted and before feature-specific backend API implementation.

#### Scenario: API scaffold follows frontend scaffold
GIVEN frontend workspace scaffolding has been accepted
WHEN backend implementation scaffolding begins
THEN Spring Boot API scaffolding may proceed as the next MVP implementation foundation
AND it references accepted product boundaries instead of redefining learner or admin workflows.

#### Scenario: API scaffold avoids product workflow implementation
GIVEN the Spring Boot API workspace is scaffolded
WHEN MVP scope is enforced
THEN the scaffold includes buildable backend foundations, runtime configuration conventions, health/readiness checks, REST-first conventions, and WebSocket readiness
AND defers production learner/admin/content/prompt/delivery/mentor workflows to focused implementation proposals or tasks.

#### Scenario: Contracts and infrastructure remain separate
GIVEN Spring Boot API scaffolding is underway
WHEN shared API contracts, generated clients, local infrastructure, persistence, worker jobs, or service activation work is considered
THEN those areas remain separate proposal candidates
AND are not implemented as part of backend API scaffolding.
