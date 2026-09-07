# ARCHITECTURE — Farmei

## 1. Visão geral

O Farmei é um monorepo com dois aplicativos principais — web e API — e packages compartilhados. A arquitetura privilegia separação clara de domínio, contratos tipados entre camadas e evolução incremental sem complexidade prematura.

```
farmei/
├── apps/
│   └── web/                  # Next.js 15 + React 19
├── services/
│   └── api/                  # Hono + TypeScript (API REST)
├── packages/
│   ├── ui/                   # Componentes compartilhados
│   ├── design-tokens/        # Tokens do design system (CSS → Tailwind)
│   ├── types/                # Contratos e tipos compartilhados
│   ├── utils/                # Helpers reutilizáveis
│   └── config/               # Configurações de lint, TS, Tailwind
├── docs/
│   ├── PRD.md
│   ├── ARCHITECTURE.md
│   ├── TASKS.md
│   └── DECISIONS.md
└── package.json              # pnpm workspaces
```

---

## 2. Bounded contexts / módulos de domínio

O domínio central é composto por dois contextos distintos que compartilham uma base comum de eventos:

### 2.1 Contexto: Identity
Responsável por autenticação, sessão e perfil do usuário.

- Entidades: `User`
- Serviços externos: Supabase Auth
- Limites: nenhuma regra de negócio de evento deve vazar para este contexto

### 2.2 Contexto: Private Events
Responsável por toda a lógica de agendamento colaborativo com sugestão de data.

- Entidades: `Event`, `PrivateEventSettings`, `EventParticipant`, `AvailabilityResponse`
- Regra central: algoritmo determinístico de melhor data (ver seção 5)
- Limites: não compartilha lógica com eventos públicos

### 2.3 Contexto: Public Events
Responsável por eventos com data fixa, inscrição e controle de lotação.

- Entidades: `Event`, `PublicEventSettings`, `PublicEventRegistration`
- Regra central: controle de capacidade máxima
- Limites: não usa algoritmo de disponibilidade

### 2.4 Contexto: Host / Organizer
Visão do host sobre seus eventos. Pode ser implementado como overlay sobre os contextos acima — não um contexto independente no MVP.

---

## 3. Modelo de dados

### `users`
| Campo       | Tipo        | Obs                        |
|-------------|-------------|----------------------------|
| id          | uuid PK     |                            |
| name        | text        |                            |
| email       | text unique |                            |
| avatar_url  | text null   |                            |
| created_at  | timestamptz |                            |
| updated_at  | timestamptz |                            |

### `events`
| Campo          | Tipo        | Obs                                         |
|----------------|-------------|---------------------------------------------|
| id             | uuid PK     |                                             |
| owner_id       | uuid FK     | → users.id                                  |
| type           | enum        | `PRIVATE` \| `PUBLIC`                       |
| title          | text        |                                             |
| description    | text null   |                                             |
| location_text  | text null   |                                             |
| status         | enum        | `DRAFT` \| `OPEN` \| `CONFIRMED` \| `CANCELLED` |
| confirmed_date | date null   | Preenchido ao confirmar evento privado       |
| created_at     | timestamptz |                                             |
| updated_at     | timestamptz |                                             |

### `private_event_settings`
| Campo               | Tipo        | Obs                                |
|---------------------|-------------|------------------------------------|
| event_id            | uuid PK FK  | → events.id, 1:1                   |
| date_window_start   | date        |                                    |
| date_window_end     | date        |                                    |
| key_person_user_id  | uuid null   | → users.id                         |
| key_person_weight   | numeric     | default 3.0                        |

### `event_participants`
| Campo           | Tipo        | Obs                                          |
|-----------------|-------------|----------------------------------------------|
| id              | uuid PK     |                                              |
| event_id        | uuid FK     | → events.id                                  |
| user_id         | uuid null   | null = convidado ainda sem conta              |
| email           | text null   | Para convites por email                      |
| name_snapshot   | text null   |                                              |
| role            | enum        | `OWNER` \| `INVITEE` \| `KEY_PERSON`         |
| invite_status   | enum        | `PENDING` \| `ACCEPTED` \| `DECLINED`        |

