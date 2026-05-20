---
name: vamointao-design
description: Use this skill to generate well-branded interfaces and assets for Vamointao — a group scheduling app where AI finds the best date for a crew. Contains essential design guidelines, colors, type, fonts, assets, and UI kit components for prototyping.
user-invocable: true
---

Read the `README.md` file within this skill, and explore the other available files.

If creating visual artifacts (slides, mocks, throwaway prototypes, etc.), copy assets out and create static HTML files for the user to view. Link `colors_and_type.css` from this folder, copy the SVGs from `assets/`, and load Phosphor icons from CDN as documented in the README's Iconography section.

If working on production code, you can copy assets and read the rules here to become an expert in designing with this brand.

If the user invokes this skill without any other guidance, ask them what they want to build or design, ask some questions, and act as an expert designer who outputs HTML artifacts _or_ production code, depending on the need.

## Quick reference

- **Hero color**: vermillion `#FF3B2E` (primary actions, brand moments — 5–10% of pixels)
- **AI accent**: spark yellow `#FFD93D` (AI states only — 1–3% of pixels)
- **Canvas**: paper `#FAFAF7`, text `#0A0A0A`
- **Type**: Bricolage Grotesque (display) + Geist (body) + JetBrains Mono (dates/data)
- **Signature move**: the "stamp" — flat 2–4px ink-offset shadow + 2px ink border on primary buttons & AI cards. Never round these without a stamp; never stamp without an ink border.
- **Voice**: warm, conversational, second person, sentence case, light bilingual flavor ("¡Vamos", "Buenas, Sofia"). Forbidden: seamless, effortless, empower, streamline, "smart".
- **Iconography**: Phosphor Icons via `https://unpkg.com/@phosphor-icons/web`. Sparkle = AI signal, only in spark or ink.

## UI kits available

- `ui_kits/mobile/` — iOS app: onboarding, home, create event, invite, availability picker, AI result, confirmed
- `ui_kits/marketing/` — full marketing site
- `ui_kits/web/` — desktop app with dashboard + month calendar
