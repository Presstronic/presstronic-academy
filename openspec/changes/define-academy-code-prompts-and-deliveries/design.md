## Context

Presstronic Academy's MVP scope is built around a complete learning loop:

mission-framed course -> lesson -> focused coding challenge -> Code Prompt -> submit a Delivery -> tests and basic review -> revision -> accepted Delivery appears in learner evidence/progress.

The existing lesson challenge spec covers focused coding challenges. Code Prompts are different: they are project-style missions where the learner must deliver a coherent piece of engineering work. They may include code, tests, notes, assumptions, tradeoffs, screenshots, API changes, or other evidence required by the prompt.

## Goals / Non-Goals

**Goals:**

- Define Code Prompts and Deliveries as first-class learner capabilities.
- Keep MVP evaluation realistic but limited: checks, tests, review status, revision guidance, and basic evidence.
- Connect accepted Deliveries to progression and mission-log behavior.
- Preserve the CYOA/mission framing in prompt language, decisions, consequences, and review outcomes.
- Preserve a foundation for future B2B hiring assessments without implementing B2B workflows now.

**Non-Goals:**

- Do not define final data schemas, API endpoints, runner implementation, or workspace execution environment.
- Do not define admin prompt-authoring workflows in detail; that belongs to `define-academy-admin-content-management`.
- Do not define content health dashboards in detail; that belongs to `define-academy-content-health-dashboard`.
- Do not define future company assessments, custom company prompt libraries, anti-cheating, plagiarism detection, candidate packets, or rubric editor tooling.
- Do not replace focused lesson challenges; Code Prompts complement them.

## Decisions

### Decision: Treat Delivery as the submitted artifact

The platform should use "Delivery" as the learner-facing term for submitted engineering work. A Delivery may include code, tests, notes, assumptions, tradeoffs, screenshots, or other required evidence.

Alternative considered: use "submission" everywhere. That is generic and loses the product framing: learners are practicing how to ship a delivery.

### Decision: Keep MVP review report bounded

MVP review reports should include evaluation results, status, strengths or passed checks, risks or failed checks, and revision guidance. Full AI design review, hiring panel evidence packets, and advanced rubric editors are deferred.

Alternative considered: launch with AI review as the main evaluator. That would make the MVP dependent on review quality and policy decisions before the simpler test/check loop is proven.

### Decision: Separate focused challenges from Code Prompts

Focused challenges remain local to lesson skills and code execution. Code Prompts are broader, project-style missions with delivery evidence and revisions.

Alternative considered: fold Code Prompts into lesson challenges. That would blur the boundary and make lesson challenge behavior too broad.

### Decision: Preserve B2B compatibility but defer B2B workflows

The same prompt/delivery foundation can later support hiring assessments. MVP should avoid design choices that block candidate review packets or company assignments, but it should not implement company tenants or hiring workflows.

Alternative considered: define hiring assessments now. That would add tenant, legal, privacy, anti-cheating, and rubric management concerns before the learner prompt loop exists.

## Risks / Trade-offs

- Code Prompts can become too broad -> Keep MVP prompt anatomy and review report bounded.
- Evaluation may overfit to tests -> Add implementation notes, assumptions, and risk feedback from the start, even if advanced AI review is deferred.
- Workspace scope can expand into a full cloud IDE -> Specify lifecycle requirements now and defer execution environment choices to implementation proposals.
- B2B needs may influence learner UX too early -> Keep future assessment compatibility as a boundary, not an MVP workflow.

## Migration Plan

1. Accept this proposal.
2. Apply the `academy-code-prompts-deliveries` baseline capability and modified boundaries.
3. Create follow-up implementation proposals for admin prompt authoring, frontend prompt/workspace UX, API/contracts, runner/evaluation integration, and content health visibility.
4. Defer hiring-assessment proposals until learner Code Prompts and Deliveries are proven.

## Open Questions

- Should MVP Code Prompt workspaces be browser-only, repo-backed, container-backed, or implementation-defined until runner proposals land?
- What evidence fields are required for the first Code Prompt versus optional?
- Should a revision create a new Delivery record, a new attempt under the same Delivery, or both?
- How many accepted Deliveries should the first path require?
