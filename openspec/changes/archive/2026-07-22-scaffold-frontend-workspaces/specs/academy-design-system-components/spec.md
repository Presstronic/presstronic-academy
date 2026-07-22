## ADDED Requirements

### Requirement: Shared UI Package Boundary
The design-system-components capability SHALL treat `packages/ui` as the implementation home for reusable Academy components and ShadCN-compatible primitives shared across frontend apps.

#### Scenario: Reusable component belongs in shared UI
GIVEN a UI component is reusable across learner and admin apps
WHEN the component is implemented
THEN it lives in `packages/ui`
AND exports a stable API for consuming frontend workspaces.

#### Scenario: App-specific composition stays app-owned
GIVEN a component or composition depends on learner or admin workflow state
WHEN implementation ownership is reviewed
THEN the app-specific composition lives in `apps/web` or `apps/admin`
AND `packages/ui` remains responsible for reusable primitives, variants, tokens, and accessibility behavior.

#### Scenario: ShadCN source ownership
GIVEN ShadCN components are added
WHEN their source files are committed
THEN they are treated as source-owned project components
AND are adapted to Academy visual design and accessibility requirements.
