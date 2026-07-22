## Context

The lesson challenge baseline already includes an AI mentor panel with context chips, sample exchange, request state, and a privacy disclosure. The MVP scope says mentor behavior should use no-direct-answer, hint-ladder, lesson-scope, and explain-don't-solve guardrails. Code Prompts and Deliveries define realistic project-style submissions, where learners will likely need support without the mentor simply solving the project.

This proposal makes mentor behavior an explicit shared capability so lesson challenges and Code Prompts can consume the same coaching policy. It also lets MVP ship with authored hints first if live AI slows the launch.

## Goals / Non-Goals

**Goals:**

- Define the shared mentor guardrail capability.
- Preserve learning by requiring no-direct-answer and explain-don't-solve behavior.
- Define progressive hint ladders, scoped context, refusal/redirection, and authored-hint fallback.
- Protect hidden tests, hidden evaluation checks, rubrics, and solution material.
- Define privacy boundaries for mentor context, logs, retention, export, and erasure.
- Define how aggregate mentor usage can later feed content health.
- Keep Academy mission/CYOA tone present while keeping technical help clear.

**Non-Goals:**

- Do not implement live AI, model/provider selection, prompt templates, moderation tooling, storage schemas, API endpoints, or frontend components.
- Do not define AI grading or autonomous Delivery acceptance.
- Do not define advanced adaptive review, mistake memory, or personalized curriculum generation.
- Do not make mentor guardrails own lesson execution, prompt evaluation, learner progress, or content health dashboards.

## Decisions

### Decision: Mentor guardrails are a shared policy capability

Lesson challenge and Code Prompts need similar help boundaries. A shared capability avoids duplicating policies and makes it easier to keep help behavior consistent.

Alternative considered: leave mentor rules inside lesson challenge only. That would not cover Code Prompts and would likely split policy as soon as prompt mentor help is added.

### Decision: The mentor teaches through hints, not final answers

The mentor should ask diagnostic questions, point to relevant concepts, explain failing signals, and provide incremental hints. It should not provide complete solutions, hidden checks, or finished Deliveries.

Alternative considered: allow full answer generation for convenience. That would make progress and Delivery evidence much less credible.

### Decision: Authored hints are a first-class fallback

MVP should not depend on live AI to provide useful help. Authored hints can satisfy the guardrail contract and provide a launchable fallback when AI is unavailable or intentionally disabled.

Alternative considered: make live AI required for mentor launch. That adds provider, cost, quality, safety, and privacy dependencies before the core learner loop is proven.

### Decision: Mentor context is scoped to the active learning task

The mentor should receive only the current lesson or prompt context, learner work relevant to that task, recent test or evaluation results, and conversation context needed for continuity. It should not receive unrelated profile, billing, private account, or cross-course data by default.

Alternative considered: send broad learner context for personalization. That may help later, but it increases privacy and policy risk before there is a proven need.

## Risks / Trade-offs

- Guardrails can feel restrictive -> Use progressive hints and clear explanations so the mentor remains helpful.
- Live model behavior may vary -> Treat provider prompts as implementation details and specify observable product behavior here.
- Authored hints can be shallow -> Let authored hints satisfy MVP fallback, then expand after real learner usage.
- Hidden checks may leak through explanation -> Explicitly forbid exposing hidden implementation details while still allowing actionable guidance.

## Migration Plan

1. Accept this proposal.
2. Apply the `academy-ai-mentor-guardrails` baseline spec and boundary deltas.
3. Create follow-up implementation proposals for frontend mentor UI behavior, backend mentor APIs, authored hint storage, and optional live AI integration.
4. Move roadmap focus to frontend workspace scaffolding after this guardrail change is accepted.

## Open Questions

- Should MVP mentor history be persisted by default or only within the active attempt/session?
- Should authored hints be authored as part of lesson/prompt content, a separate hint library, or implementation-defined for MVP?
- What usage limits should apply before billing/access rules are fully implemented?
- Should Code Prompt mentor help be disabled during final Delivery submission, or only constrained by no-direct-answer guardrails?
