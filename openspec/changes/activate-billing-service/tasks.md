## 1. Service Boundary

- [ ] 1.1 Replace placeholder-only `services/billing` documentation with active service boundary documentation.
- [ ] 1.2 Define service package/build/runtime metadata.
- [ ] 1.3 Document ownership between access gating, provider integration, and entitlement synchronization.
- [ ] 1.4 Keep checkout, pricing, production provider credentials, and subscription lifecycle implementation deferred.

## 2. Billing Contracts

- [ ] 2.1 Define entitlement synchronization concepts and states.
- [ ] 2.2 Define provider webhook handling, idempotency, replay, and audit expectations.
- [ ] 2.3 Define failure handling when provider state and Academy state diverge.
- [ ] 2.4 Define observability requirements for billing events and entitlement changes.

## 3. Verification

- [ ] 3.1 Run service scaffold build or equivalent checks.
- [ ] 3.2 Run contract/schema checks if added.
- [ ] 3.3 Run `openspec validate activate-billing-service --strict`.
- [ ] 3.4 Run `openspec validate --all --strict`.
- [ ] 3.5 Run `git diff --check`.
