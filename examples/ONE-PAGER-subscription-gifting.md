# One-Pager: Subscription Gifting

| Campo | Valor |
|-------|-------|
| **Autor** | Paulo (PM) |
| **Status** | Validating |
| **Data** | 2026-03-10 |
| **Domínio** | Subscriptions |

---

## O Problema (em 1 parágrafo)

Merchants que vendem assinaturas não conseguem oferecer a opção de "presentear" uma assinatura. Isso elimina um canal de aquisição orgânica: o gifting. Dados de mercado mostram que 35% dos subscribers de meal kits e 28% dos subscribers de café foram adquiridos via gift. Nossos merchants perdem essa receita porque a plataforma não suporta compras em nome de terceiros com data de ativação programada.

## Solução Proposta

Habilitar "Gift this subscription" no checkout, permitindo que o comprador:
1. Escolha uma data de entrega do gift
2. Adicione mensagem personalizada
3. O presenteado recebe email/SMS com link de ativação
4. Após ativação, o presenteado gerencia sua própria assinatura

## Por que Agora?

- **Timing:** Dia das Mães (maio), Dia dos Namorados (junho) — pico de gifting na LATAM
- **Demanda:** 12 merchants enterprise pediram nos últimos 3 meses via CS
- **Competição:** Shopify lançou subscription gifting em janeiro 2026
- **Custo de não fazer:** Merchants começam a buscar apps de terceiros, fragmentando a experiência

## Sizing Estimado

| Métrica | Estimativa | Premissas |
|---------|------------|-----------|
| Merchants potenciais | 450 (com subscriptions ativas) | Base atual com >10 assinantes |
| Aumento de GMV | +8-12% sobre GMV subscriptions | Benchmark: 10% dos orders viram gifts |
| Novos subscribers | +2.000/mês | Conversão de 15% dos gifts recebidos |
| Revenue incremental | ~$45K/mês | Ticket médio $22.50 x 2.000 |

## Riscos Principais

1. **Complexidade de billing:** Quem paga o renewal? Comprador ou presenteado?
   - _Mitigação:_ Gift cobre apenas o primeiro ciclo; renovação é responsabilidade do presenteado
2. **Fraude:** Gift como vetor de chargebacks
   - _Mitigação:_ Limite de gifts por comprador, anti-fraud scoring
3. **Experiência do presenteado:** Link de ativação expira/não funciona
   - _Mitigação:_ Expiração de 90 dias, reenvio automático em 7 dias

## Opções Consideradas

| Opção | Prós | Contras | Recomendação |
|-------|------|---------|--------------|
| **A: Gift full (billing transfer)** | Experiência completa | Complexo: billing transfer, dispute de ownership | Fase 2 |
| **B: Gift prepaid (1 ciclo)** | Simples, baixo risco | Presenteado precisa pagar para continuar | **Recomendado para MVP** |
| **C: Gift card/voucher** | Flexível | Não gera subscriber direto | Descartado |

## Next Steps

1. Validar com 5 merchants enterprise (semana de 2026-03-17)
2. Design do fluxo de checkout com gifting
3. Spec técnica (integração com billing engine)
4. Review de engenharia

---

*Gerado pelo Cadence OS — [One-Pager Template](../.cursor/rules/one-pager-template.mdc)*
