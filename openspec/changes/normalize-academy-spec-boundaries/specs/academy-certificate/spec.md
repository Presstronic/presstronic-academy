## ADDED Requirements

### Requirement: Certificate Responsibility Boundary
The certificate capability SHALL own completion-record presentation, certificate metadata, sharing actions, PDF generation expectations, external verification, record access, and verification privacy while delegating progression award rules to progression.

#### Scenario: Certificate uses progression-derived records
- **GIVEN** a learner opens a certificate or completion record
- **WHEN** the record is displayed
- **THEN** academy-certificate owns certificate presentation and verification behavior
- **AND** academy-progression remains authoritative for whether the completion was earned.

#### Scenario: Certificate share actions stay certificate-owned
- **GIVEN** the learner shares, downloads, or opens a credential-network action
- **WHEN** the action executes
- **THEN** academy-certificate owns the status, metadata, and failure behavior.

#### Scenario: Public verification avoids exposing private progression data
- **GIVEN** a public verification URL is opened
- **WHEN** certificate data is displayed
- **THEN** academy-certificate owns the public/private data boundary
- **AND** does not expose unrelated learner progression details.
