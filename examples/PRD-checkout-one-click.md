# PRD: Checkout One-Click Mobile

| Campo | Valor |
|-------|-------|
| **Autor** | Paulo (PM) |
| **Status** | Draft |
| **Última Atualização** | 2026-03-15 |
| **Domínio** | Subscriptions |
| **Jira Epic** | SUB-1234 |

---

## 1. Problema

Merchants com assinaturas ativas perdem 23% dos checkouts mobile por abandono no fluxo de pagamento. O checkout atual exige 4 telas e re-entrada de dados para subscribers recorrentes, criando fricção desnecessária para quem já é cliente.

**Dados de suporte:**
- Taxa de abandono mobile: 67% (vs 41% desktop)
- 78% dos abandonos ocorrem na tela de pagamento
- Merchants com >100 assinantes reportam "checkout lento" como top 3 reclamação

## 2. Contexto Estratégico

**Alinhamento com visão do domínio:** A missão de Subscriptions é maximizar receita recorrente. Reduzir fricção no checkout aumenta GMV de recorrência e reduz churn passivo (falha de pagamento por abandono).

**Quarter Goal:** Aumentar GMV de subscriptions em 15% Q2 2026.

## 3. Solução Proposta

Checkout one-click para subscribers recorrentes no mobile:

- Reconhecimento automático de subscriber via session/cookie
- Pagamento com método salvo em 1 tap
- Confirmação inline sem redirect
- Fallback para checkout completo se método salvo expirou

## 4. User Stories

### US-1: Subscriber compra com 1 tap
**Como** subscriber recorrente no mobile,
**Quero** completar minha compra com um único toque,
**Para que** eu não precise re-digitar dados de pagamento toda vez.

**Acceptance Criteria:**
- DADO que sou subscriber ativo com método de pagamento salvo
- QUANDO acesso o checkout no mobile
- ENTÃO vejo botão "Comprar com [método salvo]" em destaque
- E ao tocar, o pedido é processado em <3 segundos
- E recebo confirmação inline na mesma tela

### US-2: Fallback para checkout completo
**Como** subscriber com método de pagamento expirado,
**Quero** ser direcionado ao checkout completo com dados pré-preenchidos,
**Para que** eu possa atualizar meu pagamento sem começar do zero.

## 5. Requisitos Técnicos

| Requisito | Detalhe |
|-----------|---------|
| Tokenização | Usar token PCI-compliant do gateway atual |
| Latência | Processamento <3s P95 |
| Segurança | Biometria/PIN do device como segundo fator |
| Compatibilidade | iOS Safari 15+, Android Chrome 90+ |
| Acessibilidade | WCAG 2.1 AA |

## 6. Métricas de Sucesso

| Métrica | Baseline | Target | Prazo |
|---------|----------|--------|-------|
| Taxa de conversão mobile checkout | 33% | 55% | 60 dias pós-launch |
| Tempo médio de checkout (mobile) | 47s | <10s | Launch |
| GMV recorrente mobile | $120K/mês | $180K/mês | 90 dias |
| NPS do checkout | 32 | 50+ | 90 dias |

## 7. Riscos

| Risco | Probabilidade | Impacto | Mitigação |
|-------|--------------|---------|-----------|
| Token expirado sem aviso | Média | Alto | Validação assíncrona pré-checkout |
| Fraude por device roubado | Baixa | Alto | Biometria obrigatória + limite por transação |
| Gateway timeout em pico | Média | Médio | Circuit breaker + retry automático |

## 8. Fora de Escopo

- Checkout one-click para desktop (fase 2)
- Novos métodos de pagamento (Pix, boleto recorrente)
- Customização visual por merchant

## 9. Timeline

| Fase | Duração | Entregável |
|------|---------|------------|
| Discovery | 1 semana | Mapa de jornada validado |
| Design | 1 semana | Protótipo mobile testado |
| Desenvolvimento | 3 semanas | MVP funcional |
| Beta (10 merchants) | 2 semanas | Validação em produção |
| GA | 1 semana | Rollout completo |

---

*Gerado pelo Cadence OS — [PRD Template](../.cursor/rules/prd-template.mdc)*
