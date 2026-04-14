# Wiki Skill — Product Memory Wiki

**Skill ID:** wiki  
**Category:** knowledge  
**Version:** 1.0.0

---

## Overview

The wiki skill is the core interface for the Product Memory Wiki. It has 5 modes detected from user intent: **capture**, **query**, **browse**, **merge**, **promote**.

Before any operation, always read:
- `wiki/INDEX.md` — source of truth for all IDs and entry catalog
- `wiki/_TEMPLATE.md` — template for new entries
- `wiki/README.md` — entry types and rules

---

## Mode Detection

Detect mode from user intent before proceeding:

| User says | Mode |
|---|---|
| "wiki: <thought>", "add to wiki", "save to wiki", "anotar no wiki" | Capture |
| "what do I know about", "wiki lookup", "o que sei sobre" | Query |
| "wiki health", "wiki status", "stale entries", "saúde do wiki" | Browse |
| "wiki merge W-MMDD-N W-MMDD-N", "fundir wiki entries" | Merge |
| "wiki promote W-MMDD-N", "graduar wiki", "graduate entry" | Promote |

If mode is ambiguous, ask before proceeding.

---

## Mode 1: Capture

**Trigger:** User inputs a thought, observation, decision, or insight to be saved.

**Steps:**

### Step 1 — Classify

Use the Entry Types table to classify the input:

| Type | Captures | Detection signals |
|---|---|---|
| `decision` | "We decided X because Y" | "decidimos", "ficou combinado", "the call was", "we're going with" |
| `hypothesis` | "We believe X because Y" | "eu acho que", "my bet is", "we assume", "probably because" |
| `learning` | "We validated/invalidated X" | "data shows", "turns out", "we discovered", "confirmamos" |
| `signal` | "Competitor/market did X" | competitor name + action/launch |
| `pattern` | "X keeps happening in Y" | "de novo", "sempre que", "pattern", "toda vez" |

If ambiguous between two types, ask the user to choose.

### Step 2 — Deduplicate

1. Search `wiki/INDEX.md` for entries with similar topics or overlapping tags.
2. Grep `wiki/product/` for key terms from the new topic.
3. If a match is found:
   - Present the existing entry (ID, topic, confidence, last updated)
   - Ask: "This overlaps with [W-XXXX-N]. Update existing entry or create new?"
   - If update: proceed to update flow (add evidence, recalculate confidence, add changelog)
   - If new: proceed to creation

### Step 3 — Determine metadata

- **Domain:** Read `product-context.mdc` Active Domains table. If no domains are configured, use `shared`.
- **Tags:** 3-5 lowercase keywords, no spaces. Derived from topic + type.
- **Sources:** Extract from user input. If none, use `"user-input [date]"`.
- **Related entries:** Check INDEX.md for entries with matching tags or domain.
- **Confidence:** Start at the level matching evidence count (1-2 items → low, 3-4 → medium, 5+ → high).

### Step 4 — Generate ID

1. Read `wiki/INDEX.md`.
2. Find the latest entry with today's MMDD prefix.
3. Increment N. If none exist today, start at 1.
4. Confirm ID is unique. If collision (edge case), increment again.

### Step 5 — Create entry

1. Read `wiki/_TEMPLATE.md`.
2. Fill frontmatter with all fields.
3. Write the body:
   - **Summary:** 2-3 sentences, self-contained.
   - **Evidence Trail:** At least 1 item with date and source.
   - **Assumptions:** What must be true for this entry to hold.
   - **Open Questions:** 1-2 questions to answer later.
   - **Changelog:** First row: "Created — → [confidence level]"
4. Save to `wiki/product/[type-plural]/[ID].md`.
   - decisions → `wiki/product/decisions/`
   - hypotheses → `wiki/product/hypotheses/`
   - learnings → `wiki/product/learnings/`
   - signals → `wiki/product/signals/`
   - patterns → `wiki/product/patterns/`

