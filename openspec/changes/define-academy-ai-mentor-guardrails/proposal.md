## Why

The MVP includes mentor-style help in lessons and likely needs similar help for Code Prompts. Without explicit guardrails, AI assistance can undercut learning by giving direct answers, leaking hidden checks, expanding outside lesson scope, or sending more learner data than needed.

The Academy should make mentor behavior useful but bounded: hints should teach, preserve learner agency, and keep the mission/CYOA tone without obscuring technical guidance. This proposal defines the mentor guardrail capability before live AI, authored hints, frontend scaffolding, backend contracts, or provider-specific model decisions are implemented.

## What Changes

- Add a new `academy-ai-mentor-guardrails` capability for mentor coaching policy, hint ladders, no-direct-answer behavior, context limits, escalation, request states, and privacy boundaries.
- Define MVP behavior for lesson challenge mentor support and Code Prompt mentor support.
- Define authored-hint fallback behavior so MVP can ship mentor guidance without depending on live AI.
- Define hidden-solution and hidden-check protection for tests, evaluation checks, and prompt rubrics.
- Define safety behavior for out-of-scope, answer-seeking, policy-sensitive, and unsupported mentor requests.
- Add boundary deltas so lesson challenge and Code Prompts consume mentor guardrails while retaining ownership of their learner workflows.
- Add privacy and content health boundaries for mentor context sharing, retention, and aggregate mentor usage signals.

## Capabilities

### New Capabilities

- `academy-ai-mentor-guardrails`: Mentor policy and behavior boundaries for no-direct-answer coaching, hint ladders, scoped assistance, context sharing, fallback hints, request states, and signal emission.

### Modified Capabilities

- `academy-lesson-challenge`: Uses mentor guardrails for lesson and focused challenge help while retaining challenge workflow ownership.
- `academy-code-prompts-deliveries`: Uses mentor guardrails for Code Prompt help while retaining prompt workspace, Delivery, evaluation, review, and revision ownership.
- `academy-content-health-dashboard`: May consume aggregate mentor usage signals after guardrails are accepted but does not own mentor behavior.
- `academy-privacy-controls`: Defines privacy expectations for mentor context, logs, retention, export, and erasure.
- `academy-mvp-scope`: Recognizes AI mentor guardrails as MVP-lite scope and keeps advanced AI review deferred.

## Impact

- Affects future frontend mentor UI, backend mentor APIs, model/provider integration, authored hint content, event logging, and privacy implementation proposals.
- Keeps the first mentor scope focused on coaching behavior, not autonomous evaluation, code generation, or final-answer delivery.
- Does not define provider-specific prompts, model selection, token budgets, moderation tooling, database schemas, API endpoints, or live AI implementation.
- Establishes frontend workspace scaffolding as the next roadmap candidate after this guardrail proposal is accepted.
