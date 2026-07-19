# Academy Landing Specification

## Purpose

Define the public Presstronic Academy landing experience.

This specification captures the landing page content structure, public calls to action, story-preview affordances, pricing presentation, footer links, public navigation behavior, and entry points to shared privacy controls. It does not specify payment processing implementation or legal-document content.

## Requirements

### Requirement: Public Landing Presentation
WHEN the application displays the landing screen,
the system SHALL render the public marketing entry point without the in-app application shell.

#### Scenario: Landing outside app shell
GIVEN the current screen is `landing`
WHEN the application renders
THEN the landing page is displayed
AND the sidebar is not displayed
AND the in-app top bar is not displayed.

#### Scenario: Landing brand identity
GIVEN the landing page is displayed
WHEN the user views the first viewport
THEN the Presstronic Academy lockup is visible in the navigation bar
AND the hero communicates the choose-your-own-adventure software mastery positioning.

#### Scenario: Landing visual direction
GIVEN the landing page is displayed
WHEN visual styling is applied
THEN the system uses the Academy graphite, signal cyan, and sparse volt visual language
AND does not use photos, illustration, 3D art, or gradient decoration as the primary visual treatment.

### Requirement: Landing Navigation Bar
WHERE the landing page is displayed,
the system SHALL show a sticky public navigation bar with brand, section labels, and authentication entry actions.

#### Scenario: Navigation labels
GIVEN the landing page is displayed
WHEN the navigation bar renders
THEN the navigation bar displays Paths
AND displays Challenges
AND displays Pricing.

#### Scenario: Section navigation
GIVEN the landing page is displayed
WHEN the user activates Paths, Challenges, or Pricing
THEN the system scrolls or navigates to the corresponding public landing section
AND keeps keyboard focus in a predictable location at the destination.

#### Scenario: Sticky navigation styling
GIVEN the landing page navigation bar is sticky
WHEN the page is scrolled
THEN the navigation background uses the Academy page color at high opacity
AND may use the approved backdrop blur treatment.

#### Scenario: Sign in action
GIVEN the landing page is displayed
WHEN the user activates `Sign in`
THEN the system navigates to the authentication screen.

#### Scenario: Enroll action
GIVEN the landing page is displayed
WHEN the user activates `Enroll`
THEN the system navigates to the authentication screen.

### Requirement: Landing Hero
WHEN the landing page renders the hero section,
the system SHALL present the primary product promise, primary enrollment action, secondary preview action, and product metrics.

#### Scenario: Hero copy
GIVEN the landing page is displayed
WHEN the hero section renders
THEN the hero headline communicates mastering software one decision at a time
AND the hero body explains that Presstronic Academy replaces tutorials with a branching, story-driven adventure.

#### Scenario: Primary hero CTA
GIVEN the landing hero is displayed
WHEN the user activates `Begin your first mission`
THEN the system navigates to the authentication screen.

#### Scenario: Secondary hero CTA
GIVEN the landing hero is displayed
WHEN the user views the hero actions
THEN the system displays a secondary `Watch a branch play out` action.

#### Scenario: Hero metrics
GIVEN the landing hero is displayed
WHEN the user views the metrics row
THEN the system displays story path count, challenge count, and learner participation metrics from configured product metrics
AND does not hard-code temporary mockup counts as contractual product values.

#### Scenario: Hero background treatment
GIVEN the landing hero is displayed
WHEN hero background styling is applied
THEN the system may use the approved 48px grid
AND may use one soft cyan radial glow
AND does not stack additional decorative background effects.

#### Scenario: Hero type scale
GIVEN the landing hero headline is displayed
WHEN typography is applied on a desktop viewport
THEN the headline uses the Academy display type role
AND stays within the approved hero-scale range.

### Requirement: Feature Summary
WHEN the landing page renders the feature summary section,
the system SHALL describe the core learning model through four feature cards.

#### Scenario: Feature cards
GIVEN the landing page is displayed
WHEN the user views the `HOW IT WORKS` section
THEN the system displays feature cards for Branching curriculum
AND Skill challenges
AND Modular lessons
AND Progression that means something.

#### Scenario: Branching curriculum explanation
GIVEN the feature summary section is displayed
WHEN the Branching curriculum card renders
THEN it explains that decisions fork the story
AND that the path remembers learner choices.

#### Scenario: Skill challenge explanation
GIVEN the feature summary section is displayed
WHEN the Skill challenges card renders
THEN it explains that learners work with real code and tests
AND passing a run unlocks the next chapter.

### Requirement: Story Preview
WHEN the landing page renders the story preview section,
the system SHALL show a sample branch decision from The Broken Pipeline.

#### Scenario: Story preview context
GIVEN the landing page is displayed
WHEN the story preview section renders
THEN the system identifies the preview as live from a path
AND displays copy explaining that chapters end in a fork.

#### Scenario: Preview branch choices
GIVEN the story preview section is displayed
WHEN the preview card renders
THEN it displays the Broken Pipeline chapter context
AND displays the quoted scenario about the queue worker
AND displays choice A for patching fast
AND displays choice B for adding a dead-letter queue.

#### Scenario: Try this fork action
GIVEN the story preview section is displayed
WHEN the user activates `Try this fork`
THEN the system navigates to the authentication screen.

