# Wiki System — Phase 5 Audit Report

**Date:** 2026-04-13  
**Scope:** Post-implementation audit of wiki system (Phases 1–4)  
**Auditor:** Claude Code (systematic code review — phases 1 and 2 complete, phases 3 and 4 partial)

---

## Audit Summary

| Severity | Count | Status |
|---|---|---|
| HIGH | 3 | Fixed in this pass |
| MEDIUM | 4 | Fixed in this pass (quick wins) |
| LOW | 2 | Backlog |

---

## HIGH — Fixed

### H1: Competitive signal routing not going to wiki

**Problem:** `conversational-capture.mdc` routing table has "Competitive signal" going to `Relevant domain context or documents/`. The wiki `signal` entry type captures exactly this ("Competitor/market did X"), but the routing table didn't connect them. The routing priority rule only mentioned product insights/hypotheses/decisions — signals were omitted.

**Impact:** Users sharing competitor observations would NOT get wiki capture — knowledge went to unstructured documents instead of the searchable, challengeable wiki.

**Action:** Updated routing table row for "Competitive signal" → `wiki/product/signals/` via wiki skill (capture). Added `signal` to the routing priority rule.

---

### H2: Morning briefing Wiki Pulse had literal instructions inside template block

**Problem:** In `morning-briefing/SKILL.md`, inside the ```` ```markdown ```` template block, the Wiki Pulse section contained:

```
Read `wiki/INDEX.md` and compute:
- Total entries count
- Entries updated in the last 7 days
- Entries with confidence "low" or "outdated"
- Hypotheses never challenged (last_challenged is null)
```

These lines were NOT in brackets `[...]`, so they would be written literally into the generated briefing file instead of being processed as AI instructions. The `[Only include if...]` guard was correctly bracketed, but the computation instructions weren't.

**Action:** Wrapped the compute instructions in `[...]` notation, consistent with the template convention throughout the file.

---

### H3: Session protocol synthesis check false-positives on new wikis

**Problem:** Phase 3, item 5 in `session-protocol.mdc` checked: "If `wiki/INDEX.md` exists... if latest synthesis is >30 days old → suggest /last30days". But:
- `wiki/INDEX.md` ALWAYS exists (created at setup)
- `wiki/syntheses/` has no .md files on a fresh install (only .gitkeep)
- "No synthesis exists" = effectively no check possible, but the intent was to always surface this, causing a noisy alert on every session for users who just set up the wiki

**Action:** Added guards: only check synthesis age if wiki has at least 1 entry; only suggest /last30days if wiki has >5 entries AND no synthesis file exists OR the latest synthesis is >30 days old. Skips alert entirely on empty wikis.

---

## MEDIUM — Fixed

### M1: registry.json missing wiki inputs for morning-briefing and daily-review

**Problem:** Both skills were updated in Phase 2 to read wiki files, but `registry.json` `inputs` arrays weren't updated. This creates documentation drift — the registry is the canonical map of what each skill reads/writes.

**Action:** Added `wiki/INDEX.md` to morning-briefing inputs; added `wiki/**/*.md` to daily-review inputs.

---

### M2: Merge mode ambiguous about absorbed entry file location

**Problem:** Mode 4 (Merge) marks the absorbed entry as confidence → `outdated` but doesn't say whether to move the file. Browse mode does a sync check comparing file counts vs INDEX rows. If only "active" (non-outdated) entries are counted, files in type folders with confidence=outdated would cause a false "INDEX out of sync" warning.

**Action:** Added explicit note in Merge mode: "The absorbed entry file stays in its current location. Do NOT move it. The INDEX sync check in Browse mode counts ALL entries including outdated."

---

### M3: Wiki Pulse omission condition ambiguous on empty INDEX

**Problem:** Step 8 condition "[Only include if wiki/INDEX.md exists and has entries]" — `wiki/INDEX.md` always exists post-setup, so "exists" is always true. "Has entries" was ambiguous (could mean "file exists" vs "has at least 1 entry in catalog").

**Action:** Clarified to "Omit entirely if wiki/INDEX.md Total count = 0."

---

### M4: Phase 3 and Phase 4 missing — referenced but not implemented

**Problem:** `ARCHITECTURE.md`, `session-protocol.mdc`, and `wiki/README.md` reference `/last30days` skill and assumption challenger as if they exist. They don't — only folder stubs exist.

- `session-protocol.mdc` Phase 3 item 5 references `/last30days` command
- `wiki/README.md` lists `syntheses/` and `challenges/` folders with no description of when they populate
- `ARCHITECTURE.md` lists "Last30days skill" and "Assumption challenger" as writers

**Action:** Added note to `wiki/README.md` that last30days and assumption challenger are not yet available. Updated `ARCHITECTURE.md` annotation. Phase 3 and Phase 4 are tracked as pending implementation.

---

## LOW — Backlog

### L1: Tag enforcement relies entirely on AI discretion

Tags must be lowercase, no spaces. Enforced only via quality checklist — no structural normalization step. Risk: inconsistent tags across entries created by different paths (conversational capture vs direct wiki command vs meeting notes Step 9).

**Suggested action:** Add explicit normalization step to Capture mode Step 3 ("before saving tags, normalize: lowercase, replace spaces with hyphens").

---

### L2: No cross-path Evidence Trail formatting test

Evidence Trail format should be consistent: `- **YYYY-MM-DD** — [Source: ...] Description`. Entries created from meeting notes Step 9 might format sources differently than direct capture. No cross-skill enforcement exists.

**Suggested action:** Add a shared "Evidence Trail" format reminder at the top of wiki/SKILL.md Mode 1, and mirror it in meeting notes Step 9 when creating wiki entries.

---

## Phase 3 & 4 Status (Pending)

These were not implemented before the Phase 5 audit. They are prerequisites for:
- `wiki/syntheses/` to have any content
- `wiki/challenges/` to have any content
- Weekly review Knowledge Health section
- Assumption Challenger automation (weekly Friday run)

**Next:** Implement Phase 3 (last30days skill) and Phase 4 (assumption challenger + weekly review update) as a follow-up session.

---

*Audit complete: 2026-04-13*
