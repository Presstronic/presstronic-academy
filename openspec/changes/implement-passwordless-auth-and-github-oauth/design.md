# Design

## Context

See `proposal.md` — Why.

Current state that shapes the approach:

- `apps/api` is a bare Spring Boot 3.5.3 / Java 21 scaffold with only `starter-web`, `starter-actuator`, `starter-validation`, and `starter-websocket`. No Spring Security, no persistence layer, no auth code (`apps/api/build.gradle.kts:16-24`).
- `apps/web` is a starter placeholder (`apps/web/src/app.tsx`). No auth screen, no session store, no route guards.
- `docker-compose.yml` runs Postgres 17, Redis 7, and MinIO but nothing in the applications connects to them.
- `academy-auth-entry`'s modified requirements (this change) mandate: passwordless magic-link + GitHub OAuth, short-lived + rotatable sessions, silent refresh, non-revealing responses, and abuse controls on link requests, link consumption, and OAuth callbacks.
- `academy-shell` already gates protected screens on an "active authenticated session" and preserves return destinations — this change must expose enough client state for the shell's existing route-guard behavior to work without further shell changes.
- `academy-privacy-controls` requires "recent re-authentication" for data export and account erasure — the session model must expose a `recently_verified_at` (or equivalent) signal that privacy controls can consult later.

## Goals / Non-Goals

**Goals:**

- One coherent identity model: an `Account` has zero or more `Identity` rows (`email`, `github`). Sessions are attached to an `Account`, never to an `Identity`.
- Backend enforces all abuse controls and identity resolution; frontend only renders state and captures input.
- Backend is stateless per request: session state lives in signed JWTs in `httpOnly` cookies, backed by opaque `refresh_tokens` rows so revocation is authoritative.
- Dev-loop friction stays low: local sign-in works without SMTP.
- The GitHub OAuth surface is small enough that a Google/Google-Workspace OAuth follow-up is a copy-adapt job, not a re-architecture.

**Non-Goals:**

- No password fallback, ever, in this change. If a future proposal wants passwords, it takes on the whole password-security surface itself.
- No transactional email delivery. `activate-notifications-service` owns that.
- No admin impersonation, MFA, or session-device-management UI.
- No shared contracts package integration. Types are hand-written in the frontend feature module until `setup-shared-api-contracts` lands.
- No changes to `academy-shell` route-guard semantics. The shell already specifies the redirect-and-return behavior; this change only supplies the "is authenticated?" signal it consumes.

## Decisions

### 1. Passwordless via magic-link, not passwords

**Chosen:** Email magic-link (single-use, short-lived, single-intent) + GitHub OAuth.

**Alternatives considered:**

- *Password + optional magic-link.* Doubles the security surface (hashing, policy, breach monitoring, reset flows) for MVP with no offsetting benefit for a developer audience.
- *WebAuthn/passkeys as primary.* Best-in-class security, but non-trivial UX for cross-device sign-in without a fallback, and adds a mandatory hardware/OS story we don't need in MVP. Good candidate for a Phase-2 follow-up.

### 2. Session tokens: short-lived JWT access + opaque rotating refresh, both in httpOnly cookies

**Chosen:**

- `access_token`: signed JWT, ~15 min TTL, `SameSite=Lax`, `HttpOnly`, `Secure`, `Path=/`. Carries `sub` (account id), `sid` (session id), `iat`, `exp`, and a boolean `rv` (recently-verified) claim.
- `refresh_token`: opaque 256-bit random value, ~30 day TTL, stored server-side (`refresh_tokens` row) with `session_id`, `family_id`, `expires_at`, `revoked_at`, `used_at`. Cookie is `HttpOnly`, `Secure`, `SameSite=Strict`, `Path=/auth/token`.
- Rotation on every refresh: a used refresh token flips to `used_at` and the new token joins the same `family_id`. Presenting a `used_at`-populated token from a family triggers full-family revocation (detected reuse of a stolen refresh value).

**Alternatives considered:**

- *Session cookie backed by DB session table (Spring Session).* Simpler but every request round-trips to DB. JWT access keeps hot-path stateless while refresh remains authoritative.
- *localStorage tokens.* Rejects itself — XSS-exposed. Cookies with `HttpOnly` are the safer default for a browser SPA that lives on the same origin as the API (or a well-defined subdomain).

### 3. Cookie scoping and CSRF posture

