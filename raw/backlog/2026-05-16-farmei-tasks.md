# Farmei MVP Backlog — Tasks

> Source: docs/TASKS.md (internal project document)
> Collected: 2026-05-16
> Published: 2026-05-16

## Fases

### Fase 0 — Auditoria e planejamento ✅
Leitura de docs existentes, mapeamento de gaps, criação de PRD/ARCHITECTURE/TASKS/DECISIONS.

### Fase 1 — Foundation do monorepo
1.1 Monorepo base: pnpm workspaces, estrutura de diretórios, turbo, .gitignore, .env.example
1.2 TypeScript e qualidade: tsconfig.base.json, eslint, prettier propagados para apps e services
1.3 Design tokens: global.css derivado de colors_and_type.css, tailwind.config.ts com tokens mapeados
1.4 App web scaffold: Next.js 15, Tailwind + tokens, shadcn/ui, layout base com fonts, página placeholder
1.5 API scaffold: Hono, Zod, roteamento base /api/v1/*, middleware auth JWT, handler de erros

### Fase 2 — Banco de dados e auth
2.1 Banco: PostgreSQL (Supabase/Neon), Drizzle ORM, schema completo, migrations, seed de dev
2.2 Auth: Supabase Auth, endpoints de signup/login/logout/me, middleware sessão Next.js, páginas /login e /signup

### Fase 3 — Core do domínio
3.1 Algoritmo de sugestão: packages/utils/src/date-suggestion.ts, scoreDay(), maxPossibleScore(), suggestDate(), explicação por template, testes unitários completos
3.2 Usuários: GET/PUT /users/me, componente de perfil básico
3.3 Tipos compartilhados: packages/types com events.ts, users.ts, api.ts (DTOs)

### Fase 4 — Fluxo privado (MVP core)
4.1 Criar evento privado: POST /private-events, formulário, validação Zod+RHF, redirect para /events/[id]
4.2 Convidar participantes: POST/DELETE /private-events/:id/participants, interface de convite, token por participante, página /invite/:token
4.3 Disponibilidade: POST/GET /private-events/:id/availability, UI yes/maybe/no por data, progresso de respostas
4.4 Sugestão e confirmação: GET .../suggestion, card com data+confidence+explicação (spark yellow), POST .../confirm, estado CONFIRMED
4.5 Dashboard organizador: /dashboard com lista de eventos, status visual, links de ação

### Fase 5 — Fluxo público
5.1 Criar evento público: POST /public-events, formulário com data fixa/hora/local/capacidade
5.2 Explorar eventos: GET /public-events, feed /public com cards (título, data, local, vagas, barra lotação)
5.3 Detalhe e inscrição: GET /public-events/:id, POST/DELETE registrations, bloqueio ao lotar, feedback visual
5.4 Painel host: GET registrations (owner only), página /events/[id]/host, exportar CSV

### Fase 6 — Qualidade e hardening
6.1 Testes: unitários (algoritmo, capacidade), e2e Playwright (auth, fluxo privado completo, fluxo público)
6.2 Estados e erros: empty states, loading states, tratamento erros API, mensagens com voz da marca
6.3 Acessibilidade: foco visível, contraste, labels, navegação teclado nos fluxos críticos
6.4 Limpeza: remover mocks no fluxo real, auditar referências Farmei, README raiz, .env.example, logs

## Milestones

| Milestone | Entrega | Status |
|-----------|---------|--------|
| M0 | Documentação | ✅ |
| M1 | Foundation | ⬜ |
| M2 | Banco + algoritmo | ⬜ |
| M3 | Fluxo privado | ⬜ |
| M4 | Fluxo público | ⬜ |
| M5 | Qualidade | ⬜ |

## Dependências críticas

- Fase 2 depende de Fase 1
- date-suggestion (3.1) pode ser desenvolvido em paralelo com banco
- Fases 4 e 5 dependem de 2.1 + 2.2
- Fase 6 pode começar incrementalmente durante fases anteriores
