# Code Prompts, Deliveries, and Learning Differentiators

This document captures product ideas for making Presstronic Academy more than a tutorial platform. These ideas are intentionally broader than MVP scope. They should be refined into OpenSpec proposals only after the product direction is reviewed.

## Product Thesis

Presstronic Academy should teach learners to ship coherent engineering work, not just solve isolated exercises.

The core learning loop should be:

1. Enter a mission.
2. Make technical decisions under constraints.
3. Build, debug, refactor, or review a realistic system.
4. Submit a delivery.
5. Receive tests, rubric feedback, review guidance, and consequences.
6. Revise and improve.
7. Add the result to a durable skill record, portfolio artifact, or hiring evidence packet.

The platform should preserve the CYOA theme wherever it helps learning. Every meaningful activity should feel like a mission with context, stakes, and consequences, without burying the learning under lore.

## Core Concept: Code Prompts

A Code Prompt is a scenario-based project assignment. It may start from a blank repository, a partial project, a broken system, or a production-like codebase. The learner or candidate must take the project to an acceptable delivery.

Unlike a normal coding challenge, a Code Prompt asks:

> Can you ship a coherent piece of engineering work?

### Prompt Types

- **Greenfield Prompt**: Start from little or no project structure and build toward a goal.
- **Feature Prompt**: Add a feature to an existing application.
- **Bugfix Prompt**: Diagnose and fix a failing or flaky system.
- **Refactor Prompt**: Improve design while preserving behavior.
- **Integration Prompt**: Wire frontend, backend, API contracts, and persistence.
- **Incident Prompt**: Investigate logs, failing tests, or symptoms and ship a fix.
- **Architecture Prompt**: Propose and implement a bounded design.
- **Interview Prompt**: Complete a timed take-home style assignment.
- **Portfolio Prompt**: Produce polished work suitable for sharing as evidence.

### Prompt Anatomy

A strong Code Prompt can include:

- Mission brief
- Scenario and stakeholder context
- Objective
- Constraints
- Starter repository or blank workspace
- Visible tests
- Hidden tests
- Expected behaviors
- Allowed tools
- Delivery checklist
- Rubric
- Time guidance or time box
- Review criteria
- Follow-up missions

## Core Concept: Submit a Delivery

A Delivery is the submitted artifact for a Code Prompt. The term matters because it frames the work as engineering output, not just an answer.

A Delivery may include:

- Code changes
- Passing tests
- New tests
- README or implementation notes
- Assumptions
- Tradeoffs
- API contract changes
- Migration notes
- Screenshots or demo evidence
- ADR or short design note
- Known limitations
- Follow-up recommendations

### Delivery Evaluation Dimensions

Deliveries can be evaluated across:

- **Correctness**: Does it work?
- **Completeness**: Did it meet the prompt?
- **Testing**: Did the learner add meaningful tests?
- **Maintainability**: Is the implementation understandable and changeable?
- **Design Judgment**: Did the learner choose a reasonable approach?
- **Communication**: Did they explain assumptions and tradeoffs?
- **Production Readiness**: Would this survive review?
- **Operational Risk**: What could fail after release?
- **Security and Privacy**: Did the solution avoid unsafe behavior?
- **Accessibility**: For UI work, did the delivery preserve accessible behavior?

### Evaluation Maturity

1. **Tests Only**
   - Visible tests
   - Hidden tests
   - Lint/typecheck/build
   - Basic pass/fail

2. **Static Quality Checks**
   - Formatting
   - Complexity
   - Dependency rules
   - Security checks
   - Architecture boundary checks

3. **Rubric Review**
   - Correctness
   - Maintainability
   - Test quality
   - API design
   - Data modeling
   - Error handling
   - Accessibility
   - Performance

4. **AI-Assisted Review**
   - Explain tradeoffs
   - Spot missing edge cases
   - Compare against rubric
   - Recommend next learning
   - Generate follow-up drills from weaknesses

5. **Human or Instructor Review**
   - Useful for advanced paths, cohorts, paid tiers, certificates, and hiring assessments.

## CYOA and Mission Framing

Code Prompts should feel like missions.

Example:

