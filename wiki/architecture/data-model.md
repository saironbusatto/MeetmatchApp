# Data Model & API Contracts — Farmei

> Sources: Internal Architecture Doc, 2026-05-16; Modelo V2 2026-09-07
> Raw: [Farmei Architecture](../../raw/architecture/2026-05-16-farmei-architecture.md)

## Overview

O modelo de dados separa a base comum de eventos (tabela `events`) de configurações específicas por tipo via tabelas 1:1 (`private_event_settings`, `public_event_settings`). Isso permite shared queries simples sem misturar regras de domínio.

Modelo V2 (2026-09-07): key person virou **gate** (não peso — `key_person_weight` removido), disponibilidade passou a ser **grade dia × turno**, quórum obrigatório, categorias fixas, waitlist e sistema de presença/reputação. Tags D correspondem ao [Business Rules](../product/business-rules.md).

## Entidades e relações

### users
```
id            uuid PK
name          text
email         text UNIQUE
socials       social_link[] NULL    ← IG/TikTok/Google (auth social, D10)
created_at    timestamptz
updated_at    timestamptz
```

### time_slots (catálogo de turnos — enum, D15.1)
```
MANHA | TARDE | NOITE | ALTAS_HORAS
```
(manter como tipo enum para validar grids e candidatos.)

### events (base comum)
```
id             uuid PK
owner_id       uuid FK → users.id
type           enum (PRIVATE | PUBLIC)
title          text
description    text NULL
location_text  text NULL
geolocation    point NULL          ← P2 (decisão pendente)
status         enum (DRAFT | OPEN | CONFIRMED | NO_DATE | CANCELLED)
confirmed_date date NULL           ← preenchido ao confirmar (D17)
confirmed_slot time_slot NULL      ← turno confirmado (grade V2)
created_at     timestamptz
updated_at     timestamptz
```

> Status `NO_DATE` (D17/D20): quórum não atingido, key sem resposta ou janela fechada sem candidato. A confirmação abre a **janela de 1 dia** (D17) antes de gravar CONFIRMED final.

### private_event_settings (1:1 com events onde type=PRIVATE)
```
event_id             uuid PK FK → events.id
date_window_start    date
date_window_end      date
key_person_user_id   uuid NULL FK → users.id   ← GATE, sem peso (D1)
quorum_min           integer NOT NULL DEFAULT 1 ← quórum obrigatório (D15)
```

> `ROLE_ALEATORIO` (D19) é um valor do `role` em `event_participants`: chegante do dia, adicionado no dia do evento; entra na lista do CSV do criador, invisível no perfil, sem Aura.

### event_participants
```
id             uuid PK
event_id       uuid FK → events.id
user_id        uuid NULL FK → users.id   ← NULL = convidado sem conta ainda (P1)
email          text NULL                  ← para convidados por email
name_snapshot  text NULL
role           enum (OWNER | INVITEE | KEY_PERSON | ROLE_ALEATORIO)
invite_status  enum (PENDING | ACCEPTED | DECLINED)
indicated_by   uuid[] NULL                ← quem indicou esta pessoa (D2/D12)
invite_status_activated_at timestamptz NULL ← indicação só pesa após ACCEPTED (D5)
```

### availability_responses (grade dia × turno — V2)
```
id              uuid PK
event_id        uuid FK → events.id
participant_id  uuid FK → event_participants.id
date            date
slot            time_slot
response        enum (YES | MAYBE | NO)
UNIQUE (participant_id, date, slot)
```
> Multi-seleção: uma pessoa pode ter várias linhas por dia (ex.: MANHA + NOITE). MAYBE também é por par.

### public_event_settings (1:1 com events onde type=PUBLIC)
```
event_id         uuid PK FK → events.id
event_date       date
event_time       time NULL
capacity         integer
category         enum (ESPORTE | MUSICA | GASTRONOMIA | CULTURAL | ROLES | NEGOCIOS | RELIGIOSO | NATUREZA)  ← Enum fixo, 8 valores (D13)
admission_mode   enum (FIRST_COME | CONFIAVEL)  ← escolhido pelo criador; sistema recomenda (D27)
```

### public_event_registrations
```
id          uuid PK
event_id    uuid FK → events.id
user_id     uuid FK → users.id
status      enum (REGISTERED | CANCELLED | WAITLIST)   ← waitlist no MVP (D28)
position    integer NULL    ← posição FIFO em FIRST_COME; reordenada em CONFIAVEL (D30)
created_at  timestamptz
UNIQUE (event_id, user_id) WHERE status IN ('REGISTERED', 'WAITLIST')
```

### presence_events (sinais de presença — D24/D25)
```
id             uuid PK
user_id        uuid FK → users.id
event_id       uuid FK → events.id
source         enum (SELF | HOST | GEOFENCE | ATTESTED)
weight         numeric        ← SELF 1.0, HOST 2.0, GEOFENCE 1.5, ATTESTED 0.5
atts_attested_by uuid[] NULL  ← máx 3 (máximo 3 pessoas atestando)
created_at     timestamptz
UNIQUE (user_id, event_id, source)
```

> Presença conta **só com ≥2 fontes** por pessoa/rolê; teto 3.0 (D25). Self sozinho = 0.

