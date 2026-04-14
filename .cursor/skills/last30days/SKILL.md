# Skill: 30-Day Knowledge Synthesis (`/last30days`)

**Category:** knowledge
**Trigger commands:** "last 30 days", "monthly synthesis", "knowledge synthesis", "últimos 30 dias", "síntese mensal", "what happened this month"
**Output:** `wiki/syntheses/SYNTHESIS-YYYY-MM-DD.md`
**Estimated time:** 5-10 min
**Depends on:** wiki (Phase 1)

---

## Purpose

Individual wiki entries are atoms — useful but disconnected. This skill synthesizes all PM activity from the last 30 days into a single strategic report: dominant themes, decisions made, knowledge gaps, assumption drift, and attention distribution.

Without synthesis, the wiki is a note-taking tool. With it, it's a strategic memory system where knowledge compounds.

---

## Step 1: Determine Date Range

- **Default:** last 30 calendar days from today
- **Accept custom ranges:**
  - "last 2 months" → 60 days
  - "March" → calendar month (2026-03-01 to 2026-03-31)
  - "last week" → last 7 days
  - "Q1" → Jan–Mar of current year
- Confirm range with user before proceeding if ambiguous

---

## Step 2: Load Data Sources

Load all groups in parallel where possible. For each group, filter files by date range using git log (`git log --since="YYYY-MM-DD" --until="YYYY-MM-DD" --name-only -- path/`) or by parsing filename dates or frontmatter `date:` fields.

**Performance guard:** If any group has >30 files, sample the 20 most recent.

| Group | Source | Path |
|-------|--------|------|
| A — Daily | Briefings | `to_do's/briefings/*.md` (in range) |
| A — Daily | Reviews | `to_do's/reviews/*.md` (in range) |
| B — Weekly | Weekly reviews | `to_do's/weekly-reviews/*.md` (overlapping with range) |
| C — Meetings | Meeting notes | `documents/**/MEETING-*.md` (via git log, in range) |
| D — Documents | Created/modified docs | `documents/**/*.md` (via git log, in range) |
| E — Operational | Tasks, commitments | `to_do's/tasks.md`, `to_do's/commitments.md` |
| F — Wiki | Wiki entries | `wiki/INDEX.md`, entries updated in range |
| G — Learnings | Patterns, usage | `to_do's/learnings/patterns.md`, `to_do's/learnings/usage-log.md` |

**Error handling:**

- If git is unavailable: infer dates from filenames (format `YYYY-MM-DD` in filename) and frontmatter `date:` / `created:` fields
- If a group has 0 files: note it in the synthesis, do not block
- If total sources <5: generate what's possible, add note at top: "⚠️ Limited data: only N sources found for this period. Synthesis may be partial."

---

## Step 3: Analyze and Cross-Reference

After loading all sources, perform these analyses:

### 3a. Theme Extraction
- Count topic frequency across all sources (briefings, reviews, meeting notes, documents)
- Identify the top 5 themes by mention count
- Note which domains (from `product-context.mdc` Active Domains) each theme belongs to

### 3b. Decision Inventory
- Extract all explicit decisions from documents and meeting notes
- Detection signals: "decidimos", "ficou combinado", "the call was", "we're going with", "agreed to", "decided to"
- For each decision: date, source file, topic, owner (if mentioned)

### 3c. Knowledge Assessment
- Read `wiki/INDEX.md` — list entries updated or created within the range
- For each entry: note confidence changes (from changelog), evidence additions, whether it was challenged
- Identify entries with the most evidence growth in the period

### 3d. Gap Detection
- Cross-reference: topics that appeared frequently in meetings/tasks/documents but have NO wiki entry
- These are knowledge gaps — insights captured in conversations but not formalized
- Detection: look for recurring nouns and concepts in meeting notes that don't match any wiki topic or tags

### 3e. People Map
- List people who appeared most frequently across all sources (from `context/people/` filenames and meeting notes)
- For each top-3 person: open commitments, last meeting date, topics discussed
- Source: `to_do's/commitments.md` + meeting notes

### 3f. Attention Distribution
- Count artifacts created per domain (from `product-context.mdc` Active Domains)
- Identify which domain got the most attention (documents, meetings, tasks)
- Flag: if one domain has >70% of attention, note as potential blind spot

### 3g. Assumption Drift (if wiki entries exist)
- Read all `wiki/product/hypotheses/` entries created or updated in range
- Check confidence trajectory: entries that went from medium → high, or high → low/outdated
- Check: how many hypotheses have `last_challenged: null` (never challenged)?
- Flag: hypotheses >30 days old with no evidence added

---

## Step 4: Generate Synthesis

Save output to `wiki/syntheses/SYNTHESIS-YYYY-MM-DD.md` where the date is today.

### Frontmatter

```yaml
---
period: YYYY-MM-DD to YYYY-MM-DD
generated: YYYY-MM-DD
sources_count: N
wiki_entries_in_period: N
domains: [domain1, domain2]
---
```

### Output Structure

