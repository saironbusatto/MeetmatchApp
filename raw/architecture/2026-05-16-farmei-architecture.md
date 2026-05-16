# Farmei Architecture — System Design Document

> Source: docs/ARCHITECTURE.md (internal project document)
> Collected: 2026-05-16
> Published: 2026-05-16

## Visão geral

Monorepo com duas aplicações principais (web + API) e packages compartilhados. Separação clara de domínio, contratos tipados entre camadas, evolução incremental sem complexidade prematura.

```
farmei/
├── apps/web/                  # Next.js 15 + React 19
├── services/api/              # Hono + TypeScript
├── packages/
│   ├── ui/                    # Componentes compartilhados
│   ├── design-tokens/         # CSS tokens → Tailwind
│   ├── types/                 # Contratos e tipos compartilhados
│   ├── utils/                 # Helpers reutilizáveis
│   └── config/                # Configs de lint/TS/Tailwind
└── docs/
```

## Bounded contexts

### Identity
Auth, sessão, perfil. Provider: Supabase Auth. Nenhuma regra de evento vaza aqui.

### Private Events
Agendamento colaborativo com sugestão de data. Entidades: Event, PrivateEventSettings, EventParticipant, AvailabilityResponse. Regra central: algoritmo determinístico de melhor data.

### Public Events
Eventos com data fixa, inscrição, controle de lotação. Entidades: Event, PublicEventSettings, PublicEventRegistration. Não usa algoritmo de disponibilidade.

### Host / Organizer
Overlay sobre os contextos acima. Não é contexto independente no MVP.

## Modelo de dados

### users
id (uuid PK), name, email (unique), avatar_url (null), created_at, updated_at

### events
id (uuid PK), owner_id (FK users), type (PRIVATE|PUBLIC), title, description (null), location_text (null), status (DRAFT|OPEN|CONFIRMED|CANCELLED), confirmed_date (null), created_at, updated_at

### private_event_settings
event_id (PK FK 1:1), date_window_start, date_window_end, key_person_user_id (null), key_person_weight (default 3.0)

### event_participants
id, event_id (FK), user_id (null = sem conta ainda), email (null), name_snapshot (null), role (OWNER|INVITEE|KEY_PERSON), invite_status (PENDING|ACCEPTED|DECLINED)

### availability_responses
id, event_id (FK), participant_id (FK event_participants), date, response (YES|MAYBE|NO)

### public_event_settings
event_id (PK FK 1:1), event_date, event_time (null), capacity

### public_event_registrations
id, event_id (FK), user_id (FK), status (REGISTERED|CANCELLED), created_at

## API — domínios

Base: `/api/v1`

- Auth: POST /auth/signup, /login, /logout; GET /auth/me
- Users: GET/PUT /users/me
- Private Events: CRUD /private-events/:id
- Participants: POST/DELETE /private-events/:id/participants/:pid
- Invites: POST /invites/:token/accept
- Availability: POST/GET /private-events/:id/availability
- Suggestion: GET /private-events/:id/suggestion; POST /private-events/:id/confirm
- Public Events: CRUD /public-events/:id; GET /public-events (list)
- Registrations: POST/DELETE /public-events/:id/registrations; GET /public-events/:id/registrations (owner only)

## Algoritmo de melhor data

Implementado em `packages/utils/src/date-suggestion.ts` (função pura, testável isoladamente).

Pesos: YES=1.0, MAYBE=0.5, NO=0
Key person: peso multiplicado (configurável, default 3x)
Tiebreaker: data mais cedo em caso de empate
Confidence: score_dia / max_possible_score
Explicação: template baseado em dados, sem LLM no MVP

## Estratégia de autenticação

Supabase Auth (email+senha no MVP). JWT no header Authorization. API valida via Supabase SDK. user_id extraído do token para autorizar operações. Convidados sem conta: token de convite UUID opaco.

## Convites no MVP

Link compartilhável gerado pelo sistema (/invite/:token). Convidado acessa link → cria conta ou marca disponibilidade sem conta. Ponto de evolução: envio real via Resend/Sendgrid.

## Frontend (apps/web)

Next.js 15 App Router, React 19, Tailwind CSS 4 + design tokens, shadcn/ui (base acessível, sobrescrita com design system Farmei), React Hook Form + Zod.

Rotas: /, /login, /signup, /dashboard, /events/new, /events/[id], /events/[id]/availability, /events/[id]/host, /invite/[token], /public

## Escalabilidade futura (preparado, não implementado)

- Mobile: Expo com packages/ui headless
- Geolocalização: colunas lat/lng adicionadas sem quebrar schema
- Notificações push: Bull/BullMQ quando necessário
- IA generativa: campo reasoning no retorno do suggestion endpoint
- Waitlist: tabela adicional independente do fluxo principal
