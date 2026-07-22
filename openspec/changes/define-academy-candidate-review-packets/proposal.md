## Why

Candidate review packets are a future/B2B assessment output that needs its own boundary before companies can consume assessment evidence. Capturing it now keeps review artifacts separate from learner progress, raw Delivery data, and admin content operations.

## What Changes

- Define candidate review packet contents, evidence sources, reviewer-facing summaries, access rules, and sharing lifecycle.
- Clarify that review packets are derived from accepted assessment attempts and Deliveries.
- Define privacy, redaction, audit, expiration, and export boundaries.
- Keep implementation deferred until hiring assessments are accepted and built.

## Capabilities

### New Capabilities

- `academy-candidate-review-packets`: Future/B2B candidate packet generation, contents, evidence mapping, sharing lifecycle, redaction, access, and audit behavior.

### Modified Capabilities

- `academy-mvp-scope`: Clarifies that candidate review packets remain future/B2B and do not ship in the first learner MVP.

## Impact

- Affects future assessment review surfaces, company reviewer access, exports, and evidence retention.
- Does not implement packet generation, exports, company reviewer UI, or assessment workflows.
