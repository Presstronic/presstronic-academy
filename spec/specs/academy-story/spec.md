# Academy Story Specification

## Purpose

Define the Presstronic Academy story-path experience.

This specification captures narrative rendering, embedded video beats, objectives, branch choices, decision consequences, checkpoint rewind, branch map, path telemetry, persisted branch history, checkpoint storage, media playback expectations, and navigation into coding challenges. It does not specify story-authoring tools or video-hosting implementation details.

## Requirements

### Requirement: Story Shell Context
WHERE the story screen is displayed,
the system SHALL render the story experience inside the in-app Academy shell.

#### Scenario: Story uses app shell
GIVEN the current screen is `story`
WHEN the application renders
THEN the story content is displayed inside the app shell
AND the sidebar is displayed
AND the in-app top bar is displayed.

#### Scenario: Story heading
GIVEN the story screen is displayed
WHEN the story heading renders
THEN the system displays the current act and chapter
AND displays the current story path title
AND displays a `Decision point` badge.

### Requirement: Narrative Beat Rendering
WHEN the story screen renders the current narrative,
the system SHALL display each story beat according to its beat kind.

#### Scenario: Narration beat
GIVEN a story beat has kind `narration`
WHEN the beat renders
THEN the system displays the beat text in the narrative pane.

#### Scenario: Objective beat
GIVEN a story beat has kind `objective`
WHEN the beat renders
THEN the system displays the objective text in an emphasized objective row
AND labels it as an objective.

#### Scenario: Decision beat
GIVEN a story beat has kind `decision`
WHEN the beat renders
THEN the system displays the selected decision key
AND displays the selected decision label.

#### Scenario: Video beat
GIVEN a story beat has kind `video`
WHEN the beat renders
THEN the system displays the embedded lesson-feed video presentation.

### Requirement: Embedded Video Beat
WHERE a story beat is a video,
the system SHALL present video metadata, a play affordance, progress, markers, and player controls.

#### Scenario: Video metadata
GIVEN a video beat is displayed
WHEN the video frame renders
THEN the system displays the lesson-feed title
AND displays a recording indicator
AND displays the current timestamp and total duration.

#### Scenario: Video play affordance
GIVEN a video beat is displayed
WHEN the video frame renders
THEN the system displays a central play button.

#### Scenario: Video progress rail
GIVEN a video beat has progress
WHEN the video controls render
THEN the system displays a progress rail filled to the beat's progress percentage
AND displays checkpoint markers on the rail.

#### Scenario: Video utility controls
GIVEN a video beat is displayed
WHEN the video controls render
THEN the system displays captions, volume, and maximize affordances.

### Requirement: Branch Choice Prompt
WHERE no branch has been taken for the current decision point,
the system SHALL display the available branch choices.

#### Scenario: Choice prompt visible
GIVEN the learner has no persisted selected branch for the current decision point
WHEN the story screen renders below the narrative pane
THEN the system displays a branch choice prompt
AND displays all available choices for the current story beat.

#### Scenario: Choice details
GIVEN branch choices are displayed
WHEN a choice renders
THEN the system displays the choice key
AND displays the choice label
AND displays the choice hint.

#### Scenario: Choice visual styling
GIVEN branch choices are displayed
WHEN a choice renders
THEN the system uses volt as the story-choice accent
AND uses a 2px left edge or equivalent Academy selected-state treatment for selected choices.

#### Scenario: Choice prompt hidden after selection
GIVEN the user has selected a branch choice
WHEN the story screen renders below the narrative pane
THEN the system does not display the branch choice list.

### Requirement: Branch Selection
WHEN the user selects a branch choice,
the system SHALL persist the decision, append the configured consequence, append a checkpoint-saved narration, and update learner story progress.

#### Scenario: Select choice A
GIVEN no branch choice has been selected
WHEN the user selects choice A
THEN the system records choice A as the selected branch
AND appends a decision beat for choice A
AND appends choice A's consequence beat
AND appends a checkpoint-saved narration beat.

#### Scenario: Select choice B
GIVEN no branch choice has been selected
WHEN the user selects choice B
THEN the system records choice B as the selected branch
AND appends a decision beat for choice B
AND appends choice B's consequence beat
AND appends a checkpoint-saved narration beat.

#### Scenario: Select choice C
GIVEN no branch choice has been selected
WHEN the user selects choice C
THEN the system records choice C as the selected branch
AND appends a decision beat for choice C
AND appends choice C's consequence beat
AND appends a checkpoint-saved narration beat.

### Requirement: Post-Decision Actions
WHERE a branch choice has been selected,
the system SHALL provide actions based on the selected branch.

#### Scenario: Choice B opens challenge
GIVEN the user selected choice B
WHEN post-decision actions render
THEN the system displays `Open the coding challenge`
AND activating it navigates to the lesson screen.

#### Scenario: Non-challenge choices continue chapter
GIVEN the user selected choice A or choice C
WHEN post-decision actions render
THEN the system displays `Continue to next chapter`
AND activating it navigates to the dashboard screen.

#### Scenario: Rewind action available
GIVEN any branch choice has been selected
WHEN post-decision actions render
THEN the system displays `Rewind to checkpoint`.

### Requirement: Checkpoint Rewind
WHEN the user rewinds to the checkpoint,
the system SHALL restore the saved checkpoint, clear the current selected branch, and record the rewind event in learner story history.

#### Scenario: Rewind after choice B
GIVEN the user selected choice B
AND appended decision and consequence beats are visible
WHEN the user activates `Rewind to checkpoint`
THEN the system restores the original story beats
AND clears the selected branch
AND displays the branch choices again.

