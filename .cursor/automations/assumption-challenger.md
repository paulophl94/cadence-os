# Assumption Challenger — Automation

Weekly automated job that cross-references recent activity against wiki hypotheses, flags contradictions, tracks temporal decay, and identifies graduation candidates.

**Type:** Cursor Automation
**Trigger:** Cron Schedule — every Friday at 16:00 local time
**Output:** `wiki/challenges/CHALLENGE-YYYY-WXX.md`

---

## Instructions (paste into Cursor Automation agent)

### Step 1: Load Wiki Hypotheses

Read `wiki/INDEX.md`. Filter entries where:
- `type = hypothesis` OR
- `confidence != high` (i.e., medium, low, or outdated)

If fewer than 3 entries match, generate a minimal report ("< 3 hypotheses to challenge") and stop. Do not crash — always produce an output file.

### Step 2: Load Recent Evidence (Last 7 Days)

Load all of the following (parallel where possible):

| Source | Path |
|--------|------|
| Daily briefings | `to_do's/briefings/` (files modified in last 7 days) |
| Daily reviews | `to_do's/reviews/` (files modified in last 7 days) |
| Meeting notes | `documents/**/MEETING-*.md` (files modified in last 7 days) |
| Recently modified docs | `documents/**/*.md` (files modified in last 7 days, excluding MEETING) |
| Resolved commitments | `to_do's/commitments.md` (entries marked done in last 7 days) |
| Wiki entries updated | `wiki/product/**/*.md` (files modified in last 7 days) |

**Performance guard:** If any source has >20 files, sample the 10 most recently modified.

### Step 3: Cross-Reference Each Hypothesis

For each hypothesis loaded in Step 1, analyze against the evidence pool from Step 2:

#### 3a — Evidence Classification

| Signal | Action |
|--------|--------|
| Evidence supports the hypothesis | Tag as "confirmation" — recommend confidence upgrade |
| Evidence contradicts the hypothesis | Tag as "contradiction" — flag with source, recommend downgrade or mark `outdated` |
| No evidence found but hypothesis relates to current focus (from briefings/priorities) | Tag as "unexamined" |

#### 3b — Temporal Decay Check

| Condition | Flag |
|-----------|------|
| `last_updated` > 60 days AND confidence ≠ `outdated` | `AUTO-DECAY: recommend marking outdated` |
| `last_updated` > 30 days AND confidence = `high` | `STALE-HIGH: appears authoritative but may be wrong — high priority review` |
| `last_updated` > 30 days AND confidence = `medium` | `AGING-MEDIUM: validate or downgrade` |

#### 3c — Graduation Check

| Condition | Recommendation |
|-----------|---------------|
| Hypothesis with 3+ evidence items from distinct sources AND confidence = high | "Ready to graduate → learning (run wiki promote [ID])" |
| Signal observed 3+ times in distinct sources | "Ready to graduate → pattern (run wiki promote [ID])" |
| Pattern confirmed by quantitative data | "Ready to graduate → learning (run wiki promote [ID])" |

### Step 4: Update Wiki Entries

For each hypothesis that had at least one evidence item (supporting or contradicting):

1. Open the entry file
2. Add to Evidence Trail (most recent first):
   ```
   - **[YYYY-MM-DD]** — [Source: filename or description] [1-sentence summary of the evidence]
   ```
3. Update `last_challenged` field in frontmatter to today's date
4. **Do NOT change confidence** — only flag as recommendation in the challenge report

### Step 5: Generate Challenge Report

Save to `wiki/challenges/CHALLENGE-YYYY-WXX.md` (use ISO week number):

```markdown
---
period: YYYY-WXX
generated: YYYY-MM-DD
hypotheses_reviewed: N
contradictions: N
confirmations: N
graduation_candidates: N
---

# Assumption Challenge — Semana XX (YYYY-MM-DD)

## TL;DR

X hypotheses reviewed. Y contradictions found. Z confirmations. W entries flagged for decay.
[1-sentence summary of most important finding.]

## Contradictions Found

[For each contradiction:]
### [W-XXXX-X] "[topic]"
- **Source:** [filename or meeting title]
- **Evidence:** [1-2 sentences describing what contradicts the hypothesis]
- **Recommendation:** Downgrade confidence to [low/outdated] — run `wiki` and confirm.

_[If none: "Nenhuma contradição encontrada esta semana."]_

## Confirmations

[For each confirmation:]
- **[W-XXXX-X]** "[topic]" — [Source]. Confidence upgrade recommended: [current] → [suggested].

_[If none: "Nenhuma confirmação esta semana."]_

## Unexamined

Hypotheses relevant to current focus but with no new evidence this week:

| ID | Topic | Confidence | Last Updated |
|----|-------|------------|--------------|
| [W-XXXX-X] | [topic] | [confidence] | [date] |

Suggestion: actively seek evidence for these in the coming week.

## Auto-Decay Flags

| ID | Topic | Last Updated | Confidence | Flag |
|----|-------|-------------|------------|------|
| [W-XXXX-X] | [topic] | [date] | [confidence] | STALE-HIGH / AGING-MEDIUM / AUTO-DECAY |

Action required: review each and confirm decay via `wiki` skill.

## Graduation Candidates

| ID | Topic | Type | Evidence Count | Recommendation |
|----|-------|------|---------------|---------------|
| [W-XXXX-X] | [topic] | hypothesis | N | Promote → learning |

Run `wiki promote [ID]` to graduate each candidate.

## Entries Not Challenged

[IDs of hypotheses reviewed but with no matching evidence found — not enough data to draw conclusions this week.]

---
*Gerado automaticamente pelo Assumption Challenger em [YYYY-MM-DD 16:00]*
```

### Step 6: Notify

**If Slack is available:**
Send DM to the user with:
```
🔍 Assumption Challenge — Semana XX

X hypotheses reviewed | Y contradições | Z confirmações
[Top contradiction if any: "[W-XXXX-X] [topic]" — [1-line reason]]

Relatório completo: wiki/challenges/CHALLENGE-YYYY-WXX.md
```

**If Slack is unavailable:**
Save the report only. The session protocol will surface it on the next session start (Phase 2 wiki freshness check).

---

## What Stays Manual (and Should)

| Aspect | Reason |
|--------|--------|
| Confidence changes | Recommendations only — user confirms upgrades/downgrades via wiki skill |
| Entry deletion | Entries are never deleted, only marked `outdated` |
| Graduation execution | Challenger flags candidates, user confirms via `wiki promote [ID]` |
| Merge decisions | Side-by-side comparison requires human judgment |

---

## Error Handling

| Scenario | Action |
|----------|--------|
| `wiki/INDEX.md` missing | Stop. Log: "Wiki not initialized — run wiki skill first." |
| < 3 hypotheses | Generate minimal report with note, do not crash |
| Evidence source unreadable | Skip that source, note in report |
| Git unavailable (for date filtering) | Infer dates from filenames and frontmatter `last_updated` |

---

## Output Checklist (before saving report)

- [ ] Report file path follows `wiki/challenges/CHALLENGE-YYYY-WXX.md`
- [ ] Frontmatter complete (period, generated, counts)
- [ ] All 6 sections present (TL;DR, Contradictions, Confirmations, Unexamined, Auto-Decay, Graduation)
- [ ] `last_challenged` updated on all reviewed entries
- [ ] Evidence Trail items added with date and source
- [ ] Confidence NOT changed (recommendations only)
- [ ] No entries deleted
