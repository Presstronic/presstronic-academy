# Academy Mission Log Specification

## Purpose

Define the Presstronic Academy mission log experience.

This specification captures grouped transmissions, category tabs, unread state, read interactions, action navigation, loading and failure states, empty states, URL-addressable tab state, and persisted read state. It does not specify push-notification transport or support-thread implementation details.

## Requirements

### Requirement: Mission Log Shell Context
WHERE the mission log screen is displayed,
the system SHALL render the mission log inside the in-app Academy shell.

#### Scenario: Mission log uses app shell
GIVEN the current screen is `log`
WHEN the application renders
THEN the mission log content is displayed inside the app shell
AND the sidebar is displayed
AND the in-app top bar is displayed.

#### Scenario: Mission log heading
GIVEN the mission log screen is displayed
WHEN the page heading renders
THEN the system displays the section label `// TRANSMISSIONS`
AND displays the heading `Mission log.`

### Requirement: Mission Log Groups
WHEN the mission log displays transmissions,
the system SHALL group visible transmissions by day.

#### Scenario: Day groups visible
GIVEN the mission log has visible transmissions
WHEN the transmission list renders
THEN the system displays day group labels
AND displays matching transmissions under their day group.

#### Scenario: Hidden empty groups
GIVEN a day group has no transmissions matching the active tab
WHEN the mission log renders
THEN the system does not display that day group.

### Requirement: Transmission Categories
WHERE a transmission is displayed,
the system SHALL distinguish mission, cohort, progress, and system transmission categories.

#### Scenario: Mission transmission
GIVEN a transmission has kind `mission`
WHEN the transmission row renders
THEN the system displays a mission category label
AND displays mission-specific styling.

#### Scenario: Cohort transmission
GIVEN a transmission has kind `cohort`
WHEN the transmission row renders
THEN the system displays a cohort category label
AND displays cohort-specific styling.

#### Scenario: Progress transmission
GIVEN a transmission has kind `progress`
WHEN the transmission row renders
THEN the system displays a progress category label
AND displays progress-specific styling.

#### Scenario: System transmission
GIVEN a transmission has kind `system`
WHEN the transmission row renders
THEN the system displays a system category label
AND displays system-specific styling.

### Requirement: Mission Log Tabs
WHERE the mission log screen is displayed,
the system SHALL provide tabs for All, Unread, Missions, Cohort, and Progress.

#### Scenario: Default tab
GIVEN the mission log screen initializes
WHEN no tab has been selected
THEN the All tab is active
AND all transmissions are eligible for display.

#### Scenario: Unread tab
GIVEN the mission log screen is displayed
WHEN the user activates the Unread tab
THEN the system displays only transmissions that are unread according to persisted learner read state.

#### Scenario: Missions tab
GIVEN the mission log screen is displayed
WHEN the user activates the Missions tab
THEN the system displays only mission transmissions.

#### Scenario: Cohort tab
GIVEN the mission log screen is displayed
WHEN the user activates the Cohort tab
THEN the system displays only cohort transmissions.

#### Scenario: Progress tab
GIVEN the mission log screen is displayed
WHEN the user activates the Progress tab
THEN the system displays only progress transmissions.

#### Scenario: Tab reflected in URL
GIVEN the mission log screen is displayed
WHEN the user activates the Unread tab
THEN the URL query parameter `tab` is set to `unread`
AND reloading the page restores the Unread tab.

### Requirement: Tab Counts
WHEN mission log tabs are displayed,
the system SHALL show counts for each tab based on current transmission data and persisted learner read state.

#### Scenario: All count
GIVEN the mission log tabs are displayed
WHEN the All tab count renders
THEN the count equals the total number of transmissions.

#### Scenario: Unread count
GIVEN the mission log tabs are displayed
WHEN the Unread tab count renders
THEN the count equals the number of transmissions that are unread for the learner.

#### Scenario: Category count
GIVEN the mission log tabs are displayed
WHEN a category tab count renders
THEN the count equals the number of transmissions with that category kind.

#### Scenario: Count changes after read
GIVEN unread transmissions are visible
WHEN a user marks one unread transmission as read
THEN the Unread tab count decreases by one.

### Requirement: Transmission Row Content
WHERE a transmission is visible,
the system SHALL display category, title, body, time, unread indicator when applicable, and an action link.

#### Scenario: Row content
GIVEN a visible transmission exists
WHEN its row renders
THEN the system displays the transmission category label
AND displays the transmission title
AND displays the transmission body
AND displays the transmission time
AND displays the configured action label.

#### Scenario: Unread indicator
GIVEN a visible transmission is unread according to persisted learner read state
WHEN its row renders
THEN the system displays an unread visual indicator
AND applies unread row styling.

