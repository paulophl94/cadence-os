# Daily Review

End-of-day reflection that captures learnings, closes loops, and prepares tomorrow.

## When to Use

Use this skill at the end of the workday to:
- Reflect on what was accomplished vs planned
- Capture learnings and patterns
- Identify open loops for tomorrow
- Update tasks and commitments
- Build compounding knowledge over time

## Trigger Commands

- "Daily review"
- "End of day"
- "Close the day"
- "How did today go"

## Instructions

When the user triggers a daily review, execute the following steps:

### Step 1: Load Today's Context

Read these files to understand what was planned and what happened:

```
Read: @to_do's/tasks.md (current tasks and completions)
Read: @to_do's/briefings/YYYY-MM-DD.md (today's morning briefing, if exists)
Read: @to_do's/week-priorities.md (this week's Top 3)
Read: @to_do's/commitments.md (if exists)
Read: @cadence-progress.json (initiative pipeline status)
```

### Step 2: Analyze the Day

Compare what was planned vs what happened:

1. **Completed:** Which P1 and P2 tasks were marked as done?
2. **Not completed:** Which P1 tasks are still open? Why? (Ask briefly)
3. **Unplanned:** Did the user work on things not in the plan? What emerged?
4. **Week priorities:** Did today's work advance the Top 3 priorities?
5. **Initiatives:** Did today's work advance any initiative phase? Any documents created or progressed?

### Step 3: Ask Reflection Questions

Ask the user briefly (keep it lightweight):

**Quick review of the day:**

1. What worked well today?
2. Anything that blocked or delayed you?
3. Anything to remember for the future? (preference, mistake to avoid, pattern)

**Important:** Keep this conversational and fast. If the user says "nothing" or "all good", accept it and move on.

### Step 4: Generate Daily Review File

Save to `@to_do's/reviews/YYYY-MM-DD.md`:

```markdown
# Daily Review - YYYY-MM-DD

## Day Summary

[1-2 sentences: what defined today. Was it productive? Reactive? Meeting-heavy?]

## Completed

- [x] [Task 1] *(P1 — connects to: [week priority])*
- [x] [Task 2] *(P2)*

## Not Completed (and why)

- [ ] [Task] — [Reason: blocked by X / no time / priority changed]

## What Emerged (unplanned)

- [Item that came up during the day and consumed time]

## Week Priority Progress

| # | Priority | Advanced Today? | Note |
|---|----------|-----------------|------|
| 1 | [Priority] | Yes/No | [Brief note] |
| 2 | [Priority] | Yes/No | [Brief note] |
| 3 | [Priority] | Yes/No | [Brief note] |

## Initiative Progress

| Initiative | Phase | Advanced Today? | Note |
|---|---|---|---|
| [Name] | [Current phase] | Yes/No | [Document created, review done, etc.] |

[If no active initiatives: omit this section]

## Learnings

- [What worked — to repeat]
- [What didn't work — to avoid]
- [Pattern or preference to remember]

## Open Loops for Tomorrow

- [ ] [Task that's still pending]
- [ ] [Follow-up that needs to happen]
- [ ] [Commitment that's getting old]

---
*Review done: [timestamp]*
```

### Step 5: Update Tasks

**Automatically** update `@to_do's/tasks.md`:

1. Archive today's completed tasks to a "Completed [date]" section
2. Move incomplete P1 tasks to tomorrow (keep in "Today - P1")
3. If any task has been in P1 for 5+ consecutive days, add warning prefix
4. Update timestamp

### Step 6: Update Learnings (if any)

If the user shared learnings or patterns:

1. **Preferences** (how they like to work): Append to `@to_do's/learnings/preferences.md`
2. **Patterns/Errors** (things to avoid): Append to `@to_do's/learnings/patterns.md`

**Surface past learnings:** After recording new learnings, check `@to_do's/learnings/patterns.md` for any existing pattern that's relevant to today's work. If found, briefly surface it: "Reminder: you noted [pattern] on [date] — still relevant today."

**Usage tracking:** Update `@to_do's/learnings/usage-log.md` — increment the "Daily Review" row count and update "Last Used" date.

### Step 7: Commitment Review

Read `@to_do's/commitments.md` and perform a full commitment health check:

1. **Stale commitments:** Flag any commitment older than 3 days without update
2. **Completed today:** Move any commitments that were fulfilled today to the "Completed" section with date stamp
3. **Cross-reference:** For stale commitments, load the relevant person page from `context/people/` to add context on who is involved
4. **Surface in review:** Include a "Commitment Health" section in the daily review output:

```markdown
## Commitment Health

- **Closed today:** X
- **Pending (on track):** Y
- **Stale (>3 days):** Z
  - [ ] [What] -> to [Who] -> since [Date] (^cd-ID) — **X days overdue**
```

5. **Sync task IDs:** When completing a commitment with a `^cd-` ID, also mark the corresponding task complete in `tasks.md` and any meeting note where it originated

### Step 8: Notify User

Summarize the review concisely.

## Tone Guidelines

- Be direct and honest but not judgmental
- If nothing was completed, focus on "what's the plan for tomorrow?"
- Keep the whole process under 5 minutes
- Celebrate small wins connected to week priorities

## Error Handling

### No Briefing Today
Skip planned vs actual comparison. Ask what was done today and capture it.

### No Tasks File
Create the review from the user's verbal input. Suggest running a morning briefing tomorrow.
