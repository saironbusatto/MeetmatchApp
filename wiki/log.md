# Wiki Log

## [2026-06-07] ingest | Sprint A+B mobile + design system portado + web redesign

### O que foi feito nesta sessão

**Diagnóstico e fix de infraestrutura:**
- Identificado que mobile ainda usava `@supabase/supabase-js` enquanto a API já rodava JWT próprio no Oracle — autenticação quebrada em produção.
- Migrado `lib/auth.ts` do mobile: removido SDK Supabase, implementado `signIn/signUp/signOut/hydrateSession` com fetch direto na API Oracle.
- Corrigido erro `ExpoSecureStore.getValueWithKeyAsync is not a function` no browser: adicionado fallback `localStorage` via `Platform.OS === 'web'`.
- Corrigido CORS do Oracle: `CORS_ORIGIN` só tinha `137.131.255.5:3000`, adicionado `localhost:8081` e `localhost:19006`.
- Criado usuário real no PostgreSQL Oracle (`saironbusatto@gmail.com`).

**Design system mobile portado do zero:**
- `components/ui/tokens.ts` — paleta completa, fontes, stamp/stampAi como constantes TS.
- `components/ui/Button.tsx` — PrimaryButton, SecondaryButton, AIButton (spark yellow), GhostButton, NewButton.
- `components/ui/Avatar.tsx` — Avatar com iniciais coloridas + key person dot; AvatarStack com overlap.
- `components/ui/AppHeader.tsx` — header com back button circular.
- `components/ui/FilterChips.tsx` — chips horizontais scrolláveis.
- `components/ui/EventCard.tsx` — card privado com badge locked/waiting + AvatarStack.
- `components/ui/PublicEventCard.tsx` — card público com barra de ocupação colorida.
- `components/ui/Sparkle.tsx` — ícone SVG via react-native-svg.

**Telas reescritas com design real:**
- `(auth)/onboarding` — círculo decorativo vermillon, ponto spark, headline 56px.
- `(auth)/login` e `signup` — campos com label uppercase, layout correto.
- `(tabs)/index` — greeting + "Your events", filter chips, event cards.
- `(tabs)/public` — "Perto de você", chips por categoria, cards com occupancy bar.
- `(tabs)/profile` — avatar grande + info card com stamp shadow.

**Sprint A — dados reais conectados:**
- Adicionado `GET /private-events` na API (lista eventos do usuário autenticado).
- `lib/useApi.ts` e `lib/queries.ts` — react-query hooks para todos os endpoints.
- Tabs conectadas à API real com loading/empty states.
- `new-private.tsx` e `new-public.tsx` — formulários funcionais com POST na API.
- `category` adicionado ao tipo `CreatePublicEventRequest`.

**Sprint B — fluxo privado completo:**
- `events/[id]/index.tsx` — detalhe real com participantes da API.
- `events/[id]/invite.tsx` — convidar por email → POST /participants.
- `events/[id]/availability.tsx` — calendário tap yes/maybe/no → POST /availability.
- `events/[id]/result.tsx` — card spark amarelo com stamp vermelho, confiança %, rationale da IA.
- `events/[id]/confirmed.tsx` — locked-in screen com lista de participantes.

**Deploy:**
- API no Oracle atualizada via `docker compose build api && docker compose up -d`.
- Commit `1c5897e` — 46 arquivos, 2833 inserções.

### Docs atualizados nesta sessão
- `architecture/mobile-architecture.md` — seção de auth (Supabase→JWT) + estrutura de pastas atualizada.
- `architecture/architectural-decisions.md` — ADR-012 marcado como concluído, ADR-014 adicionado.
- `design-system/component-patterns.md` — inventário de componentes implementados.
- `backlog/mvp-backlog.md` — M1–M4 mobile atualizados.

## [2026-05-16] ingest | Ingest completo do repositório Farmei

Fontes ingeridas nesta sessão:

**Documentação operacional (docs/):**
- Updated: Product Overview
- Updated: Business Rules
- Updated: System Design
- Updated: Data Model
- Updated: Architectural Decisions
- Updated: MVP Backlog

**Design system:**
- Updated: Visual Foundations
- Updated: Brand Voice & Copy
- Updated: Component Patterns

