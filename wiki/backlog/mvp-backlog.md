# MVP Backlog — Farmei

> Sources: Internal TASKS.md, 2026-05-16
> Raw: [Farmei Tasks](../../raw/backlog/2026-05-16-farmei-tasks.md)

## Overview

O backlog está organizado em 6 fases sequenciais com dependências explícitas. A Fase 3.1 (algoritmo de data) é a única tarefa que pode rodar em paralelo com o banco. O fluxo privado (Fase 4) é o diferencial do produto e tem prioridade sobre o público (Fase 5).

## Status atual

| Milestone | Entrega | Status |
|-----------|---------|--------|
| M0 — Documentação | PRD, ARCHITECTURE, TASKS, DECISIONS, wiki | ✅ Concluído |
| M1 — Foundation | Monorepo, scaffold, tokens, auth | ✅ Concluído |
| M2 — Banco + algoritmo | Schema, migrations, date-suggestion | ✅ Concluído |
| M3 — Fluxo privado (web) | Criar → convidar → disponibilidade → sugestão → confirmar | ✅ Concluído |
| M4 — Fluxo público (web) | Criar → listar → inscrever → painel host | ✅ Concluído |
| M5 — Qualidade (web) | Testes, erros, a11y, limpeza | ✅ Concluído |
| M1 Mobile — Foundation | Scaffold Expo Router, tokens, NativeWind, CI básico | ⬜ Próximo |
| M2 Mobile — Auth & Shell | Supabase + SecureStore, tab bar, onboarding | ⬜ |
| M3 Mobile — Fluxo privado | Home → Confirmed (com AICard hero) | ⬜ |
| M4 Mobile — Fluxo público | Feed → Detail → Create → Host | ⬜ |
| M5 Mobile — Convites & Push | `/invite/[token]` + expo-notifications | ⬜ |
| M6 Mobile — Qualidade | Maestro flows, a11y, EAS + stores | ⬜ |

## Fase 1 — Foundation do monorepo (próxima)

**1.1 Monorepo base**
- pnpm workspaces + estrutura de diretórios
- Turbo (opcional, apenas se necessário)
- `.gitignore`, `.env.example`, `README.md` raiz

**1.2 TypeScript e qualidade**
- `packages/config/tsconfig.base.json`
- ESLint + Prettier propagados para `apps/web` e `services/api`

**1.3 Design tokens**
- `packages/design-tokens/src/global.css` (derivado de `colors_and_type.css`)
- `packages/design-tokens/src/tailwind.config.ts` com tokens mapeados

**1.4 App web scaffold**
- Next.js 15 inicializado
- Tailwind CSS 4 + tokens
- shadcn/ui configurado
- Layout base com Bricolage Grotesque + Geist + JetBrains Mono
- `app/layout.tsx` com tema paper-and-ink

**1.5 API scaffold**
- Hono em `services/api`
- Zod para validação
- Roteamento base `/api/v1/*`
- Middleware de autenticação JWT Supabase
- Handler de erros padronizado

## Fase 2 — Banco e auth

**2.1 Banco de dados**
- PostgreSQL (Supabase ou Neon)
- Drizzle ORM + schema completo (ver [Data Model](../architecture/data-model.md))
- Migrations + seed de desenvolvimento

**2.2 Autenticação**
- Supabase Auth configurado
- Endpoints auth (signup, login, logout, me)
- Middleware de sessão no Next.js
- Páginas `/login` e `/signup`

## Fase 3 — Core do domínio

**3.1 Algoritmo de sugestão (pode rodar em paralelo com Fase 2)**
- `packages/utils/src/date-suggestion.ts`
- Funções: `scoreDay()`, `maxPossibleScore()`, `suggestDate()`
- Explicação textual por template
- Testes unitários completos com Vitest

**3.2 Users + tipos compartilhados**
- GET/PUT `/users/me`
- `packages/types`: events.ts, users.ts, api.ts

## Fase 4 — Fluxo privado (diferencial do produto)

1. Criar evento privado (formulário + POST /private-events)
2. Convidar participantes (geração de token, página /invite/:token)
3. Marcar disponibilidade (UI yes/maybe/no por data)
4. Sugestão de data (card com spark yellow, confidence, explicação)
5. Confirmar data final (POST /private-events/:id/confirm → estado CONFIRMED)
6. Dashboard do organizador (/dashboard)

## Fase 5 — Fluxo público

1. Criar evento público (formulário data fixa + capacidade)
2. Feed de eventos (/public com cards e barra de lotação)
3. Inscrição (bloqueio ao lotar, feedback visual)
4. Painel do host (lista de inscritos + exportar CSV)

## Fase 6 — Qualidade

- Testes unitários: algoritmo + capacidade
- Testes e2e Playwright: auth, fluxo privado completo, fluxo público
- Empty states + loading states + error handling com voz da marca
- Acessibilidade: foco visível, contraste, labels
- Limpeza: mocks, referências Farmei, README raiz, .env.example

## Dependências críticas

```
Fase 1 → Fase 2 → Fase 4 e Fase 5
Fase 3.1 (independente — pode rodar com Fase 1 ou 2)
Fase 4 → Fase 5 (infra de eventos pronta)
Fase 6 (incremental durante fases anteriores)
```

## Fase mobile (tag `mobile` no Task Master)

Backlog isolado em `.taskmaster/tasks/tasks.json` na tag `mobile`. Detalhes em [Mobile Architecture](../architecture/mobile-architecture.md) e no PRD `.taskmaster/docs/mobile-prd.md`.

**M1 Mobile · Foundation**
- 1 Scaffold Expo Router + TypeScript (✅ scaffold inicial criado)
- 2 NativeWind + design tokens compartilhados
- 3 Cliente HTTP + Supabase Auth com SecureStore

**M2 Mobile · App shell**
- 4 Tab bar + onboarding + login/signup

**M3 Mobile · Privado**
- 5 Home, Create, Invite, Availability, Result (AICard hero), Confirmed

**M4 Mobile · Público**
- 6 Feed, Detail, CreatePublic, HostPanel + export CSV

**M5 Mobile · Convites & Push**
- 7 Deeplink `/invite/[token]`
- 8 Push (registro + handler; novo endpoint `POST /users/me/devices` na API)

**M6 Mobile · Qualidade & release**
- 9 Maestro flows, a11y, estados de erro
- 10 EAS Build + TestFlight + Internal Track
- 11 README + atualização de CLAUDE.md

Dependências:
```
M1 → M2 → M3 e M4
M5.7 depende de M3
M5.8 depende de M2 (e cria endpoint na API)
M6 incremental
```

## See Also

- [System Design](../architecture/system-design.md)
- [Architectural Decisions](../architecture/architectural-decisions.md)
- [Mobile Architecture](../architecture/mobile-architecture.md)
- [Business Rules](../product/business-rules.md)
