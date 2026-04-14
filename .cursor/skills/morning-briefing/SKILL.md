# Morning Briefing

Your daily cockpit — the single entry point where strategic context, initiative pipeline, calendar, and tasks converge to drive your day.

## When to Use

Use this skill when you need to:
- Start your workday with full context across strategy, initiatives, and operations
- See today's agenda and meeting schedule
- Get a summary of recent meetings and action items
- See status of active initiatives and document pipeline
- Generate proposed to-do's for the day connected to quarter goals
- Catch up after time away

## Trigger Commands

- "Morning briefing"
- "Start the day"
- "What's on today"
- "Daily briefing"
- "Status of the day"

## Instructions

When the user triggers a morning briefing, execute the following steps:

### Step 1: Load Strategic Context

Read the product strategy files that ground the briefing in the bigger picture:

```
Read: @.cursor/rules/product-context.mdc (identify active domains)
Read: @global-context/{domain}/DOMAIN-VISION.md (if exists)
Read: @global-context/{domain}/ROADMAP.md (if exists)
Read: @global-context/shared/pillars.md (strategic pillars for task alignment)
Read: @global-context/shared/assumptions.md (if exists — strategic bets)
Read: @global-context/shared/ (any glossary or invariants files)
```

**Purpose:** The briefing should connect today's work to the product strategy and strategic pillars. Without this, it's a calendar app.

**If files don't exist yet:** Skip gracefully. Note in the Day Overview: "Strategic context not configured — run `Help me fill in product context` to set up."

### Step 2: Load Planning Context

Read the planning hierarchy files to inform the briefing narrative:

```
Read: @to_do's/quarter-goals.md
Read: @to_do's/week-priorities.md
Read: @to_do's/commitments.md (if exists)
Read: @wiki/INDEX.md (if exists — for Wiki Pulse section)
```

**Purpose:** These files provide the operational planning context:
- `quarter-goals.md` informs the weekly focus section with quarter-level progress
- `week-priorities.md` provides the Top 3 priorities that should anchor the day
- `commitments.md` surfaces promises that need follow-up

**If files don't exist yet:** Skip gracefully. The briefing works without them but is better with them.

### Step 3: Load Initiative Pipeline

Read the initiative tracker to surface document pipeline status:

```
Read: @cadence-progress.json
```

**Extract for each active initiative** (`status: in_progress` or `blocked`):
- Name, priority, current phase, next actions
- Days since `last_updated` in metadata — flag as **STALE** if > 7 days
- Documents with `status: draft` — these need action
- Blocked initiatives — surface blockers prominently

**If cadence-progress.json is empty or only has examples:** Note "No active initiatives tracked — create one with `Create new initiative [name]`."

### Step 4: Load Person Pages for Today's Meetings

After fetching calendar events (Step 5), identify the key participants. For each participant:

```
Check: @context/people/Firstname-Lastname.md
```

**If person page exists:** Extract last meeting topic/date, open items (what you owe them / they owe you), key context notes, and days since last interaction.
**If not:** Note it for Meeting Prep — suggest creating one after the meeting.

Also cross-reference with `@to_do's/commitments.md` to find commitments involving each participant.

### Step 5: Fetch Calendar Events (Today)

Use your calendar MCP (Zapier, Google Calendar, etc.) to get today's events.

**Extract from each event:**
- Event title and time (start/end)
- Attendees (names)
- Location or video call link
- Brief description if available

**Meeting count:** Count today's meetings — this determines P1 capacity (4+ meetings -> max 2 P1s).

**If calendar MCP is unavailable:**
```
Calendar not available. Continuing with other data sources...
```

### Step 6: Fetch Meeting Summaries (Last 7 Days)

If a meeting transcription MCP is available (Fireflies, Otter, etc.), fetch recent meetings.

**Extract from each summary:**
- Meeting title and date
- Key topics discussed
- Action items (with owners if identified)
- Decisions made
- Open questions

**If meeting MCP is unavailable:** Skip gracefully, continue with other data.

### Step 7: Fetch Project Tracker Issues

If a project tracker MCP is available (Jira, Linear, etc.), fetch active issues.

**Query:** Active issues (In Progress, To Do, Blocked, In Review) ordered by priority.

**If tracker MCP is unavailable:** Skip gracefully, continue with other data.

### Step 8: Generate Briefing (NARRATIVE FORMAT)

**IMPORTANT:** Write in a conversational, Chief of Staff style. Be direct, insightful, and actionable. The briefing is the PM's cockpit — it should connect strategy, initiatives, and daily operations in one view.

Save the briefing to `@to_do's/briefings/YYYY-MM-DD.md` with this format:

