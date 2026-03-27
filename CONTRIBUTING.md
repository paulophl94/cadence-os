# Contributing to Cadence OS

Thanks for your interest in improving Cadence OS. This guide covers the main ways to contribute.

**Before contributing**, read `ARCHITECTURE.md` to understand the system layers, data model, and design decisions.

## Ways to Contribute

### 1. New Document Templates

Create a new `.mdc` file in `.cursor/rules/` following the pattern of existing templates:

- `description` field in frontmatter (one-line summary)
- `alwaysApply: false` (templates are invoked on demand)
- Clear "When to Use" section
- Generation process with step-by-step instructions
- Template with markdown code block showing the output structure
- Quality checklist
- File naming convention: `[TYPE]-[description]-[YYYY-MM-DD].md`

**Especially welcome:** Architecture Decision Records (ADR), Post-Mortems, Sprint Retrospectives, A/B Test Plans, Go-to-Market Plans.

### 2. New Reviewer Personas

Add a new `.mdc` file in `.cursor/rules/reviewers/`:

- Define the persona (role, seniority, perspective)
- List what this reviewer focuses on
- Provide a structured review format (strengths, concerns, recommendations)
- Include severity levels for feedback

**Especially welcome:** Designer, Legal/Compliance, Sales/GTM, Security.

### 3. New Skills

Create a new folder in `.cursor/skills/` with a `SKILL.md` file:

- Clear trigger commands
- Step-by-step instructions the AI follows
- Error handling for unavailable data sources
- Output format and save location

### 4. New Frameworks

Add a markdown file to `frameworks/` and update `frameworks/README.md`.

### 5. Bug Fixes & Improvements

- Fix broken references between files
- Improve template quality based on real-world usage
- Add missing edge cases to templates
- Improve documentation clarity

## How to Submit

1. Fork the repo
2. Create a branch: `git checkout -b feature/my-improvement`
3. Make your changes
4. Test by opening the folder in Cursor and running the relevant commands
5. Submit a Pull Request with:
   - What you changed and why
   - How you tested it (which commands you ran)

## Guidelines

- **Language:** All templates, rules, and documentation should be in English
- **Formatting:** Follow `.cursor/rules/formatting-preferences.mdc` (no blockquotes, neutral Mermaid themes, no explicit colors)
- **Keep it PM-focused:** This toolkit is for Product Managers. Templates and skills should reflect PM workflows
- **Test before submitting:** Open the project in Cursor and verify the AI interprets your template correctly
- **One change per PR:** Easier to review and merge

## Questions?

Open a [GitHub Issue](https://github.com/paulophl94/cadence-os/issues) or start a [Discussion](https://github.com/paulophl94/cadence-os/discussions).
