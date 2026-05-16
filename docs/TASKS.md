# TASKS — Farmei MVP Backlog

> Última atualização: 2026-05-16
> Método: tarefas ordenadas por fase, com dependências explícitas.
> Estado: Fase 0 concluída. Diretórios scaffold existem mas estão vazios. Fase 1 é a próxima.

---

## Fase 0 — Auditoria e planejamento ✅

- [x] Ler CLAUDE.md, README.md, colors_and_type.css
- [x] Ler protótipos e UI kits
- [x] Mapear gaps entre design e software real
- [x] Criar PRD.md
- [x] Criar ARCHITECTURE.md
- [x] Criar TASKS.md
- [x] Criar DECISIONS.md
- [x] Ingest completo na wiki (design system, UI flows, arquitetura, backlog)

---

## Fase 1 — Foundation do monorepo
> Dependência: nenhuma. Começar aqui.
> Nota: diretórios apps/web, services/api, packages/* já existem (scaffold anterior). Precisam ser inicializados.

### 1.1 Monorepo base
- [ ] Criar `package.json` raiz com `pnpm` workspaces (`apps/*`, `services/*`, `packages/*`)
- [ ] Criar `pnpm-workspace.yaml`
- [ ] Criar `turbo.json` com pipelines de build, dev e test
- [ ] Criar `.gitignore` (node_modules, .env, .next, dist, .turbo)
- [ ] Criar `.env.example` raiz com todas as variáveis necessárias documentadas
- [ ] Criar `README.md` raiz com instruções de setup local

### 1.2 TypeScript e qualidade
- [ ] Criar `packages/config/` com `package.json`
- [ ] Criar `packages/config/tsconfig.base.json` (strict, paths, moduleResolution bundler)
- [ ] Criar `packages/config/eslint.config.js` (base rules)
- [ ] Criar `packages/config/prettier.config.js`
- [ ] Criar `packages/config/tailwind.config.base.ts` (base sem tokens)

### 1.3 Design tokens
- [ ] Criar `packages/design-tokens/package.json`
- [ ] Criar `packages/design-tokens/src/global.css` (derivado de `colors_and_type.css` — CSS vars, fontes, `.vmt` class)
- [ ] Criar `packages/design-tokens/src/tailwind.config.ts` (cores, fontes, spacing, radii, shadows do design system)
- [ ] Exportar `index.ts` com referências para consumo em apps

### 1.4 App web — scaffold
- [ ] Criar `apps/web/package.json` com deps: next@15, react@19, typescript, tailwindcss, shadcn/ui
- [ ] Inicializar Next.js 15 com App Router e TypeScript strict
- [ ] Configurar Tailwind CSS 4 consumindo `packages/design-tokens`
- [ ] Instalar e configurar shadcn/ui (base acessível — visual será sobrescrito)
- [ ] Criar `apps/web/app/layout.tsx` com:
  - Google Fonts (Bricolage Grotesque, Geist, JetBrains Mono)
  - CSS variables do design system
  - Tema paper-and-ink aplicado ao `<body>`
- [ ] Criar página inicial placeholder `/` que redireciona para `/dashboard` ou `/login`

### 1.5 API — scaffold
- [ ] Criar `services/api/package.json` com deps: hono, zod, @supabase/supabase-js, drizzle-orm
- [ ] Criar `services/api/src/index.ts` com Hono app e roteamento base `/api/v1/*`
- [ ] Criar `services/api/src/middleware/auth.ts` (validar JWT Supabase, extrair user_id)
- [ ] Criar `services/api/src/middleware/error.ts` (handler de erros padronizado com shape consistente)
- [ ] Criar `services/api/src/lib/supabase.ts` (client singleton)

---

## Fase 2 — Banco de dados e autenticação
> Dependência: Fase 1 concluída.

### 2.1 Banco de dados
- [ ] Provisionar PostgreSQL (Supabase — preferencial por integrar com Auth)
- [ ] Instalar Drizzle ORM e `drizzle-kit` em `services/api`
- [ ] Criar `services/api/src/db/schema.ts` com todas as tabelas do modelo de domínio:
  - `users`, `events`, `private_event_settings`, `event_participants`
  - `availability_responses`, `public_event_settings`, `public_event_registrations`
- [ ] Criar migration inicial via `drizzle-kit generate`
- [ ] Aplicar migration no banco de desenvolvimento
- [ ] Criar `services/api/src/db/seed.ts` com dados fictícios para dev
- [ ] Configurar connection string em `.env` e `.env.example`

### 2.2 Autenticação
- [ ] Configurar projeto no Supabase Auth (email + senha)
- [ ] Implementar endpoint `POST /api/v1/auth/signup`
- [ ] Implementar endpoint `POST /api/v1/auth/login`
- [ ] Implementar endpoint `POST /api/v1/auth/logout`
- [ ] Implementar endpoint `GET /api/v1/auth/me` (retorna user autenticado)
- [ ] Criar middleware de sessão no Next.js (`apps/web/middleware.ts`) — proteger rotas
- [ ] Criar página `/login` com formulário email+senha (React Hook Form + Zod)
- [ ] Criar página `/signup` com formulário email+senha
- [ ] Criar fluxo de redirecionamento: pós-login → `/dashboard`, não autenticado → `/login`

### 2.3 Resolver decisões pendentes (antes da Fase 3)
> Estas decisões afetam diretamente o modelo e o fluxo de convites.
- [ ] **P1:** Convidados precisam criar conta para responder disponibilidade?
  - Sim → simplifica auth, complica UX de convite
  - Não → token opaco, resposta sem conta (recomendado para MVP)
- [ ] **P4:** Haverá papel separado de host com permissões distintas?
  - Decisão afeta middleware de auth e ownership checks
  - Recomendação: não no MVP — qualquer user autenticado pode criar evento privado ou público
- [ ] Registrar decisões em `docs/DECISIONS.md`

---

## Fase 3 — Core do domínio
> Dependência: Fase 2 concluída (exceto 3.1 que pode rodar em paralelo com qualquer fase).
> Ordem obrigatória dentro da fase: 3.3 → 3.1 → 3.2

### 3.1 Algoritmo de sugestão de data ⚡ (pode rodar em paralelo desde a Fase 1)
> Função pura sem dependência de banco ou auth. Começar assim que packages/utils tiver package.json.
- [ ] Criar `packages/utils/package.json` com dep: date-fns, vitest
- [ ] Criar `packages/utils/src/date-suggestion.ts`:
  - `scoreDay(responses, keyPersonId, keyPersonWeight)` → number
  - `maxPossibleScore(participantCount, keyPersonId, keyPersonWeight)` → number
  - `suggestDate(input: SuggestionInput)` → SuggestionResult com campo `reasoning`
  - Tiebreaker: data mais cedo em empate
  - Confidence: score_dia / max_possible_score
- [ ] Criar `packages/utils/src/date-suggestion.test.ts` (Vitest):
  - Cenário: todos "yes" → confidence 1.0
  - Cenário: key person com "no" → day perde mesmo com maioria "yes"
  - Cenário: empate de score → data mais cedo vence
  - Cenário: nenhum participante respondeu → retornar null ou empty
  - Cenário: key person com "maybe" vs dia sem key person mas all "yes"
  - Geração de `reasoning` textual (template-based)
- [ ] Rodar e garantir 100% de cobertura dos cenários críticos

### 3.2 Pacote de tipos compartilhados
> Fazer antes de implementar endpoints — garante contrato tipado entre web e API.
- [ ] Criar `packages/types/package.json`
- [ ] Criar `packages/types/src/events.ts`:
  - `EventType`, `EventStatus`, `ParticipantRole`, `InviteStatus`, `AvailabilityResponse`
  - `Event`, `PrivateEventSettings`, `EventParticipant`, `AvailabilityEntry`
  - `PublicEventSettings`, `PublicEventRegistration`
- [ ] Criar `packages/types/src/users.ts`: `User`, `UserProfile`
- [ ] Criar `packages/types/src/api.ts`: DTOs de request/response para todos os endpoints
- [ ] Criar `packages/types/src/index.ts` re-exportando tudo

### 3.3 Usuários
- [ ] Criar `services/api/src/routes/users.ts`
- [ ] Implementar `GET /api/v1/users/me` (usa user_id do JWT)
- [ ] Implementar `PUT /api/v1/users/me` (atualiza name, avatar_url)
- [ ] Criar componente de perfil básico no web (avatar + nome, editável)

---

## Fase 4 — Fluxo privado (diferencial do produto)
> Dependência: Fases 1, 2 e 3 concluídas.
> Implementar nesta ordem exata — cada sub-fase alimenta a próxima.

### 4.0 Dashboard base
> Pré-requisito para todas as sub-fases do fluxo privado.
- [ ] Criar layout de dashboard em `apps/web/app/(dashboard)/layout.tsx` com nav lateral/superior
- [ ] Criar página `/dashboard` com:
  - Lista de eventos criados pelo usuário (estado vazio bem tratado)
  - Botão "Novo evento" proeminente
  - Status visual por evento (DRAFT | OPEN | CONFIRMED | CANCELLED)

### 4.1 Criar evento privado
- [ ] Criar `services/api/src/routes/private-events.ts`
- [ ] Implementar `POST /api/v1/private-events`:
  - Body: title, description?, location_text?, date_window_start, date_window_end, key_person_user_id?
  - Validação Zod
  - Cria `events` (type=PRIVATE, status=DRAFT) + `private_event_settings`
  - Cria participante `OWNER` automaticamente
- [ ] Implementar `GET /api/v1/private-events/:id` (somente participantes)
- [ ] Implementar `PUT /api/v1/private-events/:id` (somente owner, somente se DRAFT/OPEN)
- [ ] Criar formulário de criação em `apps/web/app/(dashboard)/events/new/page.tsx`:
  - Campos: título, descrição, janela from/to (date pickers), key person, local
  - React Hook Form + Zod resolver
  - Redirect para `/events/[id]` após criação

### 4.2 Convidar participantes
- [ ] Implementar `POST /api/v1/private-events/:id/participants`:
  - Body: email (obrigatório), name?
  - Gera token UUID opaco em `event_participants.invite_token`
  - Retorna link de convite: `/invite/:token`
  - Owner only
- [ ] Implementar `DELETE /api/v1/private-events/:id/participants/:pid` (owner only, somente PENDING)
- [ ] Implementar `POST /api/v1/invites/:token/accept`:
  - Valida token, vincula user_id ao participante se autenticado
  - Atualiza invite_status para ACCEPTED
- [ ] Criar interface de convite na página do evento:
  - Input de email + botão "Convidar"
  - Lista de convidados com status (pending/accepted)
  - Botão para copiar link de convite
- [ ] Criar página `/invite/[token]` para aceite de convite:
  - Se não autenticado: redirect para signup com token preservado
  - Se autenticado: aceita convite e vai para a tela de disponibilidade

### 4.3 Disponibilidade
- [ ] Implementar `POST /api/v1/private-events/:id/availability`:
  - Body: array de `{ date: string, response: 'YES' | 'MAYBE' | 'NO' }`
  - Validação: datas devem estar dentro da janela do evento
  - Upsert (participante pode atualizar resposta)
  - Somente participantes com invite_status ACCEPTED
- [ ] Implementar `GET /api/v1/private-events/:id/availability`:
  - Retorna mapa de disponibilidade por dia com agregação por resposta
  - Mostra quantos de N responderam
- [ ] Criar página `/events/[id]/availability`:
  - Grid de dias dentro da janela (yes/maybe/no por toque/clique)
  - Quick fill: "Todos os dias" / "Dias de semana"
  - Banner de progresso: "5 de 6 já responderam"
  - Submit desabilitado se nenhum dia selecionado

### 4.4 Sugestão e confirmação
- [ ] Implementar `GET /api/v1/private-events/:id/suggestion`:
  - Carrega todas as availability_responses do evento
  - Chama `suggestDate()` de `packages/utils`
  - Retorna: best_date, confidence, reasoning, alternatives[], conflicts[]
  - Somente owner
- [ ] Implementar `POST /api/v1/private-events/:id/confirm`:
  - Body: confirmed_date
  - Atualiza event.status para CONFIRMED e event.confirmed_date
  - Somente owner, somente se OPEN
- [ ] Criar card de sugestão na página do evento (`/events/[id]`):
  - Background spark yellow, stamp shadow (a assinatura visual do produto)
  - Sparkle icon + "Farmei AI · best fit"
  - Data em display font grande, hora em mono
  - Confidence score + "N de M confirmados"
  - Seção "Por que esta data?" com reasoning
  - Card de conflito (vermillion soft) para quem não pode
  - Lista de alternativas
  - CTA: "Confirmar esta data"
- [ ] Exibir estado CONFIRMED na página do evento com data final bem visível

### 4.5 Dashboard do organizador (refinamento)
- [ ] Atualizar `/dashboard` para refletir estado real dos eventos:
  - Cards com: título, status badge, data (se confirmado), N de M responderam, ação principal contextual
  - Ação principal varia por status:
    - DRAFT: "Convidar pessoas"
    - OPEN: "Ver disponibilidade" ou "Ver sugestão"
    - CONFIRMED: "Ver evento"
    - CANCELLED: (sem ação)

---

## Fase 5 — Fluxo público
> Dependência: Fase 4.1 concluída (infra de events criada).
> Pode iniciar parcialmente em paralelo com fases avançadas da 4.

### 5.1 Criar evento público
- [ ] Criar `services/api/src/routes/public-events.ts`
- [ ] Implementar `POST /api/v1/public-events`:
  - Body: title, description?, location_text, event_date, event_time?, capacity, category?
  - Cria `events` (type=PUBLIC, status=OPEN) + `public_event_settings`
- [ ] Implementar `PUT /api/v1/public-events/:id` (owner only)
- [ ] Implementar `DELETE /api/v1/public-events/:id` (owner only → status=CANCELLED)
- [ ] Criar formulário de criação em `apps/web/app/(dashboard)/events/new-public/page.tsx`:
  - Campos: nome, local, categoria (select), data+hora, lotação máxima, descrição
  - Validação Zod + React Hook Form

### 5.2 Explorar eventos públicos
- [ ] Implementar `GET /api/v1/public-events`:
  - Paginação com cursor
  - Filtro por data (a partir de hoje por padrão)
  - Retorna vagas restantes calculadas em tempo real
- [ ] Implementar `GET /api/v1/public-events/:id`:
  - Retorna event + settings + contagem de inscritos + lista resumida de inscritos
- [ ] Criar página `/public` com feed de eventos:
  - Cards com: título, data/hora (fontMono), local, barra de ocupação colorida (success/warn/vermillion)
  - Filtro chips: All | Sports | Music | Social | Food
  - Empty state se não houver eventos
- [ ] Criar página `/events/[id]` para eventos públicos:
  - Hero card com cor da categoria
  - Seção de lotação com barra visual e contador
  - "Quem já vai" com avatares
  - Descrição

### 5.3 Inscrição
- [ ] Implementar `POST /api/v1/public-events/:id/registrations`:
  - Verifica capacidade em tempo real antes de criar (com lock pessimista ou constraint UNIQUE)
  - Retorna 409 se lotado
  - user_id do JWT
- [ ] Implementar `DELETE /api/v1/public-events/:id/registrations/me`:
  - Atualiza status para CANCELLED
- [ ] Criar botão de inscrição na página do evento:
  - "✓ Eu vou!" se há vagas (Primary, vermillion + stamp)
  - Desabilitado e "Lotado" se cheio
  - Toggle para cancelar inscrição se já inscrito
  - Feedback visual imediato pós-inscrição

### 5.4 Painel do host
- [ ] Implementar `GET /api/v1/public-events/:id/registrations` (owner only):
  - Retorna lista de inscritos com nome, email, data de inscrição
- [ ] Criar página `/events/[id]/host`:
  - Resumo: vagas ocupadas / total, barra de progresso
  - Lista de inscritos com nome + data de inscrição
  - Botão "Exportar CSV" (client-side: gera CSV dos dados já carregados)

---

## Fase 6 — Qualidade e hardening
> Pode começar incrementalmente durante fases anteriores.
> Testes do algoritmo (6.1 primeiros dois) devem ter sido feitos na Fase 3.1.

### 6.1 Testes de integração e e2e
- [ ] Testes e2e (Playwright): fluxo de auth completo (signup → login → logout)
- [ ] Testes e2e: fluxo privado completo (criar → convidar → disponibilidade → sugestão → confirmar)
- [ ] Testes e2e: fluxo público completo (criar → listar → inscrever → verificar lotação)
- [ ] Testes unitários: validação de capacidade máxima na inscrição

### 6.2 Estados e erros
- [ ] Empty states em todas as listas (dashboard, feed público, lista de convidados)
- [ ] Loading states em operações assíncronas (submits, fetches)
- [ ] Tratamento de erros de API com feedback visual na voz da marca
  - Exemplos: "Algo deu errado — tente de novo.", "Evento lotado, infelizmente."
- [ ] Erros de validação inline nos formulários

### 6.3 Acessibilidade
- [ ] Foco visível em todos os controles (vermillion ring, 2px offset)
- [ ] Contraste adequado verificado (ferramentas: axe ou similar)
- [ ] Labels e aria-labels em todos os inputs
- [ ] Navegação por teclado nos fluxos críticos (formulários, availability picker)

### 6.4 Limpeza e entrega
- [ ] Auditoria de referências a "Vamointao" em todo código novo
- [ ] Remover todos os `console.log` de desenvolvimento
- [ ] Revisar `.env.example` — deve documentar todas as variáveis com descrição
- [ ] Verificar que nenhum secret está hardcoded
- [ ] README raiz com: pré-requisitos, variáveis de ambiente, `pnpm install && pnpm dev`

---

## Milestones

| Milestone | Entrega | Status |
|-----------|---------|--------|
| M0 | Documentação + wiki | ✅ Concluído |
| M1 | Monorepo, scaffold, tokens, pages base | ⬜ Próximo |
| M2 | Banco + auth + algoritmo | ⬜ |
| M3 | Fluxo privado ponta a ponta | ⬜ |
| M4 | Fluxo público ponta a ponta | ⬜ |
| M5 | Qualidade, testes, limpeza | ⬜ |

---

## Mapa de dependências

```
M0 ✅
└── M1 (Fase 1)
    ├── 1.1 Monorepo base          → base para todo o resto
    ├── 1.2 TS + qualidade         → depende de 1.1
    ├── 1.3 Design tokens          → depende de 1.1
    ├── 1.4 App web scaffold       → depende de 1.2, 1.3
    └── 1.5 API scaffold           → depende de 1.2
        │
        ▼
    M2 (Fases 2 + 3)
    ├── 2.1 Banco + schema         → depende de 1.5
    ├── 2.2 Auth                   → depende de 2.1
    ├── 2.3 Decisões P1 e P4       → antes de 4.2
    ├── 3.1 Algoritmo ⚡            → independente — pode rodar desde 1.1
    ├── 3.2 Tipos                  → depende de 1.1, antes de 3.3
    └── 3.3 Users endpoint         → depende de 2.1, 2.2
        │
        ▼
    M3 (Fase 4) — fluxo privado
    ├── 4.0 Dashboard base         → depende de M2
    ├── 4.1 Criar evento privado   → depende de 4.0
    ├── 4.2 Convidar               → depende de 4.1, P1 decidida
    ├── 4.3 Disponibilidade        → depende de 4.2
    ├── 4.4 Sugestão + confirmação → depende de 4.3, 3.1
    └── 4.5 Dashboard refinamento  → depende de 4.4
        │
        ▼
    M4 (Fase 5) — fluxo público
    ├── 5.1 Criar evento público   → depende de 4.1 (infra pronta)
    ├── 5.2 Explorar eventos       → depende de 5.1
    ├── 5.3 Inscrição              → depende de 5.2
    └── 5.4 Painel host            → depende de 5.3
        │
        ▼
    M5 (Fase 6) — qualidade
```

---

## Fora do escopo (não implementar neste ciclo)

- Instagram OAuth / crush finder
- Mapa com geolocalização real (Mapbox/Google Maps)
- Sincronização de calendário externo
- Push notifications
- Feed/stories de evento
- Pagamentos e ticketing
- QR code check-in
- App mobile real (Expo)
- IA generativa para reasoning
- Waitlist para eventos lotados
