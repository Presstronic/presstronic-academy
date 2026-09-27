# Spec Delta

## MODIFIED Requirements

### Requirement: Initial Screen Selection
WHEN the application loads,
the system SHALL select the initial screen from the URL hash route (`#/<screen>`) when one is present, otherwise it SHALL display the landing screen.

#### Scenario: Landing screen without hash
GIVEN the application URL has no hash fragment, or the hash is `#/`
WHEN the application initializes
THEN the system displays the landing screen
AND does not wrap the landing screen in the in-app shell.

#### Scenario: Hash-selected screen
GIVEN the application URL hash is `#/dashboard`
AND the user has an active authenticated session
WHEN the application initializes
THEN the system displays the dashboard screen
AND wraps the dashboard screen in the in-app shell.

#### Scenario: Auth hash-selected screen
GIVEN the application URL hash is `#/auth`
WHEN the application initializes
THEN the system displays the authentication screen
AND does not wrap the authentication screen in the in-app shell.

### Requirement: Hash Change Navigation
WHEN the browser hash route changes,
the system SHALL update the active screen to match that route.

#### Scenario: External hash navigation
GIVEN the user is viewing the landing screen
AND the user has an active authenticated session
WHEN the browser hash changes to `#/story`
THEN the system updates the active screen to `story`
AND displays the story screen in the app shell.

#### Scenario: Empty hash resolves to landing
GIVEN the application is already running
WHEN the browser hash changes to an empty fragment or `#/`
THEN the system displays the landing screen.

### Requirement: Protected Route Access
WHERE a screen requires the in-app shell,
the system SHALL require an active authenticated session before rendering protected content.

#### Scenario: Unauthenticated protected hash
GIVEN the application URL hash is `#/dashboard`
AND the user does not have an active authenticated session
WHEN the application initializes
THEN the system navigates to the authentication screen
AND stores `dashboard` as the post-authentication return destination.

#### Scenario: Return after authentication
GIVEN an unauthenticated user was redirected from `#/lesson` to authentication
WHEN the user signs in successfully
THEN the system navigates to the lesson screen
AND renders it inside the in-app shell.

#### Scenario: Public routes remain public
GIVEN the user does not have an active authenticated session
WHEN the user navigates to the landing or authentication screen
THEN the system displays the requested public screen
AND does not require authentication.
