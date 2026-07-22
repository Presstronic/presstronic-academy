## ADDED Requirements

### Requirement: Billing Service Access Split
The billing access capability SHALL allow future billing service integration through normalized entitlements while preserving simple invite or access gating before full billing is accepted.

#### Scenario: Access gating consumes entitlement state
GIVEN billing service behavior is accepted
WHEN Academy access decisions require paid or subscription state
THEN access gating consumes normalized entitlement state
AND does not depend on provider-specific billing payloads in learner or admin app workflows.

#### Scenario: MVP access can remain simple
GIVEN full billing service activation is not required for MVP launch
WHEN access gating is implemented
THEN invite-only or simple access controls may proceed without activating checkout, subscription lifecycle, or provider webhook behavior.
