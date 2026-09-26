# Proposal

## Why

Presstronic Academy has an accepted `academy-auth-entry` spec and a shell that gates protected screens on an active authenticated session, but no auth is implemented on either side of the stack. The Spring Boot API scaffold has no Spring Security, no persistence, and no identity endpoints; the React app has no auth screen, session store, or route guards. Every downstream capability that assumes an authenticated learner (dashboard, catalog, lesson, progression, profile, certificate, billing, privacy) is blocked until this lands.

We are choosing **passwordless email sign-in (a magic link plus a one-time code) for local identity, plus GitHub and Google OAuth**, rather than the password-based flow the current spec describes. Removing passwords eliminates hashing, password-policy enforcement, and credential-stuffing exposure — the largest single source of auth incidents — without weakening recovery, because a password reset is an email round-trip anyway. The code alongside the link keeps sign-in working when the email is opened on another device or inside a mail app's browser (the common mobile and PWA case). GitHub fits the developer audience; Google covers beginners on the foundations track who may not have GitHub, so it ships at launch rather than as a follow-up. Passkeys, not passwords, are the future upgrade path.

## What Changes

- **BREAKING**: Rewrite the `academy-auth-entry` capability from an "access key / password" model to a passwordless model. The `Access key` field, `LOST KEY?` link, 12-character password policy, and password-based lockout scenarios are replaced with a `Request access link` flow, `Resend link` recovery, and magic-link and one-time-code consumption/expiry scenarios. `Enroll` becomes email-only. `Continue with GitHub` and `Continue with Google` cover OAuth sign-in and enrollment. New requirements cover OAuth account linking with per-provider email trust and step-up re-verification for sensitive actions.
- Add JPA + Flyway to `apps/api` and introduce the first migration set: `accounts`, `identities` (`email`, `github`, `google`), `magic_link_tokens`, `sessions`, `refresh_tokens`, `login_attempts`. Modifies `academy-spring-boot-api` to remove the "persistence deferred" scaffold-only stance for this scope.
- Implement Spring Security in `apps/api` with a stateless JWT filter chain, refresh-token rotation, and revocation on logout.
- Implement sign-in email issuance (magic link + browser-bound 6-digit code), consumption, code verification with a 5-attempt cap, and expiry. In the `dev` and `local` profiles the link URL and code are logged to stdout AND exposed at a profile-guarded `GET /dev/magic-links/latest?email=…` endpoint; production email delivery is deferred to `activate-notifications-service`.
- Implement GitHub OAuth and Google OAuth (OIDC) through one provider-agnostic authorization-code pipeline. On callback, a provider email the provider is trusted to assert (GitHub: any verified email; Google: verified Gmail or Workspace `hd` addresses only) that matches exactly one account auto-links the provider identity; no match creates an account; a missing or untrusted email routes through an email-code verification step; an ambiguous match creates nothing. Every account ends up with at least one verified email.
- Implement step-up re-verification: sensitive endpoints return `reverification_required` when the session is not recently verified, and a dialog re-verifies with an emailed code before replaying the action.
- Authenticate WebSocket handshakes: session check, explicit `Origin` allowlist, and prompt close of connections whose session is revoked. Modifies `academy-spring-boot-api`.
- Implement Redis-backed rate limiting and lockouts for sign-in email requests, link consumption, code verification, re-verification, and OAuth callback abuse.
- Implement the React auth screen (`apps/web`): `Sign in` and `Enroll` tabs with email-only form + `Continue with GitHub` and `Continue with Google` buttons, a link-sent confirmation view with code entry, an OAuth "add your email" step, a re-verification dialog, a session store, and route guards that redirect unauthenticated users to `#auth` while preserving the intended destination for `academy-shell`.
- Add auth-related environment templates (JWT signing keyset, code HMAC key, GitHub and Google OAuth client id/secret, magic-link TTL) to `.env.example`; no real secrets committed.

## Capabilities

### New Capabilities