### Step 6 — Update INDEX.md

1. Add a row to the Entries table.
2. Increment the relevant type count in Totals.
3. Update the relevant confidence count in Health.
4. Update "Last rebuilt" date.
5. Re-sort entries by last_updated (most recent first).

### Step 7 — Confirm to user

Reply with:
```
Saved: [W-MMDD-N] "[Topic]"
Type: [type] · Confidence: [level] · Domain: [domain]
Tags: [tag1, tag2, tag3]
Path: wiki/product/[type-plural]/[ID].md
```

### Step 8 — Suggest data validation (optional)

If type is `hypothesis` or `signal`, check if any tags could be validated with data. If so, suggest:
> "This hypothesis can be validated with data. Want to run a query?"

Never auto-run. Always ask first.

---

## Mode 2: Query

**Trigger:** User wants to look up knowledge about a topic.

**Steps:**

1. Extract the search term from user input.
2. Search `wiki/INDEX.md` by:
   - Topic (fuzzy match — partial words count)
   - Tags (exact match)
   - Domain (if specified)
3. Grep `wiki/product/` for the search term in file contents.
4. Present results:
   ```
   Found [N] entries for "[search term]":

   1. [W-MMDD-N] "[Topic]" — [type] · [confidence] · [age]
      [Summary excerpt — first 2 sentences]
      Related: [W-MMDD-N, ...]

   2. ...
   ```
5. If no results: "No wiki entries found for '[term]'. Want to create one?"
6. Offer actions: "View full entry [ID]", "Create new entry", "Compare entries"

---

## Mode 3: Browse

**Trigger:** User wants a wiki health dashboard.

**Steps:**

1. Read `wiki/INDEX.md`.
2. Scan `wiki/product/` to verify INDEX.md is in sync. Count ALL `.md` files across all type folders (including entries with confidence = `outdated` — these stay in place after Merge). If file count ≠ INDEX total row count, rebuild (see Error Handling).
3. Generate dashboard:

```
Wiki Health — [date]

Entries: [total]
├── decisions: [N]
├── hypotheses: [N]
├── learnings: [N]
├── signals: [N]
└── patterns: [N]

Confidence:
├── high: [N]
├── medium: [N]
├── low: [N]
└── outdated: [N]

Needs attention:
├── Stale (>30 days, not high): [N entries — list IDs and topics]
├── No evidence trail: [N entries]
└── Missing open questions: [N entries]

Recent additions (last 3):
- [W-MMDD-N] "[Topic]" — [date]
- ...

Suggested actions:
- [if stale entries] Update stale hypotheses with recent evidence
- [if low count] [N] entries at low confidence — worth challenging or enriching
- [if many hypotheses] [N] unchallenged hypotheses — run assumption challenger?
```

---

## Mode 4: Merge

**Trigger:** User wants to consolidate two overlapping entries.

**Steps:**

1. Load both entries. Present side-by-side:
   ```
   Comparing:
   A: [W-MMDD-N] "[Topic A]" — [type] · [confidence] · [N evidence items] · updated [date]
   B: [W-MMDD-N] "[Topic B]" — [type] · [confidence] · [N evidence items] · updated [date]

   Overlap: [shared tags or concepts]
   ```

2. Determine primary entry:
   - More evidence → primary
   - Higher confidence → tiebreaker
   - More recent last_updated → tiebreaker
   - If tied, ask user.

3. Merge into primary:
   - Combine Evidence Trails (interleave by date, deduplicate identical entries)
   - Union tags and related entries (deduplicate)
   - Recalculate confidence (1-2 items → low, 3-4 → medium, 5+ → high)
   - Consolidate Assumptions (deduplicate)
   - Consolidate Open Questions (deduplicate, re-check completed ones)
   - Add changelog row: "Merged [absorbed-ID] into this entry — [old confidence] → [new confidence]"
   - Update last_updated

