# Business Rules — Farmei

> Sources: Internal PRD, 2026-05-16; Modelo V2 fechado em grill session, 2026-09-07
> Raw: [Farmei PRD](../../raw/product/2026-05-16-farmei-prd.md)

## Overview

As regras de negócio do Farmei se dividem em quatro domínios: o algoritmo de sugestão de data (exclusivo do modo privado), as regras de eventos públicos, o sistema de reputação/presença que atravessa os dois modos, e a gamificação (stickers). As decisões do modelo V2 carregam a tag **D** correspondente (registradas no grill session de 2026-09-07).

## Modo privado

### Criação (D15)

- O criador define: título, local, **janela de datas**, **quórum mínimo** (`quorumMin`, inteiro ≥ 1) e, opcionalmente, uma **pessoa-chave** (pode ser ele mesmo ou outro).
- O quórum é **obrigatório** — o evento só pode ser confirmado se algum candidato atingir a meta.
- O sistema sugere uma janela "vantajosa" de timeframe (ex.: "dia 01 ao 21 do mês") para o rolê acontecer.

### Grade de votação (D15.1)

Cada convidado vota numa **grade (dia × turno)**. Turnos fixos, enum com 4 valores:

| Turno | Valores |
|-------|---------|
| manhã | MANHA |
| tarde | TARDE |
| noite | NOITE |
| altas horas | ALTAS_HORAS |

- **Multi-seleção:** o usuário pode marcar manhã E noite do mesmo dia.
- Voto MAYBE também é por par (dia, turno).
- Ao marcar, o sistema emite **aviso de conflito** se a pessoa já tem rolê confirmado no mesmo dia (D16).
- A sugestão retorna o melhor **par** (dia, turno) — não apenas o dia.

### Key person (D1, D20)

- Key person é um **portão obrigatório, não um peso**. Não existe multiplicador.
- Um par (dia, turno) só é candidato se a key person respondeu **YES** nele.
- Key person com **NO** ou **MAYBE** elimina o par da candidatura.
- Se a key person **nunca respondeu** ou respondeu **NO para tudo**, não há candidato e o evento **não pode ser confirmado**.
- Em ambos os casos (sem resposta / sem nenhum YES), o sistema dispara **alerta ativo para o criador**: esperar, trocar a key person, ou cancelar (D20).

### Pesos por resposta

| Resposta | Peso |
|----------|------|
| YES | 1.0 |
| MAYBE | 0.5 |
| NO | 0.0 |

### Peso de pessoas indicadas (D2, D5, D12)

- **Qualquer participante** pode indicar alguém para o rolê (não só o criador) (D12).
- A pessoa indicada recebe peso `1.5 × nº de indicadores` (2 indicações → 3.0). **Sem teto** (D2).
- O peso da indicação **só ativa depois que a pessoa indicada aceita** o convite. Se recusar, ela não existe na contagem (D5).
- Voto **NO nunca é boostado** por indicação.
- Key person **não recebe** multiplicador (é portão, ver D1).

### Cálculo por par (dia, turno)

Para cada par na janela definida pelo organizador:
```
score(par) = Σ [peso_resposta(p) × multiplicador_indicacao(p)]
```
onde `multiplicador_indicacao(p)` = `1.5 × nº_indicadores(p)` se p aceitou o convite e foi indicado, 1 caso contrário. Key person: multiplicador não se aplica (apenas gate).

### Seleção do melhor par

1. Apenas pares em que a key person respondeu YES (D1).
2. Ordenar por `score` decrescente.
3. Tiebreaker: par mais cedo (data, depois turno).

### Confidence score

```
confidence = score(par_vencedor) / max_possible_score
max_possible_score = Σ [max_peso_resposta(p) × multiplicador_indicacao(p)]
```
(max_peso_resposta = 1.0 para todos; se não houver key person, todos os respondedores contam.)

### Explicação textual

O sistema gera uma justificativa em linguagem natural via template baseado nos dados. Sem dependência de LLM no MVP (ADR-007).

O campo `reasoning` no response já está previsto para receber explicação via LLM em versão futura (Claude).

### Quórum (D15)

