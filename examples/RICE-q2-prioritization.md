# RICE Prioritization — Subscriptions Q2 2026

| Campo | Valor |
|-------|-------|
| **Autor** | Paulo (PM) |
| **Data** | 2026-03-18 |
| **Domínio** | Subscriptions |
| **Quarter** | Q2 2026 |

---

## Scoring Criteria

| Dimension | Scale | Anchoring |
|-----------|-------|-----------|
| **Reach** | Merchants impacted/quarter | 10=<50, 30=50-200, 50=200-500, 80=500-1000, 100=>1000 |
| **Impact** | Effect on KPI | 0.25=Minimal, 0.5=Low, 1=Medium, 2=High, 3=Massive |
| **Confidence** | Data quality | 100%=High (data+research), 80%=Medium (some data), 50%=Low (gut feeling) |
| **Effort** | Person-months | Engineering team capacity |

---

## Feature Scoring

| # | Feature | Reach | Impact | Confidence | Effort | RICE Score | Rank |
|---|---------|-------|--------|------------|--------|------------|------|
| 1 | Checkout One-Click Mobile | 80 | 2 | 80% | 2 | **64.0** | 1 |
| 2 | Subscription Gifting | 50 | 2 | 80% | 3 | **26.7** | 2 |
| 3 | Pause/Resume Subscription | 100 | 1 | 100% | 2 | **50.0** | 3 |
| 4 | Multi-frequency (weekly/biweekly) | 30 | 1 | 50% | 1.5 | **10.0** | 5 |
| 5 | Subscriber Analytics Dashboard | 50 | 1 | 80% | 2 | **20.0** | 4 |
| 6 | Custom Cancellation Flows | 80 | 1 | 80% | 3 | **21.3** | — |

---

## Recomendação de Priorização

### Must Do (Q2)
1. **Checkout One-Click Mobile** (RICE: 64.0) — Maior impacto em GMV, alinhado com quarter goal
2. **Pause/Resume Subscription** (RICE: 50.0) — Alto reach, reduz churn direto

### Should Do (Q2, se sobrar capacity)
3. **Subscription Gifting** (RICE: 26.7) — Timing com Dia das Mães, mas effort alto
4. **Custom Cancellation Flows** (RICE: 21.3) — Reduz churn, mas requer design research

### Could Do (Q3 backlog)
5. **Subscriber Analytics Dashboard** (RICE: 20.0) — Valor para merchants mas não urgente
6. **Multi-frequency** (RICE: 10.0) — Baixa confiança, precisa mais pesquisa

---

## Sensibilidade

Se **Confidence** de Checkout One-Click cair de 80% para 50% (ex: risco técnico de tokenização), o RICE cai para 40.0 — ainda #1, mas margem menor sobre Pause/Resume.

Se **Effort** de Gifting cair de 3 para 2 (ex: simplificar para prepaid only), RICE sobe para 40.0 — sobe para #2.

---

## Dependencies & Constraints

| Feature | Dependency | Constraint |
|---------|------------|------------|
| Checkout One-Click | Payment gateway token API | PCI compliance review needed |
| Subscription Gifting | Billing engine changes | Precisa spec de transfer/ownership |
| Pause/Resume | Billing engine | Não pode pausar no meio de ciclo pago |

---

*Gerado pelo Cadence OS — [RICE Template](../.cursor/rules/rice-analysis.mdc)*
