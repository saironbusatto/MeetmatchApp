# Wiki Log

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