```markdown
---
date: YYYY-MM-DD
---

# Morning Briefing - YYYY-MM-DD

## Day Overview

[Write 2-3 paragraphs as a Chief of Staff would brief their executive. Cover:
- What's the most critical thing happening today?
- Today's meeting load: how many meetings, key ones to prepare for
- What needs immediate attention?
- Quick context on the state of key initiatives
- How today's work connects to the product strategy]

## Strategic Pulse

**Quarter:** [e.g., Q2 2026] | **Weeks remaining:** [X]
**Domain focus:** [1 sentence from DOMAIN-VISION.md, or "Not configured"]

| Quarter Goal | Progress | This Week's Connection |
|---|---|---|
| [Goal 1 from quarter-goals.md] | XX% | [How this week's priorities advance it] |
| [Goal 2] | XX% | [Connection or "No direct work planned"] |
| [Goal 3] | XX% | [Connection] |

**Roadmap highlight:** [1 sentence about the most relevant current roadmap item from ROADMAP.md. If no roadmap configured: "No roadmap loaded."]

## Initiative Pipeline

| Initiative | Priority | Phase | Next Action | Last Update | Alert |
|---|---|---|---|---|---|
| [Name] | P1 | [Current phase] | [From next_actions] | [X days ago] | |
| [Name] | P2 | [Phase] | [Action] | [X days ago] | STALE |

**Documents requiring action:**
- [PRD-feature-x.md] — status: draft, pending since [date]
- [ONE-PAGER-feature-y.md] — completed, next step: Requirements Spec

[If no active initiatives: "No initiatives tracked. Start with `Create new initiative [name]`."]

## Wiki Pulse

[Only include if wiki/INDEX.md Total count > 0. Omit entirely otherwise.]

[Read wiki/INDEX.md and compute: (1) total entry count, (2) entries where last_updated is within the last 7 days, (3) entries with confidence "low" or "outdated", (4) hypotheses where last_challenged is null. Then output the line below with the real values substituted:]

**Wiki Pulse:** X entries | Y updated this week | Z stale hypotheses (>30 days) | W never challenged

[If any stale entries have tags that overlap with today's meetings or week priorities, add a specific mention:]
- "[W-XXXX-X] relates to today's meeting with [Person] — consider reviewing before the call"

## Immediate Attention

**Stale items (staleness detection):**
- Check `@to_do's/tasks.md` for tasks pending 5+ days
- Check `@to_do's/commitments.md` for commitments >3 days old
- Check `@cadence-progress.json` for initiatives >7 days without update
- Flag with warning and days pending

**Critical actions:**
- **[Item 1]** - [Brief context on why this needs attention now]
- **[Item 2]** - [Brief context]

## Week Priorities (from week-priorities.md)

| # | Priority | Connects to | Status Today |
|---|----------|-------------|--------------|
| 1 | [Priority from week-priorities.md] | [Quarter goal] | [Current status] |
| 2 | [Priority] | [Quarter goal] | [Status] |
| 3 | [Priority] | [Quarter goal] | [Status] |

## Today's Schedule

| Time | Meeting | Participants | Link |
|------|---------|--------------|------|
| [HH:MM - HH:MM] | [Event title] | [Key attendees] | [Link if available] |

**Day load:** [X meetings, Y hours in calls]. [Comment on meeting load]

## Meeting Prep

### [Meeting title] - [time]
- **Participants:** [names]
- **Last meeting:** [date and topic from person page, or "No history recorded"]
- **Open items with them:**
  - I owe: [from person page + commitments.md, with days pending. "Nothing pending" if clear]
  - They owe me: [from person page + commitments.md, with days pending. "Nothing pending" if clear]
- **Strategic context:** [How this meeting connects to current initiatives or roadmap items]
- **Prep suggestion:** [What to focus on based on all available context]

## Team Initiatives (Tracker)

| Key | Title | Owner | Status |
|-----|-------|-------|--------|
| [ID] | Issue title | Assignee | Status |

[From project tracker MCP. If unavailable: "Tracker not available."]

## Today's Three (P1)

**RULE: Maximum 3 P1s.** If the day has 4+ meetings, reduce to 2 P1s.
**RULE: Pillar alignment required.** Each P1 should connect to a strategic pillar from `global-context/shared/pillars.md`. If it doesn't, tag as [Operational] or [Ad-hoc] with a brief reason.

