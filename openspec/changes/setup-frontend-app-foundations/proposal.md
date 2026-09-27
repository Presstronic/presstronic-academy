## Why

`apps/web` and `apps/admin` render one static scaffold screen each. They have no router, no way to call the API, no server-state handling, and no test runner. The auth frontend (#207) needs route guards, a session query, error handling for the API's problem-details contract, and integration tests, and every feature after it needs the same things. If #207 picks these while it's building auth screens, both apps get foundations shaped around a single feature. This change sets them up once, for both apps, before feature work starts.

## What Changes

- Add TanStack Router to both apps with hash history. Routes are declared in code and typed, and guards run in `beforeLoad`. **BREAKING (URL format)**: learner screens move from `#dashboard` to `#/dashboard`. The `academy-shell` routing requirements and the auth proposal's `#auth` references are updated to match. The apps have no users yet, so nobody is affected.
- Register the full `academy-shell` screen registry as routes in `apps/web`, backed by placeholder screens: landing and auth outside the shell, all others inside it, and a not-found route. Protected routes use a guard hook that the auth change fills in. Until then the guard allows everything.
- Add TanStack Query for server state with one `QueryClient` per app and conservative defaults: no retry on 4xx, and no automatic refetch on window focus for mutations.
- Add a small hand-written API client per app (`src/lib/api`). It calls the API with same-origin relative URLs and sends cookies. It parses `application/problem+json` into a typed `ApiProblem` (status, `code`, `requestId`, field `errors`) and treats network failures as a separate error kind. It has an extension point for request headers such as the auth change's CSRF header. The generated contract clients from `setup-shared-api-contracts` plug in behind the same interface later.
- Add Vite dev-server proxies in both apps for `/api`, `/auth`, `/oauth`, `/.well-known`, and `/ws` (with WebSocket upgrade) to the local API, so local development is same-origin as `setup-api-platform-foundations` requires. The target can be overridden with an environment variable.
- Add a test harness to `apps/web`, `apps/admin`, and `packages/ui`: Vitest with jsdom, Testing Library, `@testing-library/jest-dom`, and MSW for API mocking. Add a `test` script to each workspace so root `pnpm test` runs them all. Add starter tests covering routing, the guard, API problem parsing, and a shared component.

## Capabilities

### New Capabilities

None.

### Modified Capabilities

- `academy-frontend-workspaces`: Modify `Frontend Dependency Boundaries` to permit a hand-written transport client ahead of generated contract clients. Add `Frontend Routing Foundation`, `Frontend API Client`, `Local API Proxy`, and `Frontend Test Harness` requirements.
- `academy-shell`: Modify `Initial Screen Selection`, `Hash Change Navigation`, and `Protected Route Access` to use the `#/<screen>` hash format.

## Impact

- **Code**: `apps/web` and `apps/admin` (`src/main.tsx`, new `src/routes/`, `src/lib/api/`, `src/lib/query.ts`, `vite.config.ts`, `vitest` config, `package.json`), `packages/ui` (test config and a first test), and root `README.md`.
- **Dependencies**: `@tanstack/react-router` and `@tanstack/react-query` in both apps. Dev dependencies in all three workspaces: `vitest`, `jsdom`, `@testing-library/react`, `@testing-library/dom`, `@testing-library/user-event`, `@testing-library/jest-dom`, and `msw`.
- **Other proposals**: Depends on `upgrade-react-19-and-vite-8` (Vitest 5 needs Vite ≥ 6.4) and consumes the error contract and path layout from `setup-api-platform-foundations`. `implement-passwordless-auth-and-oauth` task 7.3 and its `#auth` references move to `#/auth`, and #207 builds on this change's guard, API client, and test harness instead of choosing its own.
- **Deferred**: Generated API clients (`setup-shared-api-contracts`), end-to-end browser tests (Playwright), real screens, and admin route definitions beyond a placeholder home and not-found route.
