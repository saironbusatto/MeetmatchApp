# Farmei Design System

> _vamo + into_ — "let's get into it." A warm, action-oriented nudge.

**Farmei** is a group scheduling app where an AI agent finds the best date that works for the most people in a group. Participants mark their availability; the AI weighs everyone's input — with extra weight for a designated **Key person** and respect for a defined window of dates — and proposes the optimal meeting day. Exceptions are explicit, not implicit.

The product is **bright, playful, and human**, but anchored by a confident **paper-and-ink** base with a single hero color (vermillion) and one accent reserved for AI moments (spark yellow). It should feel like a friend handing you a sticker, not a calendar app from 2014.

---

## Sources

This system was built from scratch — no codebase, Figma, or screenshots were provided. All visual language, copy, and components are original to this project. If you have prior brand assets, drop them in `assets/` and update `colors_and_type.css` to override tokens.

---

## Content fundamentals

### Voice & tone
**Warm, conversational, slightly bilingual in spirit.** We speak in second person ("you") and inclusive first person plural ("let's"). Never "the user," never corporate-speak. We're nudging friends and teammates toward a shared moment, so the copy carries a small, kind grin.

The name itself is Latin-flavored, so a sprinkle of Spanish/Portuguese is **part of the brand voice** — used as flavor, never as crutch:

- ✓ "Vamos — pick a few days."
- ✓ "¡Listo! Tuesday it is."
- ✗ "Su evento ha sido creado exitosamente." (over the line)

### Casing & punctuation
- **Sentence case for everything**: headings, buttons, menu items. No Title Case Marketing Headers.
- **Periods optional on short labels and buttons**; required on full sentences.
- **Em dashes — yes**, used the way a person pauses mid-thought. No em-dash spam, though.
- **Numbers** — write `Tue, Jun 4` not `Tuesday, June 4th`. Tight, glanceable.

### Examples by surface

| Surface | ✗ Don't | ✓ Do |
|---|---|---|
| Empty event list | "No events yet" | "Nothing on the calendar — yet." |
| AI thinking | "Calculating optimal date…" | "Hunting for a time that works…" |
| AI result | "The optimal date is Tuesday, June 4." | "Tuesday, Jun 4 works for **5 of 6**. Lock it in?" |
| Invite CTA | "Send Invitations" | "Send the ping" |
| Conflict warning | "Conflict detected" | "Heads up — Diego can't make Tuesday." |
| Confirmed | "Event Confirmed Successfully" | "Locked in. ¡Vamos!" |
| Onboarding | "Welcome to Farmei" | "Hey — let's find a time." |

### Emoji
Used **sparingly** and **always with purpose**. Approved set, in order of preference:
- 📅 (event lists, headers)
- ⚡ (AI / quick action — paired with the spark color)
- 👋 (greetings only — onboarding, empty states)
- ✨ (AI suggestion moments)
- 🎉 (confirmation/lock-in, used at most once per flow)

**Never** stack emoji (`🎉🎊🥳`). One per moment. Emoji is **never** a substitute for a proper icon in a control.

### Forbidden phrases
"Seamless." "Effortless." "Streamline." "Empower." "Powerful." "Smart" (use "the AI" or describe what it does). "Cutting-edge." "Revolutionary." "Magic" is okay but rationed.

---

## Visual foundations

### Color
A confident **paper-and-ink** base with one hero, one accent.

- **Vermillion `#FF3B2E`** is the hero — primary buttons, the wordmark dot, "you" highlights, the lock-in confirmation. ~5–10% of pixels on any screen, never more.
- **Spark Yellow `#FFD93D`** appears **only** where the AI is acting or has just acted — the shimmer behind a thinking state, the highlight on a suggested date, the dot at the apex of the logomark. ~1–3% of pixels.
- **Ink `#0A0A0A`** and **Paper `#FAFAF7`** are everything else. The paper is intentionally a hair warm — never pure white.
- Borders are **`#E8E6E0`** (hairline) or **`#0A0A0A`** (the "stamped" outline on key surfaces).

Bluish-purple gradients are **forbidden**. So are emoji-card backgrounds and rounded-corner+colored-left-border banners. The brand earns its energy from typography, scale, and the single red accent — not from gradient fills.

### Type
- **Bricolage Grotesque** for display & headings. It has personality (slight optical-size variance, soft terminals, a warm geometry) without losing legibility. Used at 22px+ ideally.
- **Geist** for body, UI controls, captions. Clean and modern, designed for screens.
- **JetBrains Mono** strictly for **dates, times, counts, and AI-data moments** ("4/6 available", "Jun 4, 14:00–15:30"). Never for body copy.

Tracking is **negative for display** (-1.5% to -3.5%) and **neutral for body**. Headlines hug themselves tightly — that's part of the look.

### Spacing
4px base grid. Generous gaps (24–48px between sections; 12–16px inside cards). Density is _lower_ than enterprise products on purpose — we want the screen to breathe.

### Backgrounds
- **Solid paper** by default. No gradients, no textures, no patterns as the default surface.
- **Vermillion full-bleed** on marketing hero panels and confirmation moments — sparingly, once per screen at most.
- **Spark yellow soft fill** on AI suggestion cards — and nowhere else.
- **Optional grain overlay** (`assets/grain.svg`, 3% opacity) on the paper for warmth. Disable on mobile to avoid moiré.

