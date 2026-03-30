# Meeting Notes Processor

Process meeting transcripts and notes to extract actionable insights, decisions, and next steps.

## When to Use

Use this skill when you have:
- Transcriptions from meetings (Zoom, Google Meet, etc.)
- Handwritten or typed meeting notes
- Audio transcripts from user interviews
- Notes from stakeholder conversations

## Trigger Commands

- "Process meeting notes"
- "Extract action items from this meeting"
- "Summarize meeting notes"
- "Create meeting follow-up"

## Instructions

### Step 1: Request Input

Ask for the meeting content if not provided:

Provide the transcript or meeting notes. Also share:
- Type of meeting (planning, review, 1:1, stakeholder, discovery)
- Key participants
- Meeting objective (if known)

### Step 2: Process Content

Extract and organize:

1. **Key Decisions Made** — What was decided, who decided, rationale
2. **Action Items** — Task, owner, deadline, priority
3. **Discussion Highlights** — Main topics, key perspectives, areas of agreement/disagreement
4. **Open Questions** — Questions raised but not answered
5. **Risks & Blockers** — Problems, dependencies, concerns

### Step 3: Generate Output

Create a structured document. **Assign stable task IDs** (format `^cd-YYYYMMDD-NNN`) to all action items for cross-file sync:

```markdown
# Meeting Summary: [Title/Topic]

| Metadata | Value |
|----------|-------|
| **Date** | [YYYY-MM-DD] |
| **Type** | [planning/review/discovery/stakeholder/1:1] |
| **Participants** | [Names] |
| **Duration** | [If known] |

---

## TL;DR

[2-3 sentences summarizing the meeting outcome]

---

## Decisions Made

| Decision | Owner | Rationale |
|----------|-------|-----------|
| [Decision 1] | [Who decided] | [Why] |

---

## Action Items

| Task | Owner | Due Date | Priority |
|------|-------|----------|----------|
| [ ] [Task 1] (^cd-YYYYMMDD-001) | [Name] | [Date] | P1/P2/P3 |
| [ ] [Task 2] (^cd-YYYYMMDD-002) | [Name] | [Date] | P1/P2/P3 |

---

## Discussion Summary

### Topic 1: [Name]
- [Key point]
- **Conclusion:** [What was concluded]

---

## Open Questions

- [ ] [Question needing follow-up]

---

## Risks & Blockers Identified

| Risk/Blocker | Impact | Owner | Mitigation |
|--------------|--------|-------|------------|
| [Risk 1] | [H/M/L] | [Who] | [Action] |

---

## Next Steps

1. [Immediate next step]
2. [Follow-up meeting if needed]
3. [Documents to create]

---

*Processed: [YYYY-MM-DD]*
```

### Step 4: Update Person and Company Pages

After processing, **automatically** update person and company pages for key participants:

**Person pages:**
1. Check if person page exists in `@context/people/`
2. If not found, create one using `@context/people/_TEMPLATE.md`
3. Update with: meeting entry, open items (what you owe them / they owe you)

**Company pages:**
1. For each external participant, check if their company has a page in `@context/companies/`
2. If a company page exists, add the meeting to its Activity Log: `- [YYYY-MM-DD] Meeting: [Topic] with [Participants]`
3. If a company is referenced but has no page, suggest creating one
4. Link person pages to company pages via the Company field

Tell the user which pages were created or updated.

### Step 5: Sync Tasks to tasks.md

**Automatically** add action items assigned to the user to `@to_do's/tasks.md`:

1. Read current `tasks.md` to find the highest existing `^cd-` ID for today
2. For each action item owned by the user:
   - Add to the appropriate priority section (P1 or P2) with the same `^cd-` ID from Step 3
   - Include pillar tag if the task connects to a strategic pillar
3. Format: `- [ ] Task description (^cd-YYYYMMDD-NNN) [Pillar: Name]`

### Step 6: Update Commitments Tracker

**Automatically** update `@to_do's/commitments.md` with the same task IDs from Step 3:

- Your action items -> "I owe (pending)" section
- Others' action items -> "Others owe me (pending)" section
- Use this format per entry:

```markdown
- [ ] [What] -> to [Who] -> since [YYYY-MM-DD] -> context: [Meeting title] (^cd-YYYYMMDD-NNN)
```

**Commitment extraction rules:**
- Scan for phrases: "I'll", "I will", "I can", "let me", "I'll send", "I'll follow up", "I'll share", "I'll schedule"
- Scan for assignments to others: "[Name] will", "[Name] to", "can you", "please send", "action on [Name]"
- Each commitment gets the same `^cd-` ID as the corresponding action item
- If a commitment doesn't map to an existing action item, create a new ID for it

### Step 7: Verify Cross-File Sync

After all updates, report the sync summary to the user:

```
Task sync complete:
- Meeting note: documents/MEETING-[title]-[date].md (X action items)
- Tasks: to_do's/tasks.md (Y items added)
- Commitments: to_do's/commitments.md (Z entries added)
- Person pages: [list of updated pages]
All items share ^cd- IDs for cross-file tracking.
```

### Step 8: Suggest Follow-ups

Based on meeting content, suggest:
- Documents that should be created (PRD, One-Pager, etc.)
- People who should be informed
- Meetings that should be scheduled

## Special Processing Rules

### For Discovery/Interview Meetings
- Extract user pain points, capture verbatim quotes, identify patterns

### For Planning Meetings
- Focus on commitments, extract sprint/quarter goals, identify dependencies

### For Stakeholder Meetings
- Capture feedback and concerns, note approval status, track alignment

### For 1:1 Meetings
- Respect privacy — ask before documenting, focus on actionable items

## File Naming

Save as: `documents/MEETING-[type]-[topic]-[YYYY-MM-DD].md`

## Quality Checklist

- [ ] All action items have owners and `^cd-` IDs
- [ ] Decisions are clearly stated
- [ ] Open questions are documented
- [ ] Nothing confidential is exposed inappropriately
- [ ] Follow-up steps are actionable
- [ ] Person pages created/updated for key participants
- [ ] Tasks synced to `tasks.md` with matching IDs
- [ ] Commitments added to tracker with matching IDs
- [ ] Cross-file sync verified and reported
