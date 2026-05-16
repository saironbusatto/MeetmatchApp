# Private Event Flow — Farmei

> Sources: ui_kits/mobile/ (screens-a.jsx, screens-b.jsx, components.jsx), 2026-05-16
> Raw: [Mobile Screens](../../raw/ui-kits/2026-05-16-mobile-screens.md)

## Overview

O fluxo privado é o **diferencial central do produto**. Sete telas conectadas que levam do onboarding até o evento confirmado. A tela 6 (ResultScreen) é o hero do produto — onde o brand se manifesta mais completamente.

## Fluxo completo

```
Onboarding → Home → Create → Invite → Availability → Result → Confirmed
    1           2       3        4           5           6          7
```

## Tela 1 — Onboarding

**Propósito:** primeira impressão, ativação.

- Fundo paper com grande círculo decorativo vermillion no canto superior direito
- Spark dot (spark bg + ink border) sobreposto — único uso de spark fora de contexto de IA (é apenas decorativo aqui, aceitável por ser pré-produto)
- Headline display 56px: `"Let's find a time that works."`
- Body: `"You pick the people and a window. The AI does the math so nobody has to argue about Tuesday."`
- CTA duplo: Primary `"Get started — it's free"` + Ghost `"I already have an account"`

## Tela 2 — Home (lista de eventos)

**Propósito:** visão geral dos eventos do usuário.

- Saudação com flavor: `"Buenas, Sofia"`
- Título display: `"Your events"`
- Filtros: Upcoming | Waiting | Past | All (pill chips, primeiro ativo)
- Botão "+" compacto (ink bg, white, pill) no canto
- Lista de EventCards com:
  - Badge de status: **"locked in"** (successSoft bg) ou **"waiting"** (warnSoft bg)
  - Horário/status em fontMono uppercase
  - Título em fontDisplay
  - AvatarStack abaixo
- Bottom navigation

## Tela 3 — Create

**Propósito:** criação do evento privado.

Campos:
- **Título** — fontDisplay 22px, input de texto
- **Key person** — campo com Avatar + nome + "Their availability is weighted highest"
- **Janela de datas** — dois inputs "From / To" em fontMono (Jun 03 / Jun 14)
- **Duração** — pill chips selecionáveis: 30m | 1h | 1.5h | 2h | ½ day | Custom
- Hint: `"The AI will only suggest dates inside this range."`

CTA: `"Next: invite people →"`

## Tela 4 — Invite

**Propósito:** adicionar convidados e definir key person.

- Instrução: `"Add the crew. Mark a key person whose schedule has to work."`
- Search input com ícone de lupa
- Chips de convidados selecionados:
  - Key person: bg ink, texto white, badge "KEY" em spark yellow
  - Outros: bg white, border ink100
  - Botão "×" para remover
- Lista "Suggested" com botão "+" vermillionSoft
- Contagem: `"4 invited"`

CTA: `"Next: pick your days →"`

## Tela 5 — Availability

**Propósito:** participante marca disponibilidade por dia.

- Instrução de ciclo: tap para alternar yes ✓ | maybe ~ | no ✕
- Quick fill chips: All yes | Weekdays | Mornings
- Grid de dias (4 colunas):
  - Dia da semana (body 11px) + número (fontMono 18px bold) + ícone de estado
  - Cores: yes=success, maybe=warnSoft, no=ink
- Banner spark yellow **com Sparkle icon** (único momento de spark antes do resultado):
  - `"5 of 6 are in. Once you submit, the AI will pick a date."`

CTA: **AIButton** (bg ink, texto spark): `"Submit & let AI pick"` — único botão com essa combinação visual

## Tela 6 — Result (HERO DO PRODUTO)

**Propósito:** apresentar a sugestão com máximo impacto visual.

### AI Card principal (spark yellow + stamp)
- Background: **spark (#FFD93D)**, border 2px ink, radius 24px, stamp-lg shadow (4px 4px 0 ink)
- Eyebrow: Sparkle icon + `"Farmei AI · best fit"` (uppercase, ink)
- Data em display 44px: `"Tuesday / Jun 4"` (tight tracking)
- Hora em fontMono 17px: `"14:00 — 15:30"`
- Dashed border (1.5px ink) separando data de attendees
- Attendees: AvatarStack + `"5 of 6 in / Diego (key) ✓ · confidence 0.92"`

### Rationale card
- Background white, border hairline
- Eyebrow: `"Why this date?"`
- Explicação textual: `"It's the earliest day inside your window where Diego is free, and only Felipe can't make it. Wed Jun 5 also works for 5 of 6 — but Diego marked it 'maybe.'"`

### Conflict card
- Background vermillionSoft, border vermillion30
- `"Heads up — Felipe can't make Tuesday"` (warm, não alarmante)
- `"Tap to see other options that include him"`

### Other options
- Lista de alternativas com: dia, ratio, confidence score em fontMono, nota sobre conflito

CTA: Primary lg `"Lock in Tue, Jun 4"`

## Tela 7 — Confirmed

**Propósito:** celebração e detalhe do evento.

- Eyebrow: `"🎉 Locked in"` (success color)
- Título display 42px: `"Q3 planning lunch"`
- Data/hora em fontMono 18px
- Copy com flavor: `"In 14 days · ¡vamos!"`
- Info rows card (white, hairlines internas):
  - Where | Who (5 of 6 going) | Not coming
- Lista de attendees com check verde (✓) ou "regrets" text
- Key person com badge "Key" (texto vermillion, bg vermillionSoft)

CTAs: `"Back to events"` (Secondary) + `"Share"` (ink bg)

## Padrões UX notáveis

1. **Copy com voz consistente** — latino flavor aparece nos momentos de leveza (saudação, confirmação)
2. **Spark yellow aparece duas vezes no fluxo:** no banner de progresso da tela 5 e no AI card da tela 6. Nunca antes, nunca depois.
3. **Confidence score** sempre visível na tela de resultado (0.92 no exemplo)
4. **Conflitos são warm, não alarmes** — card vermillionSoft, não vermillion puro
5. **AIButton** é o único botão da interface com texto spark — semanticamente marcado como "ação de IA"

## See Also

- [Public Event Flow](public-event-flow.md)
- [Business Rules](../product/business-rules.md)
- [Component Patterns](../design-system/component-patterns.md)
