# Spec Delta

## ADDED Requirements

### Requirement: Frontend Platform Baseline

The frontend workspaces SHALL use a single, currently supported React major and a single, currently supported Vite major, on a Node version pinned in the repository. Shared packages SHALL declare compatibility with exactly the React major the apps use.

#### Scenario: Apps share one React major

GIVEN `apps/web` and `apps/admin` declare React dependencies
WHEN their resolved `react` and `react-dom` versions are inspected
THEN both apps resolve the same React major
AND that major is the latest stable React major, or a supported one with a documented reason to stay.

#### Scenario: Shared UI declares the matching peer range

GIVEN `packages/ui` is consumed by both apps
WHEN its React peer dependency range is reviewed
THEN it covers exactly the React major the apps use
AND does not advertise support for a major the apps do not test against.

#### Scenario: Type definitions match the runtime

GIVEN a frontend workspace depends on React type definitions
WHEN the resolved `@types/react` and `@types/react-dom` versions are inspected
THEN their major version matches the React runtime major.

#### Scenario: Apps share one build tool major

GIVEN `apps/web` and `apps/admin` build with Vite
WHEN their resolved `vite` and React plugin versions are inspected
THEN both apps resolve the same Vite major
AND that major is the latest stable Vite major, or a supported one with a documented reason to stay.

#### Scenario: Node version is pinned

GIVEN a contributor or CI job installs frontend dependencies
WHEN it selects a Node version
THEN the repository pins a Node LTS version that satisfies the build tool's engine requirement
AND the pin is the single source used by local setup documentation and CI.

#### Scenario: Upgrade preserves app behavior

GIVEN the React or Vite major is upgraded
WHEN the root build, lint, and typecheck commands run and each app is started
THEN they pass without new warnings from project code
AND the learner and admin scaffold screens render as before on their documented ports.