### reputation (derivado em janela de 3 meses rolante — D26)
```
user_id              uuid PK FK → users.id
window_start         date       ← 3 meses atrás (rolante)
confidence_weight    numeric    ← 1.0 = neutro; nunca zero; escondido no quórum (D23)
present_events       integer
miss_events          integer
updated_at           timestamptz
```
> Peso alimenta o quórum privado (interno, barra mostra só nº de gente), o modo CONFIAVEL público (D27), a fila ponderada (D30) e o desempate por confiabilidade (D31). Nunca zera; key gate e voto NO intactos.

### public_event_waitlist
```
id                 uuid PK
registration_id    uuid FK → public_event_registrations.id (status WAITLIST)
position           integer NULL
reliable_weight_at numeric NULL  ← réplica do peso no momento da fila (CONFIAVEL)
entered_at         timestamptz
```
> Ordem da fila: FIFO em `FIRST_COME`; mais confiável primeiro em `CONFIAVEL` (D30). Todos avisados quando vaga abre.

## Diagrama de relações

```
users ──< events (owner_id)
events ──1 private_event_settings   (quando type=PRIVATE)
events ──1 public_event_settings    (quando type=PUBLIC)
time_slots ──< availability_responses.slot
events ──< event_participants
event_participants ──< availability_responses
events ──< public_event_registrations
public_event_registrations ──?1 public_event_waitlist
users ──< public_event_registrations
users ──? private_event_settings (key_person_user_id)
users ──? event_participants (user_id, nullable)
users ──< presence_events
users ──1 reputation
events ──< presence_events
```

## Contratos de API

Base URL: `/api/v1`

> **Estado de implementação (2026-09-07):** estes contratos descrevem o **alvo V2** reconciliado com o business-rules. O código atual em `services/api/src/routes/` ainda diverge: `category` e `capacity` já existem mas `category` é string livre (virará enum D13), não há `admission_mode`, `waitlist` (hoje 409 "Event is full"), grade dia×turno, quórum nem presença/reputação. As rotas novas (confirm com janela, dia-do-bolo, check-in, waitlist, reputation) são target a implementar.

### Auth
| Método | Rota | Descrição |
|--------|------|-----------|
| POST | /auth/signup | Cadastro email+senha |
| POST | /auth/login | Login |
| POST | /auth/logout | Logout |
| GET | /auth/me | Usuário autenticado |

### Users
| Método | Rota | Descrição |
|--------|------|-----------|
| GET | /users/me | Perfil próprio |
| PUT | /users/me | Atualizar perfil |

### Private Events
| Método | Rota | Descrição |
|--------|------|-----------|
| POST | /private-events | Criar (com quorum_min, janela, key_person_user_id opcional) |
| GET | /private-events/:id | Detalhe |
| PUT | /private-events/:id | Editar |
| DELETE | /private-events/:id | Cancelar |
| POST | /private-events/:id/participants | Convidar |
| DELETE | /private-events/:id/participants/:pid | Remover convidado |
| POST | /invites/:token/accept | Aceitar convite via link |
| POST | /private-events/:id/availability | Registrar disponibilidade (grid dia×turno: body `{ date, slot, response }`, multi-linha) |
| GET | /private-events/:id/availability | Ver mapa de disponibilidade (grade) |
| GET | /private-events/:id/suggestion | Melhor par (dia, turno) + confidence + reason; bloqueia se key sem resposta |
| POST | /private-events/:id/confirm | Confirmar par final (abre janela 1 dia, D17) |
| POST | /private-events/:id/dia-do-bolo | Dar bolo ou entrar dentro da janela (D17); re-match se quórum cair |
| POST | /private-events/:id/check-in | Registrar presença multi-fonte (D24): self, host, geofence, atestado |

### Public Events
| Método | Rota | Descrição |
|--------|------|-----------|
| POST | /public-events | Criar (capacity, category incl. enum, admission_mode com recomendações) |
| GET | /public-events | Listar (paginação + filtros por categoria) |
| GET | /public-events/:id | Detalhe |
| PUT | /public-events/:id | Editar |
| DELETE | /public-events/:id | Cancelar |
| POST | /public-events/:id/registrations | Inscrever-se (ou entrar na waitlist se lotado, D28) |
| DELETE | /public-events/:id/registrations/me | Cancelar inscrição |
| GET | /public-events/:id/registrations | Listar inscritos (owner only) + posição da fila |
| GET | /public-events/:id/waitlist | Ver fila (owner only) |
| POST | /public-events/:id/check-in | Registrar presença (host) |

### Reputation / Presença
| Método | Rota | Descrição |
|--------|------|-----------|
| GET | /users/me/reputation | Pesos/histórico janela 3 meses (D26) — sem expor quórum interno (D23) |
| POST | /users/me/presence | Registrar auto-check-in vs atestado (D24) |

## Regras de autorização

- Mutações em eventos: verificar `events.owner_id = auth.user_id`
- Disponibilidade: verificar participação ativa no evento
- Lista de inscritos: `owner_id` only

## See Also

- [System Design](system-design.md)
- [Business Rules](../product/business-rules.md)
