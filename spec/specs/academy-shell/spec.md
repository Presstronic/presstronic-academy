# Academy Shell Specification

## Purpose

Define the Presstronic Academy application frame, screen routing behavior, navigation model, theme behavior, and persistent shell state.

This specification captures intended application-shell behavior informed by `docs/scifi-mockups/Presstronic Academy.html` and its unbundled React source in `docs/scifi-mockups/Presstronic-Academy-design-system/ui_kits/academy/`.

## Requirements

### Requirement: Initial Screen Selection
WHEN the application loads,
the system SHALL select the initial screen from the URL hash when one is present, otherwise it SHALL display the landing screen.

#### Scenario: Landing screen without hash
GIVEN the application URL has no hash fragment
WHEN the application initializes
THEN the system displays the landing screen
AND does not wrap the landing screen in the in-app shell.

#### Scenario: Hash-selected screen
GIVEN the application URL hash is `#dashboard`
AND the user has an active authenticated session
WHEN the application initializes
THEN the system displays the dashboard screen
AND wraps the dashboard screen in the in-app shell.

#### Scenario: Auth hash-selected screen
GIVEN the application URL hash is `#auth`
WHEN the application initializes
THEN the system displays the authentication screen
AND does not wrap the authentication screen in the in-app shell.

### Requirement: Screen Registry
WHERE the application resolves a screen identifier,
the system SHALL support the current Academy screen set: landing, auth, dashboard, catalog, log, story, lesson, progression, profile, and certificate.

#### Scenario: In-app screen selection
GIVEN the current screen identifier is `catalog`
WHEN the application renders
THEN the system displays the catalog screen
AND wraps it with the persistent app shell.

#### Scenario: Public screen selection
GIVEN the current screen identifier is `landing`
WHEN the application renders
THEN the system displays the landing page without the app shell.

#### Scenario: Authentication screen selection
GIVEN the current screen identifier is `auth`
WHEN the application renders
THEN the system displays the authentication page without the app shell.

#### Scenario: Unknown screen identifier
GIVEN the current screen identifier is not in the Academy screen registry
WHEN the application resolves the screen
THEN the system displays a not-found state
AND provides navigation back to the landing screen or dashboard according to authentication state.

### Requirement: Hash Change Navigation
WHEN the browser hash changes to a non-empty screen identifier,
the system SHALL update the active screen to match that hash.

#### Scenario: External hash navigation
GIVEN the user is viewing the landing screen
AND the user has an active authenticated session
WHEN the browser hash changes to `#story`
THEN the system updates the active screen to `story`
AND displays the story screen in the app shell.

#### Scenario: Empty hash ignored after initialization
GIVEN the application is already running
WHEN the browser hash changes to an empty fragment
THEN the system keeps the current active screen.

### Requirement: Protected Route Access
WHERE a screen requires the in-app shell,
the system SHALL require an active authenticated session before rendering protected content.

#### Scenario: Unauthenticated protected hash
GIVEN the application URL hash is `#dashboard`
AND the user does not have an active authenticated session
WHEN the application initializes
THEN the system navigates to the authentication screen
AND stores `dashboard` as the post-authentication return destination.

#### Scenario: Return after authentication
GIVEN an unauthenticated user was redirected from `#lesson` to authentication
WHEN the user signs in successfully
THEN the system navigates to the lesson screen
AND renders it inside the in-app shell.

#### Scenario: Public routes remain public
GIVEN the user does not have an active authenticated session
WHEN the user navigates to the landing or authentication screen
THEN the system displays the requested public screen
AND does not require authentication.

### Requirement: Programmatic Navigation
WHEN a UI action calls the shared navigation handler with a screen identifier,
the system SHALL update the active screen to the requested screen.

#### Scenario: Landing call to action
GIVEN the user is viewing the landing screen
WHEN the user activates "Begin your first mission"
THEN the system navigates to the authentication screen.

#### Scenario: Dashboard mission resume
GIVEN the user is viewing the dashboard screen
WHEN the user activates "Re-enter story"
THEN the system navigates to the story screen.

#### Scenario: Certificate next mission
GIVEN the user is viewing the certificate screen
WHEN the user activates "Next mission"
THEN the system navigates to the catalog screen.

### Requirement: In-App Shell Rendering
WHERE the active screen is not `landing` or `auth`,
the system SHALL render the selected screen inside a persistent two-column application shell.

#### Scenario: Shell layout
GIVEN the user is viewing any in-app screen
WHEN the application renders the shell
THEN the system displays a left sidebar
AND displays a main content area
AND displays a top bar above the selected screen content.

#### Scenario: Public screens bypass shell
GIVEN the user is viewing the landing or authentication screen
WHEN the application renders
THEN the system does not display the sidebar
AND does not display the in-app top bar.

### Requirement: Sidebar Navigation Items
WHERE the app shell is visible,
the system SHALL display navigation entries for Dashboard, Catalog, Mission log, Story, Challenges, Progression, and Profile.

