# OpenSpec Boundary Map

This document records the ownership decisions applied by `normalize-academy-spec-boundaries`.

## Capability Ownership

| Shared behavior | Authoritative capability | Delegating surfaces |
| --- | --- | --- |
| Data export, account erasure, cookie preferences, consent persistence, privacy request state, and accessible privacy feedback | `academy-privacy-controls` | `academy-landing`, `academy-profile`, footer/legal entry points, authenticated settings surfaces |
| Global color, typography, geometry, motion, backgrounds, decorative treatment, and iconography | `academy-visual-design` | All public and authenticated Academy surfaces |
| Reusable UI primitive variants, local component state, accessibility, and component styling | `academy-design-system-components` | All screen specs that compose buttons, cards, forms, tabs, dialogs, tooltips, progress indicators, toasts, and navigation links |
| Screen registry, protected route access, shell chrome, shell navigation, theme coordination, and shell side effects | `academy-shell` | `academy-dashboard`, `academy-catalog`, `academy-mission-log`, `academy-story`, `academy-lesson-challenge`, `academy-progression`, `academy-profile`, `academy-certificate` |
| Authentication entry, form validation, session lifecycle, recovery, and abuse controls | `academy-auth-entry` | `academy-landing`, billing plan-intent entry, protected-route redirects |
| Plan intent, checkout, subscription lifecycle, billing management, and entitlement checks | `academy-billing-access` | `academy-landing`, `academy-auth-entry`, content surfaces that require entitlement gates |
| Catalog search/filter/enrollment surface state and offering cards | `academy-catalog` | Dashboard catalog previews, shell navigation, billing entitlement checks |
| Dashboard summary state, resume mission, telemetry, and mission-log preview presentation | `academy-dashboard` | Shell navigation, progression values, mission-log preview data |
| Mission-log grouping, transmission read state, category/tabs, and message actions | `academy-mission-log` | Dashboard preview, shell notification entry points |
| Narrative beat rendering, branch choice state, checkpoints, rewinds, story map, and story persistence | `academy-story` | Landing preview, lesson challenge transitions, progression updates |
| Coding challenge briefing, editor drafts, sandbox execution, test output, mentor behavior, and challenge completion | `academy-lesson-challenge` | Story challenge entry points, progression award updates |
| Clearance ladder, XP, achievements, award integrity, and derived progression state | `academy-progression` | Dashboard telemetry, story telemetry, lesson completion, certificate eligibility |
| Certificate presentation, sharing, verification, issuance, revocation display, and certificate privacy | `academy-certificate` | Progression completion-record navigation, public verification pages |
| Learner identity editing, callsign, bio, avatar selection, terminal preferences, and profile persistence | `academy-profile` | Shell identity block, privacy-control entry points, theme preference coordination |

## Duplicate Ownership Audit

The baseline specs previously mixed ownership in these areas:

| Area | Resolution |
| --- | --- |
| Landing privacy actions duplicated data export, erasure confirmation, cookie category, cancellation, and save behavior | Landing now owns only public footer entry points and delegates privacy behavior to `academy-privacy-controls`. |
| Public and app surfaces repeated global visual direction | Surface specs now carry responsibility boundaries that refer global styling to `academy-visual-design`; surface specs may still define local layout and content exceptions. |
| Screen specs referenced app-shell state directly | Screen specs now define whether they render inside or outside the shell, while `academy-shell` owns route selection, protected access, shell chrome, theme coordination, and side effects. |
| Component specs could be interpreted as owning routing, persistence, validation, or network work | `academy-design-system-components` explicitly owns reusable primitive behavior only; consumers supply app-level behavior through props or composition. |
| Progression, certificate, dashboard, story, lesson, and billing specs all mention learner state changes | Progression owns award integrity and derived progression state; certificates own completion-record presentation and verification; feature surfaces delegate shared state updates to the authoritative owner. |

## Volatile Literal Classification

| Literal or content pattern | Classification | Owner or follow-up |
| --- | --- | --- |
| Landing hero metrics such as story-path count, challenge count, and learner participation count | Data-source-driven content | `academy-landing` displays configured product metrics; data source contract can be specified with implementation work. |
| Public pricing labels, plan names, and prices | Contractual until billing changes | `academy-billing-access` owns plan intent and subscription semantics; `academy-landing` owns public pricing display. |
| Feature-card names, hero positioning copy, story preview labels, and CTA labels | Example/product copy | Surface specs can keep these as current product copy, but changes should be reviewed as content/product decisions. |
| Story preview narrative from The Broken Pipeline | Mockup content | `academy-landing` owns public preview presentation; `academy-story` owns canonical narrative path data. |
| Compliance badge labels such as GDPR, CCPA, and WCAG 2.2 AA | Contractual display labels, not legal-policy text | `academy-landing` owns badge display; legal policy content remains out of scope. |
| Visual token names, color roles, grid sizes, glow treatment, and typography roles | Contractual design-system language | `academy-visual-design` owns global visual rules and should be changed by visual-design deltas. |
| Shell screen IDs such as `landing`, `auth`, `dashboard`, `catalog`, `log`, `story`, `lesson`, `progression`, `profile`, and `certificate` | Contractual routing vocabulary | `academy-shell` owns the screen registry and protected route behavior. |
| XP, clearance, achievement, completion-record, and certificate values shown in examples | Data-source-driven content | `academy-progression` and `academy-certificate` own derived state and presentation boundaries. |
