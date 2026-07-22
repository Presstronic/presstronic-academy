## 1. Contract Workspace Scaffold

- [ ] 1.1 Replace placeholder-only `packages/contracts` documentation with active workspace documentation.
- [ ] 1.2 Add package metadata for contract source, validation, and generated client outputs.
- [ ] 1.3 Create an OpenAPI source layout that can hold API-level and feature-level contract files.
- [ ] 1.4 Create a generated TypeScript client output boundary without committing feature clients before contracts exist.

## 2. Tooling and Scripts

- [ ] 2.1 Add contract validation tooling and workspace scripts.
- [ ] 2.2 Add client generation tooling or documented generation command.
- [ ] 2.3 Wire root scripts or documented commands for contract validation and generation.
- [ ] 2.4 Ensure generated artifacts are deterministic or explicitly ignored when they are derived outputs.

## 3. Integration Boundaries

- [ ] 3.1 Document how `apps/api` keeps endpoint behavior aligned with OpenAPI contracts.
- [ ] 3.2 Document how `apps/web` and `apps/admin` consume generated clients.
- [ ] 3.3 Confirm API clients remain deferred for product workflows not yet accepted.
- [ ] 3.4 Keep persistence, auth, WebSocket event contracts, service contracts, and GraphQL out of this setup.

## 4. Verification

- [ ] 4.1 Run contract validation commands.
- [ ] 4.2 Run affected workspace build/typecheck commands.
- [ ] 4.3 Run `openspec validate setup-shared-api-contracts --strict`.
- [ ] 4.4 Run `openspec validate --all --strict`.
- [ ] 4.5 Run `git diff --check`.
