## ADDED Requirements

### Requirement: Component Responsibility Boundary
The design-system-components capability SHALL own reusable UI primitive behavior, accessibility contracts, variant APIs, and component-level styling while excluding app-level routing policy, persistence, backend behavior, and screen-specific workflows.

#### Scenario: Components delegate app behavior
- **GIVEN** a reusable component exposes a callback, link, or controlled value
- **WHEN** an app screen uses that component
- **THEN** the screen or shared app capability owns navigation, persistence, and side effects
- **AND** the component remains responsible only for rendering, interaction state, and accessibility semantics.

#### Scenario: Components use global visual design
- **GIVEN** a reusable component has styling variants
- **WHEN** the styling uses Academy colors, typography, motion, or geometry
- **THEN** the component follows the academy-visual-design capability
- **AND** only defines component-specific variant mappings.

#### Scenario: Component tests stay primitive-focused
- **GIVEN** a component is tested independently
- **WHEN** the test exercises behavior
- **THEN** it verifies primitive interaction, accessibility, and variant rendering
- **AND** does not assert app-specific data persistence or backend request behavior.