#### Scenario: Rewind after non-challenge choice
GIVEN the user selected choice A or choice C
AND appended decision and consequence beats are visible
WHEN the user activates `Rewind to checkpoint`
THEN the system restores the original story beats
AND clears the selected branch
AND displays the branch choices again.

### Requirement: Branch Map
WHERE the story screen is displayed,
the system SHALL show a branch map grouped by act with node states for completed, current, open, and locked progression.

#### Scenario: Branch map visible
GIVEN the story screen is displayed
WHEN the story rail renders
THEN the system displays the section label `// BRANCH MAP`
AND displays acts from the story map data.

#### Scenario: Branch map nodes
GIVEN an act has branch map nodes
WHEN the act row renders
THEN the system displays each node
AND applies visual state for done, now, open, or locked nodes.

#### Scenario: Branch map legend
GIVEN the branch map is displayed
WHEN the legend renders
THEN the system identifies the current position
AND identifies cleared nodes.

### Requirement: Story Objectives
WHERE the story screen is displayed,
the system SHALL show current story objectives with completion state.

#### Scenario: Objectives visible
GIVEN the story screen is displayed
WHEN the objectives card renders
THEN the system displays the section label `// OBJECTIVES`
AND displays each configured objective.

#### Scenario: Completed objective
GIVEN an objective is marked done
WHEN the objective renders
THEN the system displays a completed node
AND visually de-emphasizes the objective text.

#### Scenario: Incomplete objective
GIVEN an objective is not marked done
WHEN the objective renders
THEN the system displays an incomplete node
AND keeps the objective text readable as active work.

### Requirement: Story Path Telemetry
WHERE the story screen is displayed,
the system SHALL show current path progress and next-checkpoint reward context.

#### Scenario: Path progress
GIVEN the story screen is displayed
WHEN path telemetry renders
THEN the system displays the learner's current path progress percentage from persisted progression data.

#### Scenario: Next checkpoint reward
GIVEN the story screen is displayed
WHEN path telemetry renders
THEN the system displays the configured reward for the next checkpoint.

### Requirement: Story Data Source
WHERE the story screen renders content,
the system SHALL derive story details from authored story data and learner checkpoint state.

#### Scenario: Story fields
GIVEN the story screen is displayed
WHEN story content renders
THEN the system reads path, act, chapter, beats, choices, objectives, and map acts from story data.

#### Scenario: Choice consequences
GIVEN branch choices are displayed
WHEN the user selects a branch
THEN the system uses the authored consequence configured for that branch.

### Requirement: Story Persistence
WHERE the story screen handles learner decisions,
the system SHALL persist decisions, checkpoint state, unlocked content, and learner progress to the learner account.

#### Scenario: Branch choice persists
GIVEN the user selects a branch choice
WHEN the story updates
THEN the system persists the branch decision
AND restores the selected branch when the learner returns to the checkpoint.

#### Scenario: Rewind uses saved checkpoint
GIVEN the user rewinds to the checkpoint
WHEN original story beats are restored
THEN the system restores the saved checkpoint state
AND records the rewind event for learner history.

#### Scenario: Challenge handoff initializes attempt
GIVEN the user selected choice B
WHEN the user activates `Open the coding challenge`
THEN the system navigates to the lesson screen
AND initializes or resumes the persisted coding challenge attempt for that story branch.

### Requirement: Story Media Playback
WHERE a story beat includes video or audio media,
the system SHALL support accessible playback, resume state, and recoverable media errors.

#### Scenario: Resume media progress
GIVEN the learner has previously watched part of a video beat
WHEN the video beat renders again
THEN the system restores the saved playback position
AND displays progress from that saved position.

#### Scenario: Captions and transcript
GIVEN a video beat is displayed
WHEN the learner opens accessibility media controls
THEN the system provides captions when available
AND provides a transcript or equivalent lesson text for required instructional content.

#### Scenario: Media failure
GIVEN a video beat cannot load
WHEN the story beat renders
THEN the system displays a recoverable media error
AND provides access to the transcript or equivalent lesson text.

### Requirement: Story Visual and Motion Design
WHERE the story screen renders narrative, decisions, maps, and telemetry,
the system SHALL use the Academy story visual language without over-decorating the surface.

#### Scenario: Decision treatment
GIVEN a story decision point is displayed
WHEN visual emphasis is applied
THEN the system may use the approved volt hazard treatment
AND does not use volt as unrelated decoration outside story-critical or caution moments.

#### Scenario: Type-on narration
GIVEN type-on narration is enabled for the learner
WHEN narrative text enters the story pane
THEN the system may type text at the approved narration speed
AND disables or minimizes the effect when reduced motion is preferred.

#### Scenario: Story pane decoration
GIVEN a story or terminal pane uses scanline styling
WHEN the pane renders
THEN scanlines remain subtle
AND the pane does not stack scanlines with multiple other decorative treatments on the same element.

### Requirement: Branch Consistency
WHERE a learner makes or rewinds a branch decision,
the system SHALL keep decisions consistent across reloads, devices, and duplicate submissions.

#### Scenario: Duplicate branch selection
GIVEN the learner has already selected a branch for the current decision point
WHEN a duplicate selection request is received
THEN the system keeps the persisted branch decision unchanged
AND returns the current persisted branch state.

#### Scenario: Cross-device branch conflict
GIVEN the learner has the same decision point open on two devices
AND one device persists a branch decision
WHEN the other device attempts to persist a different branch
THEN the system rejects or resolves the later request according to the current persisted state
AND prompts the learner to refresh the story state.

#### Scenario: Rewind confirmation
GIVEN rewinding will discard a persisted branch choice for the checkpoint
WHEN the learner activates `Rewind to checkpoint`
THEN the system asks for confirmation before changing the persisted branch state.
