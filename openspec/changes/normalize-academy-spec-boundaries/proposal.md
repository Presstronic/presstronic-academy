## Why

The Academy baseline specs are comprehensive, but several capabilities currently duplicate ownership of shared behavior such as privacy flows, visual rules, navigation, and persistence boundaries. Normalizing those boundaries now will make the specs easier to maintain before implementation starts and will reduce future conflicts between web, admin, API, and shared UI work.

## What Changes

- Clarify which capability owns cross-cutting behavior and which capabilities only expose entry points into that behavior.
- Move duplicated privacy flow details out of surface specs and into `academy-privacy-controls`.
- Move global visual rules out of individual screen specs and into `academy-visual-design`.
- Keep screen specs focused on observable screen-specific presentation, actions, and state.
- Keep component specs focused on reusable primitive behavior, not app-level persistence, navigation policy, or backend behavior.
- Clarify shell ownership for routing, protected access, app chrome, top-level navigation, and theme coordination.
- Clarify feature capability ownership for catalog, story, lesson challenge, dashboard, mission log, progression, certificate, profile, auth, and billing behaviors.
- No user-facing behavior changes are intended by this proposal; this is a documentation and specification boundary cleanup.

## Capabilities

### New Capabilities

- None.

### Modified Capabilities

- `academy-landing`: Remove duplicated privacy dialog internals and global visual rules; keep landing-specific public presentation, CTAs, footer entry points, and delegation to shared capabilities.
- `academy-privacy-controls`: Own data export, account erasure, cookie preferences, privacy request state, persistence, and privacy feedback accessibility across public and authenticated surfaces.
- `academy-visual-design`: Own global Academy art direction, tokens, typography, geometry, motion, background treatment, iconography, and visual constraints used by all screens and components.
- `academy-design-system-components`: Own reusable UI primitive behavior and styling contract while explicitly excluding app persistence, routing policy, and backend behavior.
- `academy-shell`: Own top-level screen resolution, protected route access, app chrome, app navigation, theme coordination, and shell side effects.
- `academy-auth-entry`: Own authentication entry screen behavior, validation, request state, session lifecycle, recovery, and abuse controls without owning billing checkout or global shell routing.
- `academy-billing-access`: Own plan intent, checkout, entitlement enforcement, subscription lifecycle, and billing management without owning authentication screen fields.
- `academy-catalog`: Own offering discovery, filters, enrollment actions, catalog state, and access display without owning entitlement source-of-truth logic outside catalog boundaries.
- `academy-dashboard`: Own dashboard presentation and derived summaries while delegating source-of-truth progression, catalog, and mission-log behavior to their owning capabilities.
- `academy-story`: Own narrative rendering, branches, checkpoints, media expectations, and challenge handoff while delegating challenge execution to lesson challenge.
- `academy-lesson-challenge`: Own coding challenge presentation, test execution expectations, draft safety, mentor behavior, and sandbox safety without owning story branch decisions.
- `academy-mission-log`: Own transmissions, unread/read state, grouping, tabs, counts, and action routing without owning destination screen behavior.
- `academy-progression`: Own clearance, achievements, completion navigation, and read-only progression integrity without owning certificate issuance details.
- `academy-certificate`: Own certificate presentation, sharing, issuance, verification privacy, and record access without owning progression award rules.
- `academy-profile`: Own learner profile presentation, editable identity, preferences, avatar entry points, validation, and persistence while delegating erasure to privacy controls.

## Impact

- Affects OpenSpec artifacts under `openspec/specs/` and the proposed change deltas under `openspec/changes/normalize-academy-spec-boundaries/`.
- Does not require frontend, backend, API, database, or infrastructure implementation changes.
- Improves future implementation planning by making each capability's ownership and delegation boundaries explicit.