#### Scenario: Read row
GIVEN a visible transmission is read according to persisted learner read state
WHEN its row renders
THEN the system does not display the unread visual indicator
AND applies read row styling.

### Requirement: Mark Transmission Read
WHEN the user activates a transmission row,
the system SHALL persist that transmission as read for the learner.

#### Scenario: Read an unread transmission
GIVEN a transmission is unread
WHEN the user activates the transmission row
THEN the system persists the transmission id as read
AND the row no longer displays the unread indicator.

#### Scenario: Re-activate read transmission
GIVEN a transmission id is already persisted as read
WHEN the user activates the transmission row
THEN the system keeps the transmission id marked read once
AND does not duplicate the read entry.

### Requirement: Mark All Read
WHEN the user activates the mark-all-read action,
the system SHALL persist every visible transmission as read for the learner.

#### Scenario: Mark all read
GIVEN the mission log contains unread transmissions
WHEN the user activates `Mark all read`
THEN the system persists every visible transmission id as read
AND no unread indicators remain visible.

#### Scenario: Unread tab after mark all read
GIVEN all transmissions have been marked read
WHEN the user activates the Unread tab
THEN the system displays the empty category state.

### Requirement: Transmission Actions
WHEN the user activates a transmission action link,
the system SHALL navigate to the destination configured for that transmission without also toggling row read state through event bubbling.

#### Scenario: Resume mission action
GIVEN a mission transmission has action `Resume`
WHEN the user activates that action
THEN the system navigates to the story screen.

#### Scenario: View catalog action
GIVEN a cohort transmission has action `View catalog`
WHEN the user activates that action
THEN the system navigates to the catalog screen.

#### Scenario: Open dashboard action
GIVEN a progress transmission has action `Open dashboard`
WHEN the user activates that action
THEN the system navigates to the dashboard screen.

#### Scenario: See progression action
GIVEN a system transmission has action `See progression`
WHEN the user activates that action
THEN the system navigates to the progression screen.

### Requirement: Mission Log Empty State
WHEN the active mission log tab has no matching transmissions,
the system SHALL show an empty state.

#### Scenario: Empty category state
GIVEN the active tab has no matching transmissions
WHEN the mission log renders
THEN the system displays `Channel clear.`
AND displays `No transmissions in this category.`

### Requirement: Mission Log Data Source
WHERE the mission log renders learner transmissions,
the system SHALL derive transmissions from the learner notification data source.

#### Scenario: Transmission fields
GIVEN the mission log screen is displayed
WHEN transmission rows render
THEN the system reads each transmission's id, kind, title, body, time, unread flag, and action from notification data.

#### Scenario: Transmission grouping
GIVEN the mission log screen is displayed
WHEN transmission groups render
THEN the system derives day group labels from notification timestamps.

### Requirement: Mission Log Persistence Boundary
WHERE the mission log handles learner transmission state,
the system SHALL persist read state, retrieve transmissions from the notification source of truth, and route actions to their real destinations when available.

#### Scenario: Read state is persisted
GIVEN the user marks a transmission read
WHEN the read state updates
THEN the system persists the read state to the learner account
AND updates the current mission log screen state.

#### Scenario: Mark all read is persisted
GIVEN the user activates `Mark all read`
WHEN every visible transmission is marked read
THEN the system persists the read state changes
AND no unread indicators remain visible.

#### Scenario: Actions route to real destinations
GIVEN the user activates a mission log action
WHEN the system navigates to the configured screen
THEN the destination opens the relevant mission, catalog, dashboard, progression, cohort, support, or discussion context when one exists.

#### Scenario: Missing action destination
GIVEN a transmission has an action whose destination is no longer available
WHEN the user activates the action
THEN the system displays a recoverable unavailable-destination message
AND keeps the learner on the mission log.

### Requirement: Mission Log Request State
WHEN the mission log retrieves or mutates transmission state,
the system SHALL handle loading, failure, pagination, and read-state retries.

#### Scenario: Transmissions loading
GIVEN the mission log screen is displayed
AND transmissions have not loaded
WHEN the transmission list renders
THEN the system displays a loading state
AND keeps the active tab reflected in the URL.

#### Scenario: Transmissions load failure
GIVEN transmissions cannot be loaded
WHEN the mission log renders
THEN the system displays a retryable error
AND does not display stale transmissions as current.

#### Scenario: Mark read failure
GIVEN the user marks a transmission read
WHEN read-state persistence fails
THEN the system displays a retryable error
AND reconciles the row with the persisted read state.

#### Scenario: Additional pages
GIVEN more transmissions exist than the initial page size
WHEN the mission log renders the first page
THEN the system provides a way to load or navigate to additional transmissions
AND keeps tab counts accurate for the full result set.
