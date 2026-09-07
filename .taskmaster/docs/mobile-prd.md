# Farmei Mobile — PRD

> Documento de produto + arquitetura do app mobile do Farmei. Sintetiza wiki/product, wiki/architecture, wiki/ui-flows e wiki/design-system para que o Task Master gere o backlog mobile.

**Versão:** 0.1 · **Data:** 2026-05-17 · **Autor:** Task Master AI (sessão Claude Code)
**Premissa:** o backend (`services/api`) e o web (`apps/web`) estão concluídos (tasks 1–21 do master = `done`). O mobile reaproveita 100% da API REST `/api/v1/*` e os packages compartilhados.

---

## 1. Objetivo

Entregar um app mobile nativo (iOS + Android) que cobre os **dois modos do Farmei** com a mesma profundidade do web app — mas com a UX e o impacto visual originalmente desenhados em `ui_kits/mobile/*` (esse foi o ponto de partida do design system, ver `wiki/ui-flows/private-event-flow.md`).

O mobile é a superfície natural do produto: cria com o polegar, marca disponibilidade no ônibus, descobre o que está rolando perto. O web já cobre organizadores em escritório; o mobile fecha o ciclo.

## 2. Públicos e Jornadas

Idêntico ao web (`wiki/product/product-overview.md`), com ênfase em:

- **Convidado privado** — recebe link, abre direto no app, marca disponibilidade em <30s.
- **Participante público** — descobre eventos perto, vê quem mais vai, inscreve-se em 2 taps.
- **Organizador casual** — cria evento privado pelo celular, convida via share sheet do SO.
- **Host pequeno** — cria evento público com lotação, acompanha inscrições por push.

## 3. Stack

| Camada | Escolha | Justificativa |
|---|---|---|
| Runtime | **Expo SDK 51+** com EAS | Único build chain, OTA updates, dev client. Compatível com ADR-001 (mobile depois) e com `packages/ui` headless (ADR-008). |
| Roteamento | **Expo Router v3** (file-based) | Espelha o mental model do Next.js App Router já consolidado no web. |
| Linguagem | TypeScript 5.6+ (strict) | Mesmo `packages/config/tsconfig.base.json`. |
| Estilo | **NativeWind v4** + `@farmei/design-tokens/tailwind` | Reusa tokens existentes sem fork. |
| Estado | Zustand + `@tanstack/react-query` | Async cache + sessão local. |
| Forms | React Hook Form + Zod | Idêntico ao web. |
| API client | `fetch` + Zod runtime guards consumindo `@farmei/types` | Sem geração de cliente; contratos versionados pelo package `types`. |
| Auth | `@supabase/supabase-js` + Expo SecureStore | Mesma instância Supabase do web. |
| Notificações | `expo-notifications` + APNs/FCM | Push para "alguém se inscreveu", "evento amanhã". |
| Mapas | `react-native-maps` (Google) | Place no MVP de fluxo público quando geolocalização entrar (P2). |
| Tipografia | `expo-font` com Bricolage Grotesque + Geist + JetBrains Mono | Mesmas três famílias do web. |
| Testes | Vitest (lógica pura) + Maestro (e2e do device) | Maestro foi pensado para Expo. |
| CI | GitHub Actions + `eas build --auto-submit` | Pipeline incremental ao já existente. |

**Não escolhemos:** React Native bare, Flutter (rebuild do design system + sem compartilhamento de tipos), nem Tamagui (sobrecarga sem ganho frente a NativeWind).

## 4. Estrutura no monorepo

```
apps/mobile/
├── app/                       # Expo Router (file-based)
│   ├── _layout.tsx            # Root layout: fonts, theme, providers
│   ├── (auth)/
│   │   ├── _layout.tsx
│   │   ├── onboarding.tsx
│   │   ├── login.tsx
│   │   └── signup.tsx
│   ├── (tabs)/
│   │   ├── _layout.tsx        # Bottom nav: Home | Public | Profile
│   │   ├── index.tsx          # Home privado (Your events)
│   │   ├── public.tsx         # Feed "O que está rolando"
│   │   └── profile.tsx
│   ├── events/
│   │   ├── new.tsx            # Selector Privado | Público
│   │   ├── new-private.tsx
│   │   ├── new-public.tsx
│   │   ├── [id]/index.tsx
│   │   ├── [id]/availability.tsx
│   │   ├── [id]/result.tsx
│   │   ├── [id]/confirmed.tsx
│   │   └── [id]/host.tsx
│   ├── public/[id].tsx        # Detalhe público
│   ├── invite/[token].tsx     # Convite por link (sem login)
│   └── +not-found.tsx
├── assets/
│   ├── fonts/                 # Bricolage, Geist, JetBrains Mono
│   └── icons/                 # Sparkle, logomark
├── components/                # Componentes locais (consumir @farmei/ui depois)
├── lib/
│   ├── api.ts                 # Cliente fetch + auth interceptor
│   ├── auth.ts                # Supabase + SecureStore
│   ├── push.ts
│   └── store.ts               # Zustand stores
├── app.json                   # Expo config (slug, scheme, deeplinks)
├── babel.config.js
├── metro.config.js            # Symlink do workspace pnpm
├── tailwind.config.js
├── global.css                 # NativeWind directives
├── tsconfig.json
└── package.json
```

## 5. Telas (escopo do MVP mobile)

Mapeamento direto dos UI kits (`ui_kits/mobile/screens-*.jsx`) e dos fluxos do wiki:

