# Academy Catalog Specification

## Purpose

Define the Presstronic Academy mission catalog experience.

This specification captures catalog browsing, search, type filtering, track filtering, enrollment state, offering status behavior, async loading and failure states, empty results, toast feedback, URL-addressable view state, and navigation affordances. It does not specify backend storage schemas or search-index implementation details.

## Requirements

### Requirement: Catalog Shell Context
WHERE the catalog screen is displayed,
the system SHALL render the catalog inside the in-app Academy shell.

#### Scenario: Catalog uses app shell
GIVEN the current screen is `catalog`
WHEN the application renders
THEN the catalog content is displayed inside the app shell
AND the sidebar is displayed
AND the in-app top bar is displayed.

#### Scenario: Catalog heading
GIVEN the catalog screen is displayed
WHEN the page heading renders
THEN the system displays the section label `// MISSION CATALOG`
AND displays the heading `Choose your next assignment.`

#### Scenario: Open dashboard action
GIVEN the catalog screen is displayed
WHEN the user activates `Open dashboard`
THEN the system navigates to the dashboard screen.

### Requirement: Catalog Offering Types
WHERE the catalog displays offerings,
the system SHALL distinguish story paths, tracks, and challenges with type-specific labels and iconography.

#### Scenario: Story offering
GIVEN a catalog offering has type `story`
WHEN the offering card renders
THEN the system labels it `Story path`
AND displays story-path styling.

#### Scenario: Track offering
GIVEN a catalog offering has type `track`
WHEN the offering card renders
THEN the system labels it `Track`
AND displays track styling.

#### Scenario: Challenge offering
GIVEN a catalog offering has type `challenge`
WHEN the offering card renders
THEN the system labels it `Challenge`
AND displays challenge styling.

### Requirement: Catalog Search
WHEN the user enters search text in the catalog search input,
the system SHALL filter offerings by title, blurb, track, and tags using case-insensitive matching.

#### Scenario: Search by title
GIVEN the catalog contains `The Broken Pipeline`
WHEN the user searches for `broken`
THEN the results include `The Broken Pipeline`.

#### Scenario: Search by tag
GIVEN the catalog contains offerings tagged `PostgreSQL`
WHEN the user searches for `postgresql`
THEN the results include offerings with the PostgreSQL tag.

#### Scenario: Case-insensitive search
GIVEN the catalog contains an offering in the Backend engineering track
WHEN the user searches for `BACKEND`
THEN the results include Backend engineering offerings.

#### Scenario: Search ignores surrounding whitespace
GIVEN the catalog contains `Dead-letter Queues`
WHEN the user searches for `  dead-letter  `
THEN the results include `Dead-letter Queues`.

#### Scenario: Search query reflected in URL
GIVEN the catalog screen is displayed
WHEN the user searches for `redis`
THEN the URL query parameter `q` is set to `redis`
AND reloading the page restores the same search.

### Requirement: Catalog Type Tabs
WHERE the catalog screen is displayed,
the system SHALL provide tabs for All, Story paths, Tracks, and Challenges.

#### Scenario: Default type filter
GIVEN the catalog screen initializes
WHEN no type tab has been selected
THEN the All tab is active
AND offerings of every type are eligible for display.

#### Scenario: Story path tab
GIVEN the catalog screen is displayed
WHEN the user activates the Story paths tab
THEN the system displays only story offerings that also match the active search and track filters.

#### Scenario: Track tab
GIVEN the catalog screen is displayed
WHEN the user activates the Tracks tab
THEN the system displays only track offerings that also match the active search and track filters.

#### Scenario: Challenge tab
GIVEN the catalog screen is displayed
WHEN the user activates the Challenges tab
THEN the system displays only challenge offerings that also match the active search and track filters.

#### Scenario: Type tab reflected in URL
GIVEN the catalog screen is displayed
WHEN the user activates the Challenges tab
THEN the URL query parameter `type` is set to `challenge`
AND reloading the page restores the Challenges tab.

### Requirement: Catalog Track Filters
WHERE the catalog screen is displayed,
the system SHALL provide toggles for Backend engineering, Frontend engineering, and Security tracks.

#### Scenario: No track filters selected
GIVEN no track filters are selected
WHEN the catalog calculates results
THEN offerings from all tracks are eligible for display.

#### Scenario: Select one track
GIVEN no track filters are selected
WHEN the user activates the Backend engineering filter
THEN the system includes Backend engineering offerings
AND excludes offerings from other tracks unless another track filter is selected.

#### Scenario: Select multiple tracks
GIVEN the Backend engineering filter is selected
WHEN the user activates the Security filter
THEN the system includes Backend engineering offerings
AND includes Security offerings
AND excludes Frontend engineering offerings.

