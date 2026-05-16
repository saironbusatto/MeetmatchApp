# Farmei Design System Guide (README.md)

> Source: README.md (internal, era Vamointao — rebrand em andamento para Farmei)
> Collected: 2026-05-16
> Published: 2026-05-16

## Voz e tom

Warm, conversational, slightly bilingual in spirit. Segunda pessoa ("you") e primeira plural inclusiva ("let's"). Nunca "the user", nunca corporate-speak.

Sprinkle de espanhol/português como flavor da marca:
- ✓ "Vamos — pick a few days."
- ✓ "¡Listo! Tuesday it is."
- ✗ "Su evento ha sido creado exitosamente." (passou da conta)

Sentence case para tudo: headings, buttons, menu items. Nunca Title Case Marketing.
Números curtos: "Tue, Jun 4" não "Tuesday, June 4th."

Exemplos por superfície:
- Empty state: "Nothing on the calendar — yet." (não "No events yet")
- AI pensando: "Hunting for a time that works…" (não "Calculating optimal date…")
- AI resultado: "Tuesday, Jun 4 works for 5 of 6. Lock it in?"
- Convite CTA: "Send the ping" (não "Send Invitations")
- Aviso de conflito: "Heads up — Diego can't make Tuesday."
- Confirmado: "Locked in. ¡Vamos!"
- Onboarding: "Hey — let's find a time."

Emojis aprovados (sparingly): 📅 ⚡ 👋 ✨ 🎉. Nunca empilhados. Nunca dentro de controles.

Frases proibidas: "Seamless." "Effortless." "Streamline." "Empower." "Powerful." "Smart" (use "the AI" or describe). "Cutting-edge." "Revolutionary." "Magic" é ok, mas racionado.

## Cor

Base paper-and-ink com um hero e um accent.

- Vermillion #FF3B2E — hero. Botões primários, wordmark dot, highlights de "you", lock-in confirmation. ~5–10% dos pixels. Nunca mais.
- Spark Yellow #FFD93D — APENAS onde a IA está agindo ou agiu. Shimmer de thinking state, destaque na data sugerida, dot no apex do logomark. ~1–3% dos pixels.
- Ink #0A0A0A + Paper #FAFAF7 — tudo o mais. Paper é intencionalmente warm, nunca pure white.
- Borders: #E8E6E0 (hairline) ou #0A0A0A (stamped outline em surfaces importantes).

Proibido: gradientes bluish-purple. Proibido: emoji como fundo de card. Proibido: rounded-corner+colored-left-border banners.

## Tipografia

- Bricolage Grotesque — display & headings. Personalidade sem perder legibilidade. Usar a 22px+.
- Geist — body, UI controls, captions. Clean e moderno.
- JetBrains Mono — APENAS para datas, horas, contagens e momentos de AI data. Nunca para body copy.

Tracking: negativo para display (-1.5% a -3.5%), neutro para body. Headlines se abraçam — é parte do look.

## Spacing

Base grid de 4px. Gaps generosos: 24–48px entre seções, 12–16px dentro de cards. Densidade menor que produtos enterprise de propósito.

## Fundos

Solid paper por default. Sem gradientes, texturas ou padrões como superfície padrão.
- Vermillion full-bleed: hero panels de marketing e momentos de confirmação. Uma vez por tela.
- Spark yellow soft fill: AI suggestion cards — e mais nada.
- Grain overlay opcional (assets/grain.svg, 3% opacity) para warmth. Desativar no mobile.

## Bordas

1. Hairline — 1px #E8E6E0. Default para cards, dividers, inputs.
2. Stamped — 2px #0A0A0A outline, sem border-radius abaixo de --r-md. Affordances mais importantes: primary buttons, AI suggestion cards, logomark frame. Comunica "este é o elemento."

## Sombras

Soft e warm, nunca blue. Dois sistemas:
- Lift shadows (shadow-sm/md/lg): cards flutuando. RGB(10,10,10) com baixa opacidade.
- Stamp shadow: flat 2–4px offset de pure ink, sem blur. "A assinatura do brand." Usada em primary CTAs e AI suggestion cards.

## Corner radii

Friendly e generoso. Most surfaces: r-lg (20px) ou r-xl (28px). Pills (r-pill) para tags/chips. Nunca sharp corners — mínimo r-xs (6px).

## Hover & press

- Hover: translateY(-1px) + stamp shadow cresce 1px.
- Press/active: translateY(1px) + stamp shadow shrinks to 0. Duração 120ms, ease-out.
- Focus: 2px vermillion ring at 2px offset. Nunca remover focus outlines sem substituir.

## Animação

Default 200ms, cubic-bezier(0.2, 0.8, 0.2, 1).
AI transitions: ease-spring (slight overshoot) a 320ms.
AI shimmer: soft yellow gradient sliding left→right. ~1.4s loop, pausa quando resultado chega.

## Iconografia

Phosphor Icons — dois pesos:
- Regular (1.5px stroke): main UI (nav, controls, list items).
- Fill: active states, selected tabs, AI sparkle.

Sparkle (assets/sparkle.svg ou ph-fill ph-sparkle) = sinal de IA. Sempre em spark yellow em fundo ink, ou ink em fundo yellow. Nunca vermillion.

## Cards

- Background: bg-surface (white)
- Border: 1px solid var(--border-1) OU stamp shadow (nunca ambos — exceto AI/primary card)
- Radius: r-lg (20px)
- Padding: s-6 (24px) para medium, s-8 (32px) para hero
- Hover: stamp lifts 1px, shadow deepens

## Layout

- Mobile: 16px outer gutter, 12px inter-card gap
- Web: 24px outer gutter, max-width 1200px (1320px para marketing hero)
- Sticky (header, bottom nav): 1px hairline + paper @ 80% + backdrop-blur
