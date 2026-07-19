## 1. Boundary Audit

- [ ] 1.1 Review all current `openspec/specs/academy-*` files and mark requirements that duplicate privacy, visual design, shell routing, component, billing, progression, certificate, story, lesson, dashboard, mission-log, catalog, auth, or profile ownership.
- [ ] 1.2 Create a capability ownership map that identifies the authoritative owner and allowed delegating surfaces for each shared behavior.
- [ ] 1.3 Identify hard-coded volatile literals in baseline specs and classify each as contractual, example copy, mockup content, or data-source-driven content.

## 2. Shared Capability Normalization

- [ ] 2.1 Update `academy-privacy-controls` to own the complete data export, erasure, cookie preference, verification, consent persistence, request-state, and feedback accessibility contract.
- [ ] 2.2 Update `academy-visual-design` to own global color, typography, geometry, motion, background, decorative treatment, and iconography rules.
- [ ] 2.3 Update `academy-design-system-components` to own reusable primitive behavior, accessibility, variants, and component styling while excluding app-level routing, persistence, and backend behavior.
- [ ] 2.4 Update `academy-shell` to own screen registry, protected route access, app chrome, shell navigation, theme coordination, and shell side effects.

## 3. Surface Capability Normalization

- [ ] 3.1 Update `academy-landing` to keep public presentation, CTA, pricing-section display, footer entry points, and delegation while removing duplicated privacy and global visual internals.
- [ ] 3.2 Update `academy-auth-entry` and `academy-billing-access` so authentication owns account entry/session behavior and billing owns plan intent, checkout, subscriptions, and entitlements.
- [ ] 3.3 Update `academy-catalog`, `academy-dashboard`, and `academy-mission-log` so each owns its own surface state while deriving or delegating shared behavior to the authoritative capability.
- [ ] 3.4 Update `academy-story` and `academy-lesson-challenge` so story owns narrative/branch/checkpoint state and lesson challenge owns coding challenge execution, drafts, mentor, and sandbox behavior.
- [ ] 3.5 Update `academy-progression` and `academy-certificate` so progression owns award integrity and derived progression while certificate owns record presentation, sharing, verification, and certificate privacy.
- [ ] 3.6 Update `academy-profile` so profile owns learner profile editing and preferences while delegating erasure, credential verification, and shell theme application.

## 4. Validation

- [ ] 4.1 Run `openspec validate normalize-academy-spec-boundaries --strict`.
- [ ] 4.2 Run `openspec validate --specs --strict` after applying baseline spec edits.
- [ ] 4.3 Review the resulting specs for duplicated requirements and unresolved ownership conflicts.
- [ ] 4.4 Confirm no frontend, backend, API, database, or infrastructure implementation changes are included in this normalization change.
