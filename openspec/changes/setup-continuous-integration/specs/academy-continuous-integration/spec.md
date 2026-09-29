# Spec Delta

## ADDED Requirements

### Requirement: Pull Request Verification

The repository SHALL automatically verify every pull request to `main` with the same build, test, and quality commands contributors run locally.

#### Scenario: Frontend changes are verified

GIVEN a pull request changes frontend workspaces, shared frontend packages, or root frontend tooling
WHEN CI runs
THEN it installs dependencies from the committed lockfile without modifying it
AND runs the root format, check, test, and build commands
AND reports failure if any of them fails.

#### Scenario: Backend changes are verified

GIVEN a pull request changes `apps/api`
WHEN CI runs
THEN it builds and tests the API with the committed build-tool wrapper on the Java version the API targets
AND container-backed integration tests can run.

#### Scenario: Specifications are validated

GIVEN a pull request changes OpenSpec specs or changes
WHEN CI runs
THEN it validates all specs and changes in strict mode with the repository-pinned OpenSpec CLI.

#### Scenario: Unrelated checks are skipped

GIVEN a pull request changes only backend files
WHEN CI runs
THEN frontend jobs are skipped
AND the reverse holds for frontend-only changes.

#### Scenario: Shared configuration changes run everything

GIVEN a pull request changes CI workflows or other files that affect every workspace
WHEN CI runs
THEN all verification jobs run.

### Requirement: Merge Gate

The `main` branch SHALL accept changes only after required checks pass.

#### Scenario: Single aggregate status

GIVEN some verification jobs were skipped because their paths did not change
WHEN merge eligibility is evaluated
THEN one aggregate CI status reports success only if every job that ran succeeded
AND a skipped job does not count as a failure.

#### Scenario: Failing checks block merge

GIVEN the aggregate CI status or code scanning fails on a pull request
WHEN a contributor attempts to merge it into `main`
THEN the merge is blocked.

### Requirement: Code Scanning

The repository SHALL run static security analysis on backend and frontend code.

#### Scenario: Scanning on changes and on a schedule

GIVEN Java or TypeScript code exists in the repository
WHEN a pull request targets `main`, a commit lands on `main`, or the weekly schedule fires
THEN code scanning analyzes both languages
AND findings are reported in the repository's security view.

### Requirement: Workflow Security

CI workflows SHALL run with least privilege and reproducible third-party code.

#### Scenario: Read-only default permissions

GIVEN a workflow runs
WHEN its token permissions are evaluated
THEN the default is read-only repository contents
AND any additional permission is granted only to the job that needs it.

#### Scenario: Credentials are blocked before they reach the repository

GIVEN a contributor pushes a commit containing a recognized credential pattern
WHEN the push reaches the repository
THEN the push is rejected with an explanation
AND any credential already in history raises a security alert.

#### Scenario: Pinned third-party actions

GIVEN a workflow uses an action from outside the repository
WHEN the workflow is reviewed
THEN the action is referenced by a full commit SHA with its version noted alongside.

#### Scenario: Build-tool wrapper is verified

GIVEN the backend job uses the committed build-tool wrapper
WHEN CI runs
THEN it verifies the wrapper against the tool vendor's published checksums before executing it.

#### Scenario: Superseded runs are cancelled

GIVEN a new commit is pushed to a pull request while a previous run is in progress
WHEN the new run starts
THEN the previous run for that pull request is cancelled.
