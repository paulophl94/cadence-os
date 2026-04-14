# Weekly Review

End-of-week synthesis that identifies patterns, evaluates priorities, and sets up next week.

## When to Use

Use this skill at the end of the week (Friday afternoon) to:
- Synthesize the week's work and meetings
- Evaluate progress against week priorities and quarter goals
- Identify patterns and themes across meetings
- Capture strategic learnings
- Draft next week's Top 3 priorities

## Trigger Commands

- "Weekly review"
- "Review da semana"
- "Sintese semanal"
- "Fechar a semana"
- "Friday review"

## Instructions

When the user triggers a weekly review, execute the following steps:

### Step 1: Load Week Context

Read all files from this week:

```
Read: @to_do's/briefings/ (all files from this week: Mon-Fri)
Read: @to_do's/reviews/ (all daily reviews from this week, if they exist)
Read: @to_do's/week-priorities.md (this week's Top 3)
Read: @to_do's/quarter-goals.md (quarter-level progress)
Read: @to_do's/commitments.md (open and completed commitments)
Read: @to_do's/tasks.md (current state of tasks)
Read: @to_do's/learnings/ (preferences.md and patterns.md, if exist)
Read: @to_do's/toolkit-improvements.md (pending toolkit improvements)
Read: @to_do's/learnings/usage-log.md (skill/template usage tracking)
Read: @to_do's/learnings/career-evidence.md (career evidence, if exists)
```

### Step 2: Fetch Week's Meetings from Fireflies

```
Tool: fireflies_get_transcripts
Arguments:
  fromDate: [Monday of this week in ISO 8601]
  toDate: [Today in ISO 8601]
  mine: true
  limit: 30
```

For each meeting, get the summary:
```
Tool: fireflies_get_summary
Arguments:
  transcriptId: [meeting ID]
```

Extract themes, key decisions, and patterns across all meetings.

### Step 3: Analyze the Week

Synthesize across all data sources:

1. **Week Priorities Assessment:** For each of the Top 3 priorities:
   - Did it advance? How much?
   - What drove progress or blocked it?
   - Grade: Achieved / Partial / Not Advanced

2. **Meeting Patterns:** Across all meetings this week:
   - What topics came up repeatedly?
   - Who was in the most meetings?
   - Were there conflicting messages from different stakeholders?
   - What decisions were made that shift priorities?

3. **Commitment Health:** From commitments.md:
   - How many were closed this week?
   - How many are stale (>3 days)?
   - Are there patterns in who is late?

4. **Quarter Goals Progress:** From quarter-goals.md:
   - Update progress percentages based on this week's work
   - Are we on track? Behind? Ahead?
   - What needs to change to hit the targets?

5. **Learnings Synthesis:** From daily reviews and conversations:
   - What worked well this week? (repeat it)
   - What didn't work? (fix it)
   - Any new preferences or patterns to capture?

6. **Knowledge Health:** If `wiki/` exists:
   - Read the latest `wiki/challenges/CHALLENGE-YYYY-WXX.md` (if one exists for this week)
   - Count: total wiki entries (from `wiki/INDEX.md`), entries updated this week, stale entries (>30 days without update), contradictions found in the challenge report
   - Extract: top contradiction and top confirmation from the challenge report
   - If no challenge report exists for this week, note it and suggest running the assumption challenger

### Step 4: Ask User for Input

Quick prompt (keep it brief):

> **Review rapido da semana:**
>
> 1. Qual foi a maior vitoria da semana?
> 2. O que te frustrou ou nao saiu como esperado?
> 3. Algo estrategico que voce percebeu mas nao documentou?
> 4. Prioridades para semana que vem? (ou quer que eu sugira?)

Accept brief answers. If user says "sugere", generate priorities based on analysis.

### Step 5: Generate Weekly Review File

Save to `@to_do's/weekly-reviews/YYYY-WXX.md`:

