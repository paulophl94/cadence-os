# CLAUDE.md — Cadence OS

AI-powered operating system for product teams.

**docs-version:** 1.1.0

---

## Architecture

**Cursor** auto-loads `.cursor/rules/*.mdc` (with `alwaysApply: true`) — those files are the canonical source of truth for all protocols. This file exists as a lean reference and entry point for editors that don't support `.mdc` (e.g., Claude Code).

**If your editor loaded this file but NOT the `.mdc` rules**, read these files at session start to get full protocol definitions:

| Protocol | Source file |
|---|---|
| Session Protocol | `.cursor/rules/session-protocol.mdc` |
| Product Context | `.cursor/rules/product-context.mdc` |
| Coach (core) | `.cursor/rules/cadence-coach.mdc` |
| Coach (on-demand: level up, ratings) | `.cursor/rules/cadence-coach-ondemand.mdc` |
| People Context | `.cursor/rules/people-context.mdc` |
| Company Context | `.cursor/rules/company-context.mdc` |
| Conversational Capture | `.cursor/rules/conversational-capture.mdc` |
| Formatting Preferences | `.cursor/rules/formatting-preferences.mdc` |

---

## Workspace Map

```
cadence-os/
├── .cursor/rules/            # AI rules and document templates (canonical protocols)
├── .cursor/skills/           # Detailed workflows (briefing, meeting notes, meeting prep, reviews)
│   ├── atlassian-helper/
│   ├── career-review/
│   ├── competitor-analysis/
│   ├── daily-review/
│   ├── meeting-notes/
│   ├── meeting-prep/
│   ├── metrics-analyzer/
│   ├── morning-briefing/
│   └── weekly-review/
├── context/
│   ├── people/               # Person pages for stakeholders
│   ├── companies/            # Company pages for organization-level tracking
│   ├── USERS.md              # User personas
│   └── TERMINOLOGY.md        # Product terminology
├── documents/                # Generated documents output
├── frameworks/               # Strategy frameworks (Rumelt, DHM, SWOT, etc.)
├── global-context/           # Product strategy, vision, KPIs (create per domain)
│   ├── shared/               # Pillars, assumptions, glossary, invariants
│   └── {domain}/             # DOMAIN-VISION, KPIS, ROADMAP, ARCHITECTURE
├── prd-instructions/         # Alternative PRD templates
├── webapp/                   # Web dashboard (Briefing, Tasks, Commitments, Initiatives, People)
│   ├── frontend/             # React + Vite (port 3000)
│   └── backend/              # Express API (port 3002)
└── to_do's/                  # Tasks, briefings, reviews, learnings
    ├── tasks.md              # Today's tasks (Today's Three) with ^cd- IDs
    ├── week-priorities.md    # Top 3 for the week
    ├── commitments.md        # Tracked promises with ^cd- IDs
    ├── quarter-goals.md      # Quarter goals
    ├── toolkit-improvements.md # Ranked improvement ideas with impact/effort
    ├── briefings/            # Daily morning briefings
    ├── reviews/              # Daily reviews
    ├── weekly-reviews/       # Weekly syntheses
    └── learnings/            # Preferences, patterns, skill ratings, usage-log
```

---

## Document Templates

When the user requests a document, read the relevant template before generating:

| Document | Template |
|----------|----------|
| PRD (Lean) | `.cursor/rules/lean-prd-template.mdc` |
| PRD (Full) | `.cursor/rules/prd-template.mdc` |
| One-Pager | `.cursor/rules/one-pager-template.mdc` |
| Requirements Spec | `.cursor/rules/cadence-workflows.mdc` (Workflow 2) |
| User Stories | `.cursor/rules/user-story-template.mdc` |
| RICE Analysis | `.cursor/rules/rice-analysis.mdc` |
| Risk Analysis | `.cursor/rules/risk-analysis.mdc` |
| Lean Canvas | `.cursor/rules/lean-canvas.mdc` |
| Roadmap | `.cursor/rules/roadmap-template.mdc` |
| Epic Plan | `.cursor/rules/epic-generator.mdc` |
| KPI-Revenue | `.cursor/rules/kpi-revenue.mdc` |
| Status Update | `.cursor/rules/status-update-template.mdc` |
| Personas | `.cursor/rules/persona-template.mdc` |
| Positioning | `.cursor/rules/product-positioning.mdc` |
| User Journey | `.cursor/rules/user-journey.mdc` |

Output naming: `documents/[TYPE]-[description]-[YYYY-MM-DD].md`

### Multi-Perspective Reviewers

| Reviewer | Rule file |
|----------|-----------|
| User Researcher | `.cursor/rules/reviewers/user-researcher.mdc` |
| Engineer | `.cursor/rules/reviewers/engineer.mdc` |
| Executive | `.cursor/rules/reviewers/executive.mdc` |
| Customer | `.cursor/rules/reviewers/customer.mdc` |
| Customer Success | `.cursor/rules/reviewers/customer-success.mdc` |
| Data Analyst | `.cursor/rules/reviewers/data-analyst.mdc` |

---

## Safety & Scope

- **Markdown only.** Don't generate code unless explicitly asked.
- **Never delete files** without confirmation.
- **Git safety:** Never commit/push without approval. Never force push.
- **Secrets:** Never include API keys, tokens, or credentials in files.
- **Scope control:** Only modify what was requested. If you notice improvements, mention but don't implement without asking.

---

## Editor Compatibility

This system works with any AI coding assistant:
- **Cursor** — full experience via `.cursor/rules/*.mdc` (auto-loaded) + `.cursor/skills/`. This file is loaded but kept lean to avoid duplication.
- **Claude Code** — reads this file automatically, then follows the Architecture table above to load protocol files.
- **Other editors** — load this file as system context; it will instruct the AI to read the protocol source files.

Canonical protocols live in `.cursor/rules/`. Templates and detailed workflows live in `.cursor/rules/` and `.cursor/skills/`.
