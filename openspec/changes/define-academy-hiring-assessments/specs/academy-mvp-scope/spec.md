## ADDED Requirements

### Requirement: Future Hiring Assessment Compatibility
The MVP scope SHALL preserve compatibility with future hiring assessments without implementing assessment workflows in the learner MVP.

#### Scenario: MVP Delivery design preserves assessment compatibility
GIVEN Code Prompt or Delivery behavior is implemented for learners
WHEN future assessment needs are considered
THEN the design avoids blocking later assessment assignments, candidate attempts, rubrics, and review packets
AND does not implement hiring workflows before a future/B2B proposal is accepted.

#### Scenario: Assessment work remains deferred
GIVEN hiring assessment features are requested during MVP work
WHEN MVP scope is enforced
THEN the features remain future/B2B unless a later proposal explicitly changes scope.
