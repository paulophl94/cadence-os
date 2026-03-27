# Meeting Prep

Proactive preparation for upcoming meetings — loads relationship context, open items, and suggests talking points.

## When to Use

Use this skill when you need to:
- Prepare for a 1:1, stakeholder meeting, or recurring ceremony
- Review what was discussed with someone last time
- Surface open commitments before a meeting
- Get suggested talking points based on context

## Trigger Commands

- "Prep for [meeting/person]"
- "Prepare for 1:1 with [Name]"
- "Meeting prep for [Name]"
- "What should I discuss with [Name]"
- "Brief me for [meeting name]"

## Instructions

### Step 1: Identify the Meeting or Person

Determine who the meeting is with. Accept:
- A person name: "prep for Maiki" -> find person page
- A meeting title: "prep for B2B sync" -> identify key participants
- A calendar event reference: "prep for my next meeting" -> check calendar

### Step 2: Load Person Context

For each key participant:

```
Read: @context/people/Firstname-Lastname.md (if exists)
Read: @to_do's/commitments.md (filter for this person)
```

**Extract from person page:**
- Last 3 meeting entries from Meeting History table
- Open items (what you owe them / they owe you)
- Context notes (what they care about, communication style)
- Days since last interaction

**Extract from commitments:**
- All pending commitments involving this person (both directions)
- Days pending for each commitment

### Step 3: Search Recent Meeting Notes

Search `documents/MEETING-*.md` for the person's name to find recent discussions:
- Last 3 meetings mentioning them
- Key decisions from those meetings
- Unresolved open questions

### Step 4: Load Strategic Context

```
Read: @cadence-progress.json (initiatives this person is involved in)
Read: @to_do's/week-priorities.md (alignment opportunities)
Read: @global-context/shared/pillars.md (if exists — strategic context)
```

### Step 5: Generate Meeting Prep Brief

Present a concise prep brief:

```markdown
# Meeting Prep: [Person/Meeting Name]

## Quick Context

| Field | Value |
|-------|-------|
| **Last interaction** | [Date — X days ago] |
| **Their role** | [From person page] |
| **Relationship** | [Internal/External/Partner] |
| **Communication style** | [From person page context, if noted] |

## Recent History (last 3 interactions)

1. **[Date]** — [Topic]. Key decision: [X]. Status: [resolved/open]
2. **[Date]** — [Topic]. Key decision: [X].
3. **[Date]** — [Topic]. Key decision: [X].

## Open Items

### You owe them
- [ ] [Commitment] — since [Date] — **X days pending** (^cd-ID)

### They owe you
- [ ] [Commitment] — since [Date] — **X days pending** (^cd-ID)

### Open questions from past meetings
- [Question still unresolved]

## Suggested Talking Points

Based on open items, recent context, and current priorities:

1. **[Topic 1]** — [Why: connects to open commitment / initiative / week priority]
2. **[Topic 2]** — [Why: stale item needs resolution]
3. **[Topic 3]** — [Why: strategic alignment opportunity]

## Strategic Alignment

- **Relevant initiatives:** [From cadence-progress.json]
- **Week priority connection:** [From week-priorities.md]
- **Pillar connection:** [From pillars.md]
```

### Step 6: Offer Follow-up

After presenting the prep:
- "Want me to draft an agenda based on these talking points?"
- "Should I update [Person]'s page with any notes after the meeting?"

## Special Cases

### For Recurring 1:1s
- Emphasize pattern detection: "You've discussed [topic] in 3 of the last 4 meetings — might be worth escalating"
- Surface commitment aging: "This commitment has been pending for X weeks"

### For Group Meetings
- Load person pages for all known participants
- Cross-reference commitments across all participants
- Note who owes what to whom

### For First-Time Meetings
- If no person page exists: note it and suggest creating one after the meeting
- If external: check if a company page or domain context exists

## Quality Checklist

- [ ] Person page loaded (or noted as missing)
- [ ] Commitments checked in both directions
- [ ] Recent meeting notes searched
- [ ] Strategic context loaded (initiatives + priorities)
- [ ] At least 2 actionable talking points suggested
- [ ] Stale commitments flagged with days pending
