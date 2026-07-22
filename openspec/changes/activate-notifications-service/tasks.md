## 1. Service Boundary

- [ ] 1.1 Replace placeholder-only `services/notifications` documentation with active service boundary documentation.
- [ ] 1.2 Define service package/build/runtime metadata.
- [ ] 1.3 Document ownership between product event sources, worker orchestration, and notification delivery.
- [ ] 1.4 Keep provider credentials and production sending disabled until accepted.

## 2. Delivery Model

- [ ] 2.1 Define notification source event and delivery request shapes.
- [ ] 2.2 Define delivery lifecycle states, retries, idempotency, and failure handling.
- [ ] 2.3 Define channel, template, preference, and suppression boundaries.
- [ ] 2.4 Define observability requirements for delivery attempts and failures.

## 3. Verification

- [ ] 3.1 Run service scaffold build or equivalent checks.
- [ ] 3.2 Run contract/schema checks if added.
- [ ] 3.3 Run `openspec validate activate-notifications-service --strict`.
- [ ] 3.4 Run `openspec validate --all --strict`.
- [ ] 3.5 Run `git diff --check`.
