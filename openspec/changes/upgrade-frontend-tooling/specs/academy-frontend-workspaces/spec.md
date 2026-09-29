# Spec Delta

## ADDED Requirements

### Requirement: Frontend Toolchain Baseline

The frontend workspaces SHALL use a pinned package manager version and shared lint, type-checking, and formatting tools on currently supported major versions, with any intentional lag documented by an OpenSpec change.

#### Scenario: Package manager is pinned

GIVEN a contributor or CI job installs frontend dependencies
WHEN it selects a package manager
THEN the exact package manager version comes from the repository's pinned declaration
AND installs from the committed lockfile succeed without modifying it.

#### Scenario: Install scripts are explicitly allowed

GIVEN a dependency needs to run an install or build script
WHEN dependencies are installed
THEN only dependencies explicitly allowed in workspace configuration run their scripts
AND any other dependency's scripts are blocked.

#### Scenario: Toolchain majors are current or deferred on record

GIVEN the package manager, linter, lint plugins, type checker, or formatter has a newer stable major
WHEN the toolchain is reviewed
THEN the workspace uses that major
OR an OpenSpec change documents why it stays behind and what unblocks the upgrade.

#### Scenario: Lint and type checker versions are compatible

GIVEN the shared lint configuration parses TypeScript
WHEN the type checker version is chosen
THEN it is within the range the lint parser declares as supported.

#### Scenario: Formatting covers repository config and workflows

GIVEN a contributor changes root configuration, CI workflows, infrastructure files, or workspace source
WHEN the root format check runs
THEN those files are checked
AND generated files, lockfiles, design mockups, tool-local directories, and OpenSpec markdown are excluded.
