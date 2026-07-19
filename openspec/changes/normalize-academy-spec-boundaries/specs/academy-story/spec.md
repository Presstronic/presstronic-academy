## ADDED Requirements

### Requirement: Story Responsibility Boundary
The story capability SHALL own narrative rendering, branch prompts, branch selection, checkpoint rewind, media playback expectations, branch maps, objectives, story telemetry display, and challenge handoff while delegating challenge execution to lesson challenge.

#### Scenario: Story owns branch decisions
- **GIVEN** a learner reaches a story decision point
- **WHEN** the learner selects or rewinds a branch
- **THEN** academy-story owns branch persistence, conflict handling, and checkpoint state
- **AND** other capabilities do not independently change that branch state.

#### Scenario: Challenge handoff delegates execution
- **GIVEN** a selected story branch opens a coding challenge
- **WHEN** the learner enters the lesson challenge surface
- **THEN** academy-story initializes or resumes the challenge attempt context
- **AND** academy-lesson-challenge owns code edits, tests, mentor interactions, sandbox safety, and completion reward application.

#### Scenario: Story visuals reference global design
- **GIVEN** story specifies decision, narration, media, or branch-map treatments
- **WHEN** global colors, motion, typography, or decorative rules apply
- **THEN** academy-story follows academy-visual-design
- **AND** only defines story-specific presentation patterns.
