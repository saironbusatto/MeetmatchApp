# Project Wiki Changelog

## 2026-05-16
- Bootstrapped repository structure into apps/packages/services layout.
- Added docs skeleton files: PRD.md, ARCHITECTURE.md, TASKS.md.
- Validation performed with directory listing commands.
- Raw ingest evidence: raw/wiki-ingest/2026-05-16_19-50-00.md

## 2026-05-16 (Codex global)
- Installed global Codex skill wrapper `claude-task-master` under `~/.codex/skills`.
- Added upstream reference docs and validated CLI availability (`task-master --version = 0.43.1`).
- Raw ingest evidence: raw/wiki-ingest/2026-05-16_20-30-00.md

## 2026-05-16
- Concluídas tasks 1, 2, 3 e 4 do backlog técnico (foundation + tokens + tipos + algoritmo).
- Adicionado monorepo funcional com pnpm workspaces e Turbo.
- Criado `packages/config` com baseline de TypeScript e ESLint.
- Criados `packages/design-tokens`, `packages/types` e `packages/utils` com contratos e testes iniciais.
- Rebrand textual executado no repositório (`Vamointao` → `Farmei`) com varredura completa.
- Validação: `pnpm install`, `pnpm typecheck`, `pnpm build`, `pnpm test`.
- Raw ingest evidence: `raw/wiki-ingest/2026-05-16_20-50-58.md`