### Borders
Two flavors:
1. **Hairline** — 1px `#E8E6E0`. Default for cards, dividers, input borders.
2. **Stamped** — 2px `#0A0A0A` outline, no border-radius below `--r-md`. Used on the most important affordances (primary buttons, AI suggestion cards, the logomark frame). Communicates "this is the thing."

### Shadows
Soft and warm, never blue. Two systems:
- **Lift shadows** (`--shadow-sm`, `--shadow-md`, `--shadow-lg`) — for cards floating over paper. RGB(10,10,10) with low opacity.
- **Stamp shadow** (`--stamp`, `--stamp-lg`) — a flat 2–4px offset of pure ink, no blur. Gives buttons and cards a tactile, slightly-printed feel. **The signature move of the brand.** Used on primary CTAs and AI suggestion cards.

### Corner radii
Friendly and generous. Most surfaces use `--r-lg` (20px) or `--r-xl` (28px). Pills (`--r-pill`) for tags and chips. Never sharp corners — minimum `--r-xs` (6px).

### Hover & press states
- **Hover** — subtle lift: `translateY(-1px)` + stamp shadow grows by 1px. On secondary elements, background darkens by one tone step (e.g. `--ink-25` → `--ink-50`). No opacity changes — they read as "disabled-ish."
- **Press / active** — squash: `translateY(1px)` + stamp shadow shrinks to 0. The button visibly touches the page. Duration 120ms, ease-out.
- **Focus** — 2px vermillion ring at 2px offset. Never remove default focus outlines without replacing them.

### Animation
- Default duration `200ms`, easing `cubic-bezier(0.2, 0.8, 0.2, 1)`.
- AI-related transitions use `--ease-spring` (slight overshoot) at `320ms` — the spark "lands."
- Fades for state changes, slides for navigation. No bouncy/wiggly default; the spring is reserved for AI moments.
- The **AI shimmer**: a soft yellow gradient that slides left→right across a card edge while the AI is thinking. ~1.4s loop, paused as soon as the result lands.

### Transparency & blur
Used **rarely**. Acceptable cases: modal scrims (`rgba(10,10,10,0.4)`), sticky headers over scrolling content (paper @ 80% with 12px backdrop-blur). Never as a stylistic flourish — only when content needs to peek through.

### Imagery
- Photography is **warm-leaning** — golden hour, soft window light, never blue-cool stock photo vibes.
- Illustration is **flat with stamped outlines** (2px ink lines on flat fills) — riffs on the logomark style. Vermillion + spark + ink + paper, period. No gradient-on-3D shapes.
- Faces and groups of people are encouraged — this is a social product about getting humans together.

### Cards
- Background `--bg-surface` (white)
- Border `1px solid var(--border-1)` _OR_ a stamp shadow (never both unless it's an AI/primary card)
- Radius `--r-lg` (20px)
- Padding `--s-6` (24px) for medium cards, `--s-8` (32px) for hero cards
- Hover: stamp lifts 1px, shadow deepens slightly

### Layout
- Mobile: 16px outer gutter, 12px inter-card gap
- Web: 24px outer gutter, max content width 1200px (1320px for marketing hero)
- Sticky elements (header, bottom nav) get a 1px hairline border + paper @ 80% with backdrop blur

---

## Iconography

**Phosphor Icons** ([phosphoricons.com](https://phosphoricons.com/)) — a friendly, multi-weight icon family that matches the warm-but-precise feel of the type. We use **two weights**:

- **Regular** (1.5px stroke) for the main UI: nav, controls, list items.
- **Fill** for active states, selected tabs, and the AI sparkle.

Load via CDN:

```html
<script src="https://unpkg.com/@phosphor-icons/web"></script>
<i class="ph ph-calendar-dot"></i>           <!-- regular -->
<i class="ph-fill ph-sparkle"></i>           <!-- fill -->
```

**The sparkle** (`assets/sparkle.svg` or `ph-fill ph-sparkle`) is the AI signal. Wherever the AI is acting or has acted, the sparkle appears — and always in spark yellow on an ink background, or ink on a yellow background. Never vermillion.

### Custom marks in `assets/`
- `logo.svg` — full wordmark
- `logomark.svg` — the square stamped V with the spark dot at the apex (the converging-paths metaphor)
- `sparkle.svg` — the 4-point sparkle used for AI moments

### Emoji as icon? No.
Emoji is for **content moments** (empty states, confirmations, the occasional copy flavor) — never inside controls, nav, or buttons. If you reach for an emoji to label a control, you want a Phosphor icon.

---

## Index — what's in this folder

```
README.md                 ← you are here
SKILL.md                  ← agent-skill manifest for Claude Code
colors_and_type.css       ← all CSS tokens (colors, type, spacing, radii, shadows, motion)

assets/
  logo.svg                ← wordmark
  logomark.svg            ← square mark
  sparkle.svg             ← AI sparkle icon

preview/                  ← Design System tab cards (typography, color, spacing, components)

ui_kits/
  mobile/                 ← iOS-framed app flow: event creation → invite → availability → AI result → confirmed
  web/                    ← Desktop app dashboard + calendar view
  marketing/              ← Marketing site (hero, features, pricing)
```

Each `ui_kit` has its own `README.md`, an `index.html` showing the kit's flagship surface, and modular `.jsx` components.

---

## Open caveats

- **No source brand assets were provided.** The wordmark, logomark, palette, and type pairings are all original choices. Treat them as a strong proposal, not gospel.
- **Phosphor is loaded from CDN** — bundle locally if shipping to production.
- The grain texture is mentioned but not yet shipped — add `assets/grain.svg` if you want the warm-paper feel on hero panels.