```text
Mission Brief
A customer success team reports that paid learners are losing access after renewal.
Billing events are arriving, but entitlements are not updating consistently.

Objective
Ship a delivery that restores entitlement sync and proves the failure cannot recur.

Constraints
- Do not change the public API contract.
- Preserve existing subscription states.
- Add regression coverage.
- Document any assumptions.

Delivery Required
- Code changes
- Tests
- Implementation note
- Risk assessment
```

After submission:

```text
Review Outcome
Delivery accepted with caution.

Strengths
- Correctly handled duplicate webhook events.
- Added regression coverage for renewal events.

Risk
- Retry behavior is not observable enough for production.

Unlocked Follow-Up
Add event tracing to the billing pipeline.
```

CYOA can show up through:

- Narrative mission briefs
- Decision points before implementation
- Consequences in the review report
- Branch unlocks based on delivery quality
- Persistent learner identity as an operator
- Mission log entries for every delivery
- Follow-up missions triggered by mistakes, risks, or strengths

The story should sharpen the stakes and make choices memorable. It should not obscure the technical learning objective.

## B2B Hiring Assessments

Code Prompts can become a B2B assessment product for companies that want realistic candidate evaluation.

The value proposition:

> Evaluate how candidates deliver real engineering work, not just whether they can solve isolated algorithm problems.

### Company Use Cases

- Assign realistic take-home missions.
- Standardize evaluation across candidates.
- Use hidden tests and rubric scoring.
- Review code quality, design judgment, and communication.
- Compare candidates with evidence packets.
- Generate live interview follow-up questions.
- Maintain private prompt libraries.
- Customize prompts to match real company work.

### Candidate Assessment Delivery

Candidates submit a Delivery that may include:

- Code
- Tests
- Implementation notes
- Tradeoff explanation
- Assumptions
- Screenshots or demo evidence
- ADR
- Known limitations

### Company Review Packet

Hiring teams receive a Review Packet:

- Test results
- Rubric scores
- Strengths
- Risks
- Design assessment
- Maintainability assessment
- Communication assessment
- Security and performance flags
- Suggested live interview follow-up questions
- Evidence for hiring panel discussion

The product should avoid claiming that AI decides who to hire. The safer and more credible positioning:

> Presstronic generates structured evidence and review guidance for human hiring teams.

### Role-Based Assessment Tracks

- **Frontend Engineer**
  - Fix a broken checkout flow.
  - Build an accessible data table.
  - Integrate with an API contract.
  - Improve loading and error states.

- **Backend Engineer**
  - Implement an idempotent webhook handler.
  - Design a REST endpoint with validation.
  - Fix a transaction boundary bug.
  - Add background job retry behavior.

- **Full Stack Engineer**
  - Implement a feature across React and Spring Boot.
  - Update an OpenAPI contract and generated client.
  - Handle optimistic UI and backend validation.

- **Platform Engineer**
  - Containerize a service.
  - Add health checks.
  - Diagnose a failing deployment.
  - Improve observability.

- **Staff or Lead Engineer**
  - Evaluate an architecture proposal.
  - Write an ADR.
  - Identify a migration plan.
  - Reduce risk in a partially implemented system.

### B2B-Specific Capabilities

Future company-facing features may include:

- Company tenant accounts
- Prompt assignment links
- Candidate identity/session handling
- Time-boxed assessments
- Anti-cheating controls
- Plagiarism or similarity checks
- Private prompt libraries
- Custom company prompts
- Hiring team dashboard
- Evaluation rubric editor
- Candidate review packets
- Interview follow-up question generator
- Legal/privacy controls
- Data retention settings

## Learning Differentiators

These features are broader than Code Prompts but fit the same thesis: help people learn real engineering judgment.

### Adaptive Review Queue

Use spaced repetition and retrieval practice for programming concepts, debugging patterns, API design decisions, command-line fluency, SQL mistakes, and architecture tradeoffs.

Examples:

- "You failed async error handling twice last week."
- "Here is a short bug diagnosis drill."
- "Pick the safest migration plan."
- "Explain what this stack trace means."

This should not be limited to flashcards. It should generate active recall work from the learner's history.

### Mistake Memory and Error Pattern Tracker

Track recurring mistakes and turn them into targeted practice.

Examples:

