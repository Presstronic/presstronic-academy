# Academy Privacy Controls Specification

## Purpose

Define shared Presstronic Academy privacy controls for learner data export, account erasure, and cookie preferences.

This specification centralizes privacy behavior used from public and authenticated surfaces. It captures confirmation, request state, persistence, recovery windows, and user feedback. It does not specify legal policy text, backend storage schemas, or vendor-specific privacy tooling.

## Requirements

### Requirement: Data Export Request
WHEN a user requests a copy of their data,
the system SHALL submit a data export request and display confirmation with delivery expectations.

#### Scenario: Authenticated data export
GIVEN an authenticated learner is using a surface with privacy controls
WHEN the learner activates `Request my data`
THEN the system submits a data export request for that learner
AND displays confirmation that the request was logged
AND states that a full JSON and CSV export will arrive by email within 72 hours.

#### Scenario: Export requires recent verification
GIVEN an authenticated learner requests a data export
AND the learner has not recently verified their identity
WHEN the export flow starts
THEN the system requires re-authentication or email verification before submitting the export request.

#### Scenario: Unauthenticated data export
GIVEN an unauthenticated visitor is using a surface with privacy controls
WHEN the visitor activates `Request my data`
THEN the system prompts the visitor to authenticate or provide a verified email before submitting the export request.

#### Scenario: Export request failure
GIVEN a data export request cannot be submitted
WHEN the request fails
THEN the system displays an error explaining that the user can retry
AND does not claim the request was logged.

### Requirement: Account Erasure Request
WHEN a user starts account deletion,
the system SHALL require explicit confirmation before scheduling erasure.

#### Scenario: Open erasure confirmation
GIVEN a user activates an account deletion or erasure action
WHEN the erasure flow opens
THEN the system displays a confirmation dialog
AND explains that profile, story decisions, challenge submissions, XP, achievements, billing history, and support threads are included.

#### Scenario: Cancel erasure
GIVEN the erasure confirmation dialog is open
WHEN the user activates the cancel action
THEN the system closes the dialog
AND does not schedule account deletion.

#### Scenario: Confirm erasure
GIVEN the erasure confirmation dialog is open
AND the user has recently re-authenticated
WHEN the user explicitly confirms deletion
THEN the system schedules account deletion
AND displays confirmation that deletion was scheduled
AND states there is a 14-day grace period before deletion.

#### Scenario: Erasure requires recent verification
GIVEN the erasure confirmation dialog is open
AND the user has not recently re-authenticated
WHEN the user explicitly confirms deletion
THEN the system requires re-authentication before scheduling deletion
AND keeps the account active.

#### Scenario: Cancel scheduled erasure
GIVEN account deletion has been scheduled
AND the 14-day grace period has not elapsed
WHEN the verified account owner cancels deletion
THEN the system cancels the scheduled erasure
AND confirms that the account remains active.

#### Scenario: Erasure retention exceptions
GIVEN account deletion completes
WHEN the system removes learner data
THEN the system deletes personal learning data according to the erasure policy
AND retains only legally or security-required records with minimized personal data.

#### Scenario: Erasure request failure
GIVEN the user confirms account deletion
WHEN the erasure request cannot be submitted
THEN the system keeps the account active
AND displays an error explaining that deletion was not scheduled.

### Requirement: Cookie Preferences
WHEN a user opens cookie preferences,
the system SHALL let the user review cookie categories and persist allowed optional categories.

#### Scenario: Open cookie preferences
GIVEN a user is using a surface with privacy controls
WHEN the user activates `Cookie preferences`
THEN the system opens the cookie preferences dialog
AND displays Strictly necessary, Analytics, and Marketing categories.

#### Scenario: Strictly necessary cookies
GIVEN the cookie preferences dialog is open
WHEN the cookie categories render
THEN Strictly necessary is marked always on
AND cannot be disabled
AND describes sessions, security, and saving the learner's place in the story.

#### Scenario: Optional cookie categories
GIVEN the cookie preferences dialog is open
WHEN the cookie categories render
THEN Analytics is displayed with an optional switch
AND Marketing is displayed with an optional switch.

#### Scenario: Cancel cookie preferences
GIVEN the cookie preferences dialog is open
WHEN the user activates `Cancel`
THEN the system closes the dialog
AND preserves the previous cookie preferences.

#### Scenario: Save cookie preferences
GIVEN the cookie preferences dialog is open
WHEN the user activates `Save preferences`
THEN the system persists the selected cookie preferences
AND closes the dialog
AND displays confirmation that cookie preferences were saved.

#### Scenario: Optional cookies default off
GIVEN the user has not saved cookie preferences
WHEN optional cookie categories render
THEN Analytics is off by default
AND Marketing is off by default until consent is granted.

#### Scenario: Withdraw optional consent
GIVEN the user previously enabled Analytics or Marketing cookies
WHEN the user disables those categories and saves preferences
THEN the system stops non-essential collection for disabled categories
AND records the updated consent state.

#### Scenario: Global privacy signal
GIVEN the browser provides a recognized global privacy control signal
WHEN cookie preferences initialize
THEN the system treats optional tracking categories as disabled unless the user explicitly overrides where legally allowed.

### Requirement: Privacy Feedback Accessibility
WHEN a privacy request displays status feedback,
the system SHALL expose the feedback to assistive technology and avoid relying only on transient visual state.

#### Scenario: Status announcement
GIVEN a privacy action completes or fails
WHEN feedback is displayed
THEN the status is announced politely to assistive technology
AND remains available long enough for the user to read it.

#### Scenario: Dialog keyboard behavior
GIVEN a privacy dialog is open
WHEN the user navigates by keyboard
THEN focus remains within the dialog until it closes
AND closing the dialog returns focus to the control that opened it.
