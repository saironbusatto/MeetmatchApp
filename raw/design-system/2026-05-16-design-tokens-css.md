# Farmei Design Tokens — colors_and_type.css

> Source: colors_and_type.css (fonte de verdade visual do projeto)
> Collected: 2026-05-16
> Published: 2026-05-16

Todos os tokens são CSS custom properties em :root. A classe wrapper é `.vmt` (legado Farmei — rebrand em andamento).

## Fontes

@import: Bricolage Grotesque (400–800), Geist (400–700), JetBrains Mono (400–600) via Google Fonts.

```
--font-display: 'Bricolage Grotesque', 'Geist', system-ui, sans-serif
--font-body:    'Geist', system-ui, -apple-system, 'Segoe UI', sans-serif
--font-mono:    'JetBrains Mono', ui-monospace, 'SF Mono', monospace
```

## Paleta raw

### Vermillion (hero)
--vermillion-500: #FF3B2E  ← PRIMARY
Escala: 50=#FFF1EE, 100=#FFD9D2, 200=#FFB1A4, 300=#FF8674, 400=#FF5A42, 600=#E92518, 700=#BC1809, 800=#8E1408, 900=#5C0A03

### Spark Yellow (AI accent only)
--spark-300: #FFD93D  ← AI ACCENT
Escala: 50=#FFFBE8, 100=#FFF4BD, 200=#FFE980, 400=#F5C400, 500=#C99B00

### Ink (grayscale warm)
--ink-0:   #FFFFFF
--ink-25:  #FAFAF7   ← paper (surface primária)
--ink-50:  #F4F2EC
--ink-100: #E8E6E0   ← hairline border
--ink-200: #D4D1C8
--ink-300: #B8B4A8
--ink-400: #8C8A82
--ink-500: #5F5D57
--ink-600: #3F3E3A
--ink-700: #28272A
--ink-800: #161618
--ink-900: #0A0A0A   ← ink (texto primário)

### Status
--success-500: #2EA862   --success-100: #D7F3E2
--warn-500:    #E89E18   --warn-100:    #FFF0D6

## Tokens semânticos

### Foreground (texto)
--fg-1: ink-900        ← texto primário
--fg-2: ink-600        ← texto secundário
--fg-3: ink-400        ← metadata
--fg-on-brand: ink-0   ← texto sobre vermillion
--fg-on-spark: ink-900 ← texto sobre spark yellow
--fg-brand: vermillion-600

### Background
--bg-page:      ink-25   ← canvas (warm paper)
--bg-surface:   ink-0    ← cards, panels
--bg-sunken:    ink-50   ← inputs, seções afundadas
--bg-brand:     vermillion-500
--bg-brand-soft: vermillion-50
--bg-spark:     spark-300
--bg-spark-soft: spark-100
--bg-ink:       ink-900  ← superfície inversa

### Borders
--border-1:      ink-100   ← hairlines
--border-2:      ink-200   ← stronger
--border-strong: ink-900   ← stamped outline
--border-brand:  vermillion-500

### Focus
--ring:        vermillion-500
--ring-offset: bg-page

## Escala tipográfica

--t-display-1: 700 96px/0.92 display   (letter: -0.035em)
--t-display-2: 700 72px/0.94 display   (letter: -0.03em)
--t-h1:        700 56px/1.02 display   (letter: -0.025em)
--t-h2:        700 40px/1.08 display   (letter: -0.02em)
--t-h3:        600 28px/1.16 display   (letter: -0.015em)
--t-h4:        600 22px/1.24 display   (letter: -0.01em)
--t-eyebrow:   600 12px/1.2  body      (letter: 0.12em, UPPERCASE)
--t-lead:      500 20px/1.5  body
--t-body:      400 16px/1.55 body
--t-body-sm:   400 14px/1.5  body
--t-caption:   500 12px/1.35 body
--t-button:    600 15px/1    body
--t-mono:      500 14px/1.4  mono
--t-mono-lg:   600 22px/1.1  mono

## Spacing (base 4px)

--s-1: 4px   --s-2: 8px   --s-3: 12px  --s-4: 16px
--s-5: 20px  --s-6: 24px  --s-8: 32px  --s-10: 40px
--s-12: 48px --s-16: 64px --s-20: 80px --s-24: 96px

## Radii

--r-xs: 6px   --r-sm: 10px  --r-md: 14px  --r-lg: 20px
--r-xl: 28px  --r-2xl: 36px --r-pill: 999px

## Sombras

--shadow-xs: 0 1px 2px rgba(10,10,10,0.04)
--shadow-sm: 0 2px 6px rgba(10,10,10,0.06)
--shadow-md: 0 6px 18px rgba(10,10,10,0.08)
--shadow-lg: 0 16px 40px rgba(10,10,10,0.10)
--stamp:       2px 2px 0 #0A0A0A    ← assinatura do brand
--stamp-lg:    4px 4px 0 #0A0A0A
--stamp-brand: 2px 2px 0 #E92518

## Motion

--ease-out:    cubic-bezier(0.2, 0.8, 0.2, 1)
--ease-in:     cubic-bezier(0.6, 0, 0.8, 0.2)
--ease-spring: cubic-bezier(0.34, 1.56, 0.64, 1)  ← IA moments, gentle overshoot
--dur-1: 120ms  --dur-2: 200ms  --dur-3: 320ms  --dur-4: 520ms
