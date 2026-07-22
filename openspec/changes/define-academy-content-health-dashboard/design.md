## Context

The accepted MVP scope identifies content health as necessary operational support for the first shippable learning loop. Code Prompts and Deliveries define learner submissions, evaluation, review reports, revisions, and attempt history. Admin content management defines authoring, publication, content versions, and the boundary that content health owns learner outcome signal presentation.

Content health should help an instructor or admin answer practical questions:

- Where are learners getting stuck?
- Which challenge tests fail repeatedly?
- Which Code Prompts produce too many failed or needs-revision Deliveries?
- Did a published content version improve or harm learner outcomes?
- Which content should be reviewed before adding more material?

## Goals / Non-Goals

**Goals:**

- Define MVP-limited content health dashboards for admins and instructors.
- Cover lessons, focused coding challenges, Code Prompts, tracks, courses, modules, and published content versions.
- Define privacy-aware aggregate and learner-level support boundaries.
- Define signal ownership boundaries with lesson challenge, Code Prompts and Deliveries, admin content management, learner dashboard, and privacy controls.
- Preserve the Academy mission/CYOA tone in admin presentation without obscuring operational meaning.

**Non-Goals:**

- Do not implement UI, API endpoints, event pipelines, persistence, charting, alerting, or notification delivery.
- Do not define a general analytics warehouse or BI platform.
- Do not define adaptive content recommendations, automated remediation, or AI-generated content edits.
- Do not expose hiring assessment analytics; B2B assessment workflows remain future scope.
- Do not make learner-facing dashboard responsible for admin health views.

## Decisions

### Decision: Content health is operational, not general analytics

The MVP dashboard should focus on actionable content quality signals needed to run and improve the first learning path. It should not become a broad analytics product before the learner loop ships.

Alternative considered: define a full analytics platform with cohort segmentation, funnels, alerts, and exports. That would be useful later but too broad for MVP setup.

### Decision: Health views use content version context

Health signals should be tied to published content identity and version where available. This allows admins to see whether a specific publish caused improvement or regression without making authoring own health presentation.

Alternative considered: aggregate all outcomes by content slug only. That is simpler but makes rollback and content iteration much harder to reason about.

### Decision: Aggregate first, learner-level only for support

The MVP should default to aggregate content health. Learner-level detail should exist only for authorized support/instructor use cases and should avoid exposing private profile, billing, or unrelated account data.

Alternative considered: show all learner attempts by default. That is easier for small cohorts but creates a privacy habit that will not scale.

### Decision: Source capabilities remain authoritative for raw outcomes

Lesson challenge owns test execution and focused challenge attempt results. Code Prompts and Deliveries owns prompt attempts, Deliveries, evaluation checks, review reports, and revision lifecycle. Content health consumes those signals and presents patterns.

Alternative considered: make content health compute or own attempt/evaluation state. That would blur product boundaries and duplicate learner workflow logic.

## Risks / Trade-offs

- Metrics can become misleading with low sample size -> MVP should show low-sample or incomplete-data states.
- Privacy expectations can be missed early -> Define aggregate-first behavior and explicit learner-level access boundaries now.
- Content health can expand into BI -> Keep only operational signals tied to content improvement in MVP.
- Version-aware metrics require careful event shape later -> Capture the requirement now before contracts and persistence harden.

## Migration Plan

1. Accept this proposal.
2. Apply the `academy-content-health-dashboard` baseline spec and boundary deltas.
3. Create follow-up implementation proposals for admin frontend scaffolding, backend signal contracts, persistence/event shape, and dashboard query APIs.
4. Keep AI mentor guardrails as the next proposal so mentor behavior is defined before live AI or authored-hint implementation.

## Open Questions

- What minimum sample size should hide or qualify content health metrics?
- Which learner-level details are necessary for instructor support in MVP?
- Should content health start with event-sourced facts, query tables, or implementation-defined storage?
- Should content health include manual admin notes on content issues in MVP, or should that wait for content workflow tooling?
