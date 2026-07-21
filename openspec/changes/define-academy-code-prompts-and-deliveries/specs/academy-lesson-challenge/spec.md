## ADDED Requirements

### Requirement: Lesson Challenge Code Prompt Boundary
The lesson challenge capability SHALL own focused lesson-level coding challenges and SHALL delegate project-style prompt work to the Code Prompts and Deliveries capability.

#### Scenario: Focused challenge remains lesson-owned
GIVEN a learner works on a lesson challenge
WHEN the activity evaluates a focused exercise, code pane, acceptance checklist, test run, draft, or mentor interaction local to the lesson
THEN academy-lesson-challenge owns the challenge behavior.

#### Scenario: Project-style prompt delegates
GIVEN a learner activity requires a mission brief, starter project, Delivery checklist, implementation notes, broad evidence, review report, or revision lifecycle
WHEN the activity is presented from a lesson or path
THEN academy-lesson-challenge delegates that activity to academy-code-prompts-deliveries.

#### Scenario: Lesson can link to prompt
GIVEN a lesson introduces a Code Prompt
WHEN the learner activates the prompt entry point
THEN the lesson challenge surface may navigate to or embed the Code Prompt entry point
AND does not own prompt workspace, Delivery evaluation, or review report behavior.
