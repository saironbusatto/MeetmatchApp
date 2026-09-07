# Brand Voice & Copy — Farmei

> Sources: README.md (design system guide), 2026-05-16
> Raw: [Design System Guide](../../raw/design-system/2026-05-16-design-system-guide.md)

## Overview

A voz do Farmei é quente, conversacional e levemente bilíngue em espírito. O produto está empurrando amigos e colegas para um momento compartilhado — o copy carrega um pequeno sorriso gentil, nunca tom corporativo.

## Princípios de voz

- **Segunda pessoa:** "você" / "you". Nunca "o usuário" ou "the user".
- **Primeira plural inclusiva:** "let's", "vamos".
- **Bilinguismo como flavor:** sprinkle de espanhol/português é parte da marca, não um crutch.
- **Warm, never formal:** amigo empurrando gentilmente para uma decisão, não sistema notificando.

## Formatação e casing

- **Sentence case para tudo:** headings, botões, menu items. Nunca Title Case Marketing Headers.
- **Números curtos e glanceable:** `Tue, Jun 4` não `Tuesday, June 4th`.
- **Em dashes:** usados como pausa humana — com moderação.
- **Períodos:** opcionais em labels curtos, obrigatórios em frases completas.

## Exemplos por superfície

| Superfície | ✗ Errado | ✓ Correto |
|-----------|---------|----------|
| Empty state lista | "No events yet" | "Nothing on the calendar — yet." |
| IA calculando | "Calculating optimal date…" | "Hunting for a time that works…" |
| IA resultado | "The optimal date is Tuesday, June 4." | "Tuesday, Jun 4 works for **5 of 6**. Lock it in?" |
| Convite CTA | "Send Invitations" | "Send the ping" |
| Aviso de conflito | "Conflict detected" | "Heads up — Diego can't make Tuesday." |
| Confirmado | "Event Confirmed Successfully" | "Locked in. ¡Vamos!" |
| Onboarding | "Welcome to Farmei" | "Hey — let's find a time." |
| Evento confirmado | "In 14 days" | "In 14 days · ¡vamos!" |
| Lotação | "Event at capacity" | "⚠️ Lotado!" / "Ainda há X lugares" |

## Flavor latino (regras de uso)

✓ Usar: "¡Listo!", "¡Vamos!", "Buenas, Sofia", "Perto de você", "O que está rolando"
✗ Exagerar: "Su evento ha sido creado exitosamente."

O critério: se um falante de inglês/português consegue entender sem tradução, está dentro da linha.

## Emojis

**Conjunto aprovado** (em ordem de preferência):
- 📅 — listas de eventos, headers
- ⚡ — IA / quick action (paired com spark color)
- 👋 — greetings (onboarding, empty states)
- ✨ — AI suggestion moments
- 🎉 — confirmação/lock-in, máximo uma vez por fluxo

**Regras:**
- Nunca empilhar: `🎉🎊🥳` é proibido. Um por momento.
- Nunca dentro de controles, nav ou botões — use Phosphor Icons.
- Emojis são para **content moments**, não para ícones funcionais.

## Frases proibidas

"Seamless." "Effortless." "Streamline." "Empower." "Powerful." "Smart" (diga "the AI" ou descreva o que faz). "Cutting-edge." "Revolutionary."

"Magic" é permitido mas racionado — uma vez por fluxo no máximo.

## Iconografia

**Phosphor Icons** — dois pesos:
- Regular (1.5px stroke): main UI (nav, controls, list items)
- Fill: active states, selected tabs, AI sparkle

**Sparkle** (ph-fill ph-sparkle ou assets/sparkle.svg) = sinal de IA. Sempre em:
- Spark yellow sobre fundo ink
- Ink sobre fundo spark yellow
- **Nunca** em vermillion

## See Also

- [Visual Foundations](visual-foundations.md)
- [Component Patterns](component-patterns.md)
- [Private Event Flow](../ui-flows/private-event-flow.md)
