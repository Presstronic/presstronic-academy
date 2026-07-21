## ADDED Requirements

### Requirement: MVP Learning Outcome
The MVP SHALL prove that Presstronic Academy can teach real engineering through mission-framed learning, code execution, feedback, and evidence of delivery.

#### Scenario: MVP outcome is reviewed
GIVEN MVP scope is evaluated
WHEN a capability or task is proposed for the first release
THEN it supports the mission-framed learning loop, code challenge loop, delivery loop, learner progress evidence, or content operations needed to run the product
AND work outside those outcomes is deferred unless explicitly accepted by a later proposal.

#### Scenario: MVP is not a full product vision
GIVEN a feature appears in product discovery notes or future concept documents
WHEN it is not required to prove the first shippable learning loop
THEN it is classified as MVP-lite, post-MVP, future/B2B, or explicitly deferred
AND does not block implementation scaffolding.

### Requirement: First Shippable Learning Loop
The MVP SHALL include one complete learner loop from mission-framed course entry through accepted Delivery evidence.

#### Scenario: Learner completes MVP loop
GIVEN a learner enters the first shippable path
WHEN the learner progresses through the path
THEN the system presents mission-framed course context
AND presents lesson content
AND presents a focused coding challenge
AND presents a Code Prompt
AND accepts a Delivery
AND runs tests or evaluation checks
AND presents a basic review report
AND allows revision when the Delivery is not accepted
AND records the accepted Delivery in learner progress or evidence.

#### Scenario: MVP loop remains coherent
GIVEN a feature is added to MVP
WHEN the feature does not support the first shippable learning loop
THEN the feature is deferred or moved to a future proposal
AND the MVP remains focused on shipping one coherent learner path.

### Requirement: MVP Core Capability Scope
The MVP SHALL include the learner, content, challenge, delivery, progress, and operational capabilities required to run the first shippable product.

#### Scenario: Existing learner capabilities remain in MVP
GIVEN implementation planning begins
WHEN existing baseline capabilities are mapped to MVP
THEN landing, auth entry, privacy controls, shell, catalog, dashboard, lesson challenge, mission log, profile, progression, design system components, visual design, and monorepo structure remain in MVP scope as needed by the first learning loop.

#### Scenario: New MVP capabilities are identified
GIVEN implementation planning begins
WHEN gaps are mapped to MVP
THEN admin content management, Code Prompts, Deliveries, attempt history, basic review reports, and content health dashboard are treated as MVP-critical or MVP-limited capability areas
AND receive focused follow-up proposals before implementation.

#### Scenario: Billing and launch gating remain limited
GIVEN the MVP requires controlled access
WHEN launch gating is specified
THEN the product uses either invite gating, basic billing/access gating, or both
AND does not require full subscription lifecycle sophistication before the learner loop is proven.

### Requirement: Code Prompts and Deliveries MVP Scope
The MVP SHALL include a limited Code Prompt and Delivery workflow that proves realistic engineering work can be submitted and reviewed.

#### Scenario: MVP Code Prompt
GIVEN a learner reaches an MVP Code Prompt
WHEN the prompt is displayed
THEN the system provides a mission brief, objective, constraints, starter project or workspace instructions, delivery checklist, and evaluation expectations.

#### Scenario: MVP Delivery
GIVEN a learner completes work for a Code Prompt
WHEN the learner submits a Delivery
THEN the Delivery includes code or project changes
AND may include implementation notes, assumptions, tradeoffs, tests, screenshots, or other evidence required by the prompt
AND is associated with the learner, prompt, attempt, and evaluation result.

#### Scenario: MVP review report
GIVEN a Delivery is evaluated
WHEN evaluation completes
THEN the system presents test results or evaluation checks
AND presents a basic review report with accepted, needs revision, or failed status
AND records feedback that can guide the next revision.

### Requirement: MVP-Lite Differentiators
The MVP SHALL include limited differentiators that preserve the Academy identity without requiring advanced systems.

#### Scenario: CYOA theming without full branching
GIVEN MVP lessons, challenges, or Code Prompts are presented
WHEN the learner interacts with the content
THEN the system uses mission briefs, operation language, decision framing, and consequence-aware feedback
AND does not require a full branching story engine before release.

#### Scenario: AI mentor guardrails before advanced AI
GIVEN help or mentor behavior is included in MVP
WHEN the learner requests assistance
THEN the system follows no-direct-answer, hint-ladder, lesson-scope, and explain-don't-solve guardrails
AND may use authored hints before live AI review is implemented.

#### Scenario: Skill evidence before advanced skill graph
GIVEN learner progress is displayed in MVP
WHEN lessons, challenges, or Deliveries are completed
THEN the system records completed work, challenge outcomes, accepted Deliveries, and basic skill tags
AND does not require a full adaptive skill graph before release.

### Requirement: Deferred Post-MVP Capabilities
The MVP SHALL explicitly defer advanced learner features that are valuable but not required for the first shippable loop.

#### Scenario: Advanced learning intelligence is deferred
GIVEN adaptive review, mistake memory, debugging-first challenge libraries, decision mission libraries, pre-mortem training, postmortem training, Parsons problems, code review simulation, or advanced skill graphs are proposed
WHEN they are not needed for the first shippable loop
THEN they are captured as post-MVP capabilities
AND require separate OpenSpec proposals before implementation.

#### Scenario: Public evidence features are deferred
GIVEN public profiles, certificates, portfolio export, GitHub publishing, or public artifact sharing are proposed
WHEN MVP scope is enforced
THEN they are deferred unless a later proposal makes them necessary for launch.

#### Scenario: Full CYOA is deferred
GIVEN full story branching, path divergence, complex rewind, or authored branch graph tooling is proposed
WHEN MVP scope is enforced
THEN those features are deferred
AND MVP keeps mission framing and limited decisions.

### Requirement: Future B2B Assessment Scope
The MVP SHALL treat hiring assessments as future product direction that shares the Code Prompt and Delivery foundation but does not ship in the first learner MVP.

#### Scenario: Hiring assessment is proposed
GIVEN company assessments, candidate deliveries, review packets, rubric editors, custom company prompts, anti-cheating, plagiarism checks, or tenant-specific prompt libraries are proposed
WHEN MVP scope is enforced
THEN those features are classified as future/B2B
AND require separate proposals after the learner delivery loop is proven.

#### Scenario: Shared foundation is preserved
GIVEN Code Prompt or Delivery behavior is designed for MVP
WHEN future B2B assessment needs are considered
THEN the design avoids choices that prevent later company assignments, candidate review packets, or rubric-based assessment
AND does not implement B2B workflow before it is accepted.

### Requirement: MVP Proposal Sequencing
The MVP SHALL be implemented through focused proposals that reference the accepted MVP scope.

#### Scenario: Focused proposals follow MVP scope
GIVEN MVP scope is accepted
WHEN implementation planning continues
THEN focused proposals define frontend scaffolding, Spring Boot API scaffolding, shared contracts, local infrastructure, admin content management, Code Prompts and Deliveries, content health dashboard, and AI mentor guardrails
AND each proposal identifies whether it supports MVP, MVP-lite, post-MVP, or future/B2B scope.

#### Scenario: Scope disputes are resolved by MVP loop
GIVEN contributors disagree about whether a feature belongs in MVP
WHEN the feature is reviewed
THEN the decision is made by whether the feature is required to prove the first shippable learning loop
AND the feature is deferred when it adds breadth without strengthening that loop.
