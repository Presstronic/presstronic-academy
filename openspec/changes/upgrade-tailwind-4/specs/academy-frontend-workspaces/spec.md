# Spec Delta

## ADDED Requirements

### Requirement: Shared Design Token Source

The frontend workspaces SHALL define Academy design tokens and their utility-class mappings once, in the shared UI package, and SHALL document the browsers the styling toolchain supports.

#### Scenario: Tokens are defined once

GIVEN the learner and admin apps use Academy color, easing, and typography utilities
WHEN the styling configuration is reviewed
THEN the tokens and their utility mappings are defined in `packages/ui`
AND neither app duplicates the theme definition.

#### Scenario: Token changes reach both apps

GIVEN a contributor changes an Academy token value in the shared UI package
WHEN both apps are rebuilt
THEN both apps render the updated value without app-level configuration changes.

#### Scenario: Shared components are styled in both apps

GIVEN a shared component in `packages/ui` uses utility classes
WHEN either app builds
THEN those classes are generated in that app's stylesheet.

#### Scenario: Supported browsers are documented

GIVEN the styling toolchain requires a minimum browser baseline
WHEN a contributor or product owner reviews frontend documentation
THEN the supported browser versions are stated
AND they match the styling toolchain's documented requirements.

#### Scenario: Upgrade preserves visual output

GIVEN the styling toolchain major is upgraded
WHEN the learner and admin scaffold screens are compared before and after
THEN colors, typography, spacing, borders, focus rings, and motion are visually unchanged, or the differences are listed and accepted in the change.
