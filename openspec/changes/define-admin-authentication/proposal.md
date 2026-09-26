## Why

`apps/admin` will let staff author, review, and publish curriculum, manage support cases, and later manage other staff. The accepted `academy-admin-content-management` spec defines author, reviewer, publisher, and read-only roles but delegates identity to "authentication and authorization systems" that no spec defines, and `implement-passwordless-auth-and-oauth` deliberately covers only learner sign-in on `apps/web`. A staff account is a far higher-value target than a learner account, so reusing the learner email-link flow as-is would make one phished mailbox enough to publish content to every learner. Staff sign-in needs its own, phishing-resistant contract before any admin workflow ships.

## What Changes

- Introduce the `academy-admin-authentication` capability: how staff sign in to `apps/admin`, how their sessions differ from learner sessions, and how admin access is granted and revoked.
- Staff sign in with a **passkey (WebAuthn) with user verification**. Email links, one-time codes, and GitHub/Google sign-in never grant an admin session on their own.
- Admin access requires an explicit, auditable **staff grant** on the account. The grant carries the roles `academy-admin-content-management` already defines, plus an account-support role (used by `define-account-lifecycle`) and a staff-management role. A learner session never authorizes admin endpoints.
- Passkey enrollment happens only through a single-use enrollment invite issued by an existing staff manager (or, for the very first staff account, by an operator command on the server), and the invite must be redeemed by the invited account after it verifies its email.
- Admin sessions are separate from learner sessions, shorter-lived, have an idle timeout and an absolute lifetime, and are revoked immediately when the staff grant is revoked.
- High-impact staff actions (granting or revoking staff access, publishing or rolling back content) require a fresh passkey assertion.
- Every staff sign-in, failed attempt, enrollment, grant change, and step-up is recorded as an audit event.

## Capabilities

### New Capabilities

- `academy-admin-authentication`: Staff sign-in to the admin application, staff grants and role assignment, passkey enrollment and recovery, admin session lifecycle, step-up for high-impact actions, and staff authentication audit.

### Modified Capabilities

None. `academy-admin-content-management` already delegates identity and permission decisions to authentication and authorization systems; this change supplies the authentication side without changing its requirements.

## Impact

- **Code**: `apps/api` gains an admin security filter chain for `/api/v1/admin/**`, WebAuthn registration and assertion endpoints (Spring Security's built-in WebAuthn support), staff grant and enrollment-invite persistence, and an operator bootstrap command. `apps/admin` gains a sign-in screen, passkey enrollment flow, session store, and route guards.
- **Data**: New tables for staff grants, passkey credentials, enrollment invites, and admin audit events (Flyway migration after the auth baseline).
- **APIs**: New admin-only endpoints under `/api/v1/admin/auth/**`. Learner endpoints are unchanged.
- **Dependencies**: Depends on `implement-passwordless-auth-and-oauth` (accounts, verified email identities, session and cookie plumbing, CSRF posture, rate limiting). Fine-grained permission checks on individual admin actions belong to the future `define-authorization-model`; this change only supplies the roles on the grant.
- **Deferred**: SSO/SAML for staff, hardware-key-only policies, admin impersonation of learners, and IP allowlisting.