## 2026-05-17
- Zeradas pendências do backlog no Taskmaster ().
- API e Web receberam scaffold funcional completo para os fluxos privado e público.
- Adicionados CI, docs de deploy e schema inicial Drizzle.
- Validação executada com sucesso (
> farmei@0.1.0 typecheck /home/saironbusatto/PROJETOS/Farmei
> turbo run typecheck


   • Packages in scope: @farmei/api, @farmei/config, @farmei/design-tokens, @farmei/types, @farmei/ui, @farmei/utils, @farmei/web
   • Running typecheck in 7 packages
   • Remote caching disabled

@farmei/types:typecheck: cache hit, replaying logs 5dc1c5b7a39a6567
@farmei/types:typecheck: 
@farmei/types:typecheck: > @farmei/types@0.1.0 typecheck /home/saironbusatto/PROJETOS/Farmei/packages/types
@farmei/types:typecheck: > tsc -p tsconfig.json --noEmit
@farmei/types:typecheck: 
@farmei/utils:typecheck: cache hit, replaying logs fc9808b9a20ac264
@farmei/utils:typecheck: 
@farmei/utils:typecheck: > @farmei/utils@0.1.0 typecheck /home/saironbusatto/PROJETOS/Farmei/packages/utils
@farmei/utils:typecheck: > tsc -p tsconfig.json --noEmit
@farmei/utils:typecheck: 
@farmei/ui:typecheck: cache hit, replaying logs 7cefc8e4b766492b
@farmei/ui:typecheck: 
@farmei/ui:typecheck: > @farmei/ui@0.1.0 typecheck /home/saironbusatto/PROJETOS/Farmei/packages/ui
@farmei/ui:typecheck: > tsc -p tsconfig.json --noEmit
@farmei/ui:typecheck: 
@farmei/design-tokens:typecheck: cache hit, replaying logs ac698e34379ebfa5
@farmei/design-tokens:typecheck: 
@farmei/design-tokens:typecheck: > @farmei/design-tokens@0.1.0 typecheck /home/saironbusatto/PROJETOS/Farmei/packages/design-tokens
@farmei/design-tokens:typecheck: > tsc -p tsconfig.json --noEmit
@farmei/design-tokens:typecheck: 
@farmei/api:typecheck: cache hit, replaying logs 84dfe94a15867058
@farmei/api:typecheck: 
@farmei/api:typecheck: > @farmei/api@0.1.0 typecheck /home/saironbusatto/PROJETOS/Farmei/services/api
@farmei/api:typecheck: > tsc -p tsconfig.json --noEmit
@farmei/api:typecheck: 
@farmei/web:typecheck: cache miss, executing fca44dcc36ae8360
@farmei/web:typecheck: 
@farmei/web:typecheck: > @farmei/web@0.1.0 typecheck /home/saironbusatto/PROJETOS/Farmei/apps/web
@farmei/web:typecheck: > tsc -p tsconfig.json --noEmit
@farmei/web:typecheck: 

 Tasks:    6 successful, 6 total
Cached:    5 cached, 6 total
  Time:    1.426s , 
> farmei@0.1.0 build /home/saironbusatto/PROJETOS/Farmei
> turbo run build


   • Packages in scope: @farmei/api, @farmei/config, @farmei/design-tokens, @farmei/types, @farmei/ui, @farmei/utils, @farmei/web
   • Running build in 7 packages
   • Remote caching disabled

@farmei/ui:build: cache hit, replaying logs 502c6b8ea8efa09e
@farmei/ui:build: 
@farmei/ui:build: > @farmei/ui@0.1.0 build /home/saironbusatto/PROJETOS/Farmei/packages/ui
@farmei/ui:build: > tsc -p tsconfig.json --noEmit
@farmei/ui:build: 
@farmei/types:build: cache hit, replaying logs 29923dbc12e05e69
@farmei/types:build: 
@farmei/types:build: > @farmei/types@0.1.0 build /home/saironbusatto/PROJETOS/Farmei/packages/types
@farmei/types:build: > tsc -p tsconfig.json --noEmit
@farmei/types:build: 
@farmei/design-tokens:build: cache hit, replaying logs aa2094b4b25fb2b7
@farmei/design-tokens:build: 
@farmei/design-tokens:build: > @farmei/design-tokens@0.1.0 build /home/saironbusatto/PROJETOS/Farmei/packages/design-tokens
@farmei/design-tokens:build: > tsc -p tsconfig.json --noEmit
@farmei/design-tokens:build: 
@farmei/utils:build: cache hit, replaying logs 42bffc69dc2ebdc0
@farmei/utils:build: 
@farmei/utils:build: > @farmei/utils@0.1.0 build /home/saironbusatto/PROJETOS/Farmei/packages/utils
@farmei/utils:build: > tsc -p tsconfig.json --noEmit
@farmei/utils:build: 
@farmei/api:build: cache hit, replaying logs a1ac45d67c897908
@farmei/api:build: 
@farmei/api:build: > @farmei/api@0.1.0 build /home/saironbusatto/PROJETOS/Farmei/services/api
@farmei/api:build: > tsc -p tsconfig.json --noEmit
@farmei/api:build: 
@farmei/web:build: cache hit, replaying logs a75e397a0c6229ae
@farmei/web:build: 
@farmei/web:build: > @farmei/web@0.1.0 build /home/saironbusatto/PROJETOS/Farmei/apps/web
@farmei/web:build: > next build
@farmei/web:build: 
@farmei/web:build:    ▲ Next.js 15.3.3
@farmei/web:build: 
@farmei/web:build:    Creating an optimized production build ...
@farmei/web:build:  ✓ Compiled successfully in 0ms
@farmei/web:build:    Linting and checking validity of types ...
@farmei/web:build:    Collecting page data ...
@farmei/web:build:    Generating static pages (0/9) ...
@farmei/web:build:    Generating static pages (2/9) 
@farmei/web:build:    Generating static pages (4/9) 
@farmei/web:build:    Generating static pages (6/9) 
@farmei/web:build:  ✓ Generating static pages (9/9)
@farmei/web:build:    Finalizing page optimization ...
@farmei/web:build:    Collecting build traces ...
@farmei/web:build: 
@farmei/web:build: Route (app)                                 Size  First Load JS
@farmei/web:build: ┌ ○ /                                      172 B         105 kB
@farmei/web:build: ├ ○ /_not-found                            977 B         102 kB
@farmei/web:build: ├ ○ /dashboard                             812 B         105 kB
@farmei/web:build: ├ ƒ /events/[id]                           977 B         106 kB
@farmei/web:build: ├ ƒ /events/[id]/availability            1.05 kB         102 kB
@farmei/web:build: ├ ƒ /events/[id]/host                      998 B         102 kB
@farmei/web:build: ├ ○ /events/new                          1.26 kB         102 kB
@farmei/web:build: ├ ƒ /invite/[token]                        556 B         102 kB
@farmei/web:build: ├ ○ /login                               1.17 kB         102 kB
@farmei/web:build: ├ ○ /public                                927 B         102 kB
@farmei/web:build: └ ○ /signup                               1.2 kB         102 kB
@farmei/web:build: + First Load JS shared by all             101 kB
@farmei/web:build:   ├ chunks/700-47613b909b5c1b70.js       46.1 kB
@farmei/web:build:   ├ chunks/d1c7e0ba-488f09bc54ed7341.js  53.2 kB
@farmei/web:build:   └ other shared chunks (total)          1.92 kB
@farmei/web:build: 
@farmei/web:build: 
@farmei/web:build: ƒ Middleware                             33.4 kB
@farmei/web:build: 
@farmei/web:build: ○  (Static)   prerendered as static content
@farmei/web:build: ƒ  (Dynamic)  server-rendered on demand
@farmei/web:build: 

 Tasks:    6 successful, 6 total
Cached:    6 cached, 6 total
  Time:    26ms >>> FULL TURBO, 
> farmei@0.1.0 test /home/saironbusatto/PROJETOS/Farmei
> turbo run test


   • Packages in scope: @farmei/api, @farmei/config, @farmei/design-tokens, @farmei/types, @farmei/ui, @farmei/utils, @farmei/web
   • Running test in 7 packages
   • Remote caching disabled

@farmei/utils:test: cache hit, replaying logs 5665713908e44554
@farmei/utils:test: 
@farmei/utils:test: > @farmei/utils@0.1.0 test /home/saironbusatto/PROJETOS/Farmei/packages/utils
@farmei/ui:test: cache hit, replaying logs 28a1810e3d386fd0
@farmei/utils:test: > vitest run
@farmei/utils:test: 
@farmei/ui:test: 
@farmei/ui:test: > @farmei/ui@0.1.0 test /home/saironbusatto/PROJETOS/Farmei/packages/ui
@farmei/utils:test: 
@farmei/ui:test: > echo 'no tests yet'
@farmei/utils:test:  RUN  v2.1.9 /home/saironbusatto/PROJETOS/Farmei/packages/utils
@farmei/ui:test: 
@farmei/utils:test: 
@farmei/ui:test: no tests yet
@farmei/utils:test:  ✓ src/__tests__/date-suggestion.test.ts (7 tests) 16ms
@farmei/utils:test: 
@farmei/utils:test:  Test Files  1 passed (1)
@farmei/utils:test:       Tests  7 passed (7)
@farmei/utils:test:    Start at  20:50:33
@farmei/utils:test:    Duration  251ms (transform 38ms, setup 0ms, collect 34ms, tests 16ms, environment 0ms, prepare 50ms)
@farmei/utils:test: 
@farmei/types:test: cache hit, replaying logs bf2b4847b83e9bbd
@farmei/types:test: ! Corepack is about to download https://registry.npmjs.org/pnpm/-/pnpm-9.12.2.tgz
@farmei/types:test: 
@farmei/types:test: > @farmei/types@0.1.0 test /home/saironbusatto/PROJETOS/Farmei/packages/types
@farmei/types:test: > echo 'no tests yet'
@farmei/types:test: 
@farmei/types:test: no tests yet
@farmei/design-tokens:test: cache hit, replaying logs c842793072d9d693
@farmei/design-tokens:test: ! Corepack is about to download https://registry.npmjs.org/pnpm/-/pnpm-9.12.2.tgz
@farmei/design-tokens:test: 
@farmei/design-tokens:test: > @farmei/design-tokens@0.1.0 test /home/saironbusatto/PROJETOS/Farmei/packages/design-tokens
@farmei/design-tokens:test: > echo 'no tests yet'
@farmei/design-tokens:test: 
@farmei/design-tokens:test: no tests yet
@farmei/api:test: cache hit, replaying logs a5a9076e054c2543
@farmei/api:test: 
@farmei/api:test: > @farmei/api@0.1.0 test /home/saironbusatto/PROJETOS/Farmei/services/api
@farmei/api:test: > echo 'no tests yet'
@farmei/api:test: 
@farmei/api:test: no tests yet
@farmei/web:test: cache hit, replaying logs e57db7de99130e81
@farmei/web:test: 
@farmei/web:test: > @farmei/web@0.1.0 test /home/saironbusatto/PROJETOS/Farmei/apps/web
@farmei/web:test: > echo 'no tests yet'
@farmei/web:test: 
@farmei/web:test: no tests yet

 Tasks:    6 successful, 6 total
Cached:    6 cached, 6 total
  Time:    27ms >>> FULL TURBO).