### `availability_responses`
| Campo          | Tipo        | Obs                          |
|----------------|-------------|------------------------------|
| id             | uuid PK     |                              |
| event_id       | uuid FK     | → events.id                  |
| participant_id | uuid FK     | → event_participants.id      |
| date           | date        |                              |
| response       | enum        | `YES` \| `MAYBE` \| `NO`    |

### `public_event_settings`
| Campo      | Tipo       | Obs                    |
|------------|------------|------------------------|
| event_id   | uuid PK FK | → events.id, 1:1       |
| event_date | date       | Data fixa do evento    |
| event_time | time null  |                        |
| capacity   | integer    |                        |

### `public_event_registrations`
| Campo      | Tipo        | Obs                                    |
|------------|-------------|----------------------------------------|
| id         | uuid PK     |                                        |
| event_id   | uuid FK     | → events.id                            |
| user_id    | uuid FK     | → users.id                             |
| status     | enum        | `REGISTERED` \| `CANCELLED`            |
| created_at | timestamptz |                                        |

---

## 4. Estrutura da API

Base URL: `/api/v1`

### Auth (delegado ao Supabase Auth)
- `POST /auth/signup`
- `POST /auth/login`
- `POST /auth/logout`
- `GET  /auth/me`

### Users
- `GET  /users/me` — perfil próprio
- `PUT  /users/me` — atualizar perfil

### Eventos privados
- `POST   /private-events` — criar
- `GET    /private-events/:id` — detalhe
- `PUT    /private-events/:id` — editar
- `DELETE /private-events/:id` — cancelar

### Participantes e convites
- `POST /private-events/:id/participants` — convidar
- `DELETE /private-events/:id/participants/:pid` — remover convidado
- `POST /invites/:token/accept` — aceitar convite via link

### Disponibilidade
- `POST /private-events/:id/availability` — registrar disponibilidade do participante
- `GET  /private-events/:id/availability` — ver mapa de disponibilidade

### Sugestão de data
- `GET  /private-events/:id/suggestion` — calcular e retornar melhor data
- `POST /private-events/:id/confirm` — confirmar data final

### Eventos públicos
- `POST /public-events` — criar
- `GET  /public-events` — listar (com paginação e filtros)
- `GET  /public-events/:id` — detalhe
- `PUT  /public-events/:id` — editar
- `DELETE /public-events/:id` — cancelar

### Inscrições
- `POST   /public-events/:id/registrations` — inscrever-se
- `DELETE /public-events/:id/registrations/me` — cancelar inscrição
- `GET    /public-events/:id/registrations` — listar inscritos (owner only)

---

## 5. Algoritmo de melhor data

Implementado em `packages/utils/src/date-suggestion.ts` para ser testável de forma isolada.

```ts
type Response = 'YES' | 'MAYBE' | 'NO'

const WEIGHTS = { YES: 1.0, MAYBE: 0.5, NO: 0 }

function scoreDay(
  responses: { participantId: string; response: Response }[],
  keyPersonId: string | null,
  keyPersonWeight: number = 3.0
): number {
  return responses.reduce((acc, r) => {
    const base = WEIGHTS[r.response]
    const multiplier = r.participantId === keyPersonId ? keyPersonWeight : 1
    return acc + base * multiplier
  }, 0)
}

function maxPossibleScore(
  participantCount: number,
  keyPersonId: string | null,
  keyPersonWeight: number = 3.0
): number {
  const base = participantCount - (keyPersonId ? 1 : 0)
  return base * WEIGHTS.YES + (keyPersonId ? keyPersonWeight * WEIGHTS.YES : 0)
}

function suggestDate(input: SuggestionInput): SuggestionResult {
  // Para cada dia na janela, calcula score
  // Ordena por score desc, depois por data asc (tiebreaker)
  // Retorna melhor dia + confidence + explicação textual por template
}
```

