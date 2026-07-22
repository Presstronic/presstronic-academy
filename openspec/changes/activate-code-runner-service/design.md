## Context

Code execution is core to the first shippable learner loop, but it is also a high-risk boundary. The primary API can orchestrate requests, but untrusted code execution needs explicit isolation, lifecycle, and observability decisions before implementation.

## Goals / Non-Goals

**Goals:**

- Define the service ownership boundary for isolated code execution.
- Define job states and result semantics that Delivery evaluation can consume.
- Require sandbox isolation, resource limits, timeout behavior, and artifact controls.
- Preserve observability and failure handling as first-class requirements.

**Non-Goals:**

- Do not choose a sandbox technology in this proposal.
- Do not implement execution, queues, persistence, or deployment.
- Do not define all language/runtime images.
- Do not make code-runner output the only source of Delivery acceptance.

## Decisions

### Decision: Treat code execution as an independently deployable service

Untrusted execution has different scaling, security, and operational needs than the primary API. `services/code-runner` should activate only when those needs are accepted.

Alternative considered: run code inside `apps/api`. That would reduce initial moving parts but would mix high-risk execution with request handling.

### Decision: Use explicit job lifecycle states

Evaluation consumers need stable states such as queued, running, succeeded, failed, timed out, and canceled before they can present reliable feedback.

Alternative considered: return raw process results only. That would make user-facing feedback and retries inconsistent.

### Decision: Keep sandbox technology deferred

The proposal should define the safety contract before locking the exact runtime provider.

Alternative considered: choose Docker, Firecracker, or a managed runner now. That is premature before workload and isolation needs are validated.

## Risks / Trade-offs

- Sandbox escapes or resource abuse -> require isolation, resource limits, and no shared secrets in execution environments.
- Long-running jobs can overload the system -> require timeouts, queue limits, and cancellation semantics.
- Result semantics can overclaim correctness -> code-runner reports execution/evaluation results, while Delivery acceptance remains product-owned.
- Artifact retention can leak data -> require retention and redaction rules before artifacts are stored.

## Migration Plan

1. Accept this proposal.
2. Define contracts between API/worker and code-runner.
3. Implement a minimal runner scaffold with safe no-op or controlled execution behavior.
4. Add real sandbox execution only after runtime technology is selected and verified.

## Open Questions

- Which sandbox/runtime provider should be used first?
- Should job orchestration live in `apps/api`, `apps/worker`, or both?
- Which programming languages are supported in the first runner?
