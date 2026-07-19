# Academy Design System Components Specification

## Purpose

Define the reusable Presstronic Academy UI components.

This specification captures component props, states, visual variants, local interaction behavior, accessibility expectations, visual-design fidelity, and composition boundaries for the UI kit components used by the Academy screens. It does not specify package distribution, server integration, or persistence.

## Requirements

### Requirement: Button Variants
WHERE a Button component is rendered,
the system SHALL support primary, secondary, ghost, and destructive variants with token-based visual styling.

#### Scenario: Default button variant
GIVEN a Button is rendered without a variant prop
WHEN the button appears
THEN the system displays the primary variant.

#### Scenario: Unknown button variant
GIVEN a Button is rendered with an unknown variant prop
WHEN the button appears
THEN the system falls back to the primary variant.

#### Scenario: Destructive button variant
GIVEN a Button is rendered with variant `destructive`
WHEN the button appears
THEN the system displays destructive color styling.

### Requirement: Button Sizes
WHERE a Button component is rendered,
the system SHALL support small, medium, and large sizing through the `sm`, `md`, and `lg` size values.

#### Scenario: Default button size
GIVEN a Button is rendered without a size prop
WHEN the button appears
THEN the system displays the medium size.

#### Scenario: Unknown button size
GIVEN a Button is rendered with an unknown size prop
WHEN the button appears
THEN the system falls back to the medium size.

#### Scenario: Large button size
GIVEN a Button is rendered with size `lg`
WHEN the button appears
THEN the system uses the large padding and text size.

### Requirement: Button Interaction States
WHEN a Button component receives pointer interaction,
the system SHALL show hover, pressed, keyboard, and focus-visible states unless the button is disabled.

#### Scenario: Hover enabled button
GIVEN a Button is enabled
WHEN the pointer enters the button
THEN the system applies the variant hover styling.

#### Scenario: Press enabled button
GIVEN a Button is enabled
WHEN the pointer presses the button
THEN the system applies pressed color or border styling
AND does not move, lift, translate, or scale the button.

#### Scenario: Leave button
GIVEN a Button is in hover or pressed local state
WHEN the pointer leaves the button
THEN the system clears hover state
AND clears pressed state.

#### Scenario: Disabled button
GIVEN a Button is disabled
WHEN the button renders
THEN the system sets the native disabled attribute
AND displays disabled opacity
AND uses a not-allowed cursor
AND does not apply hover styling.

#### Scenario: Keyboard activation
GIVEN a Button is enabled
WHEN the user focuses it and presses Enter or Space
THEN the system activates the button action.

#### Scenario: Focus visible
GIVEN a Button is enabled
WHEN the button receives keyboard focus
THEN the system displays a visible focus indicator.

#### Scenario: Icon-only button label
GIVEN a Button displays only an icon or non-text visual content
WHEN the button renders
THEN the button has an accessible name.

### Requirement: Button Shape Effects
WHERE a Button component is rendered,
the system SHALL support optional notched shape and glow effects while respecting Academy-wide geometry constraints.

#### Scenario: Notched button
GIVEN a Button is rendered with notch enabled
WHEN the button appears
THEN the system applies the Academy notch clipping shape
AND consuming screens ensure the notch is used on at most one element class per screen.

#### Scenario: Primary glow
GIVEN a Button is rendered with glow enabled
AND the button variant is primary
WHEN the button appears
THEN the system applies cyan glow styling.

#### Scenario: Non-primary glow
GIVEN a Button is rendered with glow enabled
AND the button variant is not primary
WHEN the button appears
THEN the system does not apply cyan glow styling.

#### Scenario: Button typography
GIVEN a Button label is rendered
WHEN the button appears
THEN the system uses mono uppercase styling for compact command buttons where appropriate
AND uses sentence case when the button is a longer plain-language action.

### Requirement: Badge Tone and Variant
WHERE a Badge component is rendered,
the system SHALL support neutral, cyan, volt, green, and red tones with soft and solid variants.

