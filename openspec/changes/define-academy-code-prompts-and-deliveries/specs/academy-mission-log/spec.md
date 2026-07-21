## ADDED Requirements

### Requirement: Prompt Delivery Activity Boundary
The mission-log capability SHALL display prompt and Delivery lifecycle activity while delegating prompt behavior to Code Prompts and Deliveries.

#### Scenario: Delivery activity appears in mission log
GIVEN a Delivery is submitted, accepted, marked needs revision, failed, or encounters evaluation error
WHEN mission-log activity is generated
THEN academy-mission-log may display a transmission for the prompt or Delivery event
AND links to the relevant prompt, Delivery, or review report.

#### Scenario: Mission log does not own prompt state
GIVEN a learner interacts with a Delivery-related mission-log transmission
WHEN the learner follows the transmission action
THEN academy-mission-log routes to the Code Prompt or review report destination
AND does not mutate prompt workspace, evaluation, review, or revision state.

#### Scenario: Prompt activity respects visibility
GIVEN prompt or Delivery activity is shown to learners, admins, or instructors
WHEN mission-log data is requested
THEN academy-mission-log shows only activity the viewer is authorized to access
AND relies on the owning capability for prompt and Delivery visibility rules.
