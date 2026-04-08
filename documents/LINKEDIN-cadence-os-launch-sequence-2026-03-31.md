# LinkedIn Launch Sequence — Cadence OS

**Contexto:** Esses 2 posts são follow-ups do post inicial que já foi publicado.
**O post inicial já cobriu:** o problema de contexto espalhado, a carga cognitiva, a referência ao Drucker, a jornada pessoal de construção, a menção ao Cadence OS como open source com links.
**O que falta cobrir:** o que o sistema faz concretamente (dia a dia + features), e como começar na prática.

**Timing:** Postar com 2-3 dias de intervalo após o post inicial
**Hashtags sugeridas:** #ProductManagement #AI #OpenSource #Cursor #ClaudeCode
**Repo:** https://github.com/paulophl94/cadence-os

---

## Post 2 — Builder/Maker: "O que o sistema faz no dia a dia"

**Imagem sugerida:** Screenshot do day-with-cadence.html (timeline Morning -> During Day -> End of Day -> Friday) ou do ONBOARDING.html (capabilities grid)

**Referência ao post anterior:** Abre conectando ao post inicial sem resumir tudo de novo.

---

No último post apresentei o Cadence OS, um sistema operacional que venho construindo nos últimos meses.

Algumas pessoas me perguntaram: "mas o que isso faz na prática?"

---

Eu desenvolvi o Cadence OS pra facilitar que pessoas próximas a mim conseguissem usar inteligência artificial de forma realmente efetiva no dia a dia. Eu queria que fosse fácil compartilhar a forma como eu trabalho com AI com outras pessoas. Sem precisar explicar tudo do zero, sem depender de conhecimento técnico.

Por isso, dentro dele tem um fluxo de onboarding que não exige nenhuma linha de código. Você abre o Cursor ou Claude Code, digita /start, e o sistema te guia. Em poucos minutos, ele apresenta o skill set completo (templates, revisores, workflows) e mostra como cada peça se encaixa no seu dia a dia.

---

E é justamente no dia a dia que o sistema mostra seu valor.

De manhã, abro o Cursor e digo "briefing matinal." O sistema puxa calendário, Jira, compromissos abertos e o que ficou pendente de ontem. Me devolve 3 prioridades do dia, com justificativa de por que cada uma importa agora.

Não são 12 tarefas genéricas. São 3. Baseadas no que está em andamento e no que vence essa semana.

---

Quando preciso de um documento, digo "Crie um documento sobre [tema]." Antes de gerar, o sistema lê sozinho o contexto estratégico que você configurou. O output já nasce alinhado. Sem copiar e colar de 5 fontes diferentes.

Depois, peço "Revise como engenheiro." O documento passa por revisores simulados, são 6 perspectivas disponíveis, antes de qualquer humano ver.

---

Se tenho uma reunião, digo "prep para reunião com [Nome]." O sistema carrega o histórico daquela pessoa: interações, compromissos, decisões passadas. Depois, colo a transcrição e digo "processar notas." Ações viram tarefas rastreáveis e as páginas dos participantes são atualizadas.

No fim do dia, "revisão diária." Compara o que planejei vs o que fiz e prepara o contexto de amanhã. Na sexta, "revisão semanal" sintetiza padrões e sugere prioridades da próxima.

---

Mas o forte do sistema não é nenhuma feature isolada. É o que acontece quando tudo roda junto.

A cada briefing, reunião processada e documento gerado, o Cadence OS vai absorvendo e estruturando contexto. Seus objetivos. Seus stakeholders. Suas decisões. Seu estilo de trabalho.

Dia 1: útil mas genérico.
Semana 2: conhece suas preferências.
Mês 1: parece ter trabalhado com você por anos.

Não é uma ferramenta que você alimenta. É um sistema que aprende enquanto você trabalha.

---

Tudo open source. Tudo configurável. Zero código. No próximo post mostro como configurar em 10 minutos.

Link do repo nos comentários.

#ProductManagement #AI #OpenSource #Cursor #ClaudeCode

---

## Post 3 — Educacional: "Como começar em 10 minutos"

**Imagem sugerida:** Screenshot da seção "3-Tier Setup" do ONBOARDING.html ou do Quick Start do README

**Referência ao post anterior:** Fecha o arco. Move de "interessante" para "vou testar."

---

Dois posts atrás falei sobre o problema de contexto fragmentado. No último, mostrei como é um dia usando o Cadence OS.

Agora a parte prática: como começar.

O Cadence OS roda no Cursor ou Claude Code. Não precisa de código. Você configura seu contexto e começa a usar por linguagem natural.

Tem 3 níveis de setup — comece pelo que faz sentido pra você:

Nível 1 — 5 minutos
Faça fork do repo e preencha um único arquivo: o contexto do seu produto (nome, estratégia, KPIs, terminologia). Pronto. Você já tem acesso a 14 templates de documentos, 6 revisores multi-perspectiva e 6 frameworks estratégicos. Pede "Crie um PRD para [feature]" e o output já vem alinhado com o seu produto.

Nível 2 — 15 minutos
Adicione o sistema de planejamento: briefing matinal, revisão diária e semanal, processamento de notas de reunião. Configure metas do trimestre e prioridades da semana. O sistema passa a rastrear compromissos e cobrar quando algo atrasa.

Nível 3 — 30 minutos
Conecte Jira, Slack e calendário via MCP. O briefing matinal puxa dados ao vivo. As notas de reunião criam tickets. Status updates puxam progresso real dos projetos.

Como começar agora:

1. git clone https://github.com/paulophl94/cadence-os.git
2. Abra a pasta no Cursor ou Claude Code
3. Digite /start no chat

O onboarding interativo configura o resto — escolha o idioma, o nível de setup, e em poucos minutos você gera o primeiro documento.

O projeto é open source. Contribuições são bem-vindas: novos templates, novos revisores, traduções, integrações com ferramentas.

Se testar, me conta como foi. O feedback de quem usa é o que faz o sistema evoluir.

Link do repo nos comentários.

#ProductManagement #AI #OpenSource #Cursor #ClaudeCode
