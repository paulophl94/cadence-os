# Cadence OS — Architecture

Internal reference for contributors and maintainers. For user-facing docs, see `README.md` and `ONBOARDING.html`.

---

## System Layers

Cadence OS has three layers that share a common filesystem-based data model.

### 1. Rules Layer (`.cursor/rules/*.mdc`)

Rules define **what the AI knows and how it behaves**. They are loaded automatically by Cursor based on their `alwaysApply` and `globs` frontmatter settings.

**Always-on protocols (5 files):**

| Rule | Purpose | Token cost |
|------|---------|------------|
| `product-context.mdc` | Product identity, domains, triggers, context loading protocol | ~1,200 |
| `session-protocol.mdc` | Silent session start, staleness checks, workspace health score, MCP fallbacks | ~1,200 |
| `cadence-coach.mdc` | Core coaching: next steps, career insights, improvement capture, usage tracking | ~1,000 |
| `people-context.mdc` | Auto-inject person pages when names are detected | ~500 |
| `formatting-preferences.mdc` | No blockquotes, Mermaid theme rules | ~200 |

**Glob-scoped rules (3 files):**

| Rule | Globs | Purpose |
|------|-------|---------|
| `cadence-workflows.mdc` | `documents/**/*.md` | Document generation workflows + post-doc checklist |
| `todos.mdc` | `to_do's/**` | Task management: IDs, priorities, pillar alignment |
| `progress-tracker.mdc` | `cadence-progress.json` | Initiative lifecycle: phases, document tracking |

**On-demand rules:**
- 14 document templates (PRD, One-Pager, RICE, etc.)
- 6 reviewer personas (Engineer, Executive, User Researcher, etc.)
- `cadence-coach-ondemand.mdc` — Level Up and Skill Rating protocols
- `start.mdc` — Onboarding wizard + `/setup` re-onboard command
- `context-generator.mdc` — Wizard to populate `product-context.mdc`

### 2. Skills Layer (`.cursor/skills/`)

Skills are **multi-step workflow SOPs** — each `SKILL.md` is a self-contained runbook. Skills do NOT import each other; they compose through **shared filesystem artifacts** (briefings feed reviews, meeting notes feed person pages).

**Registry:** `.cursor/skills/registry.json` catalogs all skills with their inputs, outputs, triggers, and integrations.

| Skill | Category | Key outputs |
|-------|----------|-------------|
| `morning-briefing` | daily-workflow | `briefings/YYYY-MM-DD.md`, tasks update |
| `daily-review` | daily-workflow | `reviews/YYYY-MM-DD.md` |
| `weekly-review` | weekly-workflow | `weekly-reviews/YYYY-WXX.md`, week priorities update |
| `meeting-notes` | meetings | `MEETING-*.md`, person pages, commitments |
| `meeting-prep` | meetings | In-chat prep brief |
| `competitor-analysis` | analysis | `COMPETITIVE-*.md` |
| `metrics-analyzer` | analysis | `METRICS-*.md` |
| `atlassian-helper` | integrations | Jira/Confluence export |
| `career-review` | career | Career evidence analysis |
| `wiki` | knowledge | `wiki/product/**/*.md`, `wiki/INDEX.md` |
| `last30days` | knowledge | `wiki/syntheses/SYNTHESIS-YYYY-MM-DD.md` |

### 3. Webapp Layer (`webapp/`)

A **file-backed local dashboard** — React SPA + Express API reading/writing the same markdown and JSON files.

| Component | Technology | Port |
|-----------|------------|------|
| Frontend | React 19 + Vite + Tailwind | 3000 |
| Backend | Express 4 + gray-matter | 3002 |

The backend (`WorkspaceService`) reads/writes files under `WORKSPACE_PATH` (env var). No separate database is used for the core features.

---

## Data Model

All state lives in the filesystem. No external database required.

### File-Based State

