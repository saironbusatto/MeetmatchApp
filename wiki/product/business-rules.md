# Business Rules — Farmei

> Sources: Internal PRD, 2026-05-16
> Raw: [Farmei PRD](../../raw/product/2026-05-16-farmei-prd.md)

## Overview

As regras de negócio do Farmei se dividem em três domínios: o algoritmo de sugestão de data (exclusivo do modo privado), as regras de eventos públicos e a estratégia de convites.

## Algoritmo de sugestão de data

O algoritmo é **determinístico e baseado em pesos** — não é IA generativa. Roda em `packages/utils/src/date-suggestion.ts` como função pura, totalmente testável sem dependências externas.

### Pesos por resposta

| Resposta | Peso |
|----------|------|
| YES | 1.0 |
| MAYBE | 0.5 |
| NO | 0.0 |

### Key person

Participante marcado como key person recebe um multiplicador no seu peso. Default: **3x**. Configurável por evento. Ausência de key person = todos com peso 1.0.

### Cálculo por dia

Para cada dia na janela definida pelo organizador:
```
score(dia) = Σ [peso_resposta(p) × multiplicador(p)]
```
onde `multiplicador(p)` = key_person_weight se p for key person, 1 caso contrário.

### Seleção do melhor dia

1. Ordenar dias por `score` decrescente
2. Tiebreaker: data mais cedo em caso de empate

### Confidence score

```
confidence = score(dia_vencedor) / max_possible_score
max_possible_score = (n_participantes - 1) × 1.0 + key_person_weight × 1.0
```
(se não houver key person: `max_possible_score = n_participantes × 1.0`)

### Explicação textual

O sistema gera uma justificativa em linguagem natural via template baseado nos dados. Sem dependência de LLM no MVP.

Exemplo: `"Tue, Jun 4 works for 5 of 6 — the key person is free."`

O campo `reasoning` no response já está previsto para receber explicação via LLM em versão futura (Claude).

## Regras de eventos públicos

- **Data fixa:** definida na criação, sem algoritmo de disponibilidade.
- **Capacidade máxima:** inscrições bloqueadas ao atingir o limite. Mensagem clara ao usuário. Sem waitlist no MVP.
- **Inscrição:** um usuário autenticado pode se inscrever uma vez por evento. Pode cancelar inscrição.
- **Painel do host:** owner visualiza lista completa de inscritos; pode exportar em CSV.

## Regras de convites (MVP)

- Convites funcionam por **link compartilhável** gerado pelo sistema (UUID opaco).
- O organizador compartilha manualmente (WhatsApp, etc.).
- Ao acessar `/invite/:token`, o convidado pode criar conta ou responder sem conta (decisão pendente: P1).
- Sem envio automático de email no MVP. Ponto de evolução: Resend/Sendgrid.

## Decisões pendentes que afetam regras

| # | Questão | Impacto |
|---|---------|---------|
| P1 | Convidados precisam de conta para responder? | Modelo de event_participants e fluxo /invite |
| P2 | Eventos públicos terão geolocalização? | Schema de events e API de listagem |
| P4 | Papel separado de host com permissões distintas? | Middleware de auth e ownership checks |

## See Also

- [Product Overview](product-overview.md)
- [Data Model](../architecture/data-model.md)
- [Architectural Decisions](../architecture/architectural-decisions.md)
