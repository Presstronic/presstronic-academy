## 1. Proposal Review

- [ ] 1.1 Review the current root directory structure and confirm the intended ownership of `apps/`, `packages/`, `services/`, `infra/`, `docs/`, and `openspec/`.
- [ ] 1.2 Review the per-directory README placeholders and identify any wording that conflicts with the accepted monorepo ownership model.
- [ ] 1.3 Confirm `apps/gateway` and `services/*` remain deferred placeholders until future proposals activate them.

## 2. Spec Application

- [ ] 2.1 Add the accepted `academy-monorepo-structure` capability to baseline specs.
- [ ] 2.2 Update repository README guidance if needed so the documented structure matches the accepted capability.
- [ ] 2.3 Update app, package, service, or infra README placeholders if needed to align with the accepted maturity boundaries.

## 3. Follow-Up Planning

- [ ] 3.1 Create follow-up proposal candidates for frontend workspace scaffolding, Spring Boot API scaffolding, shared contracts setup, and local infrastructure setup.
- [ ] 3.2 Identify which follow-up proposal should be implemented first based on dependency order.
- [ ] 3.3 Confirm no application implementation code is included in this structure-definition change.

## 4. Validation

- [ ] 4.1 Run `openspec validate define-academy-monorepo-application-structure --strict`.
- [ ] 4.2 Run `openspec validate --all --strict`.
- [ ] 4.3 Confirm the proposal branch contains only OpenSpec proposal artifacts unless README alignment edits are intentionally added during apply.
