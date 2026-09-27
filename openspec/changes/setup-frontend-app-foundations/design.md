## Context

- After `upgrade-react-19-and-vite-8`, both apps run React 19 on Vite 8, with Node 24 pinned. `apps/web` (port 5175) and `apps/admin` (port 5174) each render one static screen from `src/app.tsx`. Nothing is routed, fetched, or tested.
- `academy-shell` defines hash-based screen selection over a registry (landing, auth, dashboard, catalog, log, story, lesson, progression, profile, certificate). Landing and auth render outside the shell. Protected screens redirect to auth and return to the requested screen afterwards.
- `setup-api-platform-foundations` defines the error contract (`application/problem+json` with `code`, `requestId`, `errors`), the path layout (`/api/v1`, auth protocol paths, `/ws`), and the same-origin policy with no CORS.
- The auth proposal (#205, #207) needs a boot-time `GET /auth/session`, route guards that keep the destination, a CSRF header on state-changing auth calls, a re-verification replay on `reverification_required`, and integration tests with a mocked API.

## Goals / Non-Goals

**Goals:**

- One routing, data, transport, and test stack shared by both apps, so feature changes only add screens and calls.
- Guards and the API client expose the extension points auth needs, without implementing auth.
- Tests run from root `pnpm test` and in CI.

**Non-Goals:**

- Auth logic, real screens, or feature endpoint calls.
- Generated clients (`setup-shared-api-contracts`).
- Browser end-to-end tests. Playwright can come with the first user flow that needs them.
- Global client state libraries. Server state goes in Query, and local UI state stays in components until a feature proves otherwise.

## Decisions

### 1. TanStack Router with hash history

**Chosen:** `@tanstack/react-router` with a code-based route tree and `createHashHistory()`. Guards run in `beforeLoad` and throw `redirect({ to: "/auth", search: { redirect } })`, which keeps the requested destination in a typed search param. Routes are type-checked end to end: links, params, and search. The router context carries the `QueryClient` and an `auth` guard object, which starts as an allow-all stub that #207 replaces.

**Alternatives considered:**
- *React Router in hash mode*: Mature, but its type safety for links and search params is weaker, and it doesn't pair as tightly with TanStack Query's loader prefetching.
- *A small in-house hash router keeping `#dashboard`*: Fewer dependencies, but we'd have to rebuild guards, typed params, and pending states ourselves. There are no users, so the URL format isn't worth preserving.
- *Browser history (`/dashboard`)*: Cleaner URLs, but it needs server fallback routing in every environment and interacts with OAuth and magic-link return URLs. Hash routing stays as `academy-shell` already specifies.

**File-based route generation** is not adopted. The screen registry is small and fixed, and code-based routes avoid a generator step in the build and in CI.

### 2. TanStack Query for server state

**Chosen:** One `QueryClient` per app, created in `src/lib/query.ts`. Defaults: `retry` only for network errors and 5xx (never 4xx), `refetchOnWindowFocus: false`, and a short `staleTime`. The auth session becomes a query (`["session"]`) that the guard reads with `ensureQueryData`.

**Alternatives considered:**
- *Hand-rolled `useEffect` fetching*: It re-implements caching, dedup, and invalidation for every feature.
- *SWR*: Capable, but the Query and Router integration (loader prefetch, context) decides it.

### 3. Hand-written transport client per app

**Chosen:** `src/lib/api/client.ts` in each app exports `apiFetch<T>(path, init)`. It uses same-origin relative paths only, sets `credentials: "same-origin"`, sends and accepts JSON, and runs registered request interceptors (the auth change's CSRF header). It parses `application/problem+json` into `ApiProblem` (status, `code`, `title`, `requestId`, `errors`) and wraps fetch failures in `NetworkError`. It is duplicated between apps rather than shared, because the web and admin apps use different cookies and CSRF headers, and the generated contract client will replace the shared part. Once `setup-shared-api-contracts` lands, `openapi-fetch`-style middleware can reuse the same interceptors and error mapping.

**Alternatives considered:**
- *A new shared `packages/api-client`*: It adds a package boundary before the contracts change decides client ownership, so it's premature.
- *axios*: Unnecessary on top of `fetch`, and it adds bundle weight.

### 4. Vite dev proxy for same-origin local development

**Chosen:** Both `vite.config.ts` files proxy `/api`, `/auth`, `/oauth`, `/.well-known`, and `/ws` (`ws: true`) to `process.env.ACADEMY_API_PROXY_TARGET ?? "http://localhost:8080"`. `changeOrigin` stays `false`, so the API sees the browser's `Host` and `Origin` and can check them against `academy.web.origin` / `academy.admin.origin`.

### 5. Vitest, Testing Library, and MSW

**Chosen:** Vitest 5 (`environment: "jsdom"`) configured in each workspace's `vitest.config.ts`, merging the app's Vite config. The setup file registers `@testing-library/jest-dom/vitest` matchers and an MSW `setupServer` with `onUnhandledRequest: "error"`, and resets handlers after each test. Testing Library and `user-event` drive interactions through roles and labels. Each workspace gets a `test` script, so root `pnpm test` picks it up with no root changes.

**Alternatives considered:**
- *happy-dom*: Faster, but jsdom's behavior is closer to a browser for forms and focus, which auth dialogs depend on.
- *Jest*: A second transform pipeline next to Vite, which isn't worth maintaining.

## Risks / Trade-offs

- [The hash format change drifts from design mockups] → Only the fragment prefix changes. Screen identifiers stay the same, and the mockups aren't a contract.
- [Duplicated transport client drifts between apps] → Keep it small (under ~150 lines) with identical tests. The contracts change owns consolidating it.
- [An allow-all guard stub ships to main] → The stub is explicit and named (`allowAllGuard`). Protected screens are placeholders with no data until #207 replaces the guard, and a test asserts the guard hook is called for every protected route.
- [MSW `onUnhandledRequest: "error"` makes tests noisy] → It's intentional. Unmocked calls are bugs.

## Migration Plan

1. Land after `upgrade-react-19-and-vite-8`. It can land before or after `setup-api-platform-foundations`, because the client is tested against MSW with contract-shaped responses.
2. Update the `#auth` references in `implement-passwordless-auth-and-oauth` to `#/auth` in the same PR as the specs (done in this change).
3. Rollback: revert. No production users.

## Open Questions

- Should admin routes get their own guard contract now, or wait for `define-admin-authentication` (#252)? This change gives the admin app a placeholder home and a not-found route only.