```markdown
# Weekly Review - Semana XX (YYYY-MM-DD a YYYY-MM-DD)

## TL;DR da Semana

[2-3 sentences capturing the essence of the week. What defined it? Was it a week of progress, firefighting, planning, or execution?]

## Prioridades da Semana: Como Foi?

| # | Prioridade | Resultado | Grade |
|---|------------|-----------|-------|
| 1 | [Priority] | [What happened] | Achieved / Partial / Not Advanced |
| 2 | [Priority] | [What happened] | Achieved / Partial / Not Advanced |
| 3 | [Priority] | [What happened] | Achieved / Partial / Not Advanced |

**Analise:** [1-2 sentences on why priorities advanced or not. Were they realistic? Did emergencies derail them?]

## Reunioes da Semana

| Dia | Reuniao | Decisao-Chave | Impact |
|-----|---------|---------------|--------|
| Seg | [Meeting] | [Decision] | [High/Med/Low] |
| ... | ... | ... | ... |

**Total:** X reunioes | **Temas recorrentes:** [theme 1, theme 2]

## Patterns e Temas

- **[Theme 1]:** [What pattern emerged across meetings/tasks]
- **[Theme 2]:** [Another recurring topic]
- **[Theme 3]:** [Strategic insight]

## Progresso no Quarter

| Meta | Progresso | Tendencia | Risco |
|------|-----------|-----------|-------|
| [Quarter goal 1] | XX% | On track / Behind / Ahead | [Risk if any] |
| [Quarter goal 2] | XX% | ... | ... |

**Semanas restantes no quarter:** X

## Commitment Health

- **Fechados esta semana:** X
- **Pendentes:** Y (Z com mais de 3 dias)
- **Novos:** W
- **Quem esta devendo mais:** [Name — X items pendentes]

## Learnings da Semana

### O que funcionou
- [Repeat these patterns]

### O que nao funcionou
- [Fix these patterns]

### Insights estrategicos
- [Observations that matter for quarter goals or beyond]

## Knowledge Health

[Only include if `wiki/` exists. Omit entirely otherwise.]

- **Wiki entries total:** X (Y updated this week)
- **Challenge report:** [If exists] X entries challenged, Y contradictions, Z confirmations — [link to `wiki/challenges/CHALLENGE-YYYY-WXX.md`]
- **Top contradiction:** [W-XXXX-X] "[topic]" — [1-line summary of why it contradicts]
- **Stale entries (>30 days):** X
- **Graduation candidates:** Y entries ready to promote
- **Suggestion:** [Specific action — e.g., "Review contradictions before Monday planning" or "Run wiki promote W-XXXX-X"]

[If no challenge report for this week:] *Assumption Challenger não rodou esta semana — considere rodar manualmente ou aguardar próxima sexta.*

## Prioridades para Proxima Semana

### Top 3 Sugeridas

1. **[Priority 1]** — Conecta a: [Quarter goal]. [Why this is #1 next week]
2. **[Priority 2]** — Conecta a: [Quarter goal]. [Why]
3. **[Priority 3]** — Conecta a: [Quarter goal]. [Why]

### Tambem no radar
- [Item that didn't make Top 3 but matters]
- [Item carried over from this week]

---
*Review feito em: [timestamp]*
```

### Step 6: Assumptions Check (quarterly)

If this is the **last week of a quarter** (weeks 13, 26, 39, 52) or the first review of a new quarter:

1. Read `@global-context/shared/assumptions.md`
2. Prompt the user: "Quarterly assumption check — are these still valid?"
3. For each Current Truth and 6-Month Bet, briefly assess if evidence still supports it
4. Move invalidated assumptions to the "Invalidated" section
5. Suggest new assumptions based on the quarter's learnings

If not a quarter boundary, skip this step silently.

### Step 7: Toolkit Health

Read `@to_do's/toolkit-improvements.md` and briefly surface:
- Total improvement ideas captured
- Top 1-2 by `(Impact * Mentions) / Effort` ratio
- Items with 3+ mentions (repeated friction points)
- Items pending for 4+ weeks
- Suggest: "Want to review and implement a toolkit improvement this week?"

### Step 8: Update Week Priorities

**Automatically** update `@to_do's/week-priorities.md`:

1. Move current week's priorities to "Semana Anterior" section with results
2. Write the new Top 3 in the main section (from user input or suggested)
3. Update the week date range and timestamp

### Step 9: Update Quarter Goals

**Automatically** update `@to_do's/quarter-goals.md`:

1. Update progress percentages based on the week's analysis
2. Update initiative statuses if any changed
3. Update the "Atualizado" timestamp

### Step 10: Capture Learnings

If the user shared learnings or strategic insights:

1. Append to `@to_do's/learnings/preferences.md` (if about working style)
2. Append to `@to_do's/learnings/patterns.md` (if about errors or anti-patterns)

### Step 11: Update Usage Log

Read `@to_do's/learnings/usage-log.md` and update the summary section:

1. Count usage by template, skill, reviewer, and framework this week
2. Identify templates/skills never used in the last 30 days
3. Generate a "Sugestão da semana" — recommend 1 unused template or skill with a brief reason why it would be useful based on the week's work

### Step 12: Skill Ratings Summary

Read `@to_do's/learnings/skill-ratings.md` (if exists) and surface skills with average rating <3:

> **Skills com rating baixo esta semana:** [skill-name] (media: X.X) — investigar?

### Step 13: Notify User

> **Weekly review completo!**
>
> - Semana: X/3 prioridades avancaram
> - Quarter: [on track / behind] com X semanas restantes
> - Proxima semana: [Top priority #1]
> - [Stale commitments warning if any]
> - Toolkit: X melhorias pendentes (top: [top improvement], [N] com mencoes repetidas)
> - Workspace health: XX/100 [brief note if < 60]
> - Sugestao da semana: experimentar [unused template/skill]
> - [If wiki exists] Knowledge Health: X entries | Y contradictions | Z graduation candidates
> - Review salvo em `to_do's/weekly-reviews/YYYY-WXX.md`

**Usage tracking:** Update `@to_do's/learnings/usage-log.md` — increment the "Weekly Review" row count and update "Last Used" date.

## Tone Guidelines

- Be analytical but not cold — this is a moment of reflection
- Celebrate wins, even small ones connected to quarter goals
- Be honest about what didn't work — but focus on "what to change" not "what went wrong"
- Keep strategic insights sharp and actionable
- The whole process should take 10-15 minutes max

## Error Handling

### No Daily Reviews
If no daily reviews exist for the week:
- Build the synthesis from briefings, tasks, and Fireflies data
- Suggest starting daily reviews next week for richer weekly synthesis

### No Fireflies Data
If Fireflies is unavailable:
- Build from briefings, tasks, and user input only
- Note: "Sem dados de reunioes do Fireflies esta semana"

### First Week Using This
If no previous weekly review exists:
- Skip the comparison with last week
- Focus on establishing the baseline
- Suggest the user fill in quarter-goals.md if not yet done