- Quórum conta **YES no par candidato**. MAYBE e NO não contam.
- Quem confirma conta (se o criador se auto-marcou, ele conta no quórum).
- Confirmação **bloqueada** enquanto nenhum candidato atingir o quórum: UI mostra "quórum não atingido — faltam N".
- Barra mostra "X de N confirmaram — quórum é M".
- O quórum não substitui o gate da key person — ambos se aplicam.

### Confirmação e janela de 1 dia (D14, D17, D18)

1. **O criador confirma** o par (dia, turno) — via botão "confirmar sugestão" (usa a sugestão) ou "escolher outro dia" (lista de candidatos com nota).
2. O sistema dispara **alerta para todos**: "o rolê vai ser dia X, turno Y".
3. Abre a **janela de 1 dia**: cada confirmado pode **dar bolo** (sair) ou **entrar** (participar).
4. Passou a janela → **trava**. Status CONFIRMED final, zero bolo depois (D18).
5. Se dentro da janela o quórum cai (alguém deu bolo): **re-match automático** para o próximo melhor par com quórum → novo alerta + nova janela. Sem candidato → status "sem data", criador avisado (D17).

**Pós-janela:** porta fechada — ninguém entra (todos foram avisados no alerta).

### Chegante do dia e "rolê aleatório" (D19, D21)

- No dia do evento, o criador pode **adicionar pessoas manualmente** ("chegante do dia").
- Elas entram numa **lista própria "rolê aleatório"** — fora do fluxo normal, no CSV do criador (o registro reflete a verdade: "7 confirmados no app + 2 no dia").
- **Não podem farmar Aura** (quem não passou pelo app não colhe recompensa do app).
- A lista "rolê aleatório" é **invisível no perfil** — só aparece no rolê/CSV do criador (D21).
- Presença deles, se verificada por fontes, alimenta reputação normalmente (D24).

### Peso de reputação no quórum (D23, D26, D29)

- Cada pessoa carrega um **peso de confiabilidade** derivado do histórico de presença (janela **3 meses rolante**; replicada igual para privado e público en um único histórico) (D26).
- No quórum privado, o peso é aplicado **de forma escondida**: a barra mostra **só o número de gente** ("10 confirmados"), a ponderação é interna ao cálculo. Confiável vale mais (ex.: 1.2), buraco vale menos (ex.: 0.7), neutro 1.0, **nunca zera**, key gate intacto, NO intacto (D23).
- A **zoeira é só no privado**: o sistema solta para todos que confirmaram o aviso *"10 confirmados… mas 2 aqui têm fama de dar bolo"* — nunca para o público (D29).
- Regras de confiabilidade são sempre **explicadas** ao criar um rolê que usa o modo (D27).

## Sistema de presença e reputação

### Presença (D24, D25)

A "reputação de confiável" só existe com **presença registrada**. Sinais possuem pesos:

| Fonte | Peso |
|-------|------|
| Auto-check-in do próprio | 1.0 |
| Host marca (geo × horário ou manual) | 2.0 |
| Geofence do local batendo na janela do turno | 1.5 |
| Atestado de participante próximo | 0.5 (máx. 3) |

- **Mínimo de 2 fontes** para contar como presente (auto-check-in sozinho não vale — o buraco não se marca de casa).
- **Teto de 3.0** por pessoa/rolê.
- Requer permissões de localização opt-in.

### Desempate por confiabilidade (D31)

Empate no critério de confiabilidade resolve em degraus, nesta ordem:
1. **Quem foi mais indicado** (nº de indicações).
2. **Quem tem mais amigos no mesmo evento** (conectado fica na frente de quem chegou sozinho).
3. **Sorteio** como piso justo.

Esse desempate vale tanto no modo confiabilidade do público quanto na fila ponderada (D30).

### Stickers / gamificação (D21b)

- **Sticker por traço**, sem escada única (sem ranque militar unificado).
- Cada sticker conta uma história independente: vai a muitos eventos, é sempre indicado(a) ("fomosinha"), dá bolo demais, cria eventos sem ir nos outros.
- Gamificação = sistema separado que **evolui já no MVP** (não é v2 como a Aura).
- O sticker "Deu Bolo N×" é o mecanismo de "ser conhecido como aleatório" sem fofoca manual — acompanha o perfil nos rolês.

