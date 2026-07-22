## ADDED Requirements

### Requirement: Shared API Contract Workspace
The repository SHALL use `packages/contracts` as the shared workspace for REST API contract source, generated frontend clients, and reusable schema artifacts.

#### Scenario: Contracts workspace exists
GIVEN shared API contracts are implemented
WHEN a contributor reviews the workspace layout
THEN `packages/contracts` contains source-owned API contract documents
AND contains or documents generated TypeScript client outputs
AND remains separate from app-specific workflow state.

#### Scenario: Contract source is reviewable
GIVEN an API contract changes
WHEN the change is reviewed
THEN the source contract diff is readable without requiring generated-client diffs as the only evidence.

### Requirement: OpenAPI REST Contract Source
The contracts workspace SHALL use OpenAPI-compatible documents as the default source of truth for REST endpoint shapes.

#### Scenario: REST contract is specified
GIVEN a REST endpoint is accepted by a future proposal
WHEN its request, response, status, or error shape is documented
THEN the shape is represented in OpenAPI-compatible contract source
AND backend and frontend implementation can verify against that contract.

#### Scenario: Product endpoints remain deferred
GIVEN product endpoint behavior has not been accepted
WHEN the contracts scaffold is implemented
THEN production learner, admin, billing, mentor, content, Code Prompt, Delivery, and content health endpoint contracts remain absent or placeholder-documented
AND require focused proposals before implementation.

### Requirement: Generated Frontend Client Boundary
The contracts workspace SHALL define how generated TypeScript clients are produced and consumed by frontend workspaces.

#### Scenario: Frontend client consumption
GIVEN generated clients exist
WHEN `apps/web` or `apps/admin` consumes backend APIs
THEN they consume the generated client package or documented exports from `packages/contracts`
AND do not maintain unrelated handwritten request/response types for contracted APIs.

#### Scenario: Generation is repeatable
GIVEN contract source changes
WHEN client generation runs
THEN generated TypeScript output is deterministic
AND contributors can reproduce it from documented workspace commands.

### Requirement: Contract Verification
The contracts workspace SHALL provide validation commands for contract syntax, schema consistency, and generated output readiness.

#### Scenario: Contract validation succeeds
GIVEN contract tooling is installed
WHEN contract validation runs
THEN OpenAPI documents are checked for syntax and schema validity
AND failures report the contract source that needs correction.

#### Scenario: Root verification includes contracts
GIVEN the contracts workspace is active
WHEN root quality commands run
THEN contract validation or checks run where present
AND contributors do not need to infer contract verification commands.

### Requirement: Contract Ownership Boundaries
The contracts workspace SHALL define API shapes without owning backend behavior, frontend workflows, persistence schemas, or service implementation.

#### Scenario: Backend behavior remains API-owned
GIVEN an endpoint contract exists
WHEN backend behavior is implemented
THEN controller behavior, authorization, orchestration, and error handling live in `apps/api` or an accepted service boundary
AND `packages/contracts` remains the contract artifact owner.

#### Scenario: Persistence remains separate
GIVEN API contracts reference data fields
WHEN database storage is designed
THEN persistence schemas and migrations remain owned by persistence or feature proposals
AND are not implied solely by the API contract.