**UI flows:**
- Updated: Private Event Flow
- Updated: Public Event Flow

**Projeto:**
- Updated: Setup & Conventions

---

## [2026-05-16] ingest | Bootstrap inicial

Fontes: docs/PRD.md, docs/ARCHITECTURE.md, docs/DECISIONS.md, docs/TASKS.md
Artigos criados: product-overview, business-rules, system-design, data-model, architectural-decisions, mvp-backlog

---

## Fontes ainda pendentes de ingest futuro

- `ui_kits/mobile/screens-social.jsx` — telas sociais (crush finder, amigos em comum) — fora do MVP
- `ui_kits/web/views.jsx` e `components.jsx` — dashboard web desktop
- `ui_kits/marketing/sections.jsx` — seções do site de marketing
- `prototype.html` — fluxo clicável end-to-end com 14 telas
- `SKILL.md` — manifest do agent skill (relevante se Farmei for reutilizado como skill)

Recomendação: ingerir `ui_kits/web/` antes de implementar o app web (Fase 4).

## [2026-05-16] ingest | Foundation monorepo + core shared packages + rebrand sweep

Fontes ingeridas nesta sessão:
- Estrutura monorepo: `package.json`, `pnpm-workspace.yaml`, `turbo.json`, `.nvmrc`, `.gitignore`
- Config compartilhada: `packages/config/*`
- Tokens: `packages/design-tokens/*`
- Tipos: `packages/types/*`
- Algoritmo e testes: `packages/utils/*`
- Backlog operacional: `.taskmaster/tasks/tasks.json`
- Rebrand em docs/comentários: múltiplos arquivos (`README.md`, `SKILL.md`, `ui_kits/*`, `docs/*`, `wiki/*`)

Evidência bruta: `raw/wiki-ingest/2026-05-16_20-50-58.md`

## [2026-05-17] ingest | Fechamento de pendências do backlog

Fontes ingeridas:
- 
- 
- 
- 
- 
- 
- 

Evidência bruta: - raw/wiki-ingest/2026-05-17_11-52-24.md

## [2026-05-17] ingest | Fechamento de pendências

- Evidência bruta: raw/wiki-ingest/2026-05-17_11-52-44.md

## [2026-05-17] plan | Mobile app planning + scaffold

- Criado: PRD do mobile em `.taskmaster/docs/mobile-prd.md`
- Criado: tag `mobile` no Task Master com 11 tasks (fases M1–M6 mobile)
- Criado: artigo `architecture/mobile-architecture.md`
- Atualizado: `architecture/architectural-decisions.md` (ADR-001 reativada como decisão de implementação)
- Atualizado: `backlog/mvp-backlog.md` com fase mobile
- Atualizado: `index.md` com nova entrada de arquitetura
- Scaffold em `apps/mobile/` (Expo Router v3 + NativeWind + Supabase)

## [2026-05-17] ingest | Mobile continuation executed

- Fontes baixadas em apps/mobile/assets/fonts
- Ícones placeholders criados em apps/mobile/assets/icons
- Taskmaster tag mobile ativa e task #1 em in-progress
- Evidência: raw/wiki-ingest/2026-05-17_14-56-38.md

## [2026-05-17] ingest | Mobile continuation executed (correction)

- Fontes baixadas em apps/mobile/assets/fonts
- Ícones placeholders criados em apps/mobile/assets/icons
- Tag mobile ativa no Taskmaster e task #1 em in-progress
- Evidência: raw/wiki-ingest/2026-05-17_14-56-38.md

## [2026-05-17] ingest | Mobile one-shot completion

