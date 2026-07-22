## ADDED Requirements

### Requirement: Code Runner Service Boundary
The system SHALL treat `services/code-runner` as the independently deployable boundary for isolated code execution once the service is accepted.

#### Scenario: Service boundary is active
GIVEN code-runner service activation is implemented
WHEN repository ownership is reviewed
THEN isolated execution behavior lives under `services/code-runner`
AND primary API or worker code only orchestrates accepted runner contracts.

#### Scenario: Primary API does not execute untrusted code
GIVEN learner or candidate code must run
WHEN the execution path is reviewed
THEN untrusted code is not executed inside the primary API request process
AND execution is delegated to the accepted runner boundary.

### Requirement: Execution Job Lifecycle
The code-runner service SHALL expose explicit job lifecycle states for execution and evaluation work.

#### Scenario: Job states are observable
GIVEN a run job is submitted
WHEN its status is queried or reported
THEN the job reports a stable lifecycle state such as queued, running, succeeded, failed, timed out, or canceled
AND consumers do not need to infer state from raw process output.

#### Scenario: Failure states preserve feedback
GIVEN a job fails or times out
WHEN results are returned
THEN the response distinguishes infrastructure failure, timeout, evaluation failure, and invalid input where feasible
AND includes safe feedback suitable for learner or reviewer surfaces.

### Requirement: Sandbox Isolation
The code-runner service SHALL execute untrusted code in a sandboxed environment with explicit resource, network, secret, and filesystem boundaries.

#### Scenario: Resource limits are enforced
GIVEN a job runs untrusted code
WHEN execution begins
THEN CPU, memory, wall-clock time, process, and filesystem limits are enforced according to the accepted runner configuration.

#### Scenario: Secrets are not exposed
GIVEN a runner environment is prepared
WHEN untrusted code executes
THEN production secrets and unrelated service credentials are not present in the execution environment.

### Requirement: Runner Result Artifacts
The code-runner service SHALL define how logs, test output, generated artifacts, and evaluation metadata are returned or retained.

#### Scenario: Safe output is returned
GIVEN execution produces logs or test output
WHEN the result is delivered to Academy systems
THEN output is bounded, sanitized where needed, and associated with the run job
AND oversized or unsafe output is handled predictably.

#### Scenario: Retention remains explicit
GIVEN execution artifacts need storage
WHEN artifact retention is implemented
THEN retention duration, access rules, and deletion behavior are documented
AND storage layout is not implied solely by the runner service scaffold.

### Requirement: Runner Observability
The code-runner service SHALL provide operational visibility for job volume, duration, failures, timeouts, and sandbox health.

#### Scenario: Runner health is observable
GIVEN the runner service is deployed or run locally
WHEN operators inspect service health
THEN health and readiness signals distinguish service availability from individual job success.

#### Scenario: Job metrics are captured
GIVEN jobs are processed
WHEN observability is reviewed
THEN job counts, durations, failure categories, timeout counts, and queue pressure are available or intentionally deferred with documented rationale.
