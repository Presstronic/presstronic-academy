## ADDED Requirements

### Requirement: Shell Responsibility Boundary
The shell capability SHALL own top-level screen resolution, protected route access, persistent app chrome, app navigation, theme coordination, and shell-level render side effects for in-app Academy surfaces.

#### Scenario: Screen routing delegates to shell
- **GIVEN** a capability needs to navigate to another Academy screen
- **WHEN** the navigation targets an app-level screen identifier
- **THEN** the capability invokes shell-owned navigation behavior
- **AND** does not define independent screen registry or protected-route policy.

#### Scenario: Public and auth screens bypass app chrome
- **GIVEN** the active screen is public or authentication entry
- **WHEN** the shell resolves screen context
- **THEN** the shell owns whether app chrome is rendered
- **AND** surface capabilities only define their own content.

#### Scenario: Theme changes coordinate through shell
- **GIVEN** a surface exposes theme preference controls
- **WHEN** the learner changes the active theme
- **THEN** the shell owns document-level theme application and synchronization rules
- **AND** the surface owns only its local control presentation.
