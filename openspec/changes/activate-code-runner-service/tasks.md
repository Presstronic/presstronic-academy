## 1. Service Boundary

- [ ] 1.1 Replace placeholder-only `services/code-runner` documentation with active service boundary documentation.
- [ ] 1.2 Define service package/build/runtime metadata.
- [ ] 1.3 Document ownership between `apps/api`, `apps/worker`, and `services/code-runner`.
- [ ] 1.4 Keep unrelated services inactive.

## 2. Execution Contract

- [ ] 2.1 Define job request and result contract shape.
- [ ] 2.2 Define job lifecycle states and failure semantics.
- [ ] 2.3 Define sandbox isolation, timeout, resource, and cancellation requirements.
- [ ] 2.4 Define artifact and log handling boundaries.

## 3. Evaluation Integration

- [ ] 3.1 Document how Delivery evaluation consumes code-runner results.
- [ ] 3.2 Ensure code-runner output does not automatically imply Delivery acceptance.
- [ ] 3.3 Keep persistence schemas and production queue wiring deferred unless separately accepted.

## 4. Verification

- [ ] 4.1 Run service scaffold build or equivalent checks.
- [ ] 4.2 Run contract/schema checks if added.
- [ ] 4.3 Run `openspec validate activate-code-runner-service --strict`.
- [ ] 4.4 Run `openspec validate --all --strict`.
- [ ] 4.5 Run `git diff --check`.