**Chosen:** Same-origin deployment (web served under the same registrable domain as the API in every env). `SameSite=Lax` on the access cookie covers CSRF for the JWT-bearing endpoints; refresh cookie is `SameSite=Strict` and only sent to `/auth/token/*`. Endpoints that mutate state and are not idempotent (`POST /auth/magic-link/request`, `POST /auth/logout`) require a double-submit CSRF header for defense-in-depth.

**Alternatives considered:**

- *Bearer tokens in `Authorization` header.* Simpler CORS story but forces the frontend to hold tokens in JS memory, and every reload requires re-auth or an insecure persistence step.

### 4. Magic-link cryptographic shape

**Chosen:** URL is `/{profile}/auth/link?tid=<base64url(24 random bytes)>`. The random value is stored hashed (SHA-256) in `magic_link_tokens`; comparison is constant-time. Row carries `email_intent`, `purpose` (`SIGN_IN` | `ENROLL`), `expires_at` (default 15 min), `consumed_at`, `superseded_at`, `requester_fingerprint`. Issuing a new link with the same `(email_intent, purpose)` supersedes the older row atomically.

Rationale: opaque server-side tokens keep the surface small (no signing key rotation problem), keep the URL short, and let us revoke/supersede without cryptographic gymnastics.

### 5. Identity model

**Chosen:**

```
accounts (id, callsign, primary_email, created_at, deleted_at, ...)
identities (id, account_id, kind ENUM('email','github'), external_id, verified_at, UNIQUE(kind, external_id))
sessions (id, account_id, created_at, last_seen_at, revoked_at)
refresh_tokens (id, session_id, family_id, token_hash, expires_at, used_at, revoked_at)
magic_link_tokens (id, email_intent, purpose, token_hash, expires_at, consumed_at, superseded_at, requester_fingerprint)
login_attempts (id, scope_kind, scope_key, outcome, occurred_at)  -- audit/forensics only; rate limiting lives in Redis
```

`identities.external_id` holds the email address for `kind='email'` and the GitHub user id (numeric, stable across username changes) for `kind='github'`. The GitHub username and avatar are cached on `accounts` for display but never used for identity resolution.

**Alternative considered:** collapse `accounts` and `identities`. Rejected because auto-linking on verified GitHub email requires a second identity to hang off the same account, and future OAuth providers extend the pattern cleanly.

### 6. GitHub OAuth auto-linking

**Chosen:** On callback with a GitHub-verified primary email:

1. If an `identities` row exists with `(kind='github', external_id=<gh_id>)`, sign in that account.
2. Else, if an `identities` row exists with `(kind='email', external_id=<gh_verified_email>)`, insert a new `github` identity linked to that account and sign in.
3. Else, create a new `accounts` + `github` identity row.

If GitHub returns no verified email, take path 3 with `primary_email=NULL` and prompt for verified-email addition later (deferred UI; the account can still sign in via GitHub).

Rationale: verified-by-GitHub is a stronger signal than a self-attested match. This avoids the classic "GitHub sign-in creates a shadow account" bug where users end up with two accounts because they enrolled by email first.

### 7. Rate limiting in Redis

**Chosen:** Bucket4j with `bucket4j-redis` (Lettuce). Buckets keyed by:

- `mlreq:{email}` — 5 magic-link requests / 15 min per email intent
- `mlreq:ip:{ip}` — 30 / 15 min per source IP (looser bound; catches distributed harvesting)
- `mlcon:ip:{ip}` — 20 magic-link consumption attempts / 15 min per source IP
- `oauth:ip:{ip}` — 20 GitHub callbacks / 15 min per source IP
- `oauth:state:{state}` — single-use; state values live in Redis with 10 min TTL

Buckets return non-revealing 429s. The `login_attempts` table records outcomes for post-hoc forensics; it is not consulted during request handling.

**Alternative considered:** SQL-backed rate limiting. Rejected — writes on every request become the DB bottleneck and force per-request transactions on the hot path.

### 8. Dev magic-link surface

**Chosen:** In `local` and `dev` Spring profiles only:

- Every magic-link URL is logged at `INFO` with a structured field `magic_link_url=...` so tail-following logs is enough for a normal dev loop.
- A `DevMagicLinkController` (gated by `@Profile({"local","dev"})`) exposes `GET /dev/magic-links/latest?email=<address>` returning the most recent unexpired, unconsumed link URL for that email intent. Not registered when the active profile does not include `local` or `dev`.