- Off-by-one errors
- Missing null handling
- Async race conditions
- Over-broad exception handling
- SQL joins that duplicate rows
- Incorrect React derived state
- Spring transaction boundary mistakes

Learners should see:

> These are the bugs I tend to create.

The system should use these patterns to assign review drills, follow-up prompts, and mentor guidance.

### Debugging-First Challenges

Most platforms overemphasize greenfield code. Real engineers spend much of their time reading, tracing, debugging, and modifying existing systems.

Challenge types:

- Find the bug.
- Explain why this test fails.
- Trace this request across frontend, API, and database.
- Patch without changing public behavior.
- Refactor safely.
- Choose which log line matters.

### Decision Missions

Decision Missions teach tradeoffs.

Example:

- The queue is backing up.
- The learner can scale workers, add backpressure, add a dead-letter queue, change retry policy, or inspect poison messages.
- Each choice changes cost, reliability, complexity, and future incidents.

These missions can be CYOA-native and may not require much coding at first. They train engineering judgment.

### Skill Graph

Track learner mastery as a graph, not only course completion.

Possible skill nodes:

- HTTP basics
- Auth/session handling
- SQL joins
- Transactions
- Async jobs
- Testing
- Observability
- Threat modeling
- Refactoring
- Accessibility
- API contracts
- State management

Lessons, missions, challenges, and deliveries update the graph.

The learner should see:

- Strong areas
- Weak areas
- Concepts due for review
- Skills demonstrated by portfolio artifacts
- Skills demonstrated by hiring assessments

### Pre-Mortem and Postmortem Training

Teach incident thinking.

Feature ideas:

- Before deploying a solution, learner identifies likely failure modes.
- After a simulated incident, learner writes a postmortem.
- The system evaluates root cause, blast radius, detection gaps, prevention, and communication quality.

### Parsons Problems

Parsons problems give learners scrambled code blocks they must arrange correctly. They reduce syntax burden while testing structure and understanding.

Useful contexts:

- Beginner programming
- Mobile coding
- Syntax-heavy concepts
- Refactoring order
- Pipeline composition
- SQL query construction

### AI Mentor With Guardrails

The AI mentor should teach through constraints, not solve for the learner.

Rules:

- No direct answers.
- Scope to current lesson or prompt.
- Use a hint ladder.
- Ask the learner to predict before revealing.
- Point to relevant prior mistakes.
- Generate similar-but-not-identical practice.
- Explain errors rather than write final code.
- Say when the learner is asking to skip the learning.

### Code Review Simulator

Learners should practice receiving and giving reviews.

Review dimensions:

- Correctness
- Readability
- Test coverage
- Edge cases
- Security
- Performance
- Maintainability
- API design
- Accessibility for UI work

The system can review a learner's delivery, then later ask the learner to review another implementation.

### Portfolio-Grade Artifacts

Each path should produce artifacts that learners can keep.

Artifacts may include:

- GitHub repository
- Architecture decision record
- Test suite
- Incident report
- API contract
- Deployment notes
- Screenshots
- Verification report
- Certificate with skill evidence

The goal is not only "I finished a course." The goal is:

> Here is evidence of what I can ship.

## Possible Future OpenSpec Capabilities

These ideas should likely become separate OpenSpec proposals:

- `define-academy-code-prompts`
- `define-academy-deliveries`
- `define-academy-delivery-review`
- `define-academy-hiring-assessments`
- `define-academy-prompt-authoring`
- `define-academy-adaptive-review`
- `define-academy-mistake-memory`
- `define-academy-debugging-challenges`
- `define-academy-decision-missions`
- `define-academy-skill-graph`
- `define-academy-portfolio-artifacts`

## Open Questions

- Should Code Prompts be a content type inside courses, or a separate top-level product area?
- Should Deliveries be available to individual learners before hiring assessments exist?
- Should B2B hiring assessments share the same prompt engine as learner prompts from day one?
- What parts of a Delivery are required versus optional?
- How much should AI review be trusted before human review is available?
- Should companies be allowed to write custom prompts, or should Presstronic control prompt quality?
- How should the product prevent copying, prompt leakage, and over-reliance on AI tools?
- Should CYOA consequences affect only narrative unlocks, or also the learner's skill graph?
- What is the right balance between serious engineering review and the Academy mission aesthetic?