#### Scenario: Default badge
GIVEN a Badge is rendered without tone or variant props
WHEN the badge appears
THEN the system displays the neutral soft badge style.

#### Scenario: Unknown badge tone
GIVEN a Badge is rendered with an unknown tone prop
WHEN the badge appears
THEN the system falls back to the neutral tone.

#### Scenario: Soft badge
GIVEN a Badge is rendered with variant `soft`
WHEN the badge appears
THEN the system uses tone tint background, tone foreground, and tone border styling.

#### Scenario: Solid badge
GIVEN a Badge is rendered with variant `solid`
WHEN the badge appears
THEN the system uses tone solid background and solid foreground styling
AND uses a transparent border.

### Requirement: Card Container
WHERE a Card component is rendered,
the system SHALL provide token-based surface styling with optional interactivity, selection state, padding, and notch shape.

#### Scenario: Default card
GIVEN a Card is rendered without optional props
WHEN the card appears
THEN the system displays the card surface
AND applies the default padding
AND uses default cursor behavior.

#### Scenario: Interactive card hover
GIVEN a Card is rendered as interactive
WHEN the pointer enters the card
THEN the system changes the background to the overlay surface
AND strengthens the border
AND uses a pointer cursor.

#### Scenario: Non-interactive card hover
GIVEN a Card is not interactive
WHEN the pointer enters the card
THEN the system keeps default card background and border styling.

#### Scenario: Selected cyan card
GIVEN a Card is selected
AND selectedTone is cyan or omitted
WHEN the card appears
THEN the system applies cyan-tinted selected background
AND displays a cyan left edge.

#### Scenario: Selected volt card
GIVEN a Card is selected
AND selectedTone is `volt`
WHEN the card appears
THEN the system applies volt-tinted selected background
AND displays a volt left edge.

#### Scenario: Notched card
GIVEN a Card is rendered with notch enabled
WHEN the card appears
THEN the system applies the Academy notch clipping shape
AND consuming screens ensure the notch is used on at most one element class per screen.

### Requirement: Progress Indicator
WHERE a Progress component is rendered,
the system SHALL display bounded progress using the configured value, max, tone, label, value display, and height.

#### Scenario: Default progress
GIVEN a Progress component is rendered without props
WHEN it appears
THEN the system uses value 0
AND uses max 100
AND displays cyan fill styling.

#### Scenario: Progress percentage
GIVEN a Progress component has value 50 and max 200
WHEN it renders
THEN the fill width is 25 percent.

#### Scenario: Progress lower bound
GIVEN a Progress component has a value less than 0
WHEN it renders
THEN the fill width is clamped to 0 percent.

#### Scenario: Progress upper bound
GIVEN a Progress component has a value greater than max
WHEN it renders
THEN the fill width is clamped to 100 percent.

#### Scenario: Progress tone
GIVEN a Progress component has tone `volt`
WHEN it renders
THEN the fill uses volt styling.

#### Scenario: Progress label and value
GIVEN a Progress component has a label
AND showValue is true
WHEN it renders
THEN the system displays the label
AND displays `value / max`.

### Requirement: Tabs Component
WHERE a Tabs component is rendered,
the system SHALL display tab buttons from item definitions and support controlled or internal active state.

#### Scenario: Default active tab
GIVEN Tabs are rendered without a value prop
AND items are present
WHEN the component initializes
THEN the first item is active.

#### Scenario: Controlled active tab
GIVEN Tabs are rendered with a value prop
WHEN the component renders
THEN the tab matching the value prop is active.

#### Scenario: Select tab
GIVEN Tabs are rendered with an onChange handler
WHEN the user activates a tab
THEN the system updates internal tab state
AND calls onChange with the selected value.

#### Scenario: Item object support
GIVEN a tab item is an object with value and label
WHEN the tab renders
THEN the system uses the object value for selection
AND uses the object label for display.

#### Scenario: Primitive item support
GIVEN a tab item is a primitive value
WHEN the tab renders
THEN the system uses that value for selection
AND uses that value for display.

