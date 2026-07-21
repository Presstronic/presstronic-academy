## Why

The accepted MVP scope makes Code Prompts and Deliveries the central differentiator: learners should prove they can ship coherent engineering work, not only solve isolated exercises. The current baseline has lesson challenges and progression, but it does not yet define Code Prompt anatomy, workspace lifecycle, Delivery submission, evaluation, revision, review reports, learner evidence, or the boundary with future B2B hiring assessments.

## What Changes

- Add a new `academy-code-prompts-deliveries` capability for project-style prompts and submitted Deliveries.
- Define Code Prompt anatomy: mission brief, objective, constraints, starter project/workspace instructions, delivery checklist, and evaluation expectations.
- Define prompt workspace lifecycle: start, resume, preserve work, reset/restart, and state ownership.
- Define Delivery submission: project/code changes, implementation notes, assumptions, tradeoffs, tests, screenshots, and other prompt-required evidence.
- Define attempt history, evaluation checks, basic review reports, revision flow, and accepted Delivery evidence.
- Integrate accepted Deliveries with learner progress, basic skill evidence, and mission-log activity.
- Preserve compatibility with future hiring assessments while explicitly deferring company tenants, candidate packets, anti-cheating, rubric editors, and custom prompt libraries.

## Capabilities

### New Capabilities

- `academy-code-prompts-deliveries`: Code Prompt definitions, prompt workspaces, Delivery submissions, attempts, evaluation checks, review reports, revisions, learner evidence, and future hiring-assessment boundaries.

### Modified Capabilities

- `academy-lesson-challenge`: Clarify the boundary between focused lesson challenges and broader Code Prompts.
- `academy-progression`: Include accepted Deliveries as learner evidence without making progression own prompt evaluation internals.
- `academy-mission-log`: Include prompt and Delivery lifecycle events as loggable activity without making mission-log own prompt behavior.

## Impact

- Affects future learner web, admin/content, API/contracts, code runner, and content health proposals.
- Adds no implementation code in this proposal.
- Does not define B2B hiring assessments, company accounts, rubric editor tooling, plagiarism detection, or prompt authoring UI in detail.
- Future implementation proposals should reference this capability before scaffolding Code Prompt screens, APIs, data models, or runner integration.
