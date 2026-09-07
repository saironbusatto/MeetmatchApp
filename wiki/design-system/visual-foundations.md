# Visual Foundations — Farmei Design System

> Sources: README.md (design system guide), 2026-05-16; colors_and_type.css, 2026-05-16
> Raw: [Design System Guide](../../raw/design-system/2026-05-16-design-system-guide.md); [Design Tokens CSS](../../raw/design-system/2026-05-16-design-tokens-css.md)

## Overview

O design system do Farmei é construído sobre uma base **paper-and-ink** — warm, analógico, confiante — com um único hero color (vermillion) e um accent reservado exclusivamente para momentos de IA (spark yellow). A assinatura visual do brand é o **stamp shadow**: offset de ink sem blur, aplicado em CTAs primários e AI cards.

## Hierarquia de cores

| Papel | Cor | Hex | Regra |
|-------|-----|-----|-------|
| Hero / primário | Vermillion | #FF3B2E | CTAs, wordmark dot, highlights. 5–10% dos pixels. |
| IA / accent | Spark Yellow | #FFD93D | **Somente** em momentos de IA. 1–3% dos pixels. |
| Texto principal | Ink | #0A0A0A | Texto, borders stamped, ícones |
| Canvas | Paper | #FAFAF7 | Background de página — warm, nunca pure white |
| Surface | White | #FFFFFF | Cards, panels |
| Hairline | Ink 100 | #E8E6E0 | Borders padrão, dividers, inputs |

**Regra crítica:** Spark Yellow aparece **exclusivamente** onde a IA está agindo ou agiu. Nunca decorativo, nunca em contextos não-IA. Violações desta regra destroem a semântica do sistema.

**Proibido:** gradientes bluish-purple, emoji-card backgrounds, colored-left-border banners.

## Tipografia

| Fonte | Uso | Nunca usar para |
|-------|-----|----------------|
| Bricolage Grotesque | Display, headings (22px+) | Body copy |
| Geist | Body, UI controls, captions | Datas / dados numéricos |
| JetBrains Mono | Datas, horas, contagens, AI data | Body copy |

**Tracking:** negativo em display (-1.5% a -3.5%), neutro em body. Headlines se abraçam — faz parte do look.

**Escala:**
- Display: 96px / 72px (letra -3.5% / -3%)
- H1–H4: 56 / 40 / 28 / 22px (letra -2.5% a -1%)
- Lead: 20px | Body: 16px | Body-sm: 14px | Caption: 12px
- Mono: 14px (mono-lg: 22px)
- Eyebrow: 12px uppercase, letter-spacing 0.12em

## Espaçamento

Base grid de 4px. Nomenclatura `--s-N` onde N × 4px = valor:
- s-3=12px, s-4=16px, s-5=20px, s-6=24px, s-8=32px, s-10=40px, s-12=48px

Gaps entre seções: 24–48px. Dentro de cards: 12–16px. Densidade intencional mais baixa que enterprise apps.

## Bordas e radii

**Dois sabores de borda:**
1. **Hairline** — 1px `#E8E6E0`. Cards, dividers, inputs.
2. **Stamped** — 2px `#0A0A0A`, sem border-radius abaixo de 14px. Affordances importantes: botões primários, AI cards, logomark.

**Radii generosos:** mínimo 6px (r-xs), padrão 20px (r-lg) ou 28px (r-xl). Pills para chips/tags (999px).

## Sombras

**Lift (float sobre paper):** shadow-sm a shadow-lg, RGB(10,10,10) com baixa opacidade.

**Stamp (assinatura do brand):**
```
--stamp:    2px 2px 0 #0A0A0A
--stamp-lg: 4px 4px 0 #0A0A0A
```
Flat offset de pure ink, sem blur. Dá sensação tátil de impresso. Usado em **primary CTAs** e **AI suggestion cards** — e quase mais nada.

## Motion

| Token | Valor | Uso |
|-------|-------|-----|
| ease-out | cubic-bezier(0.2, 0.8, 0.2, 1) | Padrão |
| ease-spring | cubic-bezier(0.34, 1.56, 0.64, 1) | IA moments (slight overshoot) |
| dur-1 | 120ms | Press/hover micro |
| dur-2 | 200ms | Default transitions |
| dur-3 | 320ms | IA transitions |

**AI shimmer:** gradient spark yellow sliding left→right, ~1.4s loop. Pausa imediatamente quando o resultado aparece.

**Hover:** translateY(-1px) + stamp cresce 1px.
**Press:** translateY(1px) + stamp diminui para 0.
**Focus:** 2px vermillion ring a 2px offset. Nunca remover sem substituir.

## Fundos e backgrounds

- **Default:** solid paper (#FAFAF7). Nunca gradientes como superfície padrão.
- **Vermillion full-bleed:** hero panels de marketing e confirmação. Uma vez por tela.
- **Spark soft fill** (#FFF4BD): AI suggestion cards exclusivamente.
- **Grain overlay** (grain.svg, 3% opacity): opcional para warmth em hero panels. Desativar no mobile.

## Layout

- Mobile: 16px outer gutter, 12px inter-card gap
- Web: 24px outer gutter, max-width 1200px (1320px marketing hero)
- Sticky elements: 1px hairline + paper @ 80% + backdrop-blur 12px

## See Also

- [Brand Voice & Copy](brand-voice-and-copy.md)
- [Component Patterns](component-patterns.md)
- [System Design](../architecture/system-design.md)
