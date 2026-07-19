## ADDED Requirements

### Requirement: Auth Entry Responsibility Boundary
The auth-entry capability SHALL own authentication screen presentation, form modes, field validation, submission state, session lifecycle entry behavior, access-key recovery, and authentication abuse feedback while delegating plan checkout, entitlement, and app-shell protected routing to their owning capabilities.

#### Scenario: Plan intent is consumed but not owned
- **GIVEN** the authentication screen receives a plan intent from landing or billing access
- **WHEN** the user completes enrollment
- **THEN** auth-entry carries the intent through account creation
- **AND** billing-access owns checkout, entitlement, and subscription behavior.

#### Scenario: Protected route return is shell-owned
- **GIVEN** an unauthenticated learner is redirected to authentication from a protected route
- **WHEN** authentication succeeds
- **THEN** auth-entry reports successful authentication
- **AND** academy-shell owns return-destination resolution.

#### Scenario: Auth visuals follow global design
- **GIVEN** auth-entry specifies authentication screen styling
- **WHEN** global colors, typography, geometry, or motion are applied
- **THEN** auth-entry follows academy-visual-design rather than redefining global visual rules.
