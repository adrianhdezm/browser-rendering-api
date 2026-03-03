# Commit Message Guidelines

Begin each commit message with a header in the exact format:

```
<type>(<scope?>): <gitmoji> <summary>
```

- **`<type>`** must be one of: `feat`, `refactor`, `fix`, `docs`, `test`, or `chore`.
- **`<scope>`** is optional; if used, place a lowercase word (e.g., `auth`, `ui`) in parentheses.
- After the colon and a space, include a single **gitmoji** (e.g., ✨, 🐛, 📝).
- Follow the emoji with a brief **summary** in imperative mood (e.g., “Add”, “Fix”), no more than 72 characters, and do **not** end with a period.

- (Optional) Add a body after a blank line.
  - Use short bullet points (each starting with “–”) to explain **what** changed and **why**.
  - Wrap lines at around 80 characters for readability.

- (Optional) Add a footer on its own line for issue references or breaking changes.
  - For example: `Closes #123` or `BREAKING CHANGE: <description>`.
  - If you reference multiple issues, separate them with commas (e.g., `Fixes #45, #46`).

- Choose a gitmoji that matches the `<type>`:
  - **feat** (new feature): ✨
  - **refactor** (code restructuring): ♻️
  - **fix** (bug fix): 🐛
  - **docs** (documentation only): 📝
  - **test** (adding/updating tests): ✅
  - **chore** (maintenance, tooling, dependencies): 🔧

- Verify before committing:
  - Header summary is ≤ 72 characters and has no trailing period.
  - Summary uses imperative mood.
  - Body (if present) and footer each start on a new line separated by a blank line.