#### Scenario: Expanded sidebar labels
GIVEN the sidebar is expanded
WHEN the app shell renders
THEN each navigation entry displays its icon and text label.

#### Scenario: Active sidebar item
GIVEN the current screen is `lesson`
WHEN the app shell renders
THEN the Challenges navigation entry is marked active
AND the other navigation entries are not marked active.

#### Scenario: Sidebar item navigation
GIVEN the user is viewing the progression screen
WHEN the user activates the Catalog navigation item
THEN the system navigates to the catalog screen.

### Requirement: Sidebar Collapse State
WHEN the user collapses or expands the sidebar,
the system SHALL update the shell layout and persist the collapsed state in local storage.

#### Scenario: Collapse sidebar
GIVEN the sidebar is expanded
WHEN the user activates the collapse navigation control
THEN the sidebar width changes to the collapsed layout
AND navigation entries show icons without text labels
AND `academy-nav-collapsed` is stored as `1`.

#### Scenario: Expand sidebar
GIVEN the sidebar is collapsed
WHEN the user activates the expand navigation control
THEN the sidebar width changes to the expanded layout
AND navigation entries show icons with text labels
AND `academy-nav-collapsed` is stored as `0`.

#### Scenario: Restore collapsed preference
GIVEN local storage contains `academy-nav-collapsed` with value `1`
WHEN the application initializes
THEN the sidebar starts in the collapsed layout.

#### Scenario: Default expanded preference
GIVEN local storage does not contain `academy-nav-collapsed` with value `1`
WHEN the application initializes
THEN the sidebar starts in the expanded layout.

### Requirement: Sidebar Identity Block
WHERE the app shell is visible,
the system SHALL display the current user's identity and clearance context in the sidebar footer.

#### Scenario: Expanded identity block
GIVEN the sidebar is expanded
WHEN the app shell renders
THEN the sidebar footer displays the user's initials
AND displays the user's name
AND displays the user's clearance level.

#### Scenario: Collapsed identity block
GIVEN the sidebar is collapsed
WHEN the app shell renders
THEN the sidebar footer displays the user's initials
AND does not display the user's name or clearance text.

### Requirement: Theme Switching
WHERE the app shell is visible,
the system SHALL let the user switch between dark and light themes, persist the preference to the learner account when authenticated, and set the document theme attribute.

#### Scenario: Enable light theme
GIVEN the app shell is visible
AND the current theme is dark
WHEN the user turns off the Dark mode switch
THEN the system sets the active theme to light
AND sets `data-theme` on the document element to `light`.

#### Scenario: Enable dark theme
GIVEN the app shell is visible
AND the current theme is light
WHEN the user turns on the Dark mode switch
THEN the system sets the active theme to dark
AND sets `data-theme` on the document element to `dark`.

#### Scenario: Initial dark theme
GIVEN the application has initialized
AND no saved learner theme preference exists
WHEN the system resolves the active theme
THEN the active theme follows the browser color-scheme preference when available
AND otherwise defaults to dark.

#### Scenario: Restore saved theme
GIVEN the learner has a saved theme preference
WHEN the app shell initializes
THEN the system applies the saved preference
AND sets `data-theme` on the document element to the saved theme.

#### Scenario: Theme preference persists
GIVEN the learner changes the Dark mode switch
WHEN the theme changes
THEN the system persists the learner's theme preference
AND keeps the profile Dark mode preference in sync with the shell theme.

### Requirement: Top Bar Status
WHERE the app shell is visible,
the system SHALL display current screen context, online status, streak count, and XP total in the top bar.

#### Scenario: Screen context label
GIVEN the current screen is `dashboard`
WHEN the app shell renders
THEN the top bar displays `// DASHBOARD`.

#### Scenario: User telemetry
GIVEN the app shell is visible
WHEN the top bar renders
THEN the top bar displays online status
AND displays the user's current streak in days
AND displays the user's current XP total.

### Requirement: Screen Render Side Effects
WHEN the application renders or changes screens,
the system SHALL refresh icon rendering and scroll the window to the top.

#### Scenario: Icon refresh
GIVEN the Lucide icon library is available
WHEN the application renders
THEN the system invokes icon creation so icon placeholders are rendered.

#### Scenario: Scroll reset
GIVEN the user has scrolled down on the current screen
WHEN the active screen changes
THEN the system scrolls the window to the top.

### Requirement: Brand Lockup Navigation
WHERE a brand lockup is interactive,
the system SHALL use it as a navigation affordance to the appropriate root screen for its context.

#### Scenario: Sidebar lockup
GIVEN the app shell is visible
WHEN the user activates the sidebar brand lockup
THEN the system navigates to the dashboard screen.

#### Scenario: Authentication lockup
GIVEN the user is viewing the authentication screen
WHEN the user activates the brand lockup
THEN the system navigates to the landing screen.