4. Mark absorbed entry as outdated:
   - confidence → `outdated`
   - Prepend to Summary: "**Merged into [primary-ID] on [date].** Original summary: "
   - Add changelog row: "Merged into [primary-ID] — [old confidence] → outdated"
   - **Do NOT move the file.** The absorbed entry stays in its original folder (e.g., `wiki/product/hypotheses/`). The INDEX sync check in Browse mode counts ALL entries including outdated ones — no false sync warning will be raised.

5. Update INDEX.md:
   - Update primary entry row
   - Update absorbed entry (confidence → outdated)
   - Recalculate totals and health counts

6. Confirm:
   ```
   Merged [absorbed-ID] into [primary-ID].
   Primary now has [N] evidence items · confidence: [level]
   Absorbed entry marked as outdated.
   ```

---

## Mode 5: Promote

**Trigger:** User wants to graduate an entry to a new type.

**Graduation criteria:**

| From | To | Criteria |
|---|---|---|
| `hypothesis` | `learning` | 3+ evidence items from distinct sources AND confidence = high |
| `hypothesis` | `outdated` | Contradicting evidence OR >90 days without new evidence |
| `signal` | `pattern` | Same signal observed 3+ times in distinct sources |
| `pattern` | `learning` | Pattern confirmed by quantitative data |

**Steps:**

1. Load the entry. Count:
   - Evidence items total
   - Distinct sources (each `[Source: ...]` reference counts as 1)
   - Current confidence
   - Age (days since created)

2. Check all applicable criteria and present assessment:
   ```
   Promotion assessment for [W-MMDD-N] "[Topic]"
   Current: [type] · [confidence] · [N evidence items] from [N distinct sources] · [age] days old

   ✓ Criteria met: [list satisfied criteria]
   ✗ Criteria not met: [list unsatisfied criteria + what's missing]

   Recommendation: [promote to X] / [not ready — needs Y]
   ```

3. If criteria met, ask for confirmation before proceeding.

4. If confirmed:
   - Move file to new type folder (`wiki/product/[new-type-plural]/`)
   - Update frontmatter: type → new type, last_updated → today
   - Add changelog row: "Promoted [old-type] → [new-type]"
   - Update INDEX.md (type, path)
   - Confirm: "Promoted [W-MMDD-N] from [old] to [new]. File moved to wiki/product/[new-type-plural]/[ID].md"

5. If criteria not met, show path to promotion:
   - "Needs [N] more evidence items from distinct sources"
   - "Needs confidence = high (currently [level])"
   - Suggest: "Where might you find evidence? Check [related entries] or run a data query."

---

## Error Handling

### INDEX.md out of sync

Detected when: file count in `wiki/product/` doesn't match INDEX.md totals, or an entry file exists but has no INDEX row.

Action:
1. Warn: "INDEX.md appears out of sync. Rebuilding from files..."
2. Scan all `wiki/product/**/*.md` files
3. Read frontmatter from each
4. Rebuild INDEX.md: entries table, totals, health counts
5. Confirm: "INDEX.md rebuilt. Found [N] entries."

### Duplicate ID

Detected when generating a new ID that already exists in INDEX.md.

Action: Increment N until unique. Warn: "ID W-MMDD-[N] was taken, used W-MMDD-[N+1] instead."

---

## Quality Checklist

Enforce before finalizing any write operation:

- [ ] Frontmatter complete — all fields filled, no empty strings except optional `last_challenged`
- [ ] Summary is self-contained — no "see X for context"
- [ ] Evidence Trail has at least 1 item with date and `[Source: ...]`
- [ ] ID is unique — verified against INDEX.md
- [ ] INDEX.md updated — new/changed row, recalculated totals and health
- [ ] Tags are lowercase, no spaces, 3-5 per entry
- [ ] Related entries listed in frontmatter actually exist in INDEX.md
- [ ] File saved to correct path: `wiki/product/[type-plural]/[ID].md`