### Privado (`wiki/ui-flows/private-event-flow.md`)
1. **Onboarding** — headline 56px, círculo decorativo, duplo CTA.
2. **Home** — Your events + filtros (Upcoming | Waiting | Past | All) + FAB "+".
3. **Create** — título, key person, janela de datas (`fontMono`), duração em chips.
4. **Invite** — search + chips de convidados, badge KEY em spark sobre ink.
5. **Availability** — grid 4 col, ciclo yes/maybe/no, banner spark de progresso, **AIButton**.
6. **Result (hero)** — AICard spark + rationale + conflict + alternatives.
7. **Confirmed** — celebração, info rows, copy "¡vamos!".

### Público (`wiki/ui-flows/public-event-flow.md`)
8. **PublicHome** — feed com EventCards (barra de ocupação dinâmica), filtros por categoria.
9. **PublicDetails** — hero card colorido por categoria, ocupação, "quem já vai", CTA "Eu vou!".
10. **CreatePublic** — formulário com lotação obrigatória.
11. **HostPanel** — lista de inscritos com check-in e export CSV (compartilha via SO).

### Transversais
12. **Profile** — perfil do usuário, logout, preferências de notificação.
13. **InviteLanding** (`/invite/[token]`) — deeplink universal: abre evento sem login.

## 6. Integrações & contratos

- **API** — base URL `EXPO_PUBLIC_API_URL` (default: `http://localhost:3001/api/v1`). Todos os endpoints já documentados em `wiki/architecture/data-model.md` §"Contratos de API".
- **Supabase Auth** — `EXPO_PUBLIC_SUPABASE_URL` + `EXPO_PUBLIC_SUPABASE_ANON_KEY`. Tokens persistidos em SecureStore (não AsyncStorage).
- **Deep linking** — esquema `farmei://` + universal links `https://farmei.app/invite/:token`.
- **Push** — registrar device token em `POST /users/me/devices` (endpoint a adicionar à API — task explícita).
- **Share sheet do SO** — usar `expo-sharing` para "Convidar pessoas" do fluxo privado e "Exportar inscritos" do host.

## 7. Decisões de produto específicas do mobile

- **Sem login obrigatório para convidado** — replica P1 do web; o convite por token abre uma sessão efêmera (cookie-equivalente em SecureStore: `invite_token`).
- **Idioma** — herda P3 do web (PT-BR default; copy em inglês permanece no fluxo privado "hero", como já documentado em `brand-voice-and-copy.md`).
- **Mapas** — feature flag (`EXPO_PUBLIC_FEATURE_MAPS=false` no MVP). Habilita junto com P2.
- **Modo offline** — read-through cache do react-query; mutações fila com retry exponencial. Não é prioridade no MVP, mas o cache HTTP já cobre as leituras.
- **Tema** — só light/paper-and-ink. Dark mode é evolução documentada.

## 8. Fases do backlog

Espelha o backlog atual (`wiki/backlog/mvp-backlog.md`) mas só do que muda para mobile:

| Fase | Entregáveis |
|---|---|
| **M1 Mobile · Foundation** | Scaffold Expo Router, fontes, tokens, NativeWind, ESLint, CI básico. |
| **M2 Mobile · Auth & Shell** | Supabase + SecureStore, tab bar, onboarding, login/signup, deep links. |
| **M3 Mobile · Privado** | Home, Create, Invite, Availability, Result (hero AICard), Confirmed. |
| **M4 Mobile · Público** | Feed, Detail, CreatePublic, HostPanel, share/CSV. |
| **M5 Mobile · Convites & Push** | InviteLanding `/invite/[token]`, push (registro + handler), notificações locais. |
| **M6 Mobile · Qualidade** | Maestro flows, a11y, empty/loading/error com voz da marca, EAS build + TestFlight + Internal Track. |

## 9. Critérios de aceite gerais (definition of done por fase)

- Tipagem strict sem `any` (exceto bordas explicitamente documentadas).
- Lint + typecheck no Turbo pipeline (`pnpm turbo run typecheck` em `apps/mobile`).
- Cada tela publicada vem com snapshot/Maestro flow.
- Tokens consumidos sempre via `@farmei/design-tokens/tailwind` — proibido hardcode de cor do design system.
- Voz e regras visuais do `wiki/design-system/brand-voice-and-copy.md` aplicadas.

## 10. Riscos e mitigação

| Risco | Mitigação |
|---|---|
| Fontes custom com flicker no startup | `expo-splash-screen` segurando até `useFonts` resolver. |
| Tamanho do bundle nativo (mapas, push) | Lazy import e feature flags. |
| Divergência de regra entre web e mobile | API é fonte única; toda regra nova entra em `packages/utils` ou na API, nunca no app. |
| Quebrar build do monorepo | Metro config com `extraNodeModules` apontando para workspace symlinks; CI roda `pnpm install` na raiz. |

## 11. Fora de escopo (próximas iterações)

- Instagram OAuth e "crush finder" (já listado como fase 3+ do CLAUDE.md).
- Stories/feed pós-evento.
- Modo offline com mutações fila.
- Tema dark.
- Tradução EN do fluxo público.

## 12. Referências

- Wiki: `product/product-overview.md`, `product/business-rules.md`, `architecture/system-design.md`, `architecture/data-model.md`, `architecture/architectural-decisions.md`, `ui-flows/private-event-flow.md`, `ui-flows/public-event-flow.md`, `design-system/component-patterns.md`, `design-system/brand-voice-and-copy.md`, `backlog/mvp-backlog.md`.
- Protótipos: `ui_kits/mobile/screens-*.jsx`, `prototype.html`.
- Backend: `services/api/src/**` (todas as rotas já implementadas).
