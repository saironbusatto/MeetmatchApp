# Mobile Architecture — Farmei

> Sources: Internal Mobile PRD, 2026-05-17
> Raw: [Mobile PRD](../../.taskmaster/docs/mobile-prd.md); [Architecture Doc](../../raw/architecture/2026-05-16-farmei-architecture.md)

## Overview

O app mobile (`apps/mobile`) é um app Expo (React Native + Expo Router v3 + TypeScript strict) que consome a mesma API REST `/api/v1` do web e os mesmos packages compartilhados (`@farmei/types`, `@farmei/design-tokens`, `@farmei/utils`). Ele cobre os **dois modos** do Farmei (privado e público) com a UX originalmente desenhada em `ui_kits/mobile/*` — que foi também o ponto de partida do design system.

## Decisões de stack

| Camada | Escolha | Por quê |
|---|---|---|
| Runtime | Expo SDK 51+ com EAS | Build chain único, OTA updates, dev client; preserva ADR-001 (mobile depois). |
| Roteamento | Expo Router v3 file-based | Mesmo mental model do App Router do web. |
| Estilo | NativeWind v4 + `@farmei/design-tokens/tailwind` | Tokens já existentes, sem fork. |
| Estado | Zustand + `@tanstack/react-query` | Sessão local + cache assíncrono. |
| API client | `fetch` + `@farmei/types` | Contratos versionados, sem geração extra. |
| Auth | JWT do backend Oracle + `expo-secure-store` | Fluxo único com web/backend e persistência segura de sessão no dispositivo. |
| Notificações | `expo-notifications` (APNs/FCM) | Push para "alguém se inscreveu", "evento amanhã". |
| Mapas | `react-native-maps` (Google) | Flag `featureMaps` no MVP. Habilita junto com P2. |
| Testes | Vitest (lógica) + Maestro (e2e device) | Maestro alinha bem com Expo. |
| CI | GitHub Actions + `eas build --auto-submit` | Pipeline incremental ao já existente. |

## Estrutura de pastas

```
apps/mobile/
├── app/
│   ├── _layout.tsx                 # Fonts + providers + hydrateSession()
│   ├── index.tsx                   # Redirect (auth | tabs)
│   ├── (auth)/                     # onboarding, login, signup
│   ├── (tabs)/                     # index (privado) | public | profile
│   ├── events/
│   │   ├── new.tsx                 # Selector Privado | Público
│   │   ├── new-private.tsx         # Formulário com POST /private-events
│   │   ├── new-public.tsx          # Formulário com POST /public-events
│   │   └── [id]/
│   │       ├── index.tsx           # Detalhe + ações (convidar | disponibilidade)
│   │       ├── invite.tsx          # Convidar por email → POST /participants
│   │       ├── availability.tsx    # Grid yes/maybe/no → POST /availability
│   │       ├── result.tsx          # AI card spark + confirm → POST /confirm
│   │       ├── confirmed.tsx       # Locked-in screen
│   │       └── host.tsx            # Painel do host (check-in)
│   ├── public/[id].tsx             # Detalhe público + inscrição
│   ├── invite/[token].tsx          # Deeplink de convite
│   └── +not-found.tsx
├── components/
│   ├── ui/                         # Design system Farmei implementado (2026-06-07)
│   │   ├── tokens.ts               # Paleta, fontes, stamp shadow como constantes TS
│   │   ├── Button.tsx              # PrimaryButton, SecondaryButton, AIButton, GhostButton, NewButton
│   │   ├── Avatar.tsx              # Avatar (iniciais coloridas, key indicator) + AvatarStack
│   │   ├── AppHeader.tsx           # Header com back button circular
│   │   ├── FilterChips.tsx         # Chips horizontais scrolláveis
│   │   ├── EventCard.tsx           # Card evento privado (badge locked/waiting + AvatarStack)
│   │   ├── PublicEventCard.tsx     # Card evento público (occupancy bar colorida)
│   │   ├── Field.tsx               # Input com label uppercase
│   │   └── Sparkle.tsx             # SVG spark (react-native-svg)
│   ├── StampCard.tsx               # Card com stamp shadow (legado, ainda em uso em alguns flows)
│   └── Themed.tsx                  # Wrappers Text/View (legado)
├── lib/
│   ├── api.ts                      # createApiClient() com todos os endpoints
│   ├── auth.ts                     # signIn/signUp/signOut/hydrateSession/getAccessToken
│   ├── env.ts                      # EXPO_PUBLIC_API_URL apenas (sem Supabase)
│   ├── push.ts                     # expo-notifications + registerDevice
│   ├── queries.ts                  # React Query hooks (usePrivateEvents, usePublicEvents, etc.)
│   ├── store.ts                    # Zustand useSession
│   └── useApi.ts                   # Hook que instancia createApiClient com getAccessToken
├── assets/                         # fonts + icons
└── (configs)                       # app.json, metro, babel, tailwind, tsconfig, eas.json
```

