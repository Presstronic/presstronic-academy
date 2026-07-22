# Academy Frontend Workspaces Specification

## Purpose

Define the Presstronic Academy frontend workspace scaffolding capability.

This specification captures learner/admin React app scaffolding, shared UI package ownership, strict TypeScript configuration, shared ESLint configuration, workspace scripts, dependency boundaries, ShadCN/Tailwind conventions, and placeholder replacement boundaries. It does not specify backend APIs, generated API clients, authentication integration, persistence, live AI, code execution, production deployment, or production learner/admin workflow behavior.

## Requirements

### Requirement: Frontend Workspace Topology
The repository SHALL scaffold frontend workspaces for learner, admin, shared UI, shared TypeScript configuration, and shared ESLint configuration under the accepted monorepo boundaries.

#### Scenario: Frontend workspaces exist
GIVEN frontend scaffolding is implemented
WHEN a contributor reviews the workspace layout
THEN `apps/web` contains the learner-facing React application
AND `apps/admin` contains the admin and instructor React application
AND `packages/ui` contains reusable Academy UI components and styling utilities
AND `packages/tsconfig` contains shared TypeScript configuration
AND `packages/eslint-config` contains shared ESLint configuration.

#### Scenario: Placeholder docs are replaced or retained intentionally
GIVEN a scaffolded workspace previously contained only placeholder documentation
WHEN implementation creates the real workspace
THEN placeholder-only files are replaced or updated to describe the actual workspace
AND no obsolete placeholder text remains as the primary documentation for an implemented workspace.

#### Scenario: Non-frontend placeholders remain inactive
GIVEN frontend scaffolding is implemented
WHEN backend, worker, gateway, contract, service, or infrastructure placeholders exist
THEN those areas remain placeholder-only unless a separate accepted proposal activates them.

### Requirement: Learner Web App Scaffold
The `apps/web` workspace SHALL scaffold a learner-facing React app with strict TypeScript, Vite, Tailwind CSS, and ShadCN-compatible UI consumption.

#### Scenario: Learner app builds
GIVEN frontend dependencies are installed
WHEN the learner app build command runs
THEN `apps/web` compiles as a Vite React TypeScript application
AND consumes shared configuration from workspace packages where applicable.

#### Scenario: Learner app owns learner routes
GIVEN learner-facing screens are implemented
WHEN route or screen ownership is reviewed
THEN public and authenticated learner routes live in `apps/web`
AND shared UI primitives remain in `packages/ui`.

#### Scenario: Learner app references accepted shell boundaries
GIVEN `apps/web` scaffolds app layout or routing
WHEN the scaffold defines public and authenticated route structure
THEN it supports landing/auth screens outside the app shell
AND supports authenticated learner screens inside the app shell.

### Requirement: Admin App Scaffold
The `apps/admin` workspace SHALL scaffold an admin and instructor React app with strict TypeScript, Vite, Tailwind CSS, and ShadCN-compatible UI consumption.

#### Scenario: Admin app builds
GIVEN frontend dependencies are installed
WHEN the admin app build command runs
THEN `apps/admin` compiles as a Vite React TypeScript application
AND consumes shared configuration from workspace packages where applicable.

#### Scenario: Admin app owns admin routes
GIVEN admin or instructor screens are implemented
WHEN route or screen ownership is reviewed
THEN content management, content health, support, reporting, moderation, and administrative routes live in `apps/admin`
AND shared UI primitives remain in `packages/ui`.

#### Scenario: Admin scaffold remains separate from learner app
GIVEN learner and admin workspaces exist
WHEN a contributor adds app-specific workflow state
THEN learner workflow state remains in `apps/web`
AND admin workflow state remains in `apps/admin`.

### Requirement: Shared UI Package Scaffold
The `packages/ui` workspace SHALL scaffold reusable Academy UI primitives, styling utilities, and ShadCN-compatible component ownership without owning application routes or workflows.

#### Scenario: Shared UI package builds
GIVEN frontend dependencies are installed
WHEN the shared UI build or typecheck command runs
THEN `packages/ui` compiles reusable TypeScript React exports
AND exposes components through stable package exports.

#### Scenario: Shared UI owns reusable components
GIVEN a component is used by both learner and admin apps
WHEN it wraps ShadCN primitives, tokens, accessibility behavior, or reusable variants
THEN it lives in `packages/ui`
AND app-specific screens, data loading, and workflow state remain in the consuming app.

#### Scenario: Shared UI preserves Academy visual design
GIVEN shared components or tokens are scaffolded
WHEN styling is defined
THEN the scaffold follows Academy visual design constraints for colors, typography, geometry, iconography, spacing, and motion
AND does not introduce conflicting global visual rules.

### Requirement: Shared Frontend Configuration
The repository SHALL provide shared strict TypeScript and ESLint configuration packages for frontend workspaces.

#### Scenario: Shared TypeScript config
GIVEN frontend workspaces are scaffolded
WHEN TypeScript configuration is reviewed
THEN `packages/tsconfig` provides shared strict TypeScript config
AND frontend apps and packages extend it instead of duplicating strictness settings.

#### Scenario: Shared ESLint config
GIVEN frontend workspaces are scaffolded
WHEN lint configuration is reviewed
THEN `packages/eslint-config` provides shared frontend lint configuration
AND frontend apps and packages consume it instead of maintaining unrelated lint rules.

#### Scenario: Strict type checking
GIVEN the workspace typecheck command runs
WHEN TypeScript evaluates frontend apps and packages
THEN strict type checking is enabled
AND scaffolded source does not rely on implicit `any` or disabled strictness.

### Requirement: Frontend Workspace Scripts
The repository SHALL expose root and workspace scripts that support frontend development, build, lint, typecheck, and quality checks.

#### Scenario: Root recursive scripts
GIVEN frontend workspaces are scaffolded
WHEN a contributor runs root quality commands
THEN root scripts invoke matching workspace scripts for build, lint, typecheck, test or check where present
AND do not require contributors to manually enter each app directory for routine verification.

#### Scenario: App development scripts
GIVEN the learner and admin apps are scaffolded
WHEN a contributor starts local frontend development
THEN each app exposes a development server script
AND ports or startup instructions avoid ambiguity between learner and admin apps.

#### Scenario: Verification commands are documented
GIVEN frontend scaffolding is implemented
WHEN a contributor reads workspace documentation
THEN the documentation identifies install, dev, build, lint, typecheck, and quality commands for the scaffolded frontend.

### Requirement: Frontend Dependency Boundaries
The frontend scaffold SHALL keep dependencies aligned with workspace ownership and avoid premature product implementation.

#### Scenario: Shared dependency placement
GIVEN a dependency is used only by one app
WHEN dependencies are declared
THEN it belongs to that app workspace
AND shared dependencies are placed where workspace package management can resolve them consistently.

#### Scenario: API clients deferred
GIVEN backend contracts and generated clients are not yet accepted
WHEN frontend scaffolding is implemented
THEN API client generation and backend integration are deferred
AND any data access remains mock, placeholder, or implementation-free according to the scaffold scope.

#### Scenario: Product workflows deferred
GIVEN frontend scaffolding is implemented
WHEN learner, admin, mentor, content health, or content authoring product workflows are considered
THEN the scaffold may include minimal placeholders or route shells
AND does not implement production workflow behavior before focused feature proposals accept it.
