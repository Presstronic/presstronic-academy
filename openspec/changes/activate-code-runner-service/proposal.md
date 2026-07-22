## Why

The Academy learner loop depends on realistic code execution and Delivery evaluation, but isolated execution should not be improvised inside the primary API. The code-runner service boundary needs an accepted contract before implementation touches sandboxing, job lifecycle, or evaluation behavior.

## What Changes

- Define `services/code-runner` as the future independently deployable home for isolated code execution.
- Specify job submission, sandbox isolation, artifact handling, result reporting, failure states, and observability boundaries.
- Clarify how Code Prompts and Deliveries may depend on execution results once the service is accepted.
- Keep implementation, provider selection, persistence schemas, and production scaling deferred.

## Capabilities

### New Capabilities

- `academy-code-runner-service`: Isolated code execution service boundary, job lifecycle, sandboxing, artifacts, result semantics, observability, and failure handling.

### Modified Capabilities

- `academy-monorepo-structure`: Activates `services/code-runner` only after isolation and operational boundaries are accepted.
- `academy-code-prompts-deliveries`: Clarifies how Delivery evaluation may consume code-runner results.

## Impact

- Affects future files under `services/code-runner`, API contracts, worker orchestration, and Delivery evaluation flows.
- May introduce sandbox/runtime dependencies in a later implementation step.
- Does not implement the service, execute code, create persistence schemas, or accept Deliveries automatically.