### Requirement: Input Component
WHERE an Input component is rendered,
the system SHALL display optional label, hint, error, type, autocomplete, name, and focus-visible styling while forwarding native input props.

#### Scenario: Labeled input
GIVEN an Input has a label
WHEN the component renders
THEN the system displays the label above the input.

#### Scenario: Hint input
GIVEN an Input has a hint and no error
WHEN the component renders
THEN the system displays the hint below the input.

#### Scenario: Error input
GIVEN an Input has an error
WHEN the component renders
THEN the system displays the error below the input
AND applies error styling to the label and input border.

#### Scenario: Focused input
GIVEN an Input has no error
WHEN the input receives keyboard focus
THEN the system applies cyan focus border and focus shadow styling.

#### Scenario: Input type
GIVEN an Input is rendered with type `password`
WHEN the input renders
THEN the native input type is password.

#### Scenario: Input accessible name
GIVEN an Input is rendered for user-entered data
WHEN the input renders
THEN the native input has an accessible name from a visible label or `aria-label`.

#### Scenario: Input autocomplete metadata
GIVEN an Input is rendered for a known profile or authentication field
WHEN the input renders
THEN the input includes an appropriate `name` and `autocomplete` value.

### Requirement: Select Component
WHERE a Select component is rendered,
the system SHALL display optional label, selectable options, hint, error, accessible naming, focus styling, and a visual dropdown marker while forwarding native select props.

#### Scenario: Labeled select
GIVEN a Select has a label
WHEN the component renders
THEN the system displays the label above the select.

#### Scenario: String options
GIVEN a Select option is a string
WHEN options render
THEN the system uses the string as the option value
AND uses the string as the option label.

#### Scenario: Object options
GIVEN a Select option is an object with value and label
WHEN options render
THEN the system uses the object value as the option value
AND uses the object label as the option label.

#### Scenario: Focused select
GIVEN a Select is displayed
WHEN the select receives focus
THEN the system applies cyan focus border styling.

#### Scenario: Select accessible name
GIVEN a Select is rendered for user-entered data
WHEN the select renders
THEN the native select has an accessible name from a visible label or `aria-label`.

#### Scenario: Select error
GIVEN a Select has an error
WHEN the component renders
THEN the system displays the error below the select
AND exposes the error to assistive technology.

### Requirement: Checkbox Component
WHERE a Checkbox component is rendered,
the system SHALL support controlled and uncontrolled checked state with optional label, accessible naming, keyboard activation, focus-visible styling, and change callback.

#### Scenario: Default unchecked checkbox
GIVEN a Checkbox is rendered without checked or defaultChecked props
WHEN it appears
THEN the checkbox is off.

#### Scenario: Default checked checkbox
GIVEN a Checkbox is rendered with defaultChecked true
WHEN it appears
THEN the checkbox is on.

#### Scenario: Controlled checkbox
GIVEN a Checkbox is rendered with checked true
WHEN it appears
THEN the checkbox is on regardless of internal state.

#### Scenario: Toggle checkbox
GIVEN a Checkbox is displayed
WHEN the user activates the checkbox label
THEN the system toggles the local checked state
AND calls onChange with the new checked value when onChange is provided.

#### Scenario: Keyboard checkbox
GIVEN a Checkbox is focused
WHEN the user presses Space
THEN the system toggles the checkbox state
AND displays a visible focus indicator.

#### Scenario: Checkbox accessible name
GIVEN a Checkbox is rendered
WHEN the checkbox renders
THEN the native checkbox has an accessible name from a visible label or `aria-label`.

#### Scenario: Checked indicator
GIVEN a Checkbox is on
WHEN it renders
THEN the system displays the checkmark indicator.

### Requirement: Switch Component
WHERE a Switch component is rendered,
the system SHALL support controlled and uncontrolled on state with optional label, accessible naming, keyboard activation, focus-visible styling, and change callback.

#### Scenario: Default off switch
GIVEN a Switch is rendered without checked or defaultChecked props
WHEN it appears
THEN the switch is off.

