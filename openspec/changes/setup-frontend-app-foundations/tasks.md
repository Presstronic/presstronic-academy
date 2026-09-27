## 1. Test Harness

- [ ] 1.1 Add `vitest`, `jsdom`, `@testing-library/react`, `@testing-library/dom`, `@testing-library/user-event`, `@testing-library/jest-dom`, and `msw` as dev dependencies of `apps/web`, `apps/admin`, and `packages/ui`; verify `pnpm install` reports no peer warnings.
- [ ] 1.2 Add a `vitest.config.ts` per workspace (jsdom environment, merged with the Vite config where one exists) and a setup file that registers jest-dom matchers and an MSW server with `onUnhandledRequest: "error"`, resetting handlers after each test; add a `test` script (`vitest run`) to each workspace; verify root `pnpm test` runs all three.
- [ ] 1.3 Add a `packages/ui` test for `Button` (renders by role, applies variant, forwards `ref`, respects `disabled`); verify it passes.

## 2. Routing

- [ ] 2.1 Add `@tanstack/react-router` to both apps and create a code-based route tree with `createHashHistory()` in `src/routes/`, typed router context (`queryClient`, `auth` guard), and router type registration; verify `pnpm typecheck` fails on a link to an undeclared route.
- [ ] 2.2 In `apps/web`, declare the `academy-shell` screen registry: landing (`/`) and auth (`/auth`) outside the shell layout, and dashboard, catalog, log, story, lesson, progression, profile, and certificate inside a shell layout route, each rendering a placeholder, plus a not-found route; verify tests render `#/`, `#/auth`, `#/dashboard`, and `#/unknown` and assert the right screen and shell presence.
- [ ] 2.3 Add a protected-route `beforeLoad` that calls the context `auth` guard and, when it reports unauthenticated, redirects to `/auth` with a typed `redirect` search param; ship an explicit `allowAllGuard` stub; verify tests with a denying guard cover redirect-with-destination for every protected route and return navigation after a simulated sign-in.
- [ ] 2.4 In `apps/admin`, add the router with a placeholder home route and a not-found route; verify a routing test passes.
- [ ] 2.5 Replace the static `App` rendering in both `src/main.tsx` files with `RouterProvider` inside `QueryClientProvider`, keeping current scaffold visuals on the landing and home placeholders; verify both apps render in `pnpm dev`.

## 3. Server State and API Client

- [ ] 3.1 Add `@tanstack/react-query` to both apps and a `src/lib/query.ts` factory (retry only network errors and 5xx, `refetchOnWindowFocus: false`, short `staleTime`); verify a unit test asserts no retry on a 4xx `ApiProblem` and a retry on `NetworkError`.
- [ ] 3.2 Implement `src/lib/api/client.ts` in both apps: `apiFetch<T>` with same-origin relative paths, `credentials: "same-origin"`, JSON handling, registered request interceptors, `ApiProblem` parsing of `application/problem+json` (status, `code`, `title`, `requestId`, `errors`), a fallback `ApiProblem` for non-problem error bodies, and `NetworkError` for fetch failures and aborts; verify MSW-backed tests cover success, a validation problem with field errors, a 403 `reverification_required` problem, a non-JSON 502, a network failure, and interceptor-added headers.
- [ ] 3.3 Reject absolute URLs in `apiFetch`; verify a test asserts it throws for `https://…` input.

## 4. Local API Proxy

- [ ] 4.1 Add Vite `server.proxy` entries for `/api`, `/auth`, `/oauth`, `/.well-known`, and `/ws` (`ws: true`) targeting `process.env.ACADEMY_API_PROXY_TARGET ?? "http://localhost:8080"` with `changeOrigin: false` in both apps; verify with the API running that `http://localhost:5175/actuator/health` is served by Vite rather than proxied and `http://localhost:5175/api/v1/does-not-exist` returns the API's problem-details 404.
- [ ] 4.2 Document the proxy paths and `ACADEMY_API_PROXY_TARGET` in both app READMEs and the root README.

## 5. Align In-Flight Proposals

- [x] 5.1 In `implement-passwordless-auth-and-oauth` (`proposal.md`, `design.md`, `tasks.md`), replace `#auth` with `#/auth`, and point task 7.3 at this change's guard hook, API client, and Vitest + MSW harness.

## 6. Documentation

- [ ] 6.1 Document the routing, data, API client, and testing conventions (where routes live, how to add a protected screen, "branch on `ApiProblem.code`", MSW handler placement) in `apps/web/README.md` and `apps/admin/README.md`; verify the examples compile.

## 7. Verification

- [ ] 7.1 Run `pnpm check`, `pnpm test`, and `pnpm build`; verify all pass.
- [ ] 7.2 Run `openspec validate setup-frontend-app-foundations --strict` and `openspec validate --all`; verify no errors.
- [ ] 7.3 Run `git diff --check`.
