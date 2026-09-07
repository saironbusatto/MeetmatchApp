# Farmei Mobile UI Kit — Screens Reference

> Source: ui_kits/mobile/ (screens-a.jsx, screens-b.jsx, screens-public.jsx, components.jsx)
> Collected: 2026-05-16
> Published: 2026-05-16

Kit visual em React inline (Babel). NÃO é código de produção — é referência de design e fluxo.
Todas as cores via objeto VMT (JavaScript inline, espelha os tokens CSS).

## Token map (VMT object)

```js
VMT = {
  vermillion: '#FF3B2E',  vermillionSoft: '#FFF1EE',
  spark: '#FFD93D',       sparkSoft: '#FFF4BD',
  ink: '#0A0A0A',         paper: '#FAFAF7',   white: '#FFFFFF',
  ink100: '#E8E6E0',      ink500: '#5F5D57',  ink600: '#3F3E3A',
  success: '#2EA862',     successSoft: '#D7F3E2',
  warn: '#E89E18',        warnSoft: '#FFF0D6',
  fontDisplay: 'Bricolage Grotesque...',
  fontBody: 'Geist...',
  fontMono: 'JetBrains Mono...',
}
```

## Componentes compartilhados

### Botões
- PrimaryButton: bg=vermillion, border 2px ink, stamp shadow 3px 3px 0 ink. Uso: CTAs principais.
- SecondaryButton: bg=white, border 1.5px ink. Uso: ações secundárias.
- AIButton: bg=ink, color=spark. Uso: "Submit & let AI pick" — único botão com spark como texto.
- GhostButton: sem border/background visível.

### AppHeader
Barra superior com título centralizado (fontDisplay) e botão back opcional à esquerda.

### BottomNav
Navegação por tabs: Home | Public | Profile. Item ativo com fill icon.

### Avatar e AvatarStack
Avatar circular com initials coloridas (colorIdx define a cor). Key person tem anel vermillion + badge KEY. AvatarStack empilha avatares com overlap.

### Sparkle
SVG de 4 pontas. Usado em momentos de IA. Sempre em spark color ou ink. NUNCA em vermillion.

## Fluxo privado (7 telas)

### 1. OnboardingScreen
- Fundo paper, big decorative vermillion circle no canto superior direito
- Spark dot (spark bg + ink border) sobreposto
- Headline: "Let's find a time that works." (fontDisplay, 56px, -0.035em tracking)
- Body: "You pick the people and a window. The AI does the math so nobody has to argue about Tuesday."
- CTA: "Get started — it's free" (PrimaryButton) + "I already have an account" (GhostButton)

### 2. HomeScreen ("Your events")
- Saudação com flavor latino: "Buenas, Sofia"
- Título: "Your events" (fontDisplay, 38px)
- Botão "+" compacto (bg ink, cor white, pill shape)
- Filter chips: Upcoming | Waiting | Past | All (primeiro ativo = ink bg)
- EventListItem cards:
  - when em fontMono uppercase (green badge "locked in" ou amber "waiting")
  - título em fontDisplay
  - AvatarStack abaixo
- BottomNav ativo em "home"

### 3. CreateScreen ("New event")
- Campos: título (fontDisplay, 22px), key person (Avatar + name + "Their availability is weighted highest"), janela (from/to em fontMono), duração (pill chips: 30m/1h/1.5h/2h/½ day/Custom)
- Label style: 12px uppercase, color ink500
- Input style: 16px, border 1.5px ink100, radius 14px, bg white
- CTA: "Next: invite people →"

### 4. InviteScreen ("Invite people")
- Chips de convidados já selecionados: key person com bg ink (cor spark para "KEY" badge), outros com bg white
- Search input com ícone de lupa
- Lista "Suggested" de candidatos com botão "+" em vermillionSoft
- CTA: "Next: pick your days →"

### 5. AvailabilityScreen ("Your availability")
- Instrução: ciclo tap para yes ✓ (success bg) | maybe ~ (warnSoft bg) | no ✕ (ink bg)
- Quick fill chips: All yes | Weekdays | Mornings
- Grid de dias (4 colunas): dia da semana + número (fontMono) + label do estado
- Banner spark yellow (bg spark, border 2px ink, radius 16): "5 of 6 are in. Once you submit, the AI will pick a date." — com Sparkle icon
- CTA: AIButton "Submit & let AI pick" (bg ink, color spark)

### 6. ResultScreen ("AI's pick") — hero do produto
- Hero card: bg spark, border 2px ink, radius 24, stamp shadow 4px 4px 0 ink
  - Eyebrow: Sparkle + "Farmei AI · best fit"
  - Data: "Tuesday / Jun 4" (fontDisplay, 44px)
  - Hora: "14:00 — 15:30" (fontMono, 17px)
  - Dashed border separando data de attendees
  - "5 of 6 in / Diego (key) ✓ · confidence 0.92"
- Rationale card: "Why this date?" — explicação textual simples
- Conflict card: bg vermillionSoft, borda vermillion30 — "Heads up — Felipe can't make Tuesday"
- Other options: lista com score, dia, ratio de disponíveis
- CTA: "Lock in Tue, Jun 4" (PrimaryButton lg)

### 7. ConfirmedScreen
- Eyebrow: "🎉 Locked in" (color success)
- Título: "Q3 planning lunch" (fontDisplay, 42px)
- Data/hora em fontMono
- "In 14 days · ¡vamos!" — flavor latino no copy
- Info rows: Where | Who (5 of 6 going) | Not coming
- Lista de attendees com check verde ou "regrets" text
- CTAs: "Back to events" (SecondaryButton) + "Share"

## Fluxo público (3 telas)

### PublicEventsHome ("O que está rolando")
- Subtitle: "O que está rolando" | Título: "Perto de você"
- Filter chips: All | Sports | Music | Social | Food
- EventCard: título, horário (fontMono), localização, barra de ocupação colorida:
  - Verde (< 50%), Âmbar (< 80%), Vermillion (≥ 80%)
  - Contador fontMono (current/max)
  - Badge "Lotado!" em vermillionSoft quando cheio
  - Border vermillion 2px quando lotado
- Botão "+" rotulado "+ Host" (para criar evento público)

### CreatePublicEvent ("Criar evento público")
- Campos: nome, local, categoria (select: Sports/Music/Social/Food/Art), data+hora, lotação máxima (fontMono, number input), descrição (textarea)
- CTA: "Criar e começar a vender →"

### PublicEventDetails
- Hero card com a cor da categoria (opacity 15% de fundo)
- Seção de lotação com barra colorida e "Ainda há X lugares"
- "Quem já vai" com AvatarStack
- Seção "O que é" com descrição
- CTA: "✓ Eu vou!" ou "❌ Lotado" (disabled quando cheio)