#### Scenario: Default on switch
GIVEN a Switch is rendered with defaultChecked true
WHEN it appears
THEN the switch is on.

#### Scenario: Controlled switch
GIVEN a Switch is rendered with checked true
WHEN it appears
THEN the switch is on regardless of internal state.

#### Scenario: Toggle switch
GIVEN a Switch is displayed
WHEN the user activates the switch label
THEN the system toggles the local on state
AND calls onChange with the new on value when onChange is provided.

#### Scenario: Keyboard switch
GIVEN a Switch is focused
WHEN the user presses Space
THEN the system toggles the switch state
AND displays a visible focus indicator.

#### Scenario: Switch accessible name
GIVEN a Switch is rendered
WHEN the switch renders
THEN the native switch control has an accessible name from a visible label or `aria-label`.

#### Scenario: Switch thumb position
GIVEN a Switch is on
WHEN it renders
THEN the switch thumb is positioned on the right side.

### Requirement: Dialog Component
WHERE a Dialog component is rendered,
the system SHALL display accessible modal content only when open and SHALL support backdrop, Escape, focus-trap, and return-focus behavior.

#### Scenario: Closed dialog
GIVEN a Dialog has open set to false
WHEN it renders
THEN the system renders no dialog content.

#### Scenario: Open dialog
GIVEN a Dialog has open set to true
WHEN it renders
THEN the system displays a fixed backdrop
AND displays a notched modal panel
AND displays its children
AND exposes modal semantics to assistive technology
AND consuming screens treat the active dialog as the screen's notched element class while it is open.

#### Scenario: Optional dialog header
GIVEN a Dialog has eyebrow and title props
WHEN it renders
THEN the system displays the eyebrow
AND displays the title.

#### Scenario: Optional dialog footer
GIVEN a Dialog has footer content
WHEN it renders
THEN the system displays the footer below the body
AND aligns footer actions to the end.

#### Scenario: Backdrop close
GIVEN a Dialog is open
WHEN the user activates the backdrop
THEN the system calls onClose.

#### Scenario: Escape close
GIVEN a Dialog is open
WHEN the user presses Escape
THEN the system calls onClose.

#### Scenario: Focus trapped
GIVEN a Dialog is open
WHEN the user tabs through focusable controls
THEN focus remains inside the dialog until it closes.

#### Scenario: Return focus
GIVEN a Dialog is open from a triggering control
WHEN the dialog closes
THEN focus returns to the triggering control.

#### Scenario: Panel click does not close
GIVEN a Dialog is open
WHEN the user activates inside the modal panel
THEN the system prevents the click from propagating to the backdrop close handler.

### Requirement: Tooltip Component
WHERE a Tooltip component is rendered,
the system SHALL display tooltip content on hover and keyboard focus and position it above or below the wrapped children.

#### Scenario: Tooltip hidden initially
GIVEN a Tooltip is rendered
WHEN the pointer is not over the tooltip wrapper
THEN the tooltip content is not displayed.

#### Scenario: Tooltip appears on hover
GIVEN a Tooltip is rendered
WHEN the pointer enters the tooltip wrapper
THEN the system displays the tooltip content.

#### Scenario: Tooltip appears on focus
GIVEN a Tooltip wraps a focusable control
WHEN the wrapped control receives keyboard focus
THEN the system displays the tooltip content.

#### Scenario: Tooltip hides on leave
GIVEN a Tooltip is visible
WHEN the pointer leaves the tooltip wrapper
THEN the system hides the tooltip content.

#### Scenario: Required information is not tooltip-only
GIVEN a Tooltip contains explanatory information
WHEN the tooltip is unavailable to a user
THEN the user can still complete the relevant task without relying on tooltip-only content.

#### Scenario: Default tooltip position
GIVEN a Tooltip is rendered without side prop
WHEN the tooltip appears
THEN the system positions the tooltip above the wrapped children.

