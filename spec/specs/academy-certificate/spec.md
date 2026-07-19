# Academy Certificate Specification

## Purpose

Define the Presstronic Academy certificate and completion-record experience.

This specification captures the completion record presentation, learner and path details, completion statistics, verification metadata, sharing, PDF download, LinkedIn export, next-mission prompt, and status feedback. It does not specify external credential-network implementation details.

## Requirements

### Requirement: Certificate Shell Context
WHERE the certificate screen is displayed,
the system SHALL render the certificate view inside the in-app Academy shell.

#### Scenario: Certificate uses app shell
GIVEN the current screen is `certificate`
WHEN the application renders
THEN the certificate content is displayed inside the app shell
AND the sidebar is displayed
AND the in-app top bar is displayed.

### Requirement: Completion Record Presentation
WHEN the certificate screen renders the completion record,
the system SHALL display a branded Presstronic Academy completion certificate.

#### Scenario: Certificate brand
GIVEN the certificate screen is displayed
WHEN the completion record renders
THEN the system displays Presstronic Academy branding
AND identifies the document as a completion record.

#### Scenario: Certificate learner identity
GIVEN the completion record is displayed
WHEN the learner identity block renders
THEN the system displays the learner name
AND displays the learner callsign.

#### Scenario: Certificate path identity
GIVEN the completion record is displayed
WHEN the path completion block renders
THEN the system displays the completed story path name
AND displays the authored completion summary for that path.

### Requirement: Completion Statistics
WHERE the completion record is displayed,
the system SHALL show completion statistics for XP earned, challenges, decisions, and clearance.

#### Scenario: Completion stats visible
GIVEN the completion record is displayed
WHEN the stats row renders
THEN the system displays XP earned for the completed path
AND displays completed challenge count against total challenges
AND displays completed decision count against total required decisions
AND displays the learner's clearance at completion.

### Requirement: Verification Metadata
WHERE the completion record is displayed,
the system SHALL show issue date, record id, verification status, and verification URL.

#### Scenario: Issue metadata
GIVEN the completion record is displayed
WHEN the metadata row renders
THEN the system displays the persisted issue date
AND displays the persisted record id.

#### Scenario: Verification metadata
GIVEN the completion record is displayed
WHEN the verification block renders
THEN the system displays a verifiable status
AND displays the persisted verification URL.

### Requirement: Certificate Share Actions
WHERE the certificate screen is displayed,
the system SHALL provide actions to copy a share link, download a PDF, and add the certificate to LinkedIn.

#### Scenario: Share link action visible
GIVEN the certificate screen is displayed
WHEN certificate actions render
THEN the system displays a `Copy share link` action.

#### Scenario: Download PDF action visible
GIVEN the certificate screen is displayed
WHEN certificate actions render
THEN the system displays a `Download PDF` action.

#### Scenario: LinkedIn action visible
GIVEN the certificate screen is displayed
WHEN certificate actions render
THEN the system displays an `Add to LinkedIn` action.

### Requirement: Copy Share Link Feedback
WHEN the user activates the copy share link action,
the system SHALL attempt to copy the verification URL to the clipboard and display local toast feedback.

#### Scenario: Copy share link
GIVEN the certificate screen is displayed
WHEN the user activates `Copy share link`
THEN the system attempts to copy the certificate verification URL to the clipboard
AND displays a toast message containing the copied share URL.

#### Scenario: Clipboard failure
GIVEN the certificate screen is displayed
AND clipboard access is unavailable
WHEN the user activates `Copy share link`
THEN the system displays a clipboard error
AND presents the verification URL in a selectable field.

### Requirement: Certificate Action Feedback
WHEN the user activates non-copy certificate actions,
the system SHALL display status feedback for the requested certificate action.

#### Scenario: Download PDF feedback
GIVEN the certificate screen is displayed
WHEN the user activates `Download PDF`
THEN the system displays a pending state stating it is preparing the PDF for the current completion record.

#### Scenario: LinkedIn feedback
GIVEN the certificate screen is displayed
WHEN the user activates `Add to LinkedIn`
THEN the system displays a toast stating it is opening the LinkedIn certification form.

#### Scenario: Toast auto-dismiss
GIVEN a certificate toast is displayed
WHEN 2400 milliseconds pass
THEN the system hides the toast.

### Requirement: Next Mission Prompt
WHERE the certificate screen is displayed,
the system SHALL show a prompt toward the learner's next mission and clearance review.

#### Scenario: Next mission copy
GIVEN the certificate screen is displayed
WHEN the next mission prompt renders
THEN the system displays the learner's remaining XP or requirements for the next clearance review
AND references the configured recommended next mission.

#### Scenario: Next mission navigation
GIVEN the certificate screen is displayed
WHEN the user activates `Next mission`
THEN the system navigates to the catalog screen.

### Requirement: Certificate Data Source
WHERE the certificate screen renders completion-record content,
the system SHALL derive learner identity and completion-record details from persisted learner and certificate data.

#### Scenario: Learner fields
GIVEN the certificate screen is displayed
WHEN the learner identity block renders
THEN the system reads learner name and callsign from the learner account.

#### Scenario: Record fields
GIVEN the certificate screen is displayed
WHEN record details render
THEN the system uses the persisted record id, path name, issue date, stats, verification URL, and next-mission prompt.

### Requirement: Certificate Issuance and Verification
WHERE the certificate screen handles completion records,
the system SHALL issue persistent completion records, support verification, generate exports, and record learner sharing actions where appropriate.

#### Scenario: Copy records share event
GIVEN the user activates `Copy share link`
WHEN the toast is displayed
THEN the system records a share-link event for the learner when analytics consent permits.

#### Scenario: PDF is generated
GIVEN the user activates `Download PDF`
WHEN the PDF toast is displayed
THEN the system generates or retrieves a certificate PDF
AND starts the download.

#### Scenario: PDF generation failure
GIVEN the user activates `Download PDF`
WHEN the PDF cannot be generated or retrieved
THEN the system displays a retryable PDF error
AND does not claim the download started.

#### Scenario: LinkedIn is opened
GIVEN the user activates `Add to LinkedIn`
WHEN the LinkedIn toast is displayed
THEN the system opens the LinkedIn certification flow with certificate metadata.

#### Scenario: Verification is external
GIVEN the completion record displays a verification URL
WHEN the certificate screen renders
THEN the verification URL resolves to a public verification page for the completion record.

### Requirement: Certificate Access and Verification Privacy
WHERE a completion record is displayed or verified,
the system SHALL enforce ownership for private certificate screens and expose only approved verification data publicly.

#### Scenario: Certificate not found
GIVEN the requested completion record does not exist
WHEN the certificate screen renders
THEN the system displays a not-found state
AND does not expose learner data.

#### Scenario: Certificate not owned
GIVEN an authenticated learner requests a completion record that belongs to another learner
WHEN the certificate screen renders
THEN the system denies access
AND displays an authorization error.

#### Scenario: Revoked certificate
GIVEN a completion record has been revoked
WHEN the certificate or public verification page renders
THEN the system displays revoked status
AND does not present the record as valid.

#### Scenario: Public verification data
GIVEN a public verification page is opened
WHEN the completion record is valid
THEN the system displays only approved public fields
AND does not expose private learner profile, billing, challenge submissions, or story decision details.
