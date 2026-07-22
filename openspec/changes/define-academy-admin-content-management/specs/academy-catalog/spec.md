## ADDED Requirements

### Requirement: Catalog Published Content Boundary
The catalog capability SHALL consume published catalog offerings from admin content management and SHALL NOT own content authoring, validation, preview, publication, or versioning.

#### Scenario: Catalog displays published offerings
GIVEN admin content management has published catalog offerings
WHEN catalog renders available offerings
THEN catalog displays published offering data according to learner access rules
AND does not display draft, in-review, archived, or unpublished content to normal learners.

#### Scenario: Catalog links to content version
GIVEN a learner opens a catalog offering
WHEN the offering starts a path, course, lesson, challenge, or Code Prompt
THEN catalog routes to the learner-facing destination using the published content identity or version needed by that destination.

#### Scenario: Catalog delegates authoring
GIVEN an admin needs to create, edit, preview, publish, unpublish, or archive an offering
WHEN the admin performs content operations
THEN those operations belong to academy-admin-content-management
AND catalog remains responsible only for learner-facing discovery, filtering, and navigation.