## Integração com o monorepo

- **Workspace pnpm:** `apps/*` já incluído em `pnpm-workspace.yaml`. Sem mudanças.
- **Metro symlinks:** `metro.config.js` define `watchFolders = [workspaceRoot]` e desliga `disableHierarchicalLookup` — necessário para o pnpm.
- **NativeWind:** consome o preset do `@farmei/design-tokens/tailwind` via spread em `tailwind.config.js`. Cores/spacing/shadows do design system ficam disponíveis como classes.
- **Turbo:** o package adere ao pipeline padrão (`build`, `lint`, `typecheck`, `test`). Não precisa entrada nova em `turbo.json`.

## Sessão e autenticação

> **Atualizado 2026-06-07:** `@supabase/supabase-js` removido do mobile. Auth 100% via JWT próprio da API Oracle.

```
RootLayout (_layout.tsx)
 ├─ hydrateSession() → GET /users/me com token do SecureStore
 ├─ setUser() → atualiza store Zustand (useSession)
 └─ Slot

index.tsx
 └─ Redirect baseado em useSession (user ? tabs : onboarding)

(auth)/_layout.tsx
 └─ Guard reverso: se autenticado, manda para tabs
(tabs)/_layout.tsx
 └─ Guard: se anônimo, manda para onboarding
```

**`lib/auth.ts` — funções exportadas:**
- `signIn(email, password)` → POST /auth/login → salva JWT no SecureStore
- `signUp(email, password, name)` → POST /auth/signup → salva JWT
- `signOut()` → remove JWT do SecureStore
- `hydrateSession()` → GET /users/me → retorna User ou null
- `getAccessToken()` → lê JWT do SecureStore (usado pelo API client)

**Fallback web:** `SecureStore` não existe no browser. Em `Platform.OS === 'web'`, o storage cai para `localStorage`. Mantém compatibilidade com `expo start --web` durante desenvolvimento.

Tokens efêmeros de convite ficam em `farmei.invite_token` (SecureStore / localStorage). Ao aceitar via `POST /invites/:token/accept`, o app pula direto para `availability` do evento alvo.

## Diferenças intencionais vs. web

| Tema | Web | Mobile |
|---|---|---|
| Storage de sessão | Cookie HTTP-only | SecureStore (chave) |
| Deep linking | Routes do Next.js | scheme `farmei://` + universal links em `farmei.app/invite/*` |
| Push | — | `expo-notifications` (registra device em `POST /users/me/devices` — endpoint a criar) |
| Convidado sem conta | Página `/invite/[token]` | Mesma, mas com persistência local do token |
| Compartilhamento | Web Share API | `expo-sharing` (CSV de inscritos, link do convite) |

## Padrões visuais críticos

Replica o que já está em `wiki/design-system/component-patterns.md`, com algumas peculiaridades:

- **StampCard (componente):** sombra sólida sem blur. iOS usa `shadowRadius: 0`; Android emula com `borderBottomWidth/borderRightWidth` no ink900.
- **AICard (variant="ai"):** spark yellow + stamp 4px. Único momento de spark com shadow grande.
- **Conflict (variant="conflict"):** vermillionSoft + border vermillion200. Mensagem warm, nunca alarme.
- **Bottom nav:** paper@92% com `borderTopWidth: 1` (web blur via `backdrop-filter` não rende nativo; é aceitável).

## Feature flags

| Flag | Default | Habilita |
|---|---|---|
| `featureMaps` (app.json extra) | `false` | `react-native-maps` no detalhe público. Depende de P2. |

## Pontos de evolução

- **Modo offline:** react-query read-through cache cobre leituras. Mutações enfileiradas com retry exponencial — fora do MVP.
- **Tema dark:** preparado via tokens (`ink-25/50/100/.../900`), mas não ativado no MVP.
- **Crush finder (Instagram OAuth):** depende de credenciais e de tela "Quem segue indo".
- **Mapa real:** habilitar `featureMaps` + tile provider (Mapbox alternativo).

## Riscos e mitigação

| Risco | Mitigação |
|---|---|
| Flicker de fontes no startup | `expo-splash-screen` segurando até `useFonts` resolver. |
| Tamanho do bundle (mapas, push) | Lazy import; flags por feature. |
| Divergência entre web e mobile | A API é a fonte única; regras novas entram em `packages/utils` ou na API. |

## See Also

- [System Design](system-design.md)
- [Data Model](data-model.md)
- [Architectural Decisions](architectural-decisions.md)
- [Component Patterns](../design-system/component-patterns.md)
- [Private Event Flow](../ui-flows/private-event-flow.md)
- [Public Event Flow](../ui-flows/public-event-flow.md)
- [MVP Backlog](../backlog/mvp-backlog.md)
