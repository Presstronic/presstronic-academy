# Academy Dashboard Specification

## Purpose

Define the authenticated Presstronic Academy dashboard experience.

This specification captures the learner welcome state, resume mission card, active path list, telemetry panel, mission-log preview, dashboard navigation affordances, and service-backed loading and empty states. It does not specify backend storage schemas or low-level progress calculation internals.

## Requirements

### Requirement: Dashboard Shell Context
WHERE the dashboard screen is displayed,
the system SHALL render the dashboard inside the in-app Academy shell.

#### Scenario: Dashboard uses app shell
GIVEN the current screen is `dashboard`
WHEN the application renders
THEN the dashboard content is displayed inside the app shell
AND the sidebar is displayed
AND the in-app top bar is displayed.

#### Scenario: Dashboard page heading
GIVEN the dashboard screen is displayed
WHEN the page heading renders
THEN the system identifies the operative by callsign in the eyebrow text
AND welcomes the learner by name
AND displays the learner clearance badge.

### Requirement: Resume Mission Card
WHEN the dashboard displays the learner's current mission,
the system SHALL show a prominent resumable mission card with path context, narrative prompt, progress, and a story navigation action.

#### Scenario: Resume mission content
GIVEN the dashboard screen is displayed
WHEN the resume mission card renders
THEN the system displays the learner's current mission path and chapter
AND displays the authored resume prompt for that mission
AND displays the learner's persisted path progress.

#### Scenario: Re-enter story
GIVEN the dashboard screen is displayed
WHEN the user activates `Re-enter story`
THEN the system navigates to the story screen.

### Requirement: Active Path List
WHEN the dashboard displays learner paths,
the system SHALL list each current path with title, track, act, status, and progress or lock state.

#### Scenario: Active paths heading
GIVEN the dashboard screen is displayed
WHEN the paths section renders
THEN the system displays the section label `// YOUR PATHS`.

#### Scenario: In-progress path
GIVEN a path has active status
WHEN the path appears in the dashboard path list
THEN the system displays the path title
AND displays the path track and act
AND displays the path progress indicator
AND allows the path card to be activated.

#### Scenario: Locked path
GIVEN a path has locked status
WHEN the path appears in the dashboard path list
THEN the system visually de-emphasizes the path
AND displays a clearance requirement badge
AND does not provide a path activation action.

#### Scenario: Activate available path
GIVEN the dashboard path list contains an active path
WHEN the user activates that path card
THEN the system navigates to the story screen.

### Requirement: Dashboard Telemetry Panel
WHERE the dashboard screen is displayed,
the system SHALL show learner XP, streak, and progress toward the next clearance level.

#### Scenario: Telemetry values
GIVEN the dashboard telemetry panel is displayed
WHEN the panel renders
THEN the system displays the learner's total XP
AND displays the learner's streak in days.

#### Scenario: Next clearance progress
GIVEN the dashboard telemetry panel is displayed
WHEN the clearance progress indicator renders
THEN the system displays progress toward the learner's next clearance level
AND uses the learner's current XP and next-clearance XP target.

### Requirement: Dashboard Mission Log Preview
WHERE the dashboard screen is displayed,
the system SHALL show a compact mission-log preview using recent log events.

#### Scenario: Mission log preview heading
GIVEN the dashboard screen is displayed
WHEN the right rail renders
THEN the system displays the section label `// MISSION LOG`.

#### Scenario: Log event rendering
GIVEN recent log events exist
WHEN the mission-log preview renders
THEN each log row displays its timestamp
AND displays its message
AND uses tone-specific styling for cyan, green, volt, or neutral events.

#### Scenario: Last log row
GIVEN the mission-log preview contains multiple rows
WHEN the last row renders
THEN the system omits the bottom divider for that final row.

### Requirement: Dashboard Data Source
WHERE the dashboard renders learner content,
the system SHALL derive dashboard values from the authenticated learner account, progress, enrollment, and notification data sources.

#### Scenario: User data
GIVEN the dashboard screen is displayed
WHEN user-specific text and badges render
THEN the system reads the learner name, callsign, clearance, XP, next-clearance XP, and streak from the learner account and progression data.

#### Scenario: Path data
GIVEN the dashboard screen is displayed
WHEN the path list renders
THEN the system reads path titles, tracks, acts, progress values, statuses, and icons from the learner enrollment and catalog data.

#### Scenario: Log data
GIVEN the dashboard screen is displayed
WHEN the mission-log preview renders
THEN the system reads recent log entries from the learner notification data.

### Requirement: Dashboard State Consistency
WHERE the dashboard displays learner state,
the system SHALL keep progress, enrollment, telemetry, and recent log data consistent with persisted learner state.

#### Scenario: Resume preserves progress
GIVEN the dashboard screen is displayed
WHEN the user activates `Re-enter story`
THEN the system navigates to the story screen
AND resumes the learner at the persisted story checkpoint.

#### Scenario: Path activation uses enrollment state
GIVEN the dashboard screen displays an active path
WHEN the user activates that path
THEN the system navigates to the story screen
AND resumes the persisted progress for that enrolled path.

#### Scenario: Telemetry display is derived
GIVEN the dashboard telemetry panel is displayed
WHEN the user views XP and streak values
THEN the values reflect the latest persisted progression state
AND cannot be directly edited from the dashboard.

### Requirement: Dashboard Request and Empty States
WHEN the dashboard retrieves learner-specific data,
the system SHALL handle loading, failure, partial data, and first-run states.

#### Scenario: Dashboard loading
GIVEN the authenticated dashboard is requested
AND learner dashboard data has not loaded
WHEN the dashboard renders
THEN the system displays a loading state for learner-specific panels
AND does not display stale data from another learner.

#### Scenario: Dashboard load failure
GIVEN learner dashboard data cannot be loaded
WHEN the dashboard renders
THEN the system displays a recoverable error
AND provides a retry action.

#### Scenario: First-run learner
GIVEN the learner has no enrolled or in-progress missions
WHEN the dashboard renders
THEN the system displays an onboarding dashboard state
AND provides a primary action to open the catalog.

#### Scenario: Partial mission log data
GIVEN progress data loads but recent mission-log data fails
WHEN the dashboard renders
THEN the system displays available progress and path data
AND shows a recoverable error only for the mission-log preview.

#### Scenario: Mission log preview navigation
GIVEN the mission-log preview is displayed
WHEN the learner activates the preview heading or a log row destination
THEN the system navigates to the mission log or the row's configured destination.
