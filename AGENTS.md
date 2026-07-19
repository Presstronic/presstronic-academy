# Agent Instructions

These instructions apply to all agent work in this repository.

## Engineering Standards

- Treat code and documentation as production-quality work, even when the app is still pre-production.
- Prefer maintainable, idiomatic solutions over quick local hacks.
- Follow the conventions already present in the relevant part of the codebase.
- Keep changes scoped to the requested task unless broader changes are required to complete it safely and only after you have gotten approval.

## Verification

- Run the relevant lint, test, typecheck, or build command before finalizing work when such commands are available.
- If verification cannot be run, clearly state what was not run and why.

## Attribution

- Do not add AI, assistant, Claude, Codex, or tool attribution in source files, comments, documentation, commit messages, or generated project artifacts unless explicitly requested.

## Permissions

- **Reading project files**: You may read any file inside the `presstronic-academy/` project directory without asking permission.
- **Reading outside the project**: You must ask permission every time. If granted, you may only access the specific file(s) you were given permission for. Permission does not carry over — ask again each time.
- **Creating or modifying files**: Always ask permission first. When multiple files need changes, batch them into a single request so you don't stop repeatedly.
- **Executing commands**: Always ask permission before running commands that modify state (e.g., `git push`, `npm install`, database operations). Read-only commands (e.g., `ls`, `find`, `git status`) may be run freely inside the project.

## Communication

- When asking the user to take an action, briefly explain what you are asking them to do and why it is needed.
- Keep status updates concise and focused on what changed, what was verified, and what remains.