- Raw ingest evidence: raw/wiki-ingest/2026-05-17_11-52-24.md

## 2026-05-17
- Pendências zeradas no Taskmaster.
- API/Web/CI/deploy docs atualizados.
- Validação: pnpm typecheck/build/test.
- Raw ingest evidence: raw/wiki-ingest/2026-05-17_11-52-44.md

## 2026-05-17
- Mobile: ativada tag  no Taskmaster e task #1 marcada como in-progress.
- Executado setup operacional: install, fonts, typecheck e  com Metro em localhost:8081.
- Raw ingest evidence: raw/wiki-ingest/2026-05-17_14-56-38.md

## 2026-05-17
- Mobile: tag mobile ativada no Taskmaster e task #1 marcada como in-progress.
- Setup operacional executado: install, fonts, typecheck e start do app mobile (Metro em localhost:8081).
- Raw ingest evidence: raw/wiki-ingest/2026-05-17_14-56-38.md

## 2026-05-17
- Conclusão one-shot da trilha mobile (tasks 22..32).
- Endpoint de devices para push adicionado na API.
- EAS config + workflow mobile release adicionados.
- Validação executada via typecheck API/mobile e startup command do Expo.
- Raw ingest evidence: raw/wiki-ingest/2026-05-17_15-09-48.md

