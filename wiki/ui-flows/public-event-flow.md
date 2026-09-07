# Public Event Flow — Farmei

> Sources: ui_kits/mobile/screens-public.jsx, 2026-05-16
> Raw: [Mobile Screens](../../raw/ui-kits/2026-05-16-mobile-screens.md)

## Overview

O fluxo público é mais simples que o privado: data fixa, sem algoritmo de disponibilidade. O elemento visual central é a **barra de ocupação com cor dinâmica** e a clareza sobre quem já vai. Três telas: feed → detalhe → criação (para hosts).

## Fluxo

```
PublicEventsHome → PublicEventDetails → [inscrição]
                                    ↑
                        CreatePublicEvent (host only)
```

## Tela 1 — PublicEventsHome ("O que está rolando")

**Propósito:** descoberta de eventos públicos.

- Header: `"O que está rolando"` (ink500) + `"Perto de você"` (display 38px)
- Botão `"+ Host"` compacto (ink bg) para hosts
- Filter chips: All | Sports | Music | Social | Food

### EventCard (público)
Campos por card:
- Horário em fontMono uppercase (ex: `"Sex · Jun 07 · 20:00"`)
- Título em fontDisplay
- Localização com 📍
- Badge de categoria (cor da categoria em bg opacity 20%)
- **Barra de ocupação** (6px, colors dinâmicas):
  - < 50% vagas usadas: success verde
  - < 80% vagas usadas: warn âmbar
  - ≥ 80% vagas usadas: vermillion
  - Contador fontMono: `"8/12"`
- Avatar stack dos inscritos
- Quando lotado: border vermillion 2px + banner `"⚠️ Lotado!"`

### Exemplos de eventos no protótipo
| Título | Vagas | Categoria | Local |
|--------|-------|-----------|-------|
| Futebol na quadra de salão | 8/12 | Sports | Quadra Arena 5 |
| Volley de praia | 6/10 | Sports | Praia do Leblon |
| Show de Rock — Caverna Pub | 24/80 | Music | Caverna Pub · Lapa |
| Pagodinho no bar da esquina | 12/40 | Music | Bar do Zé |

## Tela 2 — PublicEventDetails

**Propósito:** detalhe e inscrição.

### Hero card
- Background: cor da categoria em opacity 15%
- Border: cor da categoria em opacity 50%
- Localização em eyebrow com 📍
- Título display 28px
- Horário em fontMono

### Seção de lotação
- Track de 8px, fill colorido (mesma lógica das cores)
- Porcentagem + ratio: `"67% · 8/12"`
- Se tem vagas: `"Ainda há 4 lugares"`
- Se lotado: `"⚠️ Evento lotado"` em vermillion

### Seção "Quem já vai"
- AvatarStack size 36, max 6
- `"+N outras pessoas já se inscreveram."`

### Seção "O que é"
- Body text descritivo do evento

### CTA
- Se tem vagas: Primary `"✓ Eu vou!"` (vermillion + stamp)
- Se lotado: Primary disabled `"❌ Lotado"`

## Tela 3 — CreatePublicEvent (host)

**Propósito:** criação de evento público por host.

Campos:
- **Nome do evento** — fontDisplay 22px
- **Local** — text input
- **Categoria** — select: Sports | Music | Social | Food | Art
- **Data e hora** — text input
- **Lotação máxima** — number input em fontMono. Hint: `"Quantas pessoas cabem?"`
- **Descrição breve** — textarea

CTA: `"Criar e começar a vender →"`

## Diferenças chave vs. fluxo privado

| Dimensão | Privado | Público |
|----------|---------|---------|
| Data | Definida por algoritmo | Fixa no formulário |
| Spark Yellow | Sim (AI card + banner) | Não |
| Barra de ocupação | Não | Sim (obrigatória) |
| Key person | Sim | Não |
| Convites | Por link/email | Aberto para todos |
| Copy principal | "Let AI pick" | "Eu vou!" |
| Idioma do copy | EN + flavor PT/ES | PT-BR |

## Regras UX do fluxo público

1. **Barra de ocupação é obrigatória** em qualquer lista e detalhe de evento público
2. **Cores da barra** refletem urgência real — não são decorativas
3. **Lotado = botão disabled + border vermillion** — o bloqueio deve ser inequívoco
4. **"Quem já vai"** é o elemento social central — nunca omitir na tela de detalhe
5. **Sem spark yellow** — o fluxo público não tem IA; usar spark aqui violaria a semântica

## See Also

- [Private Event Flow](private-event-flow.md)
- [Business Rules](../product/business-rules.md)
- [Component Patterns](../design-system/component-patterns.md)
