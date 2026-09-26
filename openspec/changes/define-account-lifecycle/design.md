## Context

- Every account has at least one verified `email` identity and optionally `github` and `google` identities (`implement-passwordless-auth-and-oauth`, design decision #5).
- Sensitive endpoints can require recent verification: they return `reverification_required`, and the learner client runs the emailed-code re-verification dialog and replays the request.
- Session revocation is published to Redis so API nodes close WebSocket connections and reject refresh for revoked sessions.
- Staff with a grant carrying the `support` role act through `apps/admin` with passkey sign-in and admin step-up (`define-admin-authentication`).
- `academy-privacy-controls` owns erasure confirmation, the 14-day grace period, and cancellation by the "verified account owner".

## Goals / Non-Goals

**Goals:**

- No single stolen session can silently take over an account: every change that alters how the account is reached requires step-up and notifies the addresses that could be affected.
- Every account always keeps a verified email.
- Support can fix real lockouts without creating a social-engineering bypass.

**Non-Goals:**

- Per-device session lists and new-device alerts.
- Self-service merge of two accounts.
- Changing callsigns or other profile fields (owned by `academy-profile`).

## Decisions

### 1. Email change

**Chosen:** `POST /account/email-change` `{newEmail}` requires `rv=true`. The server sends a code-only email to the new address (reusing the one-time-code machinery with `purpose=EMAIL_CHANGE`). On confirmation the new address becomes the primary verified email identity; the old email identity is removed; the old address receives a notice with a revert link valid for 7 days. Using the revert link restores the old address, removes the new one, revokes every session, and tells the user to sign in again.

If the new address already belongs to another account, the server still sends nothing that reveals that before the code is confirmed; at confirmation it declines with "this email can't be used" and points to support for a merge.

**Alternative considered:** *Confirm on both addresses.* Stronger, but blocks learners who changed email because they lost the old mailbox — exactly the case that drives email changes. The revert window gives the old owner a way back instead.

### 2. Sign-in methods

**Chosen:** `GET /account/identities` lists identities. Connecting a provider starts the normal `/oauth/{provider}/authorize` flow with an `intent=connect` state bound to the current session and requires `rv=true`. On callback:

- provider identity unlinked anywhere → link to the current account, emit `identity_linked`;
- provider identity already on this account → no-op;
- provider identity linked to another account → decline and point to support merge.

Disconnecting `DELETE /account/identities/{id}` requires `rv=true` and is refused for the last verified `email` identity. Additional verified emails can be added with the same code flow as email change, without removing the primary.

### 3. Sign out everywhere

**Chosen:** `POST /account/sessions/revoke-all` revokes every session and refresh family for the account, publishes each session id on the revocation channel (closing WebSockets), clears the caller's cookies, and sends a notice. It does not require step-up; it is a protective action.

### 4. Account status and suspension

**Chosen:** `accounts.status` ∈ `active`, `suspended`, `pending_erasure`. Suspension by a support staff member (admin step-up required) revokes all sessions. Sign-in for a suspended account still runs the full link/code/OAuth verification; only after the identity is proven does the auth screen show "This account is suspended. Contact support." so the state is not enumerable. Refresh for a suspended account fails.

### 5. Erasure interplay

**Chosen:** When privacy controls schedule erasure, status becomes `pending_erasure` and every other session is revoked. The owner can still sign in during the grace period, but only the cancellation flow and sign-out are available. On cancellation the status returns to `active`. When erasure executes, identities, sessions, refresh tokens, and pending tokens are deleted, releasing the email for future enrollment.

### 6. Support-assisted recovery and merge

**Chosen:** A public `Can't sign in?` link on the auth screen opens a recovery request form that creates a support case (no account state changes, no disclosure of whether an account exists). Support staff verify evidence out of band and, with admin step-up, may replace the account's verified email. The system revokes all sessions, emails a notice to the old address with a 7-day revert link, and records a support audit event naming the staff member.

Merge is support-only: the learner proves control of both accounts by signing in to each and confirming a merge request from each within 24 hours; support then merges identities and learning records into the surviving account with admin step-up. The losing account is closed.

**Alternative considered:** *Self-service recovery via security questions or a secondary factor.* Security questions are weak; a secondary factor arrives with passkeys (`add-mfa-and-webauthn`).

### 7. Security notices

**Chosen:** Emit a `security_notice` event for email change (to old and new), revert, identity connected or disconnected, sign out everywhere, suspension, recovery, and merge. Notices go through `activate-notifications-service`; they bypass marketing preferences but respect hard suppression (bounced addresses). Locally they are logged.

## Risks / Trade-offs

- **Support becomes the social-engineering target** → support actions need the `support` role, passkey step-up, audit, and a notice plus revert window to the previous address.
- **Revert link as an attack** → it only restores the previous verified address and signs everything out; it cannot point the account anywhere new.
- **Notices depend on email delivery** → production launch is already gated on the notifications service.

## Migration Plan

1. Land after `implement-passwordless-auth-and-oauth` and `define-admin-authentication`.
2. Add a Flyway migration for account status, pending email changes, revert tokens, and support cases.
3. Rollback: disable the endpoints; existing accounts remain valid because status defaults to `active`.

## Open Questions

- Revert window length (7 days default) and merge confirmation window (24 hours default) live in configuration.
- Which learning records move on merge is decided with the progression and privacy owners when merge is implemented; the auth side only moves identities and closes the losing account.