| Path | Purpose | Written by |
|------|---------|------------|
| `to_do's/tasks.md` | Today's tasks with `^cd-` IDs | Skills, webapp |
| `to_do's/backlog.md` | Future tasks | Skills, webapp |
| `to_do's/commitments.md` | Tracked promises with `^cd-` IDs | Meeting notes skill |
| `to_do's/week-priorities.md` | Weekly Top 3 | Weekly review, onboarding |
| `to_do's/quarter-goals.md` | Quarter goals | Weekly review, onboarding |
| `to_do's/briefings/YYYY-MM-DD.md` | Daily briefings | Morning briefing skill |
| `to_do's/reviews/YYYY-MM-DD.md` | Daily reviews | Daily review skill |
| `to_do's/weekly-reviews/YYYY-WXX.md` | Weekly syntheses | Weekly review skill |
| `cadence-progress.json` | Initiative lifecycle index | Document generation workflows |
| `context/people/*.md` | Stakeholder pages | Meeting notes skill, onboarding |
| `documents/*.md` | Generated product documents | Document templates |
| `to_do's/learnings/usage-log.md` | Feature usage tracking | Coach protocol 4 |
| `to_do's/learnings/onboarding-state.json` | Onboarding progress | `/start` flow |
| `to_do's/toolkit-improvements.md` | Workflow improvement ideas | Coach protocol 3 |
| `wiki/INDEX.md` | Wiki entry catalog (IDs `W-MMDD-N`) | Wiki skill |
| `wiki/product/**/*.md` | Knowledge entries (decisions, hypotheses, learnings, signals, patterns) | Wiki skill, conversational capture |
| `wiki/syntheses/*.md` | Monthly knowledge syntheses | Last30days skill |
| `wiki/challenges/*.md` | Assumption challenge reports | Assumption challenger |

### Cross-File Linking

Tasks and commitments use `^cd-YYYYMMDD-NNN` IDs for traceability. When a task is marked complete, the ID is searched across `to_do's/`, `documents/`, and `context/people/` to update all references.

### JSON Schemas

Type definitions for `cadence-progress.json` and `onboarding-state.json` are in `webapp/backend/src/services/workspace.service.ts` as `CadenceProgressSchema` and `OnboardingStateSchema`.

---

## Data Flow

```
User request
    │
    ▼
Rules layer (always-on protocols load context silently)
    │
    ▼
Skills / Templates (multi-step workflows with explicit file I/O)
    │
    ├── Write: documents/*.md, to_do's/*.md, wiki/**/*.md
    ├── Update: cadence-progress.json
    └── Update: context/people/*.md
    │
    ▼
Webapp (reads filesystem via WorkspaceService, displays in browser)
```

**Composition pattern:** Skills compose through filesystem artifacts, not imports.
- Morning briefing **writes** `briefings/YYYY-MM-DD.md` → Daily review **reads** it
- Meeting notes **writes** person pages → Meeting prep **reads** them
- Document templates **update** `cadence-progress.json` → Session protocol **reads** it for staleness
- Meeting notes / daily review / conversational capture **write** wiki entries → Assumption challenger **reads** and challenges
- Wiki entries **inform** morning briefing (Wiki Pulse) and weekly review (Knowledge Health)

---

## Design Decisions

1. **Markdown-first**: All state is human-readable. No vendor lock-in, no proprietary formats.
2. **Convention over configuration**: Fixed paths (`to_do's/`, `documents/`, `context/`) — skills know where to read/write.
3. **Always-on rules are minimal**: Only 5 rules load on every conversation to keep the context window lean.
4. **Skills are SOPs, not code**: Each `SKILL.md` is instructions for the AI, not executable code.
5. **Webapp is a view layer**: The webapp reads the same files the AI writes — it's a dashboard, not the source of truth.
6. **Graceful degradation**: When MCPs or integrations fail, the system falls back to manual paste or local markdown.

---

## Adding New Capabilities

### New document template

1. Create `.cursor/rules/[template-name].mdc` with `alwaysApply: false`
2. Add to the Document Templates table in `CLAUDE.md`
3. Add a row to `COMMANDS.md`
4. Include the output type in `COMMANDS.md` File Naming Convention

### New skill

1. Create `.cursor/skills/[skill-name]/SKILL.md`
2. Add entry to `.cursor/skills/registry.json`
3. Add trigger phrases to `product-context.mdc` Natural Language Triggers table
4. Add commands to `COMMANDS.md`

### New reviewer

1. Create `.cursor/rules/reviewers/[reviewer].mdc`
2. Add to the Reviewers table in `CLAUDE.md`
3. Add to `COMMANDS.md` Reviews section
