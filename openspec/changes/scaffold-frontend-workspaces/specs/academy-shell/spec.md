## ADDED Requirements

### Requirement: Learner Frontend Shell Scaffold Boundary
The shell capability SHALL guide learner app routing and layout scaffolding without requiring full screen implementation during frontend workspace setup.

#### Scenario: Shell route shape supported
GIVEN `apps/web` is scaffolded
WHEN initial routing or layout placeholders are created
THEN the scaffold can represent public landing/auth surfaces separately from authenticated app-shell surfaces
AND does not need to implement every learner screen behavior in the scaffold change.

#### Scenario: Shell implementation remains learner-owned
GIVEN the learner app shell is implemented later
WHEN shell code is added
THEN it lives in `apps/web`
AND reusable shell UI primitives may live in `packages/ui` only when they are app-agnostic.
