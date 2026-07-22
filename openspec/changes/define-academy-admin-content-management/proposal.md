## Why

The MVP requires a first shippable path, Code Prompts, Deliveries, and content iteration. The current baseline defines learner-facing catalog, lesson, prompt, and progress behavior, but it does not define how admins create, validate, preview, review, publish, unpublish, or version the authored content that powers those learner surfaces.

## What Changes

- Add a new `academy-admin-content-management` capability for admin/instructor content authoring and publishing workflows.
- Define managed content types: tracks, courses, modules, lessons, focused coding challenges, Code Prompts, and supporting metadata.
- Define draft, review, publish, unpublish, archive, and restore lifecycle states.
- Define preview behavior for learner-facing catalog entries, lessons, challenges, and Code Prompts before publication.
- Define validation requirements for required fields, content structure, broken references, prompt evidence checklists, challenge test configuration, and publish readiness.
- Define basic content versioning, change notes, and rollback expectations.
- Define admin roles and boundaries: author, reviewer, publisher, and read-only viewer.
- Add boundary deltas so catalog, lesson challenge, and Code Prompts consume published content while admin content management owns authoring and publish state.

## Capabilities

### New Capabilities

- `academy-admin-content-management`: Admin authoring, validation, preview, review, publication, unpublication, versioning, and role boundaries for Academy content.

### Modified Capabilities

- `academy-catalog`: Catalog consumes published offerings and does not own admin authoring or publish lifecycle.
- `academy-lesson-challenge`: Lesson challenge consumes published lesson/challenge content and does not own admin authoring.
- `academy-code-prompts-deliveries`: Code Prompts consume published prompt definitions and do not own admin authoring or publishing.
- `academy-mvp-scope`: MVP scope recognizes admin content management as required content operations for the first shippable path.

## Impact

- Affects future admin app, API/contracts, content storage, validation, and publishing implementation proposals.
- Establishes admin authoring as MVP-critical without implementing UI or backend code in this proposal.
- Does not define final database schemas, REST endpoints, rich text editor implementation, media storage, workflow notifications, or content health analytics.
- Content health dashboard remains a separate follow-up capability that consumes content and learner outcome signals.
