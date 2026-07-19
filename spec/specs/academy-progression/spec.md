# Academy Progression Specification

## Purpose

Define the Presstronic Academy progression and service-record experience.

This specification captures the clearance ladder, commit-graph visual model, current clearance state, progress toward next clearance, achievements, and navigation to completion records. It does not specify low-level award calculation internals or credential-provider implementation details.

## Requirements

### Requirement: Progression Shell Context
WHERE the progression screen is displayed,
the system SHALL render the progression view inside the in-app Academy shell.

#### Scenario: Progression uses app shell
GIVEN the current screen is `progression`
WHEN the application renders
THEN the progression content is displayed inside the app shell
AND the sidebar is displayed
AND the in-app top bar is displayed.

#### Scenario: Progression heading
GIVEN the progression screen is displayed
WHEN the page heading renders
THEN the system displays the section label `// SERVICE RECORD`
AND displays the heading `Progression`
AND displays the learner's XP badge.

### Requirement: Completion Record Navigation
WHERE the progression screen is displayed,
the system SHALL provide a link to the learner completion record.

#### Scenario: View completion record
GIVEN the progression screen is displayed
WHEN the user activates `View completion record`
THEN the system navigates to the certificate screen.

### Requirement: Clearance Ladder
WHEN the progression screen displays the clearance ladder,
the system SHALL render every configured clearance level in order.

#### Scenario: Clearance ladder heading
GIVEN the progression screen is displayed
WHEN the clearance ladder card renders
THEN the system displays the section label `// CLEARANCE LADDER`
AND displays the git-log inspired context text.

#### Scenario: Clearance levels
GIVEN clearance data is available
WHEN the clearance ladder renders
THEN the system displays each configured clearance level
AND displays its hash
AND displays its name
AND displays its XP threshold
AND displays its description.

#### Scenario: Completed clearance
GIVEN a clearance level is marked done
WHEN that clearance row renders
THEN the system displays completed node styling
AND connects it to the next completed segment with a solid completed line where applicable.

#### Scenario: Current clearance
GIVEN a clearance level is marked as the current level
WHEN that clearance row renders
THEN the system displays current node styling
AND displays a `HEAD` marker
AND emphasizes the current level with volt styling.

#### Scenario: Locked clearance
GIVEN a clearance level is not done and not current
WHEN that clearance row renders
THEN the system displays locked styling
AND displays a lock icon
AND uses dashed or muted progress connectors where applicable.

### Requirement: Clearance Progress
WHERE the progression screen is displayed,
the system SHALL show progress toward the next clearance level.

#### Scenario: Next clearance progress label
GIVEN the progression screen is displayed
WHEN the clearance progress indicator renders
THEN the system displays the next clearance level and clearance name from progression data.

#### Scenario: Next clearance values
GIVEN the learner has current XP and next-clearance XP target
WHEN the clearance progress indicator renders
THEN the system uses the learner's current XP as the progress value
AND uses the learner's next-clearance XP as the maximum value.

### Requirement: Achievement Grid
WHERE the progression screen is displayed,
the system SHALL show earned and unearned achievements.

#### Scenario: Achievements heading
GIVEN the progression screen is displayed
WHEN the achievements section renders
THEN the system displays the section label `// ACHIEVEMENTS`.

#### Scenario: Earned achievement
GIVEN an achievement is earned
WHEN the achievement card renders
THEN the system displays its icon
AND displays its name
AND displays its description
AND applies earned styling.

#### Scenario: Unearned achievement
GIVEN an achievement is not earned
WHEN the achievement card renders
THEN the system displays its icon
AND displays its name
AND displays its description
AND visually de-emphasizes the card.

#### Scenario: Achievement grid layout
GIVEN achievements are displayed
WHEN the achievement grid renders
THEN the system arranges achievements in a multi-column grid where viewport space allows.

### Requirement: Progression Data Source
WHERE the progression screen renders learner content,
the system SHALL derive progression values from persisted learner progression, clearance, achievement, and completion-record data.

#### Scenario: Persisted user progression
GIVEN the progression screen is displayed
WHEN progression header and progress indicators render
THEN the system reads learner XP and next-clearance XP from persisted progression data.

#### Scenario: Persisted clearances
GIVEN the progression screen is displayed
WHEN the clearance ladder renders
THEN the system reads level, name, XP threshold, hash, completion state, current state, and description from clearance data.

#### Scenario: Persisted achievements
GIVEN the progression screen is displayed
WHEN achievements render
THEN the system reads icon, name, description, and earned state from achievement data.

### Requirement: Progression Integrity
WHERE the progression screen displays clearance and achievement state,
the system SHALL present progression as read-only to learners while updating it through trusted learning, grading, and administrative workflows.

#### Scenario: Clearance ladder is read-only
GIVEN the progression screen is displayed
WHEN the user views clearance rows
THEN the system does not provide learner-facing controls to directly modify clearance state.

#### Scenario: Achievements are read-only
GIVEN the progression screen is displayed
WHEN the user views achievement cards
THEN the system does not provide learner-facing controls to earn, revoke, or edit achievements directly.

#### Scenario: Completion record link is navigation only
GIVEN the progression screen is displayed
WHEN the user activates `View completion record`
THEN the system navigates to the certificate screen
AND displays the existing completion record when one exists
AND prompts the learner to complete required work when no completion record exists.

#### Scenario: Progression changes are event-backed
GIVEN learner XP, clearance, achievement, or completion-record state changes
WHEN progression data is updated
THEN the system records the source event that caused the change
AND stores enough audit context to explain the change.

#### Scenario: Duplicate award event
GIVEN the same trusted award event is processed more than once
WHEN progression data is updated
THEN the system applies the award idempotently
AND does not duplicate XP, achievements, clearance changes, or certificates.

#### Scenario: Administrative correction
GIVEN an authorized administrative workflow corrects learner progression
WHEN the correction is applied
THEN the system records the correction reason
AND updates the learner-facing progression view from the corrected state.