Rationale: keeps the dev loop one click away without adding Mailhog + SMTP wiring that duplicates work `activate-notifications-service` will do properly.

### 9. Session recency signal for privacy controls

**Chosen:** Set `sessions.last_verified_at = now()` whenever the session is minted via magic-link consumption or a fresh OAuth callback. Do **not** update it on silent refresh. The JWT access token carries `rv=(now - last_verified_at) < RV_WINDOW` (e.g. 10 min). `academy-privacy-controls` re-auth checks read `rv`. When `rv=false`, a follow-up change wires a "verify again" flow — this change only exposes the signal.

### 10. Public API surface

Endpoints (all under `/api/v1` in the app; omitted here for brevity):

- `POST /auth/magic-link/request` `{email, purpose, callsign?}` → 202 Accepted (always, per non-revealing scenario).
- `POST /auth/magic-link/consume` `{token}` → 200 with `Set-Cookie` access + refresh; body carries `session` summary.
- `POST /auth/token/refresh` (uses refresh cookie) → 200 with rotated cookies.
- `POST /auth/logout` (uses access + CSRF header) → 204; revokes the session and refresh family.
- `GET /auth/session` → 200 (session summary) or 401.
- `GET /oauth/github/authorize?returnTo=...` → 302 to GitHub with state cookie set.
- `GET /oauth/github/callback?code=...&state=...` → 302 to `/` (or `returnTo`), sets session cookies.
- `GET /dev/magic-links/latest?email=...` — dev/local profiles only.

## Risks / Trade-offs

- **Refresh-reuse detection false positives** → Rotating refresh tokens on every request creates a race where a legit client with two in-flight tabs can trigger family revocation. **Mitigation:** grace window on `used_at` (e.g. 30s) during which the previous refresh remains valid; align the frontend to serialize refresh through the session store.
- **Same-origin assumption** → The CSRF posture and `SameSite` cookie choices assume web and API share a registrable domain in every env. **Mitigation:** document this in `apps/web/README.md` and the local `.env.example`; if a future env splits the origins, this change's cookie/CSRF choices need a follow-up proposal.
- **Enumeration via timing** → Even with identical 202 responses, an attacker can time-attack the endpoint to distinguish registered vs unregistered emails. **Mitigation:** always run the identity-resolution + hashed-token-insert path (dummy insert for unregistered emails into a discard sink), and add uniform jitter (0–50ms) to the response.
- **Verified-email spoofing by a provider** → GitHub is the only provider so we trust its verification claim. **Mitigation:** the trust is a policy decision documented in decision #6; future providers must opt in explicitly and the code must not treat "provider says verified" as universally true — it's gated per-provider.
- **Dev endpoint leaking into non-dev** → `@Profile` misconfiguration could expose `/dev/magic-links/latest`. **Mitigation:** dedicated integration test asserts the endpoint returns 404 under the `test`/`prod` profiles; the endpoint also refuses to start if `spring.profiles.active` contains none of `local`, `dev`.
- **First real schema means the API becomes migration-critical** → From this change forward, `apps/api` deployment requires Flyway to run cleanly. **Mitigation:** Flyway runs on Spring Boot startup with `flyway.baselineOnMigrate=false`; CI runs `./gradlew :apps:api:test` which brings up an ephemeral Postgres via Testcontainers so every migration is exercised before merge.

## Migration Plan

There is nothing to migrate from — no prior auth data, no prior schema. Deployment is:

1. Merge & deploy `apps/api` with Flyway migrations `V1__auth_baseline.sql` (accounts, identities, sessions, refresh_tokens, magic_link_tokens, login_attempts).
2. Frontend deploy sets `#auth` as the initial route for unauthenticated users; `academy-shell`'s existing protected-route logic starts routing users through the new screen.
3. Rollback: revert application deploys; Flyway migrations do not require rollback because no prior schema exists. If a rollback ships anyway, `V1` tables can be left in place (unused) or dropped manually — no cross-schema references yet.

## Open Questions

- Exact `RV_WINDOW` for the `rv` (recently-verified) claim. 10 minutes is a placeholder pending the first `academy-privacy-controls` re-auth wiring, which is a separate change. Choosing a value now does not change the specs, the code, or the task list — the constant lives in configuration.
- Whether to expose a per-account "sessions and devices" surface. Deferred to a follow-up (`academy-profile` scope) — does not change the schema; `sessions.last_seen_at` and `user_agent` (add in a later migration) support it whenever it lands.
