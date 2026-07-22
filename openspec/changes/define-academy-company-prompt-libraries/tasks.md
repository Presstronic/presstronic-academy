## 1. Library Domain Boundary

- [ ] 1.1 Define company prompt library, company prompt, version, owner, reviewer, and assignment eligibility concepts.
- [ ] 1.2 Document how company prompts reuse Code Prompt foundations.
- [ ] 1.3 Define tenant visibility and Academy curriculum separation.
- [ ] 1.4 Keep prompt library implementation, imports, exports, and tenant administration deferred.

## 2. Governance and Lifecycle

- [ ] 2.1 Define draft, review, approved, archived, and assigned prompt states.
- [ ] 2.2 Define version snapshot behavior for assessment assignment.
- [ ] 2.3 Define ownership, access, and sharing rules.
- [ ] 2.4 Define validation boundaries for imported or copied prompts.

## 3. Verification

- [ ] 3.1 Run `openspec validate define-academy-company-prompt-libraries --strict`.
- [ ] 3.2 Run `openspec validate --all --strict`.
- [ ] 3.3 Run `git diff --check`.