#### Scenario: Deselect track
GIVEN the Backend engineering filter is selected
WHEN the user activates the Backend engineering filter again
THEN the system removes Backend engineering from the active track filters.

#### Scenario: Track filters reflected in URL
GIVEN the catalog screen is displayed
WHEN the user selects Backend engineering and Security track filters
THEN the URL query parameter `tracks` represents both selected tracks
AND reloading the page restores both selected track filters.

### Requirement: Combined Catalog Filtering
WHEN search text, type filters, and track filters are active together,
the system SHALL display only offerings that satisfy all active filters.

#### Scenario: Search and type filter combine
GIVEN the user searches for `queue`
AND the Challenges tab is active
WHEN the catalog calculates results
THEN the system displays matching challenge offerings only.

#### Scenario: Search and track filter combine
GIVEN the user searches for `PostgreSQL`
AND the Security track filter is active
WHEN the catalog calculates results
THEN the system displays only Security offerings that match PostgreSQL in title, blurb, track, or tags.

#### Scenario: Result count reflects filters
GIVEN catalog filters are active
WHEN the results are calculated
THEN the system displays the count of offerings currently matching all active filters.

### Requirement: Catalog Offering Cards
WHEN the catalog displays a matching offering,
the system SHALL show core offering metadata and a status-aware action.

#### Scenario: Offering metadata
GIVEN an offering appears in catalog results
WHEN its card renders
THEN the system displays its type label
AND displays its title
AND displays its blurb
AND displays its tags
AND displays its clearance level
AND displays its duration
AND displays its XP value
AND displays its track.

#### Scenario: In-progress status
GIVEN an offering has status `progress`
WHEN its card renders
THEN the system displays an `In progress` badge
AND displays a `Resume` action.

#### Scenario: Completed status
GIVEN an offering has status `completed`
WHEN its card renders
THEN the system displays a `Completed` badge
AND displays a `Review` action.

#### Scenario: Locked status
GIVEN an offering has status `locked`
WHEN its card renders
THEN the system displays a `Locked` badge
AND visually de-emphasizes the card
AND displays a disabled clearance action.

#### Scenario: New not-enrolled status
GIVEN an offering has status `new`
AND the offering is not in the learner's persisted enrolled offering list
WHEN its card renders
THEN the system displays an `Enroll` action.

#### Scenario: New enrolled status
GIVEN an offering has status `new`
AND the offering is in the learner's persisted enrolled offering list
WHEN its card renders
THEN the system displays a `Start now` action.

### Requirement: Catalog Initial Enrollment State
WHEN the catalog screen initializes,
the system SHALL derive enrollment state from the learner's persisted enrollments and offering progress records.

#### Scenario: Progress offering initially enrolled
GIVEN an offering has status `progress`
WHEN the catalog screen initializes
THEN the offering is included in the learner's enrolled offering list.

#### Scenario: Completed offering initially enrolled
GIVEN an offering has status `completed`
WHEN the catalog screen initializes
THEN the offering is included in the learner's enrolled offering list.

#### Scenario: New offering initially not enrolled
GIVEN an offering has status `new`
WHEN the catalog screen initializes
THEN the offering is not included in the learner's enrolled offering list.

### Requirement: Catalog Offering Actions
WHEN the user activates a catalog offering action,
the system SHALL perform navigation or persisted enrollment behavior appropriate to that offering state.

#### Scenario: Resume offering
GIVEN an offering has status `progress`
WHEN the user activates `Resume`
THEN the system navigates to the story screen.

#### Scenario: Review completed challenge
GIVEN an offering has status `completed`
WHEN the user activates `Review`
THEN the system navigates to the lesson screen.

#### Scenario: Enroll in new offering
GIVEN an offering has status `new`
AND the offering is not in the learner's persisted enrolled offering list
WHEN the user activates `Enroll`
THEN the system submits an enrollment request
AND, when the request succeeds, updates the offering as enrolled
AND displays a toast stating it was added to the user's file.

#### Scenario: Start enrolled offering
GIVEN an offering has status `new`
AND the offering is in the learner's persisted enrolled offering list
WHEN the user activates `Start now`
THEN the system navigates to the story screen.

#### Scenario: Locked action disabled
GIVEN an offering has status `locked`
WHEN the user views the offering action
THEN the action is disabled
AND activating it does not navigate.

### Requirement: Catalog Toast Feedback
WHEN the catalog displays enrollment feedback,
the system SHALL present a temporary status toast.

#### Scenario: Added toast
GIVEN the user enrolls in a new offering
WHEN enrollment succeeds
THEN the system displays a toast message beginning with `Added to your file`.

#### Scenario: Removed toast
GIVEN an offering is in the learner's persisted enrolled offering list
WHEN the offering is removed from the enrolled offering list by a catalog enrollment toggle
THEN the system displays a toast message beginning with `Removed`.

