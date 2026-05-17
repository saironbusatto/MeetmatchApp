# @farmei/mobile

App mobile do Farmei. **Expo Router + NativeWind + TypeScript**, consumindo os
packages compartilhados (`@farmei/types`, `@farmei/design-tokens`, `@farmei/utils`)
e a API REST `services/api`.

> O backlog vive em `.taskmaster/tasks/tasks.json` na tag `mobile`.
> Para alternar: `task-master use-tag mobile`.

## Pré-requisitos

- Node 20+ (`.nvmrc` na raiz)
- pnpm 9.12+
- Watchman (recomendado no macOS/Linux)
- Para builds nativos:
  - **iOS:** macOS + Xcode 15+ e CocoaPods
  - **Android:** Android Studio + JDK 17

## Setup

A partir da raiz do monorepo:

```bash
pnpm install
```

Variáveis de ambiente (em `apps/mobile/.env` ou no shell antes do `expo start`):

```env
EXPO_PUBLIC_API_URL=http://localhost:3001/api/v1
EXPO_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
EXPO_PUBLIC_SUPABASE_ANON_KEY=...
```

> Em emulador Android, o `localhost` da máquina é `10.0.2.2`.
> Em iOS Simulator, `localhost` funciona normalmente.

## Rodando

```bash
# da raiz
pnpm --filter @farmei/mobile dev       # Expo Dev Client
pnpm --filter @farmei/mobile ios       # build nativo iOS
pnpm --filter @farmei/mobile android   # build nativo Android
pnpm --filter @farmei/mobile web       # web preview (Metro)
```

A primeira execução vai pedir o **Expo Dev Client** instalado no device —
basta seguir o prompt do CLI.

## Fontes

Coloque os arquivos `.ttf` em `assets/fonts/`:

```
BricolageGrotesque-Regular.ttf
BricolageGrotesque-Bold.ttf
Geist-Regular.ttf
Geist-Medium.ttf
Geist-SemiBold.ttf
JetBrainsMono-Regular.ttf
JetBrainsMono-Bold.ttf
```

Fontes oficiais:
- Bricolage Grotesque — https://github.com/ateliertriay/bricolage
- Geist — https://github.com/vercel/geist-font
- JetBrains Mono — https://github.com/JetBrains/JetBrainsMono

## Estrutura

```
app/                         → rotas (expo-router)
  (auth)/                    → onboarding + login + signup
  (tabs)/                    → Home (privado) | Public | Profile
  events/                    → criar, detalhe, availability, result, confirmed, host
  public/[id].tsx            → detalhe público
  invite/[token].tsx         → deeplink de convite
assets/                      → fonts + icons
components/                  → componentes locais (Themed, StampCard…)
lib/                         → api, auth, env, push, store
```

## Convenções

- Tokens **sempre** vindos de `@farmei/design-tokens/tailwind`.
- Spark Yellow só nos momentos de IA (banner de progresso + AICard de resultado).
- Vermillion ≤ 10% dos pixels por tela.
- Copy segue `wiki/design-system/brand-voice-and-copy.md`.

## CI / Release

EAS Build configurado na Task #10 do backlog mobile (`eas.json` + workflow).
Antes disso, valide localmente com:

```bash
pnpm --filter @farmei/mobile typecheck
pnpm --filter @farmei/mobile lint
```

## Referências

- PRD: [`.taskmaster/docs/mobile-prd.md`](../../.taskmaster/docs/mobile-prd.md)
- Arquitetura: [`wiki/architecture/mobile-architecture.md`](../../wiki/architecture/mobile-architecture.md)
- UI flows: [`wiki/ui-flows/private-event-flow.md`](../../wiki/ui-flows/private-event-flow.md), [`wiki/ui-flows/public-event-flow.md`](../../wiki/ui-flows/public-event-flow.md)
- Design system: [`wiki/design-system/component-patterns.md`](../../wiki/design-system/component-patterns.md)

## Maestro flows

Fluxos críticos em `apps/mobile/.maestro/`:
- `signup-and-create-private.yaml`
- `invite-and-availability.yaml`
- `public-rsvp-flow.yaml`

Executar (com Maestro instalado):

```bash
maestro test apps/mobile/.maestro/signup-and-create-private.yaml
```

## Push notifications

- Permissão pedida no onboarding/signup.
- Registro de device no backend via `POST /users/me/devices`.
- Notificação pode carregar `targetPath` no payload para deep link interno.

## EAS + release

- Configuração em `apps/mobile/eas.json`.
- Workflow de release por tag: `.github/workflows/mobile-release.yml` (`mobile-*`).
- Canal OTA de produção: `stable`.
