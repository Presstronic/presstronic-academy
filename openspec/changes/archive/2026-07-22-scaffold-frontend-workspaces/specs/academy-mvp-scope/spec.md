## ADDED Requirements

### Requirement: MVP Frontend Scaffolding Sequence
The MVP scope SHALL allow frontend workspace scaffolding after product boundaries are accepted and before detailed learner/admin workflow implementation.

#### Scenario: Frontend scaffold is next implementation step
GIVEN Code Prompts, admin content management, content health, and AI mentor guardrails are accepted
WHEN implementation scaffolding begins
THEN frontend workspace scaffolding may proceed as the next MVP implementation step
AND it references accepted product boundaries instead of redefining them.

#### Scenario: Scaffold avoids product workflow implementation
GIVEN frontend workspaces are scaffolded
WHEN MVP scope is enforced
THEN the scaffold includes buildable app/package foundations, shared config, styling setup, and minimal placeholders
AND defers production learner/admin workflows to focused implementation proposals or tasks.

#### Scenario: Backend scaffolding remains separate
GIVEN frontend workspace scaffolding is underway
WHEN Spring Boot API, contracts, local infrastructure, or service activation work is considered
THEN those areas remain separate proposal candidates
AND are not implemented as part of frontend scaffolding.
