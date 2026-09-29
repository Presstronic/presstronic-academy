# Spec Delta

## ADDED Requirements

### Requirement: Type Checking Toolchain Compatibility

The frontend workspaces SHALL upgrade the TypeScript compiler only to versions that the shared lint parser, build tooling, and test tooling declare as supported.

#### Scenario: Compiler upgrade is blocked by lint support

GIVEN a new TypeScript major is released
AND the shared lint parser's supported TypeScript range excludes it
WHEN the upgrade is evaluated
THEN the workspaces stay on the newest supported TypeScript version
AND the pending upgrade is tracked by an OpenSpec change with explicit entry criteria.

#### Scenario: Compiler upgrade proceeds when supported

GIVEN the lint parser, build tooling, and test tooling all support a new TypeScript major
WHEN the upgrade is applied
THEN all frontend workspaces resolve a single TypeScript version of that major
AND lint, typecheck, test, and build commands pass without disabling strictness.