- Tasks mobile (#22..#32) concluídas no Taskmaster
- API ganhou endpoint 
- Mobile recebeu push registration, handler de deep link por notificação, Maestro flows e EAS/workflow
- Evidência: raw/wiki-ingest/2026-05-17_15-09-48.md

## [2026-05-17] ingest | Mobile one-shot completion (correction)

- Tasks mobile (#22..#32) concluídas no Taskmaster
- API ganhou endpoint POST /users/me/devices
- Mobile recebeu push registration, handler de deep link por notificação, Maestro flows e EAS/workflow
- Evidência: raw/wiki-ingest/2026-05-17_15-09-48.md

## [2026-05-17] ingest | Task #33 user_devices persistence

- Drizzle schema ganhou enum/table de devices e índices de unicidade
- upsertUserDevice migrou para query real com fallback local
- migration gerada; execução bloqueada localmente por DATABASE_URL ausente
- Evidência: raw/wiki-ingest/2026-05-17_15-33-11.md

## [2026-05-17] ingest | Task #33 user_devices persistence (correction)

- Drizzle schema ganhou enum/table de devices e índices de unicidade
- upsertUserDevice migrou para query real com fallback local
- migration gerada; execução bloqueada localmente por DATABASE_URL ausente
- Evidência: raw/wiki-ingest/2026-05-17_15-33-11.md

## [2026-05-17] ingest | Security & dependency hardening (tasks #34 #35 #36 #44 #45)

- Auth da API consolidado em Supabase JWT, removendo bypass local `dev_*`
- Fluxo de invites agora exige Bearer válido e ignora `userId` arbitrário no body
- Dependências atualizadas: `next@16.2.6`, `drizzle-orm@^0.45.2`, `drizzle-kit@^0.31.10`
- Task Master atualizado: tasks 34, 35, 36, 44 e 45 marcadas como `done`
- Evidência: raw/wiki-ingest/2026-05-17_15-49-50.md

## [2026-05-19] ingest | Pretext text measurement library

- Created: raw/pretext/2026-05-19-pretext-text-measurement.md
- Created: pretext/text-measurement.md (new topic)
- Updated: index.md with pretext section


## [2026-05-20] ingest | Sprint plan Postgres/API migration + Alembic governance

- Created: `docs/SPRINTS_POSTGRES_API_MIGRATION.md`
- Conteúdo inclui:
  - plano de sprints com deliverables por fase
  - tasks com skill obrigatória antes de execução
  - fechamento técnico de cada sprint com `debugger` e `alembic-pro`
  - diretriz de adoção de SQLAlchemy + Alembic para migrações futuras
- Objetivo operacional: migração suave de auth/infra para backend próprio com PostgreSQL

## [2026-05-20] ingest | Sprint 4 execution (parallel Alembic track) + wiki correction

- Created: `services/api/python-requirements.txt`
- Created: SQLAlchemy model layer for auth
  - `services/api/sqlalchemy_models/base.py`
  - `services/api/sqlalchemy_models/auth_models.py`
- Created: Alembic parallel scaffold
  - `services/api/alembic.ini`
  - `services/api/alembic_py/env.py`
  - `services/api/alembic_py/script.py.mako`
  - `services/api/alembic_py/versions/20260520_0001_baseline_auth.py`
- Created: operational runbook for Sprint 4
  - `docs/SPRINT4_ALEMBIC_PARALLEL_RUNBOOK.md`
- Corrected architecture decisions:
  - Added `ADR-013` (SQLAlchemy + Alembic parallel to Drizzle) in `wiki/architecture/architectural-decisions.md`

## [2026-05-20] ingest | Ops runbook sanitized + local private runbooks ignored

- Created: `wiki/project/ops-runbook-sanitized.md`
  - Deployment and operations baseline without real IPs, keys, OCIDs, usernames or secrets
  - Includes service topology, ingress policy, DB/migration flow, verification checklist, backup baseline
- Updated: `wiki/index.md` with runbook article entry under `project`
- Updated: `.gitignore` to keep private runbooks out of Git
  - `docs/RUNBOOK_LOCAL*`
  - `docs/*LOCAL*.md`
  - `docs/private/`
  - `wiki/private/`

## [2026-05-19] ingest | Auditoria de segurança do Credenciais.md

- Verificado conteúdo de `Credenciais.md` com foco em privacidade/chaves/tokens.
- Confirmado que `Credenciais.md` está ignorado por `.gitignore` (linha 30).
- Confirmado que não há histórico de commit (`--all`) para `Credenciais.md`, `*.key`, `*.key.pub` e `.env`.
- Evidência: `raw/wiki-ingest/2026-05-19_00-47-07.md`

## [2026-05-19] ingest | Checagem de servidor (disco + containers)

- Acesso SSH validado com usuário `ubuntu`.
- Verificado espaço em disco com `df -h` no host `farmei-prod`.
- Verificados containers em execução com `docker ps`: 3 ativos.
- Evidência: `raw/wiki-ingest/2026-05-19_00-48-20.md`

## [2026-05-19] ingest | Build Android via EAS bloqueado por autenticação

- `eas-cli` instalado localmente com sucesso.
- Tentativa de login Expo falhou por credencial inválida.
- Build Android não foi iniciado nesta etapa.
- Evidência: `raw/wiki-ingest/2026-05-19_00-53-22.md`

## [2026-05-19] ingest | Troubleshooting EAS Android build

- Investigadas falhas em cadeia do build Android no EAS (prebuild, bundle e gradle).
- Aplicadas correções em `apps/mobile`: simplificação de `metro.config.js` e adição de deps ausentes (`whatwg-fetch`, `expo-modules-core`, `@babel/runtime`, `react-native-css-interop`).
- Build avançou até fase `RUN_GRADLEW`, falhando em `android/app/build.gradle` linha 14 com `Cannot invoke method getAbsolutePath() on null object` (resolução de `hermes-compiler`).
- Evidência: `raw/wiki-ingest/2026-05-19_08-13-13.md`


## [2026-05-21] ingest | Pull remoto com autostash

- Executado `git pull --rebase --autostash` em `main`.
- Fast-forward para `origin/main` aplicado com sucesso.
- Reaplicação do autostash gerou conflitos; mudanças locais preservadas no stash.
- Evidência: `raw/wiki-ingest/2026-05-21_13-27-26.md`

## [2026-06-07] ingest | Sprint C+D mobile + web design deClerk + browser validation

### O que foi feito

**Sprint C — Mobile fluxo público completo:**
- `apps/mobile/app/public/[id].tsx` — detalhe de evento público com dados reais (GET /public-events/:id), barra de ocupação, botão "Eu vou!" funcional, share sheet
- `apps/mobile/app/events/[id]/host.tsx` — host dashboard com lista de inscritos (GET /public-events/:id/registrations), check-in por horário, remoção de inscrito, export CSV via Share
- `apps/mobile/lib/api.ts` — adicionado `publicEvents.getRegistrations(id)`

**Sprint D — Mobile design polish:**
- `apps/mobile/app/events/new.tsx` — seletor de tipo de evento reescrito com `EventTypeCard`: privado usa AIButton card (ink bg, spark yellow, stampAi), público usa card padrão com stamp
- Removido uso de `StampCard` e `Themed` legados nessa tela

**Validação com browser automation (Playwright):**
- Mobile onboarding: ✅ círculo vermelho, ponto spark, Bricolage 56px, stamp button
- Mobile login: ✅ "Buenas de novo.", labels uppercase, botão vermelho stamp
- Mobile tabs: ✅ "Buenas, Sairon" / filter chips / loading spinner vermelho
- Web: aguardando deploy com design correto

**Correção de contaminação Clerk:**
- Processo externo introduziu `@clerk/nextjs`, `@clerk/types`, `useApiToken`, `ClerkProvider`, `clerkMiddleware` em vários arquivos web e mobile
- Todos removidos e restaurados para versão JWT Oracle:
  - `apps/web/app/layout.tsx` → AuthProvider
  - `apps/web/app/login/page.tsx`, `signup/page.tsx` → email/senha + useAuth
  - `apps/web/components/ui/Nav.tsx` → useAuth (sem Clerk)
  - `apps/web/middleware.ts` → JWT cookie check
  - `apps/mobile/app/_layout.tsx` → hydrateSession() sem Clerk
  - `apps/mobile/app/(auth)/login.tsx`, `signup.tsx` → sem OAuthButton/Clerk
  - `services/api/src/middleware/auth.ts`, `utils/jwt.ts` → verifyAccessToken JWT local
  - `apps/web/hooks/useApiToken.ts`, `apps/web/app/sso-callback/page.tsx` → deletados

**Git:**
- Force push para sobrescrever commits Clerk no remote (os commits Clerk divergiam do nosso trabalho JWT)
- Deploy no Oracle via docker compose build web

### Docs atualizados
- `wiki/log.md` esta entrada
- `wiki/CHANGELOG.md` entrada 2026-06-07 expandida