- [ ] **[Task 1]** - [context] *(connects to: [week priority #] | initiative: [name or "none"] | pillar: [name or "Operational"])*
- [ ] **[Task 2]** - [context] *(connects to: [week priority #] | initiative: [name or "none"] | pillar: [name or "Operational"])*
- [ ] **[Task 3]** - [context] *(connects to: [week priority #] | initiative: [name or "none"] | pillar: [name or "Operational"])*

### Also on Radar (P2)
- [ ] [Actionable task with context]
- [ ] [Actionable task with context]

---
*Generated: [timestamp]*
```

### Step 9: Update Progress Log

**Always** append a new entry to `@to_do's/progress-log.md` with highlights, decisions, blockers, and action items.

### Step 10: Update Tasks

**Always** update `@to_do's/tasks.md` automatically:
- Keep all existing tasks
- Add new P1 items to "Today - P1" section (max 3 P1s)
- Add new P2 items to "Today - P2" section
- Update the "Updated" date at the top
- If a task has been in P1 for 5+ days, add a warning prefix to flag it

### Step 11: Open Webapp

**Always** open the webapp dashboard after generating the briefing:

1. Check if backend (port 3002) and frontend (port 3000) are already running
2. If not running, start them:
   - `cd webapp/backend && npm run dev` (background)
   - `cd webapp/frontend && npm run dev` (background)
   - Wait for both servers to be healthy before proceeding
3. Navigate the browser to `http://localhost:3000` using the browser MCP (`browser_navigate`)

### Step 12: Notify User

After saving:
```
Briefing saved in to_do's/briefings/YYYY-MM-DD.md
```

## Error Handling

If any data source is unavailable, continue with what's available. The briefing should always be generated, even if some sections are incomplete. Note which sources were unavailable.

## Customization

### Adjusting Time Range
- "Morning briefing for last week" - 7 days
- "Morning briefing for last 3 days" - 3 days

### Filtering
- "Morning briefing for [domain] only"
- "Morning briefing P1 only"

## Stale Skill Detection

After generating the briefing, silently check `to_do's/learnings/usage-log.md` (if it exists):

1. Identify skills/templates not used in the last 30 days
2. Cross-reference with current work context (active initiatives, week priorities)
3. If a relevant unused skill is found, add a one-line suggestion at the end of the briefing:

```
**Tip:** You haven't used [skill/template] in 30+ days. It could help with [current initiative/priority]. Try: `[command]`
```

Only suggest one skill per briefing. Don't suggest if the user has used all skills recently.

## Cursor Tip (Progressive Learning)

After generating the briefing, silently check `to_do's/learnings/onboarding-state.json` → `cursor_skills_learned` array (if it exists):

If fewer than 5 skills are learned, pick ONE untaught skill from this list and add a one-line tip at the end of the briefing:

| Skill ID | Not learned? Suggest this tip |
|---|---|
| `chat_and_modes` | **Cursor tip:** This chat has three modes — Agent (creates files), Ask (read-only analysis), and Plan (research then plan then execute). Switch from the mode picker at the top of the chat panel. |
| `at_context` | **Cursor tip:** Type **@** in the chat to reference specific files or folders. Try `@documents/` to point me at your docs, or `@Web` to search the internet. |
| `diffs` | **Cursor tip:** When I edit a file, you see a diff with green (added) and red (removed) lines. Accept or Reject each change — nothing saves until you approve. |
| `rules_awareness` | **Cursor tip:** The templates that shape my output live in `.cursor/rules/`. Open any `.mdc` file in the sidebar to see how they work — 14 templates, 6 reviewer personas, all customizable. |
| `plan_mode` | **Cursor tip:** For complex tasks (full PRD, roadmap, competitive analysis), try **Plan mode** — I research first, show a plan, and only execute after your approval. Toggle from the mode picker or press Shift+Tab. |

**Rules:**
- Only one tip per briefing
- Rotate through untaught skills in order
- Once all 5 are in `cursor_skills_learned`, stop showing tips
- If the user acts on a tip (e.g., switches to Plan mode), add that skill to `cursor_skills_learned`
- If `onboarding-state.json` doesn't exist or has no `cursor_skills_learned` field, skip this section

## Quality Checklist

Before presenting the briefing:
- [ ] Strategic context loaded (domain vision + roadmap, or noted as missing)
- [ ] Initiative pipeline loaded from cadence-progress.json (or noted as empty)
- [ ] Calendar events fetched (or error noted)
- [ ] Meeting data fetched (or error noted)
- [ ] Project tracker data fetched (or error noted)
- [ ] Narrative sections written in conversational tone
- [ ] Strategic Pulse: quarter goals with progress and roadmap highlight
- [ ] Initiative Pipeline: active initiatives with phases, staleness flags, draft documents
- [ ] Week priorities loaded (or noted as missing)
- [ ] Today's Three: max 3 P1s (2 if 4+ meetings), connected to initiatives where applicable
- [ ] Staleness check: tasks >5 days, commitments >3 days, initiatives >7 days flagged
- [ ] Meeting prep: person pages + commitments cross-referenced for each attendee
- [ ] Stale skill detection: check usage-log for unused skills relevant to current work
- [ ] File saved to correct location
- [ ] Webapp opened in browser (frontend + backend running)
