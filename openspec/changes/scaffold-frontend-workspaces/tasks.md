## 1. Proposal Review

- [ ] 1.1 Review `academy-monorepo-structure`, `academy-shell`, `academy-design-system-components`, `academy-visual-design`, and `academy-mvp-scope` for frontend workspace boundaries.
- [ ] 1.2 Review current repository root, app placeholders, package placeholders, `package.json`, and `pnpm-workspace.yaml` for scaffold impact.
- [ ] 1.3 Confirm frontend scaffolding is the next proposal candidate after AI mentor guardrails.
- [ ] 1.4 Confirm this proposal does not implement production learner/admin workflows, backend APIs, contracts, infrastructure, or services.

## 2. Spec Application

- [ ] 2.1 Add the accepted `academy-frontend-workspaces` capability to baseline specs.
- [ ] 2.2 Update `academy-monorepo-structure` with frontend scaffold activation boundaries.
- [ ] 2.3 Update `academy-design-system-components` with shared UI package boundaries.
- [ ] 2.4 Update `academy-visual-design` with frontend scaffold token boundaries.
- [ ] 2.5 Update `academy-shell` with learner frontend shell scaffold boundaries.
- [ ] 2.6 Update `academy-mvp-scope` with frontend scaffolding sequence boundaries.

## 3. Implementation Planning

- [ ] 3.1 Define implementation scope for `apps/web`, `apps/admin`, `packages/ui`, `packages/tsconfig`, and `packages/eslint-config`.
- [ ] 3.2 Define expected root and workspace scripts for dev, build, lint, typecheck, test/check, and formatting.
- [ ] 3.3 Identify whether frontend scaffold implementation or Spring Boot API scaffolding should come next after this proposal is accepted.

## 4. Validation

- [ ] 4.1 Run `openspec validate scaffold-frontend-workspaces --strict`.
- [ ] 4.2 Run `openspec validate --all --strict`.
- [ ] 4.3 Confirm the proposal branch contains only OpenSpec proposal artifacts unless documentation alignment edits are intentionally included.
