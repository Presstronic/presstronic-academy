# Design

## Context

See `proposal.md` — Why.

Current state that shapes the approach:

- `apps/api` is a bare Spring Boot 4.1 / Java 25 scaffold (after `upgrade-spring-boot-4`) with only `starter-webmvc`, `starter-actuator`, `starter-validation`, and `starter-websocket`. No Spring Security, no persistence layer, no auth code (`apps/api/build.gradle.kts:16-24`).
- `apps/web` is a starter placeholder (`apps/web/src/app.tsx`). No auth screen, no session store, no route guards.
- `docker-compose.yml` runs Postgres 17, Redis 7, and MinIO but nothing in the applications connects to them.
- `academy-auth-entry`'s modified requirements (this change) mandate: passwordless sign-in email (magic link + one-time code) plus GitHub and Google OAuth, short-lived + rotatable sessions, silent refresh, non-revealing responses, step-up re-verification, and abuse controls on email requests, link/code verification, and OAuth callbacks.
- `academy-shell` already gates protected screens on an "active authenticated session" and preserves return destinations — this change must expose enough client state for the shell's existing route-guard behavior to work without further shell changes.
- `academy-privacy-controls` requires "recent re-authentication" for data export and account erasure — the session model exposes a recently-verified signal and this change ships the re-verification prompt those flows call.
- Runner output will stream over WebSockets (`apps/api` already carries `starter-websocket`). Cookie-authenticated WebSockets are exposed to cross-site WebSocket hijacking unless the handshake checks `Origin`, so the handshake rules ship with the session model rather than with the first streaming feature.
- A PWA is planned (issue #212). Magic links opened from a mail app frequently land in the mail app's in-app browser or in a different browser than the installed PWA, which is why every sign-in email also carries a code the user can type where they started.

## Goals / Non-Goals

**Goals:**

- One coherent identity model: an `Account` has one or more `Identity` rows (`email`, `github`, `google`), and at least one of them is a verified `email` identity. Sessions are attached to an `Account`, never to an `Identity`.
- Backend enforces all abuse controls and identity resolution; frontend only renders state and captures input.
- Backend is stateless per request: session state lives in signed JWTs in `httpOnly` cookies, backed by opaque `refresh_tokens` rows so revocation is authoritative.
- Dev-loop friction stays low: local sign-in works without SMTP.
- OAuth handling is provider-agnostic: GitHub and Google share one authorize/callback/linking pipeline, and each provider contributes only its registration, profile mapping, and email-trust policy. A later provider is a configuration-plus-trust-policy job, not a re-architecture.

**Non-Goals:**

- No password fallback, ever, in this change. If a future proposal wants passwords, it takes on the whole password-security surface itself.
- No transactional email delivery. `activate-notifications-service` owns that.
- No admin impersonation, MFA, or session-device-management UI.
- No admin/staff sign-in. `define-admin-authentication` owns `apps/admin` authentication.
- No post-sign-in account management (email change, connecting or disconnecting sign-in methods, sign out everywhere, support-assisted recovery). `define-account-lifecycle` owns those; this change supplies the step-up re-verification they call.
- No repository-scoped GitHub access. Sign-in requests identity scopes only; repository write access for issue #216 is a separate, optional grant with its own proposal.
- No shared contracts package integration. Types are hand-written in the frontend feature module until `setup-shared-api-contracts` lands.
- No changes to `academy-shell` route-guard semantics. The shell already specifies the redirect-and-return behavior; this change only supplies the "is authenticated?" signal it consumes.

## Decisions

### 1. Passwordless sign-in email, not passwords

**Chosen:** A sign-in email carrying both a magic link and a one-time code (single-use, short-lived, single-intent), plus GitHub and Google OAuth.

Rationale: with passwords, "forgot password" is an email-based reset, so the mailbox is already the trust anchor; removing passwords removes credential stuffing, hashing, policy, and reset surface without weakening recovery. The audience is developers (most have GitHub) plus beginners on the foundations track (who may not), which is why Google ships alongside GitHub rather than as a follow-up.

**Alternatives considered:**

- *Password + optional magic-link.* Doubles the security surface (hashing, policy, breach monitoring, reset flows) for MVP with no offsetting benefit for a developer audience.
- *Magic link only, no code.* Breaks when the email is opened on another device or inside a mail app's in-app browser, which is the common case on mobile and for the planned PWA.
- *WebAuthn/passkeys as primary.* Best-in-class security, but non-trivial UX for cross-device sign-in without a fallback, and adds a mandatory hardware/OS story we don't need in MVP. Passkeys are the upgrade path (`add-mfa-and-webauthn`), never passwords.

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

**Chosen:** URL is `/{profile}/auth/link?tid=<base64url(24 random bytes)>`. The random value is stored hashed (SHA-256) in `magic_link_tokens`; comparison is constant-time. Row carries `email_intent`, `purpose` (`SIGN_IN` | `ENROLL` | `REVERIFY` | `OAUTH_EMAIL`), `expires_at` (default 15 min), `consumed_at`, `superseded_at`, `requester_fingerprint`. Issuing a new email with the same `(email_intent, purpose)` supersedes the older row atomically.

Rationale: opaque server-side tokens keep the surface small (no signing key rotation problem), keep the URL short, and let us revoke/supersede without cryptographic gymnastics.

### 4a. One-time code

**Chosen:** The same `magic_link_tokens` row also carries a 6-digit numeric code:

- `code_hash` — HMAC-SHA-256 of the code keyed with a server secret (a bare SHA-256 of a 6-digit value is trivially reversible), compared in constant time.
- `binding_hash` — SHA-256 of a random 256-bit value set as an `HttpOnly`, `Secure`, `SameSite=Strict` cookie (`pa_signin_bind`, 15 min) on the browser that requested the email. A code is accepted only when the submitting browser presents the matching binding cookie. The magic link is not bound, so it still works on any device.
- `failed_code_attempts` — incremented on each wrong code for the row; at 5 the row is marked consumed (link and code both dead) and the user is told to request a new email.

Link and code share `expires_at`; consuming either sets `consumed_at`, so exactly one of them succeeds once. `REVERIFY` rows are code-only (no link is emailed) and are bound to the session instead of a binding cookie.

Rationale: the code solves cross-device and in-app-browser sign-in without a second token table. Binding the code to the requesting browser means a phished code is useless on the attacker's browser, and the 5-attempt cap bounds guessing at 5 in 10^6 per email before per-IP buckets apply.

**Alternatives considered:**

- *Code only, no link.* Worse UX on the same device, where one tap beats typing.
- *Unbound code.* Simpler, but turns the code into a phishable bearer credential.

### 5. Identity model

**Chosen:**

```
accounts (id, callsign, primary_email, created_at, deleted_at, ...)
identities (id, account_id, kind ENUM('email','github','google'), external_id, verified_at, UNIQUE(kind, external_id))
sessions (id, account_id, created_at, last_seen_at, last_verified_at, revoked_at)
refresh_tokens (id, session_id, family_id, token_hash, expires_at, used_at, revoked_at)
magic_link_tokens (id, email_intent, purpose, token_hash, code_hash, binding_hash, failed_code_attempts, expires_at, consumed_at, superseded_at, requester_fingerprint)
login_attempts (id, scope_kind, scope_key, outcome, occurred_at)  -- audit/forensics only; rate limiting lives in Redis
```

`identities.external_id` holds the normalized (lower-cased) email address for `kind='email'`, the GitHub user id (numeric, stable across username changes) for `kind='github'`, and the OIDC `sub` claim for `kind='google'`. Provider usernames, display names, and avatars are cached on `accounts` for display but never used for identity resolution.

Every account has at least one verified `email` identity. OAuth-created accounts get one from the provider when the provider is trusted for that address (decision #6), or from the email-verification step otherwise. This guarantees a recovery channel for re-verification and for accounts whose provider access is lost.

**Alternative considered:** collapse `accounts` and `identities`. Rejected because auto-linking on verified GitHub email requires a second identity to hang off the same account, and future OAuth providers extend the pattern cleanly.

### 6. OAuth account linking and per-provider email trust

**Chosen:** One linking algorithm for every provider, run on callback:

1. If an `identities` row exists with `(kind=<provider>, external_id=<provider user id>)`, sign in that account.
2. Collect the provider's **trusted** verified emails (per-provider policy below).
   - Exactly one existing account has an `email` identity matching any of them → insert the provider identity on that account, emit `identity_linked`, sign in.
   - More than one existing account matches → do not link or create. Redirect to the auth screen with an `ambiguous_account` error telling the user to sign in with email and connect the provider from account settings (`define-account-lifecycle`).
   - No account matches → create `accounts` + the provider identity + a verified `email` identity from the provider's primary trusted email, sign in.
3. If the provider returns no trusted verified email, park the provider assertion in Redis (`oauth:pending:{id}`, 15 min TTL, referenced by an `HttpOnly` `pa_oauth_pending` cookie) and send the user to an "add your email" step on the auth screen, prefilled with the provider email if one exists. The user receives a code-only email (`purpose=OAUTH_EMAIL`); on successful verification step 2 runs again with the now-verified address, so the result is either a link to the matching account or a new account.

**Per-provider trust policy** (lives in each provider's adapter, never in shared code):

- **GitHub:** every entry from `GET /user/emails` with `verified: true` is trusted. Primary is used for new accounts.
- **Google:** the ID token `email` is trusted only when `email_verified` is `true` **and** Google is authoritative for the address — the domain is `gmail.com`/`googlemail.com`, or the `hd` claim is present and equals the email's domain (a Google Workspace domain). Any other Google account email (a Google account created on a non-Google address) is treated as untrusted and goes through step 3.

Rationale: a provider-verified email is a stronger signal than a self-attested match and avoids the classic "OAuth sign-in creates a shadow account" bug. Google marks many non-Google addresses as verified without being their authority, so it cannot inherit GitHub's rule. Requiring a verified email on every account gives re-verification and recovery a channel that does not depend on a third party.

Remaining duplicates (a learner who enrolled with email A and uses a provider whose only emails are B) cannot be detected at sign-in. `define-account-lifecycle` covers connecting a provider from a signed-in session and support-assisted merge.

### 7. Rate limiting in Redis

**Chosen:** Bucket4j with `bucket4j-redis` (Lettuce). Buckets keyed by:

- `mlreq:{email}` — 5 sign-in email requests / 15 min per email intent
- `mlreq:ip:{ip}` — 30 / 15 min per source IP (looser bound; catches distributed harvesting)
- `mlcon:ip:{ip}` — 20 magic-link consumption attempts / 15 min per source IP
- `mlcode:ip:{ip}` — 20 code verification attempts / 15 min per source IP (on top of the 5-attempt cap per email)
- `reverify:{account}` — 5 re-verification codes / 15 min per account
- `oauth:ip:{ip}` — 20 OAuth callbacks / 15 min per source IP, shared across providers
- `oauth:state:{state}` — single-use; state values live in Redis with 10 min TTL

Buckets return non-revealing 429s. The `login_attempts` table records outcomes for post-hoc forensics; it is not consulted during request handling.

**Alternative considered:** SQL-backed rate limiting. Rejected — writes on every request become the DB bottleneck and force per-request transactions on the hot path.

### 8. Dev magic-link surface

**Chosen:** In `local` and `dev` Spring profiles only:

- Every sign-in email's link URL and code are logged at `INFO` with structured fields `magic_link_url=...` and `magic_link_code=...` so tail-following logs is enough for a normal dev loop.
- A `DevMagicLinkController` (gated by `@Profile({"local","dev"})`) exposes `GET /dev/magic-links/latest?email=<address>` returning the most recent unexpired, unconsumed link URL and code for that email intent. Not registered when the active profile does not include `local` or `dev`.

Rationale: keeps the dev loop one click away without adding Mailhog + SMTP wiring that duplicates work `activate-notifications-service` will do properly.

### 9. Session recency and step-up re-verification

**Chosen:** Set `sessions.last_verified_at = now()` whenever the session is minted via magic-link consumption, code verification, or a fresh OAuth callback, and when step-up re-verification succeeds. Do **not** update it on silent refresh. The JWT access token carries `rv=(now - last_verified_at) < RV_WINDOW` (default 10 min).

Endpoints that their owning capability marks sensitive (privacy export and erasure, account-security changes) return a `403` problem detail (`application/problem+json`, per the `academy-spring-boot-api` error contract) whose `code` is `reverification_required` when `rv=false`. The security entry point and access-denied handler emit the same problem-details format for 401 and 403. The frontend intercepts that response, opens a `ReverifyDialog`, calls `POST /auth/reverify/request` (sends a code-only `REVERIFY` email to the account's primary verified email), then `POST /auth/reverify/confirm {code}`. On success the API updates `last_verified_at`, re-issues the access cookie with `rv=true`, and the frontend replays the original request with its original body.

Rationale: the email code works for every account because every account has a verified email (decision #5), so there is one re-verification path instead of one per provider. Forcing a provider re-login is not reliable on GitHub.

**Alternative considered:** *Re-authenticate through the provider the user signed in with.* Rejected for now — GitHub has no reliable forced re-prompt, and it would split the flow by provider.

### 10. Public API surface

Endpoints (all under `/api/v1` in the app; omitted here for brevity):

- `POST /auth/magic-link/request` `{email, purpose, callsign?}` → 202 Accepted (always, per non-revealing scenario); sets the `pa_signin_bind` cookie.
- `POST /auth/magic-link/consume` `{token}` → 200 with `Set-Cookie` access + refresh; body carries `session` summary.
- `POST /auth/magic-link/verify-code` `{email, code}` (requires `pa_signin_bind`) → 200 with `Set-Cookie` access + refresh, or a non-revealing 400.
- `POST /auth/oauth-email/request` `{email}` and `POST /auth/oauth-email/confirm` `{code}` (require `pa_oauth_pending`) → complete OAuth account entry when the provider email is missing or untrusted.
- `POST /auth/reverify/request` and `POST /auth/reverify/confirm` `{code}` (require access cookie + CSRF header) → step-up re-verification.
- `POST /auth/token/refresh` (uses refresh cookie) → 200 with rotated cookies.
- `POST /auth/logout` (uses access + CSRF header) → 204; revokes the session and refresh family.
- `GET /auth/session` → 200 (session summary including `rv`) or 401.
- `GET /oauth/{provider}/authorize?returnTo=...` (`provider` ∈ `github`, `google`) → 302 to the provider with state cookie set.
- `GET /oauth/{provider}/callback?code=...&state=...` → 302 to `/` (or `returnTo`), sets session cookies; or 302 to the auth screen's "add your email" step or an error state.
- `GET /.well-known/jwks.json` → active and retired signing keys.
- `GET /dev/magic-links/latest?email=...` — dev/local profiles only.

### 11. Google via OpenID Connect

**Chosen:** Register Google as a Spring Security OAuth2 client using OIDC (`openid email profile` scopes). Spring validates the ID token signature, `iss`, `aud`, `exp`, and `nonce`; the Google adapter maps `sub`, `email`, `email_verified`, `hd`, `name`, and `picture` into the same `ProviderIdentityAssertion` the GitHub adapter produces (`provider`, `providerUserId`, `trustedVerifiedEmails`, `displayName`, `avatarUrl`).

**Alternative considered:** plain OAuth2 against Google's userinfo endpoint. Rejected — OIDC gives a signed, audience-bound assertion for free.

### 12. Sign-in scopes stay minimal

**Chosen:** GitHub requests `read:user user:email`; Google requests `openid email profile`. No repository, organization, or Drive scopes are ever requested at sign-in.

Rationale: sign-in tokens are discarded after the callback. Issue #216 (push solutions to student repositories) needs a long-lived, repository-scoped grant, which is a different trust decision with its own storage, encryption, and revocation story; it gets its own proposal and an explicit "Connect repository access" step.

### 13. WebSocket handshake authentication

**Chosen:**

- A `HandshakeInterceptor` validates the access cookie on the HTTP upgrade request, checks that the session is not revoked, and binds `accountId` + `sessionId` to the WebSocket session attributes. Unauthenticated upgrades get `401` and are never upgraded.
- Allowed origins are set explicitly from `academy.web.origin` (`setAllowedOrigins`, no wildcards, no `setAllowedOriginPatterns("*")`). A handshake from any other `Origin` gets `403` even with a valid cookie — this is the cross-site WebSocket hijacking defence, because `SameSite=Lax` does not reliably cover upgrades.
- Logout, refresh-reuse revocation, and later sign-out-everywhere or suspension publish the session id to Redis (`session:revoked` pub/sub channel plus a `session:revoked:{sid}` key with TTL = refresh TTL). Each API node closes matching open connections with close code `4401` ("re-authenticate"). As a backstop, each connection re-checks its session every 60 s.
- Access-token expiry does not close an open connection while the session is valid; session validity is authoritative. The client refreshes and reconnects with backoff after any `4401` or drop.
- Channel and subscription authorization belongs to the owning capability (for example the runner job stream checks job ownership); handshake authentication grants no channel access by itself.

Rationale: the rules are small and belong with the session model; deferring them to the first streaming feature (#187/#178) risks shipping an unauthenticated or hijackable socket.

## Risks / Trade-offs

- **Refresh-reuse detection false positives** → Rotating refresh tokens on every request creates a race where a legit client with two in-flight tabs can trigger family revocation. **Mitigation:** grace window on `used_at` (e.g. 30s) during which the previous refresh remains valid; align the frontend to serialize refresh through the session store.
- **Same-origin assumption** → The CSRF posture and `SameSite` cookie choices assume web and API share a registrable domain in every env. **Mitigation:** document this in `apps/web/README.md` and the local `.env.example`; if a future env splits the origins, this change's cookie/CSRF choices need a follow-up proposal.
- **Enumeration via timing** → Even with identical 202 responses, an attacker can time-attack the endpoint to distinguish registered vs unregistered emails. **Mitigation:** always run the identity-resolution + hashed-token-insert path (dummy insert for unregistered emails into a discard sink), and apply a fixed-latency floor (e.g. 200ms) in the controller after the service completes, so both branches return in the same time.
- **Verified-email spoofing by a provider** → Auto-linking trusts the provider's verified-email claim, so a provider that marks addresses it does not control as verified could take over an Academy account. **Mitigation:** trust is gated per provider in each adapter (decision #6); Google is trusted only for Gmail and Workspace (`hd`) addresses, anything else goes through the email-code step; future providers must opt in explicitly.
- **One-time code guessing or phishing** → A 6-digit code is low entropy and can be relayed by a phishing page. **Mitigation:** 5 wrong attempts kill the email's link and code, per-IP code buckets and the global floor apply, and the code only works in the browser holding the `pa_signin_bind` cookie (decision #4a).
- **Long-lived WebSocket connections outlive sign-out** → A connection opened before logout could keep streaming. **Mitigation:** Redis revocation broadcast closes connections on revoke, with a 60 s re-check backstop (decision #13).
- **Re-verification email delay blocks sensitive actions** → Export or erasure waits on email delivery. **Mitigation:** acceptable for rare actions; the dialog offers resend within the `reverify` bucket, and the notifications service is a launch prerequisite for production email.
- **Dev endpoint leaking into non-dev** → `@Profile` misconfiguration could expose `/dev/magic-links/latest`. **Mitigation:** dedicated integration test asserts the endpoint returns 404 under the `test`/`prod` profiles; the endpoint also refuses to start if `spring.profiles.active` contains none of `local`, `dev`.
- **First real schema means the API becomes migration-critical** → From this change forward, `apps/api` deployment requires Flyway to run cleanly. **Mitigation:** Flyway runs on Spring Boot startup with `flyway.baselineOnMigrate=false`; CI runs `./gradlew :apps:api:test` which brings up an ephemeral Postgres via Testcontainers so every migration is exercised before merge.

## Migration Plan

There is nothing to migrate from — no prior auth data, no prior schema. Deployment is:

1. Merge & deploy `apps/api` with Flyway migrations `V1__auth_baseline.sql` (accounts, identities, sessions, refresh_tokens, magic_link_tokens, login_attempts).
2. Frontend deploy sets `#/auth` as the initial route for unauthenticated users; `academy-shell`'s existing protected-route logic starts routing users through the new screen.
3. Rollback: revert application deploys; Flyway migrations do not require rollback because no prior schema exists. If a rollback ships anyway, `V1` tables can be left in place (unused) or dropped manually — no cross-schema references yet.

## Open Questions

- Exact `RV_WINDOW` for the `rv` (recently-verified) claim. 10 minutes is the default; revisit once privacy export/erasure and account-security flows are exercised with the re-verification dialog. Choosing a value now does not change the specs, the code, or the task list — the constant lives in configuration.
- Whether to expose a per-account "sessions and devices" surface. Deferred to `define-account-lifecycle` (sign out everywhere ships there; a per-device list is a later follow-up) — does not change the schema; `sessions.last_seen_at`, `user_agent`, and `network_fingerprint` support it whenever it lands.
- Code length and attempt cap. 6 digits and 5 attempts are the defaults; both live in `AcademyAuthProperties`, so tuning them does not change the specs or the task list.
