## Why

The MVP needs more than authored content and learner-facing execution. Admins and instructors need a limited way to see whether lessons, focused challenges, and Code Prompts are working: where learners get stuck, which tests fail repeatedly, which Deliveries need revision, and whether published content versions are producing weak outcomes.

Without a defined content health capability, implementation scaffolding risks mixing analytics concerns into learner dashboards, content authoring, prompt evaluation, or challenge execution. This proposal gives content health a clear MVP boundary before frontend, API, storage, and contracts are scaffolded.

## What Changes

- Add a new `academy-content-health-dashboard` capability for privacy-aware admin/instructor visibility into content health.
- Define MVP health signals for stuck learners, repeated challenge failures, sandbox/evaluation errors, Delivery outcomes, revision loops, drop-off points, and content version context.
- Define dashboard summaries for tracks, courses, modules, lessons, focused challenges, and Code Prompts.
- Define drill-down behavior that helps admins identify content needing review without turning the dashboard into a full analytics platform.
- Define privacy and role boundaries for aggregated metrics and learner-level support views.
- Add deltas so admin content management, lesson challenge, Code Prompts and Deliveries, dashboard, privacy controls, and MVP scope delegate or expose the correct content health responsibilities.

## Capabilities

### New Capabilities

- `academy-content-health-dashboard`: Admin/instructor dashboard for content health signals, summaries, drill-downs, trend windows, content version context, privacy boundaries, and responsibility boundaries.

### Modified Capabilities

- `academy-admin-content-management`: Provides content identity and version context but does not own health signal presentation.
- `academy-lesson-challenge`: Emits or exposes challenge attempt/test outcome signals but does not own health analysis.
- `academy-code-prompts-deliveries`: Emits or exposes prompt attempt, Delivery, evaluation, review, and revision signals but does not own health analysis.
- `academy-dashboard`: Remains learner-facing and does not expose admin content health.
- `academy-privacy-controls`: Defines privacy expectations for learner data used in operational health views.
- `academy-mvp-scope`: Recognizes content health as MVP-limited operational scope.

## Impact

- Affects future admin app, API/contracts, event design, persistence, and reporting implementation proposals.
- Keeps MVP content health limited to actionable operational visibility rather than broad BI, cohort analytics, or adaptive learning automation.
- Does not define final database schemas, event transport, metrics warehouse, charting libraries, alerting, notifications, or automated content recommendations.
- Establishes `define-academy-ai-mentor-guardrails` as the next proposal candidate after this change is accepted.
