# Spec Delta

## ADDED Requirements

### Requirement: Automated Dependency Update Proposals

The repository SHALL automatically propose non-major dependency updates as pull requests for every package ecosystem it uses.

#### Scenario: All ecosystems are covered

GIVEN the repository uses frontend packages, backend build dependencies, the backend build-tool wrapper, CI actions, and local infrastructure container images
WHEN the update automation configuration is reviewed
THEN each of those ecosystems has an update schedule.

#### Scenario: Routine updates are grouped

GIVEN several patch or minor updates are available in one ecosystem
WHEN the weekly update run happens
THEN they are proposed together in one pull request for that ecosystem
AND the pull request is labeled as a dependency update for that ecosystem.

#### Scenario: Update pull requests are verified

GIVEN an automated update pull request is opened
WHEN CI runs
THEN it runs the same required checks as any other pull request
AND the update merges only after those checks pass.

### Requirement: Security Updates

The repository SHALL propose fixes for dependencies with published security advisories without waiting for the routine schedule.

#### Scenario: Vulnerable dependency is detected

GIVEN a dependency in the repository has a published security advisory with a fixed version
WHEN the advisory is published
THEN a security alert is raised
AND when the fix is within the current major version, a pull request updating to the fixed version is opened independently of routine grouping.

#### Scenario: Security fix requires a major upgrade

GIVEN a security advisory is fixed only in a new major version of an application dependency
WHEN the security alert is raised
THEN no automated pull request is opened for the major version
AND the alert is triaged within one week into either an OpenSpec upgrade change or a documented risk acceptance.

### Requirement: Major Upgrades Through OpenSpec

Major-version upgrades of application dependencies SHALL go through an OpenSpec change rather than an automated version-update pull request.

#### Scenario: Major version is released

GIVEN a new major version of an application framework, library, runtime, or build tool is released
WHEN the routine update run happens
THEN no automated version-update pull request is opened for that major
AND the upgrade is proposed as an OpenSpec change when the team decides to adopt it.

#### Scenario: CI action majors are exempt

GIVEN a new major version of a CI action is released
WHEN the routine update run happens
THEN an automated pull request is opened for it
AND it is verified by CI like any other update.