```markdown
# Knowledge Synthesis — [Period]

> Generated on [date] from [N] sources across [N] days.
> [If <5 sources: ⚠️ Limited data: only N sources found. Synthesis may be partial.]

---

## Dominant Themes

Top 5 topics by frequency across all sources in the period:

1. **[Theme]** — mentioned N times across briefings, meetings, documents | Domain: [domain]
2. **[Theme]** — ...
3. **[Theme]** — ...
4. **[Theme]** — ...
5. **[Theme]** — ...

---

## Decisions Made

[If no decisions found: No explicit decisions detected in this period.]

| Date | Decision | Source | Owner |
|------|----------|--------|-------|
| YYYY-MM-DD | [Decision text] | [File] | [Person or "—"] |

---

## Knowledge Gained

[Only include if wiki/ entries exist for the period. Otherwise: "No wiki entries updated in this period. Consider running /wiki to capture insights."]

**New entries:** N created this period
**Updated entries:** N entries with new evidence

Notable changes:
- [W-XXXX-X] "[topic]" — confidence: [before] → [after] | Evidence added: N items
- ...

---

## Knowledge Gaps

Topics discussed frequently but not yet captured in wiki:

- **[Topic]** — appeared in N meetings/documents, no wiki entry exists
  → Suggested type: [hypothesis / decision / learning] | Create?
- ...

[If no gaps: All major topics from this period have wiki coverage.]

---

## Assumption Drift

[Only include if hypotheses exist in wiki/]

| Entry ID | Topic | Age (days) | Confidence | Status |
|----------|-------|------------|------------|--------|
| [W-XXXX-X] | [topic] | N | [level] | [stable / drifting / never challenged] |

- **Never challenged:** N hypotheses with `last_challenged: null`
- **Stale high-confidence:** N entries >30 days, confidence = high (appears authoritative, may be wrong)
- **Ready to graduate:** N entries meeting promotion criteria

---

## People Map

Top 3 people by activity in the period:

1. **[Name]** — N meetings | N open commitments | Topics: [theme1, theme2]
2. **[Name]** — ...
3. **[Name]** — ...

---

## Attention Distribution

| Domain | Documents | Meetings | Tasks | Total |
|--------|-----------|----------|-------|-------|
| [Domain 1] | N | N | N | N |
| [Domain 2] | N | N | N | N |
| Shared | N | N | N | N |

[If one domain >70%: ⚠️ Potential blind spot: [domain] received N% of attention this period.]

---

## Suggested Wiki Updates

[Candidates for user confirmation — never auto-create]

The following insights from this period may warrant wiki entries or updates:

1. **[Topic]** (type: [type], confidence: [level])
   - Source: [file/meeting]
   - Summary: [1 sentence]
   - Add to wiki? → Run: `wiki: [topic]`

2. ...

[Max 5 suggestions. Prioritize: decisions > learnings > hypotheses > signals]

---

## Sources Processed

- Briefings: N files
- Reviews: N files
- Weekly reviews: N files
- Meeting notes: N files
- Documents: N files
- Wiki entries: N entries
- Learnings: N files
```

---

## Step 5: Temporal Comparison (optional)

If the user requests comparison ("compare with last month", "how does this compare to March"):

1. Load the previous synthesis from `wiki/syntheses/` (closest date before current period)
2. Add a **Delta** section to the synthesis:

```markdown
## Delta — Comparison with [Previous Period]

### Themes
- **Gained attention:** [topic] (new), [topic] (↑ from rank 4 to rank 1)
- **Lost attention:** [topic] (↓ dropped out of top 5)

### Knowledge
- **New entries this period:** +N (vs +N last period)
- **Confidence upgrades:** N (vs N last period)
- **Confidence downgrades:** N (vs N last period)

### Decisions
- **Decisions this period:** N (vs N last period)
- **Recurring topics:** [topic] appeared in both periods

### Assumption Health
- **Hypotheses challenged:** N (vs N last period)
- **Graduation candidates:** N (vs N last period)
```

---

## Step 6: Suggest Wiki Updates

After generating the synthesis:

1. Present candidates from the "Suggested Wiki Updates" section
2. Ask: "Want to capture any of these? (all / select by number / skip)"
3. If user selects: route to wiki skill (capture mode) for each selected item
4. If user says "skip" or "all done": confirm synthesis saved, close skill

**Rules:**
- Never auto-create wiki entries — always ask
- Max 5 candidates (prioritize: decisions > learnings > hypotheses > signals)
- If user selects "all": create entries sequentially, confirming each ID

---

## Error Handling

| Condition | Response |
|-----------|----------|
| <5 sources total | Generate partial synthesis, add warning at top |
| No wiki entries yet | Skip "Knowledge Gained" and "Assumption Drift" sections; add: "Consider running /wiki to start capturing insights from this synthesis" |
| Git unavailable | Infer dates from filenames and frontmatter; note in synthesis |
| No meetings found | Note in "Sources Processed"; still generate themes from available sources |
| Synthesis file already exists for today | Append `-v2`, `-v3` to filename |

---

## Quality Checklist

Before saving the synthesis:

- [ ] Frontmatter complete (period, generated, sources_count, wiki_entries_in_period, domains)
- [ ] All 7 sections present (or explicitly omitted with reason)
- [ ] Dominant Themes: at least 3 themes (if enough data)
- [ ] Sources Processed count is accurate
- [ ] Suggested Wiki Updates: max 5 candidates
- [ ] File saved to `wiki/syntheses/SYNTHESIS-YYYY-MM-DD.md`
- [ ] If wiki entries exist: Assumption Drift section populated
- [ ] Temporal Delta section added only if explicitly requested

---

## Example Output Confirmation

After saving:

```
Synthesis complete.

📅 Period: 2026-03-14 to 2026-04-13 (30 days)
📁 Saved: wiki/syntheses/SYNTHESIS-2026-04-13.md
📊 Sources: 47 files processed (8 briefings, 6 reviews, 4 weekly reviews, 12 meetings, 10 documents, 7 wiki entries)

Top themes: payments (14×), churn (11×), onboarding (8×), pricing (6×), mobile (4×)
Decisions found: 6
Knowledge gaps: 3 topics without wiki coverage
Assumption drift: 2 hypotheses stale (>30 days, no new evidence)

5 wiki candidates identified. Add any to wiki? (all / 1,3 / skip)
```
