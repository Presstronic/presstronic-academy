## ADDED Requirements

### Requirement: Candidate Review Packet Boundary
The system SHALL treat candidate review packets as future/B2B derived artifacts for assessment review rather than source-of-truth learner or assessment records.

#### Scenario: Packet is derived from assessment evidence
GIVEN a candidate assessment has evaluation evidence
WHEN a review packet is generated
THEN the packet derives from candidate attempts, Deliveries, rubric results, reviewer notes, and evaluation metadata
AND does not replace the underlying assessment records.

### Requirement: Packet Contents
Candidate review packets SHALL include only accepted evidence fields needed for company review.

#### Scenario: Reviewer inspects packet
GIVEN a company reviewer opens a packet
WHEN packet contents are displayed
THEN the packet includes candidate identity context, assessment prompt context, submitted work evidence, evaluation outcomes, rubric mapping, and reviewer notes where accepted
AND excludes private learner data that is not part of the assessment review contract.

### Requirement: Packet Sharing Lifecycle
Candidate review packets SHALL define sharing, expiration, revocation, and audit behavior before company access is implemented.

#### Scenario: Packet access is shared
GIVEN a packet is made available to a company reviewer
WHEN access is granted
THEN the access has documented scope and expiration behavior
AND packet views or exports are auditable.

#### Scenario: Packet access is revoked
GIVEN packet access should no longer be available
WHEN access is revoked or expires
THEN company reviewers can no longer view the packet through that grant
AND the revocation or expiration is recorded.

### Requirement: Packet Redaction
Candidate review packets SHALL support redaction or exclusion of sensitive evidence before sharing.

#### Scenario: Sensitive evidence is excluded
GIVEN assessment evidence contains data not approved for company review
WHEN packet content is prepared
THEN unapproved fields are redacted or excluded
AND the packet still references enough source context for review integrity.
