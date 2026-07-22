## Context

The accepted MVP scope classifies hiring assessments as future/B2B. Assessments can share Code Prompt, Delivery, evaluation, and evidence concepts, but they introduce company ownership, candidate privacy, rubric integrity, review packets, and tenant-specific prompts.

## Goals / Non-Goals

**Goals:**

- Define the future assessment boundary without implementing it.
- Preserve compatibility with learner Code Prompts and Deliveries.
- Identify privacy, integrity, and review constraints.
- Separate candidate assessment flows from learner education flows.

**Non-Goals:**

- Do not implement assessments in MVP.
- Do not define company billing, tenant administration, or final pricing.
- Do not implement anti-cheating or plagiarism detection.
- Do not implement candidate review packets or company prompt libraries in this change.

## Decisions

### Decision: Reuse Code Prompt and Delivery concepts

Assessments should build on the same work-submission foundation as learning, with assessment-specific ownership and constraints.

Alternative considered: create a separate assessment work model. That would duplicate the strongest shared foundation before there is evidence it needs to diverge.

### Decision: Keep candidate privacy separate from learner profile

Candidate assessment evidence should not automatically become learner profile or public portfolio evidence.

Alternative considered: treat candidates as learners. That would blur privacy, consent, and review expectations.

## Risks / Trade-offs

- Assessment needs can distort MVP learning -> keep implementation deferred and scoped as future/B2B.
- Candidate privacy requirements are higher -> require consent and access boundaries before implementation.
- Anti-cheating can become a broad product -> capture integrity boundaries without overcommitting implementation.
- Rubric complexity can grow quickly -> define minimum rubric concepts before building editors.

## Migration Plan

1. Accept this proposal.
2. Preserve MVP Code Prompt and Delivery compatibility.
3. Later define candidate review packets and company prompt libraries as separate future/B2B changes.
4. Implement assessment workflows only after the learner delivery loop is proven.

## Open Questions

- Should candidates authenticate through the same auth surface as learners?
- What evidence can be shared with companies, candidates, and internal reviewers?
- Which integrity controls are required before a paid B2B assessment launch?
