## ADDED Requirements

### Requirement: Hiring Assessment Boundary
The system SHALL treat hiring assessments as a future/B2B capability that reuses Code Prompt and Delivery foundations without becoming part of the first learner MVP.

#### Scenario: Assessment remains future/B2B
GIVEN hiring assessment behavior is proposed
WHEN MVP scope is enforced
THEN assessment workflows remain future/B2B
AND do not block the first shippable learner loop.

#### Scenario: Assessment reuses work foundation
GIVEN a hiring assessment includes practical engineering work
WHEN a candidate submits work
THEN the assessment can reuse Code Prompt, Delivery, attempt, evaluation, and evidence concepts
AND assessment-specific ownership, privacy, and review constraints are applied.

### Requirement: Candidate Attempt
The hiring assessment capability SHALL model candidate attempts separately from learner progress.

#### Scenario: Candidate attempt is recorded
GIVEN a candidate starts an assessment
WHEN the attempt is created
THEN it is associated with an assessment assignment, candidate identity, prompt or task set, time constraints, and submission state
AND it does not automatically update learner progression.

### Requirement: Assessment Rubric
The hiring assessment capability SHALL define rubric-based evaluation boundaries before assessment review is implemented.

#### Scenario: Rubric guides evaluation
GIVEN a candidate Delivery is reviewed
WHEN an assessment rubric is available
THEN reviewer feedback and automated checks can map to rubric criteria
AND final recommendation remains distinguishable from raw test results.

### Requirement: Assessment Privacy and Integrity
The hiring assessment capability SHALL define candidate privacy, consent, access, and integrity boundaries before production assessment workflows are implemented.

#### Scenario: Candidate evidence access is controlled
GIVEN assessment evidence exists
WHEN a company reviewer, candidate, or Academy operator accesses it
THEN access follows assessment-specific permissions and consent rules
AND evidence is not exposed as public learner profile data by default.

#### Scenario: Integrity controls are explicit
GIVEN anti-cheating, plagiarism detection, monitoring, or time-window enforcement is implemented
WHEN integrity behavior is reviewed
THEN the controls are explicitly specified by assessment proposals
AND are not implied solely by learner Delivery behavior.