None. Passwordless email sign-in and GitHub/Google OAuth are alternative account-entry mechanisms within the existing `academy-auth-entry` capability, not a new capability boundary. Post-sign-in account management and staff sign-in are separate capabilities introduced by `define-account-lifecycle` and `define-admin-authentication`.

### Modified Capabilities

- `academy-auth-entry`: Replace password/access-key requirements with magic-link + one-time-code + GitHub/Google OAuth requirements. Remove `Login Form Fields` access-key affordances, `Enrollment Form Fields` access-key hint, `Access Key Recovery` requirement, and password-specific validation scenarios. Add link and code request/consumption/expiry, OAuth sign-in and enrollment, OAuth account linking with per-provider email trust, step-up re-verification, and updated abuse controls sized to email-request, code, and OAuth-callback flows. Update the security footer copy to reflect passwordless posture and narrow the responsibility boundary to delegate account management and staff sign-in.
- `academy-spring-boot-api`: Narrow the "persistence dependencies deferred" scenario so JPA, Flyway, and the initial accounts/sessions/tokens schema are permitted (and required) when introduced by an accepted proposal — this change is that proposal. Narrow the "external integrations deferred" scenario to permit Spring Security, JWT libraries, OAuth client wiring, and a Redis client for rate limiting. Add an `Authenticated WebSocket Connections` requirement.

## Impact