#### Scenario: Toast auto-dismiss
GIVEN a catalog toast is displayed
WHEN 2400 milliseconds pass
THEN the system hides the toast.

### Requirement: Catalog Empty Results
WHEN the active filters match no offerings,
the system SHALL display an empty-results state and provide a reset action.

#### Scenario: No matching results
GIVEN the active search, type, and track filters match no catalog offerings
WHEN the catalog renders results
THEN the system displays `No offerings match those filters.`
AND displays a reset filters action.

#### Scenario: Reset filters
GIVEN the empty-results state is displayed
WHEN the user activates `Reset filters`
THEN the system clears the search text
AND sets the type filter to All
AND clears all selected track filters.

### Requirement: Catalog Data Source
WHERE the catalog renders offerings,
the system SHALL derive catalog entries from the authoritative Academy catalog data source.

#### Scenario: Offering fields
GIVEN the catalog screen is displayed
WHEN offering cards render
THEN the system reads each offering's id, type, title, track, blurb, tags, clearance, duration, XP, and status from catalog data.

#### Scenario: Track filters
GIVEN the catalog screen is displayed
WHEN track filters render
THEN the system reads the available track filter labels from catalog data.

### Requirement: Catalog Request State
WHEN the catalog retrieves, filters, or mutates catalog data,
the system SHALL expose loading, failure, and retry states without losing the current URL-addressable filter state.

#### Scenario: Catalog loading
GIVEN the catalog screen is displayed
AND catalog data has not loaded
WHEN the catalog content renders
THEN the system displays a loading state
AND keeps search, type, and track controls available when their current values are known.

#### Scenario: Catalog load failure
GIVEN catalog data cannot be loaded
WHEN the catalog screen renders
THEN the system displays an error state
AND provides a retry action
AND preserves the current search, type, and track filters in the URL.

#### Scenario: Enrollment pending
GIVEN an offering is available for enrollment
WHEN the user activates `Enroll`
THEN the system disables duplicate enrollment actions for that offering
AND displays pending feedback until the request completes.

#### Scenario: Enrollment failure
GIVEN the user activates `Enroll`
WHEN the enrollment request fails
THEN the system leaves the offering unenrolled
AND displays an error with a retry path
AND does not display `Start now`.

### Requirement: Catalog Scale Behavior
WHERE the catalog contains more offerings than can be comfortably displayed at once,
the system SHALL support incremental browsing without breaking filtering, counts, or keyboard navigation.

#### Scenario: Paginated or incremental results
GIVEN the active filters match more offerings than the initial page size
WHEN catalog results render
THEN the system displays the first result set
AND provides a way to reach additional matching results.

#### Scenario: Result order
GIVEN catalog results are displayed
WHEN the system orders offerings
THEN in-progress and enrolled offerings are prioritized before new offerings
AND locked offerings remain visible but de-emphasized unless filtered out by active filters.

### Requirement: Catalog Persistence and Access Boundary
WHERE the catalog is used in production,
the system SHALL persist learner enrollment changes, retrieve catalog data from the catalog service, and enforce clearance access consistently with the learner's account state.

#### Scenario: Enrollment is persisted
GIVEN the user enrolls in a catalog offering
WHEN enrollment succeeds
THEN the system persists the enrollment to the learner record
AND updates the catalog screen state.

#### Scenario: Search uses catalog source of truth
GIVEN the user enters search text
WHEN the catalog filters results
THEN the system returns results from the authoritative catalog data source
AND keeps search, type, and track filters consistent with the URL.

#### Scenario: Locked clearance is enforced
GIVEN an offering requires a higher clearance level
WHEN the learner attempts to access the offering
THEN the system prevents access
AND explains the required clearance level.

### Requirement: Catalog Responsibility Boundary
The catalog capability SHALL own offering discovery, filters, offering cards, catalog request state, catalog enrollment actions, and access-state display while delegating entitlement authority, story progression, and lesson execution to their owning capabilities.

#### Scenario: Catalog displays entitlement results
- **GIVEN** an offering requires paid access or clearance
- **WHEN** the catalog renders the offering
- **THEN** catalog displays the locked or available state
- **AND** billing-access and progression remain authoritative for entitlement and clearance rules.

#### Scenario: Catalog starts but does not own story progress
- **GIVEN** a learner starts or resumes a story offering from catalog
- **WHEN** navigation begins
- **THEN** catalog initiates the route
- **AND** academy-story owns checkpoints, branch state, and story progression.

#### Scenario: Catalog starts but does not own lesson execution
- **GIVEN** a learner opens a challenge offering from catalog
- **WHEN** navigation begins
- **THEN** catalog initiates the route
- **AND** academy-lesson-challenge owns test execution, draft safety, and sandbox behavior.
