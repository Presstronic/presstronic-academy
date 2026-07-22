## ADDED Requirements

### Requirement: Code Runner Service Activation
The monorepo structure capability SHALL allow `services/code-runner` to become active only through an accepted proposal that defines isolation, contracts, observability, and failure behavior.

#### Scenario: Code runner service becomes active
GIVEN `activate-code-runner-service` is accepted and applied
WHEN code execution behavior is implemented
THEN `services/code-runner` becomes the active owner for isolated execution
AND app workspaces only orchestrate or consume its accepted contracts.

#### Scenario: Runner activation does not activate other services
GIVEN `services/code-runner` is active
WHEN `services/notifications`, `services/billing`, `apps/gateway`, or unrelated service directories are reviewed
THEN those areas remain inactive unless their own proposals are accepted.
