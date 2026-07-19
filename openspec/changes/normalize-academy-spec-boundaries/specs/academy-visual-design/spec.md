## ADDED Requirements

### Requirement: Visual Design Responsibility Boundary
The visual-design capability SHALL be the authoritative owner for Academy art direction, color tokens, typography roles, geometry, motion, background treatment, iconography rules, and global visual constraints used by screens and reusable components.

#### Scenario: Screen specs reference global visual rules
- **GIVEN** a screen capability describes colors, typography, motion, geometry, iconography, or decorative treatments
- **WHEN** visual rules overlap with global Academy style
- **THEN** the screen capability references the visual-design capability
- **AND** does not redefine the global visual contract.

#### Scenario: Component specs reference global visual rules
- **GIVEN** a reusable component capability describes styling constraints
- **WHEN** the styling constraint is global to Academy rather than component-specific
- **THEN** the component capability references the visual-design capability
- **AND** only defines component-specific states, variants, and accessibility behavior.

#### Scenario: Volatile visual examples remain non-contractual
- **GIVEN** a mockup or design handoff contains example values or content
- **WHEN** those values are not explicitly required by the visual-design capability
- **THEN** other capabilities treat them as examples rather than independent product contracts.
