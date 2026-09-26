## Context

- `implement-passwordless-auth-and-oauth` gives every account one or more verified email identities, optional GitHub/Google identities, cookie-based JWT access + rotating refresh sessions, a double-submit CSRF header, Redis rate limiting, and a recently-verified (`rv`) signal. It covers `apps/web` only.
- `apps/admin` is a scaffold served by Vite on port 5174 locally. It will call `apps/api`, which must share a registrable domain with the admin app (the same-origin startup assertion from the auth change is extended to the admin origin).
- `academy-admin-content-management` defines author, reviewer, publisher, and read-only permissions and expects authentication and authorization systems to provide identity and permission decisions.
- Spring Boot 3.5 ships Spring Security 6.5, which includes WebAuthn relying-party support.

## Goals / Non-Goals

**Goals:**

- Phishing-resistant staff sign-in that does not depend on a mailbox for day-to-day access.
- A single account model: staff are ordinary accounts with a staff grant, so an instructor can also be a learner without a second identity.
- Complete separation between learner and admin sessions.
- A recovery path that does not weaken the model (no "email me a way around my passkey").

**Non-Goals:**

- Per-action authorization rules. The grant carries roles; enforcement of what each role may do on each resource belongs to `define-authorization-model` and the owning admin capabilities.
- Staff SSO (Google Workspace SAML/OIDC), impersonation, and IP allowlists.
- Learner passkeys. `add-mfa-and-webauthn` may later reuse the credential storage introduced here.

## Decisions

### 1. Passkeys are required for staff

**Chosen:** Staff sign in with a WebAuthn passkey with `userVerification=required` and discoverable credentials, so the sign-in screen is a single `Sign in with passkey` action. Email links, codes, and OAuth never mint an admin session.

**Alternatives considered:**

- *Email code + TOTP.* TOTP is phishable in real time and adds a shared secret to protect.
- *Restrict to a GitHub organization or Google Workspace domain.* Delegates staff security to a third party's MFA policy and still allows phishing of the OAuth consent flow. Reasonable as an additional gate later, not as the only one.

### 2. Staff grants on ordinary accounts

**Chosen:** `staff_grants (id, account_id, roles, granted_by, granted_at, revoked_at, revoked_by)`. Roles: `author`, `reviewer`, `publisher`, `read_only` (from `academy-admin-content-management`), `support` (account support actions defined by `define-account-lifecycle`), and `staff_manager`. An account has at most one active grant. The admin session carries the grant id and roles; revoking the grant revokes every admin session for that account immediately (same Redis revocation broadcast the auth change uses).

### 3. Enrollment invites

**Chosen:** A `staff_manager` creates a grant and an enrollment invite (`staff_enrollment_invites (id, account_id, token_hash, expires_at, redeemed_at, created_by)`, 24 h, single use). The invited person signs in to their account with the normal learner flow on `apps/web` (proving email control), opens the invite link, completes a fresh step-up re-verification, and registers a passkey. The invite is bound to that account, so a forwarded link is useless to anyone else.

The first staff account is created by a one-shot operator command run on the server (a Spring Boot `ApplicationRunner` enabled only when `academy.admin.bootstrap-email` is set) that creates the grant with `staff_manager` and prints a single-use invite. The command refuses to run once any active `staff_manager` grant exists.

### 4. Recovery

**Chosen:** Staff are encouraged to register at least two passkeys (for example a platform passkey and a hardware key). A staff member who loses every passkey is recovered by another `staff_manager` issuing a new enrollment invite; if no other manager exists, by the operator bootstrap path after the existing grant is revoked. There is no self-service email recovery for admin access.

### 5. Admin sessions

**Chosen:** Separate cookies (`pa_admin_access`, `pa_admin_refresh`) scoped to the admin API path, `HttpOnly`, `Secure`, `SameSite=Strict`. Access token 10 min; refresh rotates like learner refresh but with a 30 min idle timeout and an 8 h absolute lifetime, after which a new passkey assertion is required. Learner cookies are never accepted on `/api/v1/admin/**`, and admin cookies are never accepted on learner endpoints.

### 6. Step-up for high-impact actions

**Chosen:** Granting or revoking staff access, changing roles, publishing, unpublishing, and rolling back content require a passkey assertion within the last 5 minutes. Endpoints return `403 {"error":"admin_step_up_required"}`; the admin client prompts for a passkey and replays the request, mirroring the learner re-verification pattern.

### 7. Audit

**Chosen:** `admin_audit_events (id, account_id, event, detail jsonb, source_ip, user_agent, occurred_at)` for sign-in success and failure, passkey registration and removal, invite creation and redemption, grant changes, step-up, and session revocation. Retention and export follow `define-security-observability`.

## Risks / Trade-offs

- **Lost passkeys lock staff out** → encourage two passkeys; manager-issued re-enrollment; operator bootstrap as a last resort.
- **Bootstrap command misuse** → refuses to run while any active `staff_manager` exists and writes an audit event.
- **Browser support** → passkeys are supported in all current evergreen browsers; staff are a small, managed group.
- **Separate admin origin** → the same-origin assertion must include the admin origin, or CSRF posture breaks; covered in tasks.

## Migration Plan

1. Land after `implement-passwordless-auth-and-oauth`.
2. Add the admin tables in a new Flyway migration.
3. Run the bootstrap command once per environment to create the first staff manager.
4. Rollback: disable the admin filter chain; admin endpoints then reject every request. Learner auth is unaffected.

## Open Questions

- Should staff access additionally require membership of a GitHub organization or Google Workspace domain? Not required for this change; can be added as an extra check without changing the flows.
- Exact idle and absolute admin session lifetimes (30 min / 8 h defaults) live in configuration.