- **Code**: `apps/api` gains `spring-boot-starter-security`, `spring-boot-starter-data-jpa`, `spring-boot-starter-security-oauth2-client`, `spring-boot-starter-data-redis`, `spring-boot-starter-flyway`, a JWT library (e.g. `nimbus-jose-jwt` via Spring Security defaults), and Bucket4j (or equivalent) for Redis rate limiting. New packages under `com.presstronic.academy.api.auth` (controllers, services, tokens, oauth) and `com.presstronic.academy.api.platform.security` (filter chain, JWT decoder/encoder). `apps/web` gains an auth feature module (screen, forms, session store) and a route-guard hook consumed by `academy-shell`.
- **APIs**: New public endpoints — `POST /auth/magic-link/request`, `POST /auth/magic-link/consume`, `POST /auth/magic-link/verify-code`, `POST /auth/oauth-email/{request,confirm}`, `POST /auth/reverify/{request,confirm}`, `POST /auth/token/refresh`, `POST /auth/logout`, `GET /auth/session`, `GET /oauth/{github,google}/authorize`, `GET /oauth/{github,google}/callback`, `GET /.well-known/jwks.json`. Dev-only: `GET /dev/magic-links/latest`. WebSocket handshakes now require an authenticated session and an allowed `Origin`.
- **Data**: First real schema in Postgres. Flyway migrations begin at `V1__auth_baseline.sql`. All identity, session, and token state is persisted; short-lived rate-limit and lockout counters live in Redis.
- **Infrastructure**: No new containers — uses the existing Postgres and Redis services in `docker-compose.yml`. No SMTP dependency yet; realistic email delivery lands with `activate-notifications-service`. **Production launch is blocked on that service** (reputable provider, SPF/DKIM/DMARC on the sending domain), because email is a required sign-in path.
- **Contracts**: Auth request/response DTOs should be added to `packages/contracts` when `setup-shared-api-contracts` lands. Until then, the frontend consumes hand-written TypeScript types colocated with the auth feature module.
- **Dependencies on other proposals**: Depends on `academy-spring-boot-api` (accepted), on `upgrade-spring-boot-4` (Spring Boot 4.1 / Java 25 baseline, which must land first), and on the Gradle wrapper and build scaffold tracked by issue #203 (every verification command here uses `./gradlew`). Softly depends on `setup-local-development-infrastructure` for canonical `.env.example` conventions — if that has not landed when this ships, this change adds the auth-relevant keys to whatever env-template scaffold exists.
- **Downstream unblocks**: `academy-shell` protected routes, `academy-dashboard`, `academy-privacy-controls` re-authentication requirements, `academy-billing-access` entitlement gates, `activate-billing-service`, `activate-notifications-service`, `define-account-lifecycle`, `define-admin-authentication`, and runner streaming over WebSockets.
- **Deferred**: Password fallback (not planned), enterprise SAML/OIDC SSO, LTI, real transactional email, admin impersonation, MFA/passkeys, per-device session list, repository-scoped GitHub access (#216). Admin sign-in → `define-admin-authentication`. Email change, connecting/disconnecting sign-in methods, sign out everywhere, suspension, and support-assisted recovery → `define-account-lifecycle`. Candidate sign-in → `define-academy-hiring-assessments`.

## Security Risk Register

Each item is labeled with a risk level and the chosen mitigation path. Mitigations marked **In scope** ship with this change and appear as tasks in `tasks.md`. Mitigations marked **Follow-up** are documented here so they are not lost and are captured under "Security Follow-Ups" below.

### Critical

- **Cookie theft = full account takeover.** Bearer cookies + no MFA/device binding; XSS or extension access ends the game.
  - *Mitigation (Follow-up):* Ship strict CSP + HSTS + `Secure`/`HttpOnly`/`SameSite=Strict` where possible in a `harden-web-security-headers` change, then add MFA/WebAuthn as a second factor in a separate change.
- **Email compromise = account compromise.** Mailbox access is the entire trust anchor.
  - *Mitigation (Split):* Step-up re-verification for sensitive actions is in scope, so a stolen session alone cannot export or erase an account. WebAuthn/passkey as an optional second factor is Follow-up (`add-mfa-and-webauthn`).
- **Magic-link URL leakage.** URLs land in history, referrers, corporate proxies, and email-scanner bots that auto-consume links.
  - *Mitigation (In scope):* Two-step consume — the link URL lands on a `GET /auth/link` page that renders a `Sign in` button which then `POST`s the token to `/auth/magic-link/consume`; the landing page sends `Referrer-Policy: no-referrer`; scanner user-agent heuristics on `GET /auth/link` render the page without pre-consuming the token.
- **JWT signing key is a single blast-radius secret with no rotation strategy.**
  - *Mitigation (In scope):* Sign every access token with a `kid` header; publish a JWKS with the active key + N most-recent retired keys; the verifier accepts any key in the JWKS; rotation is a config swap that adds a new `kid` and moves the previous one to retired.

### High

- **Same-origin assumption is load-bearing but unenforced.** A future subdomain split silently breaks the CSRF posture.
  - *Mitigation (In scope):* Startup assertion in `apps/api` that the configured web origin and API origin share a registrable domain; refuse to start otherwise.
- **Dev magic-link endpoint is a misconfiguration foot-gun.** `dev` accidentally in a real profile list exposes tokens.
  - *Mitigation (In scope):* Application refuses to start if `DevMagicLinkController` is registered AND `spring.profiles.active` contains `prod` or `staging`; a CI check greps deployment configs for the forbidden combo.
- **Missing supporting hardening: no CSP/HSTS/`Referrer-Policy` requirement, no `returnTo` allowlist on OAuth authorize.**
  - *Mitigation (Split):* Enforce a strict `returnTo` allowlist on `GET /oauth/{provider}/authorize` in scope (exact-match or same-origin path prefix only). CSP/HSTS/`Referrer-Policy` across the app is Follow-up (`harden-web-security-headers`).
- **No account-takeover signals or new-device notifications.**
  - *Mitigation (Follow-up):* When `activate-notifications-service` lands, send a "new sign-in from new device" email; ship a session-listing UI + revoke button in `academy-profile`. This change records `user_agent` and coarse network fingerprint on `sessions` so the follow-up has the data it needs.

### Medium

- **Auto-linking on provider-verified email transitively trusts the provider.** GitHub or Google takeover = academy takeover, and Google marks some addresses verified that it is not authoritative for.
  - *Mitigation (Split):* Per-provider trust policy in scope (Google only for Gmail and Workspace `hd` addresses; anything else goes through the email-code step), and a structured `identity_linked` audit event on every auto-link. A linked-identities view + disconnect flow ships in `define-account-lifecycle`; new-link email notification is Follow-up under notifications service.
- **One-time codes are low-entropy and phishable.**
  - *Mitigation (In scope):* 5-attempt cap per email, per-IP code buckets under the global floor, and codes accepted only in the browser that requested them.
- **IP-based rate limits bypassable by proxy/IPv6 rotation. No global floor, no CAPTCHA fallback.**
  - *Mitigation (Split):* Add a global request-floor bucket per public auth endpoint in scope (independent of IP/email keys). CAPTCHA integration is Follow-up.
- **JWTs are bearer tokens — no proof-of-possession.** Anyone holding the cookie is you.
  - *Mitigation (Follow-up):* Adopt DPoP or per-session key binding once the frontend can hold a non-extractable `CryptoKey`.
- **Refresh-reuse detection has a 30s race window that lets a stolen refresh succeed.**
  - *Mitigation (In scope):* Frontend single-flight-serializes refresh (already in tasks); every use of the grace window is logged as a `refresh_grace_hit` security event with `session_id` and `family_id` for post-hoc review.
- **`sessions.last_verified_at` never advances on refresh, so 30-day sessions never re-prove identity.**
  - *Mitigation (In scope):* Expose `rv` (recently-verified) on the JWT with a configurable `RV_WINDOW`; privacy/billing surfaces are contractually required to consult `rv` for sensitive actions (already surfaced in `academy-privacy-controls` re-auth scenarios). Follow-up: step-up re-verification UI when `rv=false`.
- **Flyway-on-startup runs any shipped migration in prod automatically.**
  - *Mitigation (Split):* Add a `CODEOWNERS` rule for `apps/api/src/main/resources/db/migration/**` requiring platform-owner review in scope. CI shadow-database run + manual approval on destructive DDL is Follow-up.

### Low

- **Timing-based email enumeration only partially mitigated.**
  - *Mitigation (In scope):* Registered and unregistered branches share the same code path with a constant-time hashed-token insert (dummy sink for the unregistered branch); jitter is a fixed-latency floor (e.g. 200ms) not a random additive, and is applied at the controller after the service completes.
- **Testcontainers requires Docker socket access in CI.**
  - *Mitigation (Follow-up):* When CI is set up, use rootless Docker or per-job ephemeral runners; never mount the socket into an untrusted step. Recorded here so the CI proposal picks it up.

## Security Follow-Ups

These are the security items intentionally deferred out of this change. Each should become its own OpenSpec change when picked up. The list is grouped so it is obvious which items grew out of this change's risk register and which items close broader OWASP Top 10 gaps that no auth change alone would cover.

### Auth-adjacent follow-ups (grew out of this change's risk register)

- `harden-web-security-headers` — CSP, HSTS, `Referrer-Policy`, `X-Content-Type-Options`, `Permissions-Policy`, and the `SameSite=Strict` refresh cookie posture across the frontend + API. Covers OWASP **A02** (Cryptographic Failures — HSTS) and **A05** (Security Misconfiguration).
- `add-mfa-and-webauthn` — Optional WebAuthn/passkey second factor, and passkeys as an optional faster step-up method alongside the emailed code this change ships. Covers OWASP **A07** (Identification and Authentication Failures — MFA gap).
- `add-account-takeover-notifications` — New-device sign-in email + per-device session listing with individual revoke, gated on `activate-notifications-service`. Sign out everywhere ships earlier in `define-account-lifecycle`. Covers OWASP **A07** (post-compromise detection) and **A09** (Logging and Monitoring — user-facing alerting).
- `define-account-lifecycle` — Email change, connect/disconnect sign-in methods, sign out everywhere, suspension/deletion session revocation, support-assisted recovery. Replaces the earlier `add-linked-identities-management` placeholder. Covers OWASP **A01** and **A07**.
- `define-admin-authentication` — Staff sign-in for `apps/admin` with a mandatory stronger factor and staff-grant gating. Covers OWASP **A01** and **A07**.
- `add-captcha-and-suspicious-score` — CAPTCHA challenge on suspicious-score threshold; wires into the existing Bucket4j buckets. Covers OWASP **A07** (abuse controls beyond fixed rate limits).
- `add-dpop-proof-of-possession` — DPoP or per-session key binding once the frontend can hold non-extractable `CryptoKey` material. Covers OWASP **A02** (bearer-token exposure) and **A07** (session token theft).
- `harden-migration-review` — Shadow-database CI run + manual approval gate for destructive DDL. Covers OWASP **A08** (Software and Data Integrity Failures — deploy-time DB changes).

### OWASP Top 10 gap follow-ups (not owned by any auth change)

These close broader web-application exposures that this auth change does not — and cannot — address on its own. Named here so they are not silently deferred forever.

- `define-authorization-model` — Roles/RBAC (or ABAC) contract, per-resource ownership checks, IDOR test convention. This change proves callers are authenticated; this follow-up proves they are authorized. Covers OWASP **A01** (Broken Access Control — authorization semantics and IDOR).
- `define-injection-defense` — Repo-wide requirements banning string-concatenated native queries, header-injection protection on log-emitted URLs, HTML-escape requirements for the two-step consume landing and future rendered surfaces, output-encoding requirements for the frontend, and a static-analysis gate in CI (SpotBugs/Semgrep). Covers OWASP **A03** (Injection).
- `define-supply-chain-hygiene` — SBOM generation (CycloneDX), Dependabot/Renovate wiring, `./gradlew dependencyCheck` (OWASP Dependency-Check) and `npm audit` gates in CI, lockfile-freshness enforcement, renewal cadence. Covers OWASP **A06** (Vulnerable and Outdated Components).
- `secure-actuator-and-infra-defaults` — Actuator endpoint lockdown (auth-required, minimal surface), custom error pages that do not leak framework identity, Postgres role least-privilege, Redis auth in non-local envs, MinIO admin-console posture. Covers OWASP **A05** (Security Misconfiguration — server/infra defaults).
- `define-build-and-deploy-integrity` — SLSA build provenance target, Cosign container-image signing, SRI on the frontend bundle, deserialization-safety requirements. Covers OWASP **A08** (Software and Data Integrity Failures — build/deploy chain).
- `define-security-observability` — Central log destination, alert thresholds (e.g. N `refresh_grace_hit` events per hour pages oncall), retention policy, PII/token redaction rules, SIEM integration story. Tied to `activate-notifications-service` for the alerting leg. Covers OWASP **A09** (Security Logging and Monitoring Failures).
- `define-egress-controls` — Outbound proxy or Spring `RestTemplate`/`WebClient` interceptor enforcing an egress allowlist, cloud-metadata-endpoint block (`169.254.169.254`), DNS rebinding protection. Needed before capabilities that will fetch user-supplied URLs (AI mentor references, code runner resources, notifications avatar fetch) reach production. Covers OWASP **A10** (Server-Side Request Forgery).
- `define-persistence-data-protection` — KMS-backed JWKS keyset custody, at-rest encryption for PII columns (`primary_email`, `callsign`) via `pgcrypto` or app-side envelope encryption, logging redaction requirements for tokens and emails. Covers OWASP **A02** (Cryptographic Failures — key custody and PII at rest).
- `define-ci-security-baseline` — Rootless Docker or per-job ephemeral runners for Testcontainers, secret-scanning on push (gitleaks), forbidden-string checks (e.g. hardcoded JWT keys), CODEOWNERS coverage report. Absorbs the Testcontainers Docker-socket item from this change's Low risks. Covers OWASP **A05** (Security Misconfiguration — CI plane) and **A08** (build integrity).
