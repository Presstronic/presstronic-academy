# Academy Visual Design Specification

## Purpose

Define Presstronic Academy's visual design contract across public, authenticated, story, challenge, and component surfaces.

This specification captures the design-guide constraints that implementation SHALL preserve: muted cyberpunk art direction, tokenized color, typography, square geometry, limited notch usage, motion restraint, brand voice, iconography, background treatment, and layout rhythm. It does not specify CSS file organization, build tooling, or individual component implementation details.

## Requirements

### Requirement: Art Direction
WHERE Presstronic Academy UI is rendered,
the system SHALL present a muted cyberpunk instrument-panel aesthetic that remains professional, restrained, and distinct from the parent Station product.

#### Scenario: Academy visual identity
GIVEN any Academy screen is displayed
WHEN visual styling is applied
THEN the system uses graphite surfaces, signal cyan emphasis, sparse volt caution marks, and disciplined terminal-inspired structure
AND does not use the legacy Matrix green placeholder theme.

#### Scenario: Visual restraint
GIVEN a screen contains decorative cyberpunk treatments
WHEN the screen renders
THEN the system uses decoration only when it supports wayfinding, narrative context, or state
AND avoids neon overload, ornamental script, generic sci-fi glyphs, and decorative noise.

### Requirement: Color System
WHERE Academy UI uses color,
the system SHALL derive colors from the Academy token palette and SHALL NOT introduce unapproved hues.

#### Scenario: Primary accent
GIVEN an interactive primary accent is required
WHEN color is applied
THEN the system uses signal cyan from the Academy color tokens.

#### Scenario: Story or caution accent
GIVEN a story decision, checkpoint warning, or caution state requires emphasis
WHEN color is applied
THEN the system uses volt yellow from the Academy color tokens
AND does not use volt as general decoration.

#### Scenario: Thin system signal
GIVEN a live indicator, recording marker, code keyword, HUD corner accent, or single hero signal word requires a secondary signal
WHEN color is applied
THEN the system may use synth magenta from the Academy color tokens
AND does not make magenta the dominant color of a surface.

#### Scenario: Status colors
GIVEN the UI communicates success or destructive state
WHEN color is applied
THEN success uses the Academy green token
AND destructive state uses the Academy red token.

### Requirement: Typography and Voice
WHERE Academy UI renders text,
the system SHALL apply the Academy type system and content voice consistently.

#### Scenario: Type roles
GIVEN screen text is rendered
WHEN typography is applied
THEN display and body text use Archivo or its approved replacement
AND labels, data, numbers, code, badges, and status readouts use IBM Plex Mono or its approved replacement.

#### Scenario: Label casing
GIVEN an eyebrow, badge, telemetry label, or status readout is rendered
WHEN text is displayed
THEN the label uses uppercase mono styling with wide tracking
AND eyebrow labels use the `// LABEL` pattern.

#### Scenario: Body casing
GIVEN a headline, body paragraph, field label, button label, error message, or empty-state message is rendered
WHEN text is displayed
THEN the system uses sentence case unless the text is a mono label, badge, or status readout.

#### Scenario: Product voice
GIVEN Academy chrome or instructional UI text is displayed
WHEN copy is authored
THEN the system uses active, plain, mission-briefing language
AND uses fiction vocabulary sparingly
AND refers to learners as operatives where the product voice calls for it.

#### Scenario: Chrome punctuation
GIVEN product chrome text is displayed
WHEN punctuation is authored
THEN the text avoids exclamation marks
AND does not use emoji.

### Requirement: Geometry and Notch Usage
WHERE Academy UI renders components, panels, cards, dialogs, or controls,
the system SHALL use square geometry and reserve the signature notch for one element class per screen.

#### Scenario: Square geometry
GIVEN any button, input, select, checkbox, switch, badge, card, tab, dialog, toast, or panel renders
WHEN geometry is applied
THEN the system uses zero border radius
AND does not render pills or rounded cards.

#### Scenario: Signature notch limit
GIVEN a screen uses the notched top-right corner motif
WHEN screen-level styling is applied
THEN at most one element class on that screen uses the notch
AND the notch is reserved for a primary CTA, hero card, or active dialog.

### Requirement: Backgrounds and Decorative Treatments
WHERE Academy surfaces render background or cyberpunk dress treatments,
the system SHALL use only the approved treatments and SHALL avoid stacking treatments on the same element.

#### Scenario: Hero or auth background
GIVEN a hero or authentication surface renders
WHEN background decoration is applied
THEN the system may use the faint 48px grid
AND may use one soft cyan radial glow.

#### Scenario: Flat app background
GIVEN an authenticated app screen renders
WHEN the page background is applied
THEN the system uses flat graphite surfaces
AND does not use photos, illustration, 3D art, noise, or gradients as decoration.

#### Scenario: Terminal treatments
GIVEN a terminal, code, or story pane uses cyberpunk dress
WHEN decorative treatments are applied
THEN scanlines are limited to dark terminal or story panes
AND no element stacks multiple decorative treatments such as HUD corners, scanlines, neon top edge, hazard stripe, and glow at once.

### Requirement: Interaction and Motion
WHERE Academy UI reacts to user interaction,
the system SHALL use restrained color, border, and opacity changes without positional movement.

#### Scenario: Hover state
GIVEN an interactive element is hovered
WHEN hover styling is applied
THEN the system strengthens border, text color, or fill by one visual step
AND does not lift, translate, or scale the element.

#### Scenario: Press state
GIVEN an interactive element is pressed
WHEN pressed styling is applied
THEN the system darkens or strengthens the pressed visual state
AND does not move or scale the element.

#### Scenario: Motion timing
GIVEN a non-essential UI transition is used
WHEN motion is applied
THEN the duration is between 120 and 320 milliseconds
AND uses the Academy ease-out timing
AND does not use bouncy motion.

#### Scenario: Reduced motion
GIVEN the user prefers reduced motion
WHEN Academy UI would animate or type on
THEN the system disables or minimizes non-essential motion
AND preserves all content and functionality.

### Requirement: Layout Rhythm
WHERE Academy screens lay out content,
the system SHALL follow the Academy spacing and chrome dimensions unless a responsive constraint requires adaptation.

#### Scenario: Spacing scale
GIVEN screen or component spacing is applied
WHEN layout is calculated
THEN spacing uses the Academy 4px base scale
AND layout uses flex or grid gaps instead of ad hoc offsets.

#### Scenario: Content width
GIVEN a public or content-centered screen renders on a wide viewport
WHEN content is constrained
THEN primary content uses the Academy maximum content width of approximately 1200px.

#### Scenario: App sidebar width
GIVEN the app shell is expanded on a desktop viewport
WHEN sidebar layout renders
THEN the sidebar uses the Academy app chrome width of approximately 264px.

### Requirement: Iconography
WHERE Academy UI displays icons,
the system SHALL use the approved Lucide icon language and avoid decorative substitutes.

#### Scenario: Approved icon set
GIVEN an icon is needed in Academy UI
WHEN the icon renders
THEN the system uses a Lucide outline icon styled with currentColor
AND does not use emoji, hand-authored decorative SVGs, or unapproved icon styles.

#### Scenario: Recurring concept icons
GIVEN an icon represents story paths, challenges, lessons, progression, clearance, adventure map, XP, or choices
WHEN the icon is selected
THEN the system uses the corresponding approved Lucide concept icon where available.

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