### Requirement: Pricing Presentation
WHEN the landing page renders the pricing section,
the system SHALL present Recruit and Operative subscription options.

#### Scenario: Pricing headline
GIVEN the landing page is displayed
WHEN the pricing section renders
THEN the system displays the pricing headline `One subscription. Every path.`

#### Scenario: Recruit plan
GIVEN the pricing section is displayed
WHEN the Recruit plan renders
THEN the system displays a price of `$0`
AND describes access as Act 1 of every path
AND displays a `Start free` action.

#### Scenario: Operative plan
GIVEN the pricing section is displayed
WHEN the Operative plan renders
THEN the system displays a price of `$19 / MONTH`
AND describes access as every act, every branch, all challenges, and full progression
AND displays an `Enroll now` action.

#### Scenario: Pricing actions navigate to auth
GIVEN the pricing section is displayed
WHEN the user activates `Start free` or `Enroll now`
THEN the system navigates to the authentication screen.

#### Scenario: Start free intent
GIVEN the pricing section is displayed
WHEN the user activates `Start free`
THEN the system navigates to enrollment mode
AND carries the Recruit plan intent into account creation.

#### Scenario: Paid plan intent
GIVEN the pricing section is displayed
WHEN the user activates `Enroll now`
THEN the system navigates to enrollment mode
AND carries the Operative plan intent into account creation or checkout.

### Requirement: Footer Link Columns
WHEN the landing footer renders,
the system SHALL display grouped public links for product, learning, company, and legal destinations.

#### Scenario: Footer groups
GIVEN the landing footer is displayed
WHEN the link columns render
THEN the system displays a Product group
AND displays a Learn group
AND displays a Company group
AND displays a Legal group.

#### Scenario: Footer link destinations
GIVEN footer links are displayed
WHEN a user activates a footer link
THEN the system navigates to the configured internal route, public document, or external destination
AND does not render inert footer links as clickable controls.

#### Scenario: Footer operational metadata
GIVEN the landing footer is displayed
WHEN the footer metadata renders
THEN the system displays the Presstronic Academy lockup
AND displays social icons
AND displays all-systems-operational status
AND displays copyright, license, and Kansas City location metadata.

### Requirement: Public Compliance Badges
WHEN the landing footer renders its bottom bar,
the system SHALL display compliance badges for GDPR, CCPA, and WCAG 2.2 AA.

#### Scenario: Compliance badges visible
GIVEN the landing footer is displayed
WHEN the user views the footer bottom bar
THEN the system displays a GDPR badge
AND displays a CCPA badge
AND displays a WCAG 2.2 AA badge.

### Requirement: Landing Action Boundary
WHERE the landing page handles user actions,
the system SHALL route enrollment actions to authentication and route privacy actions to shared privacy controls.

#### Scenario: Data export delegates to privacy controls
GIVEN the landing footer is displayed
WHEN the user activates `Request my data`
THEN the landing page delegates export behavior to the shared privacy-controls capability.

#### Scenario: Deletion delegates to privacy controls
GIVEN the deletion confirmation dialog is open
WHEN the user confirms deletion
THEN the landing page delegates erasure behavior to the shared privacy-controls capability.

#### Scenario: Cookie preferences delegate to privacy controls
GIVEN the cookie preferences dialog is open
WHEN the user saves preferences
THEN the landing page delegates preference persistence to the shared privacy-controls capability.

### Requirement: Public Responsive Navigation
WHERE the landing page is displayed on narrow or touch-first viewports,
the system SHALL provide public navigation that remains reachable, readable, and keyboard accessible.

#### Scenario: Mobile navigation access
GIVEN the landing page is displayed on a narrow viewport
WHEN the navigation bar renders
THEN the system provides access to public section links and authentication actions
AND prevents navigation content from overlapping the hero or page content.

#### Scenario: Landmark structure
GIVEN the landing page is displayed
WHEN assistive technology navigates the page
THEN the system exposes recognizable header, main, section, and footer landmarks.

### Requirement: Landing Responsibility Boundary
The landing capability SHALL own public landing presentation, marketing section structure, public calls to action, footer entry points, and delegation to shared capabilities without owning shared privacy-control, authentication, billing, shell, or global visual-design internals.

#### Scenario: Privacy actions delegate to privacy controls
- **GIVEN** the landing page exposes data export, account erasure, or cookie preference entry points
- **WHEN** the user activates one of those entry points
- **THEN** the landing page invokes the shared privacy-controls capability
- **AND** does not define privacy request persistence, verification, consent, or erasure policy behavior itself.

#### Scenario: Auth and billing actions remain entry points
- **GIVEN** the landing page displays enrollment, sign-in, or plan call-to-action controls
- **WHEN** the user activates one of those controls
- **THEN** the landing page routes to authentication or plan intent capture
- **AND** does not define authentication form validation, session lifecycle, checkout, entitlement, or subscription behavior itself.

#### Scenario: Landing visual treatment references global design
- **GIVEN** the landing page specifies visual treatment for public sections
- **WHEN** the implementation applies colors, typography, geometry, motion, or decorative treatments
- **THEN** the landing page follows the academy-visual-design capability
- **AND** only specifies landing-specific layout or content exceptions.
