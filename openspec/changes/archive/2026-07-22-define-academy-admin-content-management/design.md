## Context

The accepted MVP scope requires one complete learner path and enough content operations to run and improve it. The accepted Code Prompts and Deliveries capability defines how learners interact with project-style prompts, but prompt definitions, lesson content, challenge configuration, and catalog offerings still need an admin-owned creation and publication workflow.

Admin content management should be deliberately smaller than a full CMS for MVP. It should create and publish enough structured content to power the first shippable path while leaving advanced collaboration, scheduling, localization, media pipelines, analytics, and content health dashboards for later proposals.

## Goals / Non-Goals

**Goals:**

- Define admin ownership of content authoring and publishing.
- Cover tracks, courses, modules, lessons, focused coding challenges, Code Prompts, and catalog metadata.
- Support draft, review, publish, unpublish, archive, restore, validation, preview, versioning, and rollback.
- Keep learner surfaces read-only consumers of published content.
- Preserve the CYOA/mission framing in content metadata and preview.

**Non-Goals:**

- Do not implement admin UI, API endpoints, storage schemas, rich text editors, file uploads, media pipelines, or auth roles.
- Do not define content health analytics; that belongs to `define-academy-content-health-dashboard`.
- Do not define full multi-user editorial collaboration, scheduled publishing, localization, or enterprise approval workflows.
- Do not make learner catalog, lesson challenge, or Code Prompt capabilities own authoring behavior.

## Decisions

### Decision: Admin content management owns authoring, not learner consumption

Admin content management should own content drafts, validation, preview, publication, versioning, and unpublication. Learner capabilities consume published content snapshots.

Alternative considered: let each learner-facing capability own its own authoring workflow. That would duplicate lifecycle rules and make content consistency difficult.

### Decision: MVP content lifecycle is intentionally simple

MVP should support draft, in review, published, unpublished, archived, and restored. Advanced workflow states can wait until real editorial needs emerge.

Alternative considered: introduce a full editorial workflow with assignments, approvals, scheduled releases, and localization. That is useful later but too broad before the first path ships.

### Decision: Preview uses learner-facing rendering without publishing

Admin preview should show how catalog offerings, lessons, focused challenges, and Code Prompts will appear to learners, without exposing the draft to normal learner access.

Alternative considered: build separate admin-only previews. That risks mismatch between authoring preview and learner experience.

### Decision: Versioning is required before publishing

Published content should keep version history, change notes, and rollback targets. MVP does not need a full diff editor, but admins need enough versioning to recover from bad publishes.

Alternative considered: publish mutable records in place. That is faster but unsafe once learner attempts, Deliveries, and progress reference content.

## Risks / Trade-offs

- Authoring scope may expand into full CMS complexity -> Keep MVP to structured content, validation, preview, publish, and rollback.
- Preview can require significant frontend work -> Specify behavior now; implementation can start with pragmatic preview fidelity and improve later.
- Versioning can complicate learner attempts -> Use published snapshots or stable version references so learner history remains coherent.
- Role boundaries depend on auth implementation -> Define roles contractually here and map them to auth/authorization later.

## Migration Plan

1. Accept this proposal.
2. Apply the `academy-admin-content-management` baseline spec and boundary deltas.
3. Create follow-up implementation proposals for admin frontend scaffolding, content APIs/contracts, content validation, and persistence.
4. Keep content health dashboard as a separate follow-up that consumes published content and learner outcome signals.

## Open Questions

- Should the first authoring format be Markdown plus structured metadata, block-based editing, or an implementation detail?
- Should Code Prompt starter projects be uploaded archives, repository references, generated templates, or implementation-defined for MVP?
- Should published content changes create new versions automatically on every save or only on publish?
- Should admin preview support authenticated learner context such as plan, clearance, and progress from day one?
