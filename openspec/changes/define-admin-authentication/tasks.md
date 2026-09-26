## 1. Persistence and Configuration

- [ ] 1.1 Add a Flyway migration creating `staff_grants`, `webauthn_credentials`, `staff_enrollment_invites`, and `admin_audit_events`; verify the migration runs cleanly on the local stack and the entity-drift test passes.
- [ ] 1.2 Add `academy.admin.*` configuration (admin origin, relying-party id and name, access TTL, idle timeout, absolute lifetime, step-up window) and extend the same-origin startup assertion to include the admin origin; verify a mismatched admin origin fails startup.

## 2. Staff Grants and Enrollment

- [ ] 2.1 Implement staff grant creation, role changes, and revocation (with the last-staff-manager guard) and publish admin-session revocations on grant revoke; verify integration tests cover each path and that learner sessions survive a grant revoke.
- [ ] 2.2 Implement enrollment invites bound to an account (24 h, single use, hashed at rest); verify tests cover redemption, wrong account, expiry, and reuse.
- [ ] 2.3 Implement the one-shot bootstrap runner enabled by `academy.admin.bootstrap-email`; verify it grants `staff_manager`, prints a single-use invite, writes an audit event, and refuses to run when an active staff manager exists.

## 3. Passkeys and Admin Sessions

- [ ] 3.1 Configure Spring Security WebAuthn registration (invite-gated, requires a recent learner re-verification) and assertion (discoverable credentials, `userVerification=required`) for the admin chain; verify integration tests with a virtual authenticator cover registration, sign-in, cancelled assertion, and an account without a grant.
- [ ] 3.2 Implement a separate `/api/v1/admin/**` security filter chain with `pa_admin_access`/`pa_admin_refresh` cookies (`SameSite=Strict`), idle timeout, absolute lifetime, CSRF header, and rate limiting on sign-in; verify learner cookies are rejected on admin endpoints and admin cookies on learner endpoints.
- [ ] 3.3 Implement admin step-up (`admin_step_up_required`) for grant, role, publish, unpublish, and rollback endpoints; verify tests cover inside and outside the step-up window.
- [ ] 3.4 Record `admin_audit_events` for every event listed in the spec; verify an integration test asserts one event per action.

## 4. Admin Frontend (`apps/admin`)

- [ ] 4.1 Build the admin sign-in screen (`Sign in with passkey`), invite redemption and passkey registration flow, session store, and route guards; verify Vitest suites cover success, cancel, no-grant, and expired-invite states.
- [ ] 4.2 Build a staff management screen for staff managers (grant, change roles, revoke, issue re-enrollment invite) with step-up prompting; verify component tests cover step-up replay and the last-manager error.

## 5. Verification

- [ ] 5.1 Run `openspec validate define-admin-authentication --strict`.
- [ ] 5.2 Run `./gradlew :apps:api:test` and the `apps/admin` check script.
- [ ] 5.3 Manual acceptance: bootstrap the first staff manager, redeem the invite, sign in with a passkey, grant a second staff member, revoke them and confirm their admin session ends, and confirm a learner session never opens the admin app.
- [ ] 5.4 Document the bootstrap command and passkey setup in `apps/api/README.md` and `apps/admin/README.md`.