## 2026-05-17
- Conclusão one-shot da trilha mobile (tasks 22..32).
- Endpoint de devices para push adicionado na API.
- EAS config + workflow mobile release adicionados.
- Validação executada via typecheck API/mobile e startup command do Expo.
- Raw ingest evidence: raw/wiki-ingest/2026-05-17_15-09-48.md

## 2026-05-17
- Task #33 concluída: persistência de  em PostgreSQL via Drizzle.
- Gerada migration SQL para devices; aplicação no banco depende de  no ambiente.
- Raw ingest evidence: raw/wiki-ingest/2026-05-17_15-33-11.md

## 2026-05-17
- Task #33 concluída: persistência de user_devices em PostgreSQL via Drizzle.
- Gerada migration SQL para devices; aplicação no banco depende de DATABASE_URL no ambiente.
- Raw ingest evidence: raw/wiki-ingest/2026-05-17_15-33-11.md

## 2026-05-19
- Executada auditoria de segurança em `Credenciais.md` e arquivos sensíveis locais.
- Validado que `Credenciais.md` está ignorado por `.gitignore` e sem commits no histórico local (`--all`).
- Checado histórico local para `*.key`, `*.key.pub` e `.env` sem evidência de versionamento.
- Raw ingest evidence: `raw/wiki-ingest/2026-05-19_00-47-07.md`
