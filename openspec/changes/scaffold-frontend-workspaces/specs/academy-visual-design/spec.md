## ADDED Requirements

### Requirement: Frontend Scaffold Visual Token Boundary
The visual-design capability SHALL guide scaffolded Tailwind, CSS, and shared UI token configuration for frontend workspaces.

#### Scenario: Tailwind uses Academy tokens
GIVEN frontend Tailwind configuration is scaffolded
WHEN colors, typography, spacing, geometry, or motion tokens are defined
THEN the scaffold reflects accepted Academy visual design constraints
AND does not introduce conflicting global theme values.

#### Scenario: App scaffolds do not redefine visual contract
GIVEN `apps/web` or `apps/admin` defines local styles
WHEN style ownership is reviewed
THEN app styles consume shared visual tokens where feasible
AND do not redefine global art direction, typography roles, color semantics, geometry, or iconography.
