## 1. Persistence

- [ ] 1.1 Add a Flyway migration for `accounts.status` (`active`, `suspended`, `pending_erasure`), pending email changes, revert tokens, merge requests, and support cases with audit fields; verify the migration runs cleanly and the entity-drift test passes.

## 2. Email Change and Sign-In Methods

- [ ] 2.1 Implement `POST /account/email-change` and confirmation (requires `rv=true`, code to the new address, uniqueness check at confirmation) plus the revert link to the old address (7 days, restores old address, revokes all sessions); verify integration tests cover success, expiry, address in use, and revert.
- [ ] 2.2 Implement `GET /account/identities`, secondary email add, provider connect via `/oauth/{provider}/authorize?intent=connect` bound to the current session, and `DELETE /account/identities/{id}` with the last-verified-email guard; verify tests cover connect, already linked elsewhere, disconnect, and the guard.
- [ ] 2.3 Build the `Sign-in & security` panel in `apps/web` (methods list, connect/disconnect, add email, change email, sign out everywhere) reached from profile, using the re-verification dialog; verify component tests cover each action and the step-up prompt.

## 3. Sessions, Suspension, and Erasure

- [ ] 3.1 Implement `POST /account/sessions/revoke-all` using the revocation broadcast; verify all sessions are revoked, WebSocket connections close, and refresh fails.
- [ ] 3.2 Implement suspension and reinstatement for support staff (admin step-up, audit) and enforce status in sign-in completion and refresh, showing the suspended message only after verification; verify tests cover each sign-in method and that sign-in email requests stay non-revealing.
- [ ] 3.3 Hook erasure scheduling, cancellation, and execution from privacy controls to set `pending_erasure`, revoke other sessions, restrict the signed-in surface, and delete identities and sessions on execution; verify integration tests cover each transition.

## 4. Support Recovery and Merge

- [ ] 4.1 Add the public `Can't sign in?` recovery form creating a support case with a non-revealing confirmation; verify identical responses for matching and non-matching details.
- [ ] 4.2 Build admin support screens for recovery (replace verified email) and merge (dual-confirmed requests) behind the `support` role and admin step-up, with notices and audit; verify tests cover role enforcement, step-up, notices, and audit rows.

## 5. Notices

- [ ] 5.1 Emit `security_notice` events for every event in the spec, routed to the notifications service and logged locally; verify a test asserts one notice per event and that marketing opt-out does not suppress them.

## 6. Verification

- [ ] 6.1 Run `openspec validate define-account-lifecycle --strict`.
- [ ] 6.2 Run `./gradlew :apps:api:test` and the `apps/web` and `apps/admin` check scripts.
- [ ] 6.3 Manual acceptance: change email and revert it, connect and disconnect GitHub and Google, sign out everywhere across two browsers, suspend and reinstate an account, schedule and cancel erasure, and complete a support recovery.
