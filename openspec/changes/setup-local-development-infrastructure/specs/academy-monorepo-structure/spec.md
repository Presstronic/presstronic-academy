## ADDED Requirements

### Requirement: Local Infrastructure Activation
The monorepo structure capability SHALL allow accepted local infrastructure work to activate development-only assets under `infra/` while preserving production deployment and service ownership boundaries.

#### Scenario: Local infrastructure assets are active
GIVEN `setup-local-development-infrastructure` is accepted and applied
WHEN local infrastructure files are created
THEN they live under `infra/` or root scripts that delegate to `infra/`
AND they are documented as development-only assets.

#### Scenario: Local infrastructure does not activate services
GIVEN local dependency containers exist
WHEN `services/*`, `apps/worker`, or `apps/gateway` are reviewed
THEN they remain inactive unless separately accepted
AND local dependency containers are not treated as Academy service implementations.
