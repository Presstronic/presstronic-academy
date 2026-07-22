## 1. Local Service Definition

- [ ] 1.1 Define local PostgreSQL service configuration.
- [ ] 1.2 Define local Redis service configuration.
- [ ] 1.3 Define local S3-compatible storage configuration.
- [ ] 1.4 Keep provider-specific production integrations absent.

## 2. Environment and Documentation

- [ ] 2.1 Add environment template files without committing secrets.
- [ ] 2.2 Document service ports, credentials, override points, and startup order.
- [ ] 2.3 Document start, stop, health, logs, and reset commands.
- [ ] 2.4 Identify which commands are destructive before documenting reset behavior.

## 3. App Wiring Boundaries

- [ ] 3.1 Update API local profile conventions only where local dependencies are accepted.
- [ ] 3.2 Avoid adding feature schemas, migrations, queues, or object layouts before focused proposals accept them.
- [ ] 3.3 Keep frontend apps independent of local infrastructure except through accepted API/client boundaries.

## 4. Verification

- [ ] 4.1 Validate Docker Compose configuration.
- [ ] 4.2 Verify documented local service health checks.
- [ ] 4.3 Run affected app configuration checks.
- [ ] 4.4 Run `openspec validate setup-local-development-infrastructure --strict`.
- [ ] 4.5 Run `openspec validate --all --strict`.
- [ ] 4.6 Run `git diff --check`.
