## 1. Proposal Review

- [x] 1.1 Review `academy-mvp-scope`, `academy-admin-content-management`, `academy-lesson-challenge`, `academy-code-prompts-deliveries`, `academy-dashboard`, and `academy-privacy-controls` for health signal and privacy boundaries.
- [x] 1.2 Confirm content health is the next proposal candidate after admin content management.
- [x] 1.3 Confirm content health remains MVP-limited and does not absorb broad analytics, adaptive recommendations, alerting, or AI mentor guardrails.

## 2. Spec Application

- [x] 2.1 Add the accepted `academy-content-health-dashboard` capability to baseline specs.
- [x] 2.2 Update `academy-admin-content-management` with content identity/version context boundaries.
- [x] 2.3 Update `academy-lesson-challenge` with health source-fact boundaries.
- [x] 2.4 Update `academy-code-prompts-deliveries` with prompt and Delivery health source-fact boundaries.
- [x] 2.5 Update `academy-dashboard` with learner-dashboard separation from admin content health.
- [x] 2.6 Update `academy-privacy-controls` with content health privacy boundaries.
- [x] 2.7 Update `academy-mvp-scope` with MVP-limited content health boundaries.

## 3. Follow-Up Planning

- [x] 3.1 Update follow-up proposal roadmap if needed after content health is accepted.
- [x] 3.2 Identify whether AI mentor guardrails or implementation scaffolding should come next.
- [x] 3.3 Confirm no application implementation code is included in this capability-definition change.

## 4. Validation

- [x] 4.1 Run `openspec validate define-academy-content-health-dashboard --strict`.
- [x] 4.2 Run `openspec validate --all --strict`.
- [x] 4.3 Confirm the proposal branch contains only OpenSpec proposal artifacts unless documentation alignment edits are intentionally included.