A explicação textual usa templates simples baseados em dados — sem dependência de LLM no MVP.

Exemplo: `"Tue, Jun 4 works for 5 of 6 — the key person is free."`

---

## 6. Estratégia de autenticação

- Provider: **Supabase Auth** (email + senha no MVP; social login para depois)
- O token JWT do Supabase é enviado no header `Authorization: Bearer <token>`
- A API valida o JWT via Supabase SDK
- O `user_id` extraído do token é usado para autorizar operações
- Convidados sem conta recebem um token de convite via link mágico (UUID opaco)

---

## 7. Convites no MVP

Para não bloquear progresso com email transacional:

1. Ao convidar, o sistema gera um token único por participante
2. O organizador recebe um link compartilhável: `/invite/:token`
3. Ao acessar o link, o convidado pode:
   - Criar conta → fica vinculado ao evento
   - Marcar disponibilidade mesmo sem conta (fluxo simplificado)
4. Ponto de evolução: envio real via Resend/Sendgrid (documentado em DECISIONS.md)

---

## 8. Frontend (apps/web)

### Stack
- Next.js 15 (App Router)
- React 19 (Server Components + Client Components)
- Tailwind CSS 4 configurado com tokens do design system
- shadcn/ui como base de componentes acessíveis, sobrescritos com o design system Farmei
- React Hook Form + Zod para formulários

### Roteamento
```
/                         → landing ou dashboard (auth-gated)
/login                    → página de login
/signup                   → cadastro
/dashboard                → visão geral dos eventos do usuário
/events/new               → criar evento (private ou public)
/events/[id]              → detalhe do evento (privado ou público)
/events/[id]/availability → preencher disponibilidade (convidado)
/events/[id]/host         → painel do host
/invite/[token]           → aceitar convite / marcar disponibilidade
/public                   → feed de eventos públicos
```

### Design tokens
`packages/design-tokens` exporta:
- `tailwind.config.ts` com as cores, fontes, spacing e shadow do design system
- `global.css` com as CSS variables (source: `colors_and_type.css`)

---

## 9. Fluxos críticos de ponta a ponta

### Fluxo privado
```
Login → Dashboard → Criar evento privado → Definir janela + key person
→ Adicionar convidados → Compartilhar link → Convidados marcam disponibilidade
→ Organizador solicita sugestão → Sistema calcula → Organizador confirma data
→ Todos os participantes são notificados (email futuro / UI imediato)
```

### Fluxo público
```
Login (host) → Criar evento público → Publicar
Login (user) → /public → Visualizar evento → Inscrever-se
Host → /events/[id]/host → Ver lista de inscritos
```

---

## 10. Escalabilidade futura (preparado, não implementado)

- **App mobile**: Expo com Expo Router. O `packages/ui` já considera componentes headless reutilizáveis.
- **Geolocalização**: coluna `location_lat/lng` pode ser adicionada à `events` sem quebrar o schema.
- **Notificações push**: fila de jobs com Bull/BullMQ quando o volume exigir.
- **IA generativa**: o algoritmo de sugestão pode ser enriquecido com explicação via LLM — o contrato já prevê um campo `reasoning` no retorno.
- **Waitlist**: tabela `public_event_waitlist` pode ser adicionada independentemente do fluxo principal.

---

## 11. Observações de segurança

- Validação de input com Zod em todos os endpoints
- Verificação de ownership antes de qualquer mutação (usuário só edita o que é seu)
- Tokens de convite são UUIDs opacos — sem dados codificados
- Senhas gerenciadas pelo Supabase Auth — nunca transitam pela API própria
- Sem secrets no código — tudo via variáveis de ambiente
