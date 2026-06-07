# Component Patterns — Farmei

> Sources: README.md, 2026-05-16; ui_kits/mobile/components.jsx, 2026-05-16
> Raw: [Design System Guide](../../raw/design-system/2026-05-16-design-system-guide.md); [Mobile Screens](../../raw/ui-kits/2026-05-16-mobile-screens.md)

## Overview

Síntese dos padrões de componentes do Farmei derivados do design system e dos UI kits.

**Status de implementação (2026-06-07):**
- **Mobile (`apps/mobile/components/ui/`):** implementado com inline styles React Native + `tokens.ts`. Sem shadcn/ui (não existe no RN).
- **Web (`apps/web/components/ui/`):** implementado com inline styles React + `tokens.ts`. Sem Tailwind (não configurado no web app).

Ambas as plataformas compartilham os mesmos valores de tokens (cores, fontes, stamp shadow) definidos diretamente como constantes TypeScript em `tokens.ts` de cada plataforma — derivados de `colors_and_type.css`.

## Inventário de componentes implementados

### Mobile (`apps/mobile/components/ui/`)

| Componente | Arquivo | O que cobre |
|---|---|---|
| Tokens | `tokens.ts` | Toda a paleta, fontes, stamp/stampAi como objeto TS |
| PrimaryButton | `Button.tsx` | Vermillion + stamp shadow, tamanhos sm/md/lg |
| SecondaryButton | `Button.tsx` | White + ink border, sem stamp |
| AIButton | `Button.tsx` | Ink bg + spark yellow text + stamp vermillion |
| GhostButton | `Button.tsx` | Sem background, ação terciária |
| NewButton | `Button.tsx` | Pill ink, "+" para criar evento |
| Avatar | `Avatar.tsx` | Iniciais coloridas, key person indicator (dot vermillion) |
| AvatarStack | `Avatar.tsx` | Overlap com margem negativa, overflow +N |
| AppHeader | `AppHeader.tsx` | Back button circular, título centralizado, slot de ação |
| FilterChips | `FilterChips.tsx` | ScrollView horizontal, active = ink bg |
| EventCard | `EventCard.tsx` | Evento privado: badge locked/waiting, AvatarStack |
| PublicEventCard | `PublicEventCard.tsx` | Evento público: occupancy bar colorida, badge de categoria |
| Field | `Field.tsx` | Input com label uppercase, border ink100 |
| Sparkle | `Sparkle.tsx` | SVG via react-native-svg, cor configurável |

## Botões

### Primary Button (CTA principal)
- Background: `vermillion` (#FF3B2E)
- Texto: white, font-body, 600, 15–17px
- Border: 2px solid ink
- Stamp shadow: `3px 3px 0 ink`
- Press: `translateY(1px)`, stamp reduz a 0
- Hover: `translateY(-1px)`, stamp cresce 1px
- Uso: uma ação principal por tela. Lock in, criar evento, confirmar.

### Secondary Button
- Background: white
- Texto: ink, font-body, 600
- Border: 1.5px solid ink
- Sem stamp shadow
- Uso: ações secundárias, "back to events"

### AI Button (único)
- Background: ink
- Texto: **spark yellow** (#FFD93D)
- Border: 2px solid ink
- Uso: **exclusivamente** para "Submit & let AI pick" — o único botão com cor spark
- Nunca usar em outros contextos

### Ghost Button
- Sem background, sem border visível
- Uso: "I already have an account" em onboarding, ações terciárias

## Cards

### Standard Card
- Background: white
- Border: 1px solid ink100 (#E8E6E0)
- Radius: 20px (r-lg)
- Padding: 24px (medium) / 32px (hero)
- Hover: stamp shadow aparece, card sobe 1px

### AI Suggestion Card (hero do produto)
- Background: **spark yellow** (#FFD93D)
- Border: 2px solid ink
- Stamp shadow: **4px 4px 0 ink** (stamp-lg)
- Radius: 24px
- Conteúdo: Sparkle icon + "Farmei AI · best fit" eyebrow (uppercase, ink), data em display font (44px), hora em mono, dashed border separando data de attendees
- Esta é a aplicação mais importante de spark yellow no produto

### Conflict Card
- Background: vermillionSoft (#FFF1EE)
- Border: 1px solid vermillion (30% opacity)
- Uso: "Heads up — [nome] can't make [dia]"
- Conteúdo: Avatar + mensagem warm, sem alarme

### Info Card / Info Row
- Background: white
- Border: 1px solid ink100
- Radius: 16–18px
- Seções separadas por hairlines internas

## Disponibilidade (Availability Picker)

Grid de dias clicáveis, ciclo: unset → yes → maybe → no → unset

| Estado | Background | Texto | Border | Label |
|--------|-----------|-------|--------|-------|
| Unset | white | ink500 | ink100 | · |
| Yes | success (#2EA862) | white | success | ✓ |
| Maybe | warnSoft (#FFF0D6) | amber (#9D6B0C) | #F5C66B | ~ |
| No | ink (#0A0A0A) | white | ink | ✕ |

Cada célula: dia da semana (body, 11px), número (fontMono, 18px, bold), label do estado.

## Barra de Ocupação (Eventos Públicos)

- Track: 6–8px height, background ink100, radius 3–4px
- Fill color dinâmica:
  - < 50% → success verde
  - < 80% → warn âmbar
  - ≥ 80% → vermillion
- Contador em fontMono ao lado: `current/max`
- Card borda vermillion 2px quando lotado

## Filter Chips

Pills horizontais, overflow-x auto, gap 8px.
- Ativo: background ink, texto white
- Inativo: background white, border 1px ink100, texto ink700
- Categorias de eventos públicos: All | Sports | Music | Social | Food

## Avatar e AvatarStack

- Avatar: círculo com initials coloridas (colorIdx 0–6 mapeado para paleta)
- Key person: anel vermillion ao redor + badge "KEY" em spark yellow (sobre bg ink)
- AvatarStack: overlap de 8px, max configurável, "+N" badge se exceder

## AI Shimmer (loading state)

Gradient spark soft (#FFF4BD) deslizando da esquerda para a direita sobre o card. Animação ~1.4s em loop. Para **imediatamente** quando o resultado aparece. Uso exclusivo durante processamento do algoritmo de melhor data.

## Bottom Navigation (Mobile)

3 tabs: Home | Public | Profile.
- Ativo: ícone fill + texto vermillion ou ink bold
- Inativo: ícone regular, ink400
- Borda superior hairline + paper @ 80% com backdrop-blur

## Status Badges (Eventos Privados)

- "locked in": background successSoft, texto success. Evento confirmado.
- "waiting": background warnSoft, texto amber. Aguardando respostas.

## Eyebrow Labels

- Font: body, 11–12px, weight 700, letter-spacing 0.08–0.12em, UPPERCASE
- Color: ink500 ou ink400
- Uso: seções de detalhe, labels de campo, categorias

## See Also

- [Visual Foundations](visual-foundations.md)
- [Brand Voice & Copy](brand-voice-and-copy.md)
- [Private Event Flow](../ui-flows/private-event-flow.md)
- [Public Event Flow](../ui-flows/public-event-flow.md)
