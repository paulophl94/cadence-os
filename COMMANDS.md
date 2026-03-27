# Cadence OS - Command Reference

Complete reference of all available commands.

---

## Document Generation

### PRD & Requirements

| Command | Description | Output |
|---------|-------------|--------|
| "Create PRD for [feature]" | Lean PRD (6 sections, default) or Full PRD (15 sections) | `PRD-[feature]-[date].md` |
| "Generate One-Pager for [feature]" | Strategic document | `ONE-PAGER-[feature]-[date].md` |
| "Generate Spec for [feature]" | Detailed requirements | `SPEC-[feature]-[date].md` |
| "Write user stories for [feature]" | Stories + acceptance criteria | `USER-STORIES-[feature]-[date].md` |

### Research & Discovery

| Command | Description | Output |
|---------|-------------|--------|
| "Process research input about [topic]" | Synthesize research data | `RESEARCH-INPUT-[topic]-[date].md` |
| "Document existing feature [name]" | Feature documentation | `DOC-[feature]-[date].md` |

### Strategy & Planning

| Command | Description | Output |
|---------|-------------|--------|
| "Create roadmap for [period]" | Quarterly roadmap | `ROADMAP-[period]-[date].md` |
| "Create Lean Canvas for [product]" | 9-section canvas | `LEAN-CANVAS-[product]-[date].md` |
| "Create personas for [segment]" | Ideal + Skeptical personas | `PERSONAS-[segment]-[date].md` |
| "Create elevator pitch for [product]" | Positioning statements | `POSITIONING-[product]-[date].md` |
| "Map user journey for [flow]" | End-to-end journey map | `USER-JOURNEY-[flow]-[date].md` |
| "Generate epic plan for [feature]" | Epic structure with sub-epics | `EPIC-PLAN-[feature]-[date].md` |

---

## Analysis & Prioritization

| Command | Description | Output |
|---------|-------------|--------|
| "Prioritize features using RICE" | RICE scoring | `RICE-[topic]-[date].md` |
| "Analyze risks of [feature]" | Risk matrix | `RISK-ANALYSIS-[feature]-[date].md` |
| "Analyze metric impact of [feature]" | Metrics impact analysis | `METRICS-[feature]-[date].md` |
| "Analyze competitor [name]" | Competitive analysis | `COMPETITIVE-[name]-[date].md` |
| "Create battlecard for [competitor]" | Sales-ready battlecard | `COMPETITIVE-[name]-[date].md` |
| "Connect KPIs to revenue" | KPI-revenue linkage | `KPI-REVENUE-[feature]-[date].md` |

---

## Reviews

### Multi-Perspective Reviews

| Command | Reviewer | Focus |
|---------|----------|-------|
| "Review as engineer" | Staff Engineer | Technical feasibility |
| "Review as executive" | VP of Product | Strategic alignment |
| "Review as user researcher" | UX Researcher | User needs & adoption |
| "Review as data analyst" | Data Analyst | Metrics & measurement |
| "Review as customer" | Customer personas | Value clarity & ease of use |
| "Review as customer success" | CS Lead | Support & experience |

| Command | Description |
|---------|-------------|
| "Review document" | All core perspectives sequentially |
| "Full review of PRD" | All perspectives + consolidated feedback |

---

## Daily Workflow

### Morning Briefing

| Command | Description |
|---------|-------------|
| "Morning briefing" | Full briefing: calendar + meetings + tracker + staleness |
| "Start the day" | Alias |
| "What's on today" | Alias |

**Web Dashboard:** The briefing and other views (tasks, commitments, initiatives, people) are also available at `http://localhost:3000` when running the webapp (run `npm run dev` in both `webapp/backend` and `webapp/frontend`).

### Daily Review

| Command | Description |
|---------|-------------|
| "Daily review" | End of day: completed vs planned, learnings |
| "End of day" | Alias |
| "Close the day" | Alias |

### Weekly Review

| Command | Description |
|---------|-------------|
| "Weekly review" | Week synthesis: patterns, quarter progress, next week priorities |
| "Friday review" | Alias |
| "Close the week" | Alias |

### Meeting Notes

| Command | Description |
|---------|-------------|
| "Process meeting notes" | Extract insights, update person pages + commitments |
| "Extract action items" | Action items only |

### Meeting Prep

| Command | Description |
|---------|-------------|
| "Prep for [meeting/person]" | Load person context, open items, suggested talking points |
| "Prepare for 1:1 with [Name]" | Alias |
| "Meeting prep for [Name]" | Alias |
| "Brief me for [meeting]" | Alias |
| "What should I discuss with [Name]" | Alias |

### Tasks

| Command | Description |
|---------|-------------|
| "Show my tasks" | Display tasks.md P1 and P2 |
| "Add task: [description]" | Add checkbox to tasks.md |
| "Done with [task]" | Mark [x] and move to Completed |

### People & Relationships

| Command | Description |
|---------|-------------|
| "Who is [name]?" | Show person page with history and open items |
| "Create person page for [name]" | Create page in context/people/ |
| "What do I owe [name]?" | List open items from commitments + person page |
| "Prep for meeting with [name]" | Load full person context |

---

## Progress Tracking

| Command | Description |
|---------|-------------|
| "Show initiative progress" | Current status of all initiatives |
| "Status of [initiative]?" | Specific initiative status |
| "Create new initiative [name]" | Start tracking new initiative |
| "Update progress of [initiative]" | Update initiative progress |
| "Quarter summary" | Quarter-level summary |

---

## Context & Setup

| Command | Description |
|---------|-------------|
| "/start" | Interactive onboarding wizard (first-time setup with tier selection) |
| "Get started" | Alias for /start |
| "/setup" | Resume or redo specific onboarding steps |
| "Help me fill in product context" | Context generator wizard |
| "Update product context" | Update product-context.mdc |
| "Show terminology" | Key terms from glossary |

---

## Self-Improvement

| Command | Description |
|---------|-------------|
| "Level up" | Discover Cadence OS features you haven't used yet |
| "Discover features" | Alias |
| "What else can I do?" | Alias |
| "/improve" | Review and rank toolkit improvement ideas |
| "Improve toolkit" | Alias |
| "Assumptions" | Read or update strategic assumptions |
| "What do we believe?" | Alias for assumptions |

---

## File Naming Convention

All generated files follow: `[TYPE]-[description]-[YYYY-MM-DD].md`

| Type | Description |
|------|-------------|
| PRD | Product Requirements Document |
| SPEC | Requirements Specification |
| ONE-PAGER | Strategic One-Pager |
| USER-STORIES | User Stories |
| RESEARCH-INPUT | Research Synthesis |
| DOC | Feature Documentation |
| METRICS | Metrics Analysis |
| COMPETITIVE | Competitive Analysis |
| RICE | RICE Prioritization |
| RISK-ANALYSIS | Risk Analysis |
| ROADMAP | Roadmap |
| LEAN-CANVAS | Lean Canvas |
| PERSONAS | User Personas |
| MEETING | Meeting Notes |
| STATUS | Status Update |
| POSITIONING | Product Positioning |
| USER-JOURNEY | User Journey Map |
| EPIC-PLAN | Epic Plan |
| KPI-REVENUE | KPI-Revenue Analysis |
