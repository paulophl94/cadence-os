# Product Memory Wiki

A synthesis layer where product knowledge compounds over time. Not a document folder — entries evolve, get challenged, and decay.

---

## When to use the wiki

| Use the wiki | Don't use the wiki |
|---|---|
| A decision with clear rationale | A raw meeting note |
| A hypothesis you'll want to challenge later | A one-off task |
| A validated learning from data | A draft PRD |
| A competitor signal you'll track | An ad-hoc Slack thought |
| A recurring pattern you've noticed | |

---

## Entry Types

| Type | Captures | Detection signals |
|---|---|---|
| `decision` | "We decided X because Y" | "decidimos", "ficou combinado", "the call was", "we're going with" |
| `hypothesis` | "We believe X because Y" | "eu acho que", "my bet is", "we assume", "probably because" |
| `learning` | "We validated/invalidated X" | "data shows", "turns out", "we discovered", "confirmamos" |
| `signal` | "Competitor/market did X" | competitor name + action/launch |
| `pattern` | "X keeps happening in Y" | "de novo", "sempre que", "pattern", "toda vez" |

---

## Confidence Levels

| Level | Meaning |
|---|---|
| `high` | 5+ distinct sources, well-tested, no known contradictions |
| `medium` | 3-4 sources, reasonable evidence, some assumptions remain |
| `low` | 1-2 sources, early signal, treat as a bet |
| `outdated` | Contradicted, merged into another entry, or >90 days without new evidence |

**Promotion rules (confidence auto-calc):** 1-2 evidence items → low · 3-4 → medium · 5+ → high

---

## Commands

| Command | What it does |
|---|---|
| `wiki: <thought>` | Capture a new entry (or update existing) |
| `add to wiki: <thought>` | Same as above |
| `what do I know about <topic>` | Query the wiki |
| `wiki lookup <topic>` | Same as above |
| `wiki health` | Browse dashboard — totals, stale counts, suggested actions |
| `wiki status` | Same as above |
| `wiki merge W-MMDD-N W-MMDD-N` | Consolidate two overlapping entries |
| `wiki promote W-MMDD-N` | Graduate entry to a new type if criteria are met |

---

## Folder Structure

```
wiki/
├── README.md               # This file
├── INDEX.md                # Auto-maintained catalog (sorted by last_updated)
├── _TEMPLATE.md            # Entry template
├── product/
│   ├── decisions/          # Choices made with rationale
│   ├── hypotheses/         # Bets being tested
│   ├── learnings/          # Validated or invalidated knowledge
│   ├── signals/            # Competitor or market observations
│   └── patterns/           # Recurring themes across contexts
├── syntheses/              # Output from /last30days
└── challenges/             # Output from assumption challenger
```

---

## ID Format

`W-MMDD-N` — W = wiki, MMDD = month/day of creation, N = sequential within the day.

Example: `W-0409-1` is the first entry created on April 9th.

IDs are **permanent**. If an entry is invalidated, its confidence changes to `outdated` — the ID never changes.

---

## Ecosystem

The wiki connects to these downstream skills:

| Skill | Trigger | Output |
|---|---|---|
| Last 30 Days | "últimos 30 dias", "monthly synthesis" | `wiki/syntheses/SYNTHESIS-YYYY-MM-DD.md` — thematic synthesis across all PM activity |
| Assumption Challenger | Runs automatically on Fridays | `wiki/challenges/CHALLENGE-YYYY-WXX.md` — weekly cross-reference of hypotheses against recent evidence |

**Status:** All downstream skills are implemented. Last 30 Days generates monthly syntheses to `syntheses/`. Assumption Challenger runs weekly on Fridays and outputs to `challenges/`.

---

## Rules

1. One concept per entry. Merge if two entries cover the same ground.
2. Evidence Trail is mandatory — at least 1 item with date and source.
3. Summary must be self-contained. No "see meeting notes for context."
4. Tags are lowercase, no spaces, 3-5 per entry.
5. INDEX.md is the source of truth for IDs — always check before creating.