## Modo público

### Categorias (D13)

Enum fixo e fechado, 8 categorias:

| Valor |
|-------|
| esporte |
| música |
| gastronomia |
| cultural |
| rolês |
| negócios |
| religioso |
| natureza |

- Sem "festa" (evita monolito de categoria). Nova categoria = processo de PR, não input do usuário.
- No backend, substituir a string livre atual por enum (validação).

### Data e capacidade

- Data fixa na criação, sem algoritmo de disponibilidade.
- Capacidade máxima (`capacity`, inteiro > 0) bloqueia novas inscrições ao atingir o limite.

### Modo de admissão (D27)

O criador escolhe, na criação, o modo de admissão do rolê público. O sistema **recomenda** o modo com base no contexto:

| Situação | Modo recomendado |
|----------|------------------|
| RPG / grupo que é penalizado quando alguém falha | confiabilidade |
| Futebol — sem quórum mínimo não joga | confiabilidade |
| Rolê de moto no fim de semana com a turma das bikes | ordem de chegada |
| Improviso de instrumento com a galera | ordem de chegada |

As regras de cada modo são **sempre explicadas** na criação (nunca regime misterioso). Quando o modo é confiabilidade, vale o peso de reputação (D23/D26) com o desempate em degraus (D31).

### Inscrição e waitlist (D28, D30)

- Um usuário autenticado se inscreve uma vez por evento; pode cancelar.
- **Waitlist rolando no MVP** (revoga parcialmente ADR-010): ao lotar, o usuário entra na fila — "entre na fila" é verdade funcional.
- **Fila ponderada pelo modo (D30):**
  - modo **ordem de chegada** → FIFO pura (primeiro da fila entra primeiro);
  - modo **confiabilidade** → o **mais confiável da fila entra primeiro** (mesma régua D23/D26, janela 3 meses).
- Todo mundo da fila é avisado quando uma vaga abre, seja qual for o modo.

### Painel do host

- Owner visualiza lista completa de inscritos; pode exportar em CSV (com proteção contra injeção de fórmula).
- A lista "rolê aleatório" (chegantes do dia) aparece junto no CSV, separada (D19).

## Autenticação (D9, D10, D11)

- **Conta obrigatória** para responder convite/participar no MVP (D9).
- Login social do MVP: **Instagram (primary), TikTok, Google** + fallback **email/senha** (D10). Apple Sign-In → v2.
- Nota técnica: IG/TikTok OAuth muitas vezes não retornam email (exigem revisão de app); Google ancora a identidade real (email).
- Persona wall ("quem não tem IG/TikTok não usa") é **decisão de marketing, não técnica**: Google + email/senha permanecem como infra (recuperação, merge de identidade, convites) (D11).

## V2 (fora do MVP)

| Feature | Regra |
|---------|-------|
| Aura (economia) | Revelar "quem indicou quem" custa Aura; repetível (1x, 2x, 3x...); log de quem pagou é segredo vendável; indicada só sabe "N pessoas querem você no rolê", nunca nomes (D3/D4). Sem self-desmascaramento. Sem modelagem de relacionamento (neutro total) (D6). |
| Leilão de voto | Leilão para mudar dia/voto — v2 |
| Cronograma pago | Revelar dia/hora de quem interessa — v2 |
| Escolha de rolê do dia | Escolher entre múltiplos rolês do mesmo dia — v2 |

## Decisões pendentes que afetam regras

| # | Questão | Impacto |
|---|---------|---------|
| P2 | Eventos públicos terão geolocalização? | Schema de events e API de listagem |
| P4 | Papel separado de host com permissões distintas? | Middleware de auth e ownership checks |
| — | "Dia do bolo" como ritual semanal | Antes mantido como fantasia; modelo V2 adotou janela de 1 dia (D17) + aviso de conflito (D16). Revisitar se o ritual semanal retornar |

## See Also

- [Product Overview](product-overview.md)
- [Data Model](../architecture/data-model.md)
- [Architectural Decisions](../architecture/architectural-decisions.md)