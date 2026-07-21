## Context

The Academy baseline currently includes specs for learner-facing product surfaces, visual design, auth, billing/access, progression, certificates, story, lesson challenge, privacy, and monorepo structure. A product concept brief now captures broader ideas around Code Prompts, Deliveries, B2B hiring assessments, adaptive review, mistake memory, debugging-first challenges, decision missions, skill graphs, postmortem training, AI guardrails, code review simulation, and portfolio artifacts.

The risk is trying to implement the entire vision before proving the core learning loop. The MVP should still feel differentiated, but it should not require every future system.

## Goals / Non-Goals

**Goals:**

- Define the first shippable product loop.
- Preserve CYOA theming and mission framing without requiring a full branching engine.
- Include a small but real version of Code Prompts and Deliveries because they are central differentiators.
- Make admin/content operations and content health visible enough to run and improve the product.
- Explicitly defer B2B hiring assessments and advanced learning intelligence until after the learner product proves the loop.

**Non-Goals:**

- Do not scaffold frontend, backend, code runner, admin, or database implementation.
- Do not fully specify Code Prompts, Delivery review, admin CMS, or content health dashboards in this change.
- Do not activate multi-tenancy, hiring assessments, public profiles, certificates, enterprise integrations, or microservices.
- Do not decide pricing or launch gating beyond identifying it as invite-gate or billing-gate scope.

## Decisions

### Decision: MVP proves one complete learning loop

The MVP should prove one complete path from mission-framed content through a realistic submitted Delivery. This prevents the product from becoming a disconnected set of screens.

Alternative considered: scaffold all planned surfaces first. That would create breadth but delay proof that the learning model works.

### Decision: Include Code Prompts and Deliveries in limited form

Code Prompts and "Submit a Delivery" are core differentiators. The MVP should include a basic version with starter projects, visible/hidden tests where feasible, delivery checklist, implementation notes, attempt history, and a basic review report.

Alternative considered: defer Code Prompts entirely. That would make MVP closer to a conventional lesson/challenge platform and weaken the differentiator.

### Decision: Keep CYOA as framing before full branching

The MVP should use mission briefs, operation language, limited decision prompts, review consequences, and unlock-style feedback. Full branching story graph, rewind complexity, and path divergence can wait.

Alternative considered: build full CYOA first. That would increase content, state, and authoring complexity before the core runner/delivery loop is proven.

### Decision: Admin content and content health are MVP infrastructure

Admin content management and basic content health are not polish. They are needed to create, publish, observe, and improve the first shippable course.

Alternative considered: hand-author all content in code or database seed files. That may be useful for prototypes, but it does not support iteration once learners use the product.

### Decision: B2B hiring assessments are future product direction

Hiring assessments share the Code Prompt and Delivery engine, but company tenants, candidate packets, rubric editors, anti-cheating, and custom prompt libraries are deferred until the learner workflow is proven.

Alternative considered: launch B2B immediately. That adds legal, privacy, sales, integrity, and tenant complexity before the core assessment engine exists.

## Risks / Trade-offs

- Limited Code Prompts may feel less powerful than the vision -> Keep scope honest but make the delivery loop real.
- Deferring full CYOA may dilute differentiation -> Preserve mission framing and consequences from day one.
- Admin/content work can expand quickly -> Limit MVP to content creation, preview, publish, and essential health signals.
- AI mentor expectations can grow quickly -> Ship guardrails and authored hints first if live AI slows launch.

## Migration Plan

1. Accept this MVP scope proposal.
2. Apply it into a baseline `academy-mvp-scope` spec.
3. Create focused follow-up proposals for Code Prompts/Deliveries, admin content management, content health dashboard, AI mentor guardrails, and implementation scaffolding.
4. Use this scope spec to reject or defer implementation work that does not support the first learning loop.

## Open Questions

- Should MVP launch with invite gating, paid billing, or both?
- Should AI mentor be live-model backed in MVP, or should MVP start with authored hint ladders and guardrails?
- Should Code Prompts be integrated into the first course path or exposed as a separate prompt catalog from day one?
- How many Code Prompts are enough to prove the delivery loop?
