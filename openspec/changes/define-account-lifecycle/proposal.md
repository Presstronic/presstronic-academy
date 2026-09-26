## Why

`implement-passwordless-auth-and-oauth` gets a learner signed in, but nothing specifies what happens after that when the account itself changes: a learner switches email providers, wants to add or remove GitHub or Google, suspects someone else is signed in, is suspended by an operator, schedules deletion, or loses access to every sign-in method. `academy-profile` already promises that an email change is verified before it takes effect but does not say how, and `academy-privacy-controls` schedules erasure without saying what happens to live sessions. Without a contract, each of these gets improvised in profile or support code and becomes the easiest account-takeover path in the system.

## What Changes

- Introduce the `academy-account-security` capability for post-sign-in account management:
  - **Email change** confirmed on the new address after step-up re-verification, with a notice and a time-limited revert path sent to the old address.
  - **Sign-in methods**: view linked email, GitHub, and Google identities; connect a provider from a signed-in session; disconnect a provider. The last verified email can never be removed.
  - **Sign out everywhere**, revoking every session including open WebSocket connections.
  - **Suspension** by support staff, revoking sessions immediately and blocking new ones with a message shown only after identity is proven.
  - **Session handling around erasure**: scheduling erasure signs out other sessions but still lets the owner sign in to cancel during the grace period; completed erasure removes identities and sessions.
  - **Support-assisted recovery and merge** for learners who lost every sign-in method or ended up with two accounts, performed by staff with the support role, audited, and announced to the affected addresses.
  - **Security notices** emailed for each of these events.
- Modify `academy-profile` so the email field hands off to the account-security email-change flow and the profile screen exposes a sign-in and security entry point.

## Capabilities

### New Capabilities

- `academy-account-security`: Email change, sign-in method management, sign out everywhere, suspension, session handling around erasure, support-assisted recovery and merge, and account security notices.

### Modified Capabilities

- `academy-profile`: The `Email change requires verification` scenario delegates to `academy-account-security`, and the responsibility boundary names account-security as the owner of sign-in method, session, and email-change behavior.

## Impact

- **Code**: `apps/api` gains account-security endpoints under `/api/v1/account/**`, an operator-facing support API under `/api/v1/admin/support/**`, and suspension checks in sign-in and session refresh. `apps/web` gains a `Sign-in & security` panel reached from profile. `apps/admin` gains support screens for suspension, recovery, and merge.
- **Data**: New columns or tables for pending email changes, revert tokens, account status (`active`, `suspended`, `pending_erasure`), and support case audit.
- **Dependencies**: Depends on `implement-passwordless-auth-and-oauth` (identities, step-up re-verification, session revocation broadcast) and `define-admin-authentication` (support role, staff audit). Security notices need `activate-notifications-service` for production delivery; locally they are logged like sign-in emails. Erasure scheduling and cancellation remain owned by `academy-privacy-controls`.
- **Deferred**: Per-device session list with individual revoke and new-device alerts (`add-account-takeover-notifications`), learner passkeys (`add-mfa-and-webauthn`), and self-service account merge.
