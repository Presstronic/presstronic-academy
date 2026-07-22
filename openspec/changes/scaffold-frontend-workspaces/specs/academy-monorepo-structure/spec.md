## ADDED Requirements

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