#### Scenario: Bottom tooltip position
GIVEN a Tooltip is rendered with side `bottom`
WHEN the tooltip appears
THEN the system positions the tooltip below the wrapped children.

### Requirement: Toast and Status Component
WHERE Academy screens display transient or persistent feedback,
the system SHALL provide a reusable status component that supports tone, duration, dismissal, and assistive-technology announcements.

#### Scenario: Success status
GIVEN a screen displays a successful action status
WHEN the Status component renders
THEN the system displays success tone styling
AND announces the message politely to assistive technology.

#### Scenario: Error status
GIVEN a screen displays a failed action status
WHEN the Status component renders
THEN the system displays error tone styling
AND keeps the error visible until dismissed or resolved.

#### Scenario: Auto-dismiss status
GIVEN a non-critical success status has a duration
WHEN the duration elapses
THEN the system hides the status
AND does not remove focus from the user's current control.

### Requirement: Navigation Link Component
WHERE Academy screens navigate between routes or external destinations,
the system SHALL provide link semantics for navigation and button semantics for in-place commands.

#### Scenario: Internal navigation link
GIVEN a component navigates to another Academy screen
WHEN it renders
THEN the system exposes link semantics or an equivalent router link
AND preserves keyboard and assistive-technology navigation behavior.

#### Scenario: External link
GIVEN a component opens an external destination
WHEN it renders
THEN the system exposes a valid link destination
AND indicates new-window behavior when applicable.

### Requirement: Motion and Content Resilience
WHERE Academy components animate, truncate, or render user/content text,
the system SHALL respect reduced-motion preferences and keep content readable across supported viewports and locales.

#### Scenario: Reduced motion
GIVEN the user prefers reduced motion
WHEN an Academy component would animate
THEN the system disables or minimizes non-essential animation.

#### Scenario: Long content
GIVEN component text is longer than expected
WHEN the component renders
THEN the system wraps, truncates with an accessible full value, or otherwise preserves layout without overlapping adjacent content.

### Requirement: Component Styling Boundary
WHERE the design-system components are used by Academy screens,
the system SHALL rely on Academy CSS tokens for colors, typography, spacing, motion, surfaces, borders, and notch styling.

#### Scenario: Token-based styling
GIVEN any Academy design-system component renders
WHEN its styles are applied
THEN the system references Academy CSS custom properties for visual styling.

#### Scenario: Square component geometry
GIVEN a Button, Badge, Card, Input, Select, Dialog, Checkbox, or Switch renders
WHEN component geometry is applied
THEN the system uses zero-radius square or notched geometry rather than rounded corners
AND does not render pills.

#### Scenario: Approved component colors
GIVEN an Academy design-system component renders
WHEN color is applied
THEN the system uses the Academy graphite, cyan, volt, magenta, green, and red token palette
AND does not introduce unapproved hues.

#### Scenario: Component motion
GIVEN a component uses hover, press, focus, open, close, or status transitions
WHEN motion is applied
THEN the transition uses Academy timing between 120 and 320 milliseconds
AND avoids bouncy movement, lift, translate, or scale effects.

#### Scenario: Icon source
GIVEN a component includes an icon
WHEN the icon renders
THEN the icon uses Lucide outline styling with currentColor
AND does not use emoji or decorative hand-authored SVGs.

### Requirement: Component Responsibility Boundary
WHERE Academy design-system components handle interaction,
the system SHALL limit behavior to presentational and local component state and SHALL NOT perform persistence, routing, network calls, validation, or business logic unless explicitly supplied by consuming screens through props.

#### Scenario: Component callbacks delegated
GIVEN a component receives an event callback prop
WHEN the relevant component interaction occurs
THEN the system calls the callback
AND leaves business behavior to the consuming screen.

#### Scenario: No implicit persistence
GIVEN a component updates local hover, focus, checked, pressed, open, or active state
WHEN that state changes
THEN the component does not persist the state externally.

#### Scenario: No implicit network behavior
GIVEN a component is activated
WHEN no consuming screen callback performs a network action
THEN the component itself does not issue network requests.
