## 1. Contract Workspace Scaffold

- [ ] 1.1 Replace placeholder-only `packages/contracts` documentation with active workspace documentation covering contract-first ownership, the drift test, and how apps consume the client.
- [ ] 1.2 Add `packages/contracts/package.json` (`@presstronic-academy/contracts`) with `openapi-typescript` as a dev dependency and `openapi-fetch` as a dependency, and exports for generated types and a client factory; verify `pnpm install` resolves it as a workspace package.
- [ ] 1.3 Create `packages/contracts/openapi/academy.yaml` (OpenAPI 3.1) containing only the shared components from design.md (`Problem`, `ValidationProblem`, `ErrorCode`) and an empty `paths` object; verify the component fields match the `setup-api-platform-foundations` error contract.
- [ ] 1.4 Create the generated output boundary (`packages/contracts/src/generated/`), either committed and deterministic or ignored and generated on install/build (document the choice); verify two consecutive generations produce identical output.

## 2. Tooling and Scripts

- [ ] 2.1 Add a `validate` script (OpenAPI lint/validation, for example Redocly CLI) and a `generate` script (`openapi-typescript`) to `packages/contracts`; verify validation fails on a deliberately invalid schema.
- [ ] 2.2 Add a `createAcademyClient()` factory over `openapi-fetch` with middleware hooks for request interceptors and `ApiProblem` / `NetworkError` mapping compatible with the per-app `apiFetch` from `setup-frontend-app-foundations`; verify tests (MSW) cover a problem-details response and a network failure.
- [ ] 2.3 Wire `check`, `test`, and `build` scripts so root `pnpm check`, `pnpm test`, and `pnpm build` include the contracts package; verify each root command runs it.

## 3. Integration Boundaries

- [ ] 3.1 Add `springdoc-openapi` to `apps/api` without shipping it in the runtime artifact (test scope or a build-time generation task), and a test that compares the API's generated OpenAPI document to `packages/contracts/openapi/academy.yaml`, failing on path, operation, status, or schema differences; verify the test passes with the component-only contract and fails when a test-only controller adds an uncontracted endpoint.
- [ ] 3.2 Document how `apps/web` and `apps/admin` move contracted calls to the generated client while keeping hand-written TanStack Query hooks.
- [ ] 3.3 Confirm no product endpoint contracts are added; the first endpoints arrive with `implement-passwordless-auth-and-oauth` (#205) as contract deltas.
- [ ] 3.4 Keep persistence, WebSocket event contracts, service contracts, runtime response validation, and GraphQL out of this setup.

## 4. Verification

- [ ] 4.1 Run the contracts `validate` and `generate` scripts; verify both succeed.
- [ ] 4.2 Run `pnpm check`, `pnpm test`, `pnpm build`, and `pnpm api:build`; verify all pass.
- [ ] 4.3 Run `openspec validate setup-shared-api-contracts --strict`.
- [ ] 4.4 Run `openspec validate --all --strict`.
- [ ] 4.5 Run `git diff --check`.
