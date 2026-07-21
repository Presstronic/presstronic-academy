## Why

The current OpenSpec baseline captures a broad product vision, and the product discovery notes add more differentiators such as Code Prompts, Deliveries, mistake memory, adaptive review, and hiring assessments. Before implementation scaffolding begins, the project needs an explicit MVP scope contract that defines the first shippable learning loop and separates MVP, MVP-lite, post-MVP, and future/B2B capabilities.

## What Changes

- Add a new `academy-mvp-scope` capability that defines the first shippable product outcome.
- Define the MVP learning loop: mission-framed course -> lesson -> focused coding challenge -> Code Prompt -> submit a Delivery -> tests and basic review -> revision -> accepted Delivery appears in learner evidence/progress.
- Classify existing baseline capabilities that remain in MVP scope, including auth, catalog, dashboard, lesson challenge, profile, progression, mission log, design system, privacy controls, and monorepo structure.
- Add limited MVP scope for Code Prompts, Deliveries, basic review reports, attempt history, admin content management, and content health dashboard.
- Define MVP-lite treatment for CYOA theming, AI mentor guardrails, and launch gating.
- Explicitly defer full branching story engine, hiring assessments, advanced AI review, adaptive learning intelligence, public profiles, certificates, portfolio export, multi-tenancy, enterprise integrations, and microservice activation.

## Capabilities

### New Capabilities

- `academy-mvp-scope`: First shippable product scope, MVP learning loop, included capabilities, limited differentiators, and deferred capabilities.

### Modified Capabilities

- None.

## Impact

- Affects planning and sequencing for future OpenSpec proposals.
- Provides scope constraints for frontend, backend, contracts, content, code runner, and admin scaffolding.
- Does not implement application code, database schemas, API endpoints, or UI screens.
- Future proposals for Code Prompts, admin content management, AI mentor guardrails, and content health should reference this MVP scope.
