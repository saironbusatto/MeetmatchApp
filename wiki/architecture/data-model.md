# Data Model & API Contracts — Farmei

> Sources: Internal Architecture Doc, 2026-05-16
> Raw: [Farmei Architecture](../../raw/architecture/2026-05-16-farmei-architecture.md)

## Overview

O modelo de dados separa a base comum de eventos (tabela `events`) de configurações específicas por tipo via tabelas 1:1 (`private_event_settings`, `public_event_settings`). Isso permite shared queries simples sem misturar regras de domínio.

## Entidades e relações

### users
```
id            uuid PK
name          text
email         text UNIQUE
avatar_url    text NULL
created_at    timestamptz
updated_at    timestamptz
```

### events (base comum)
```
id             uuid PK
owner_id       uuid FK → users.id
type           enum (PRIVATE | PUBLIC)
title          text
description    text NULL
location_text  text NULL
status         enum (DRAFT | OPEN | CONFIRMED | CANCELLED)
confirmed_date date NULL       ← preenchido ao confirmar evento privado
created_at     timestamptz
updated_at     timestamptz
```

### private_event_settings (1:1 com events onde type=PRIVATE)
```
event_id             uuid PK FK → events.id
date_window_start    date
date_window_end      date
key_person_user_id   uuid NULL FK → users.id
key_person_weight    numeric DEFAULT 3.0
```

### event_participants
```
id             uuid PK
event_id       uuid FK → events.id
user_id        uuid NULL FK → users.id   ← NULL = convidado sem conta ainda
email          text NULL                  ← para convidados por email
name_snapshot  text NULL
role           enum (OWNER | INVITEE | KEY_PERSON)
invite_status  enum (PENDING | ACCEPTED | DECLINED)
```

### availability_responses
```
id              uuid PK
event_id        uuid FK → events.id
participant_id  uuid FK → event_participants.id
date            date
response        enum (YES | MAYBE | NO)
UNIQUE (participant_id, date)
```

### public_event_settings (1:1 com events onde type=PUBLIC)
```
event_id    uuid PK FK → events.id
event_date  date
event_time  time NULL
capacity    integer
```

### public_event_registrations
```
id          uuid PK
event_id    uuid FK → events.id
user_id     uuid FK → users.id
status      enum (REGISTERED | CANCELLED)
created_at  timestamptz
UNIQUE (event_id, user_id) WHERE status = 'REGISTERED'
```

## Diagrama de relações

```
users ──< events (owner_id)
events ──1 private_event_settings   (quando type=PRIVATE)
events ──1 public_event_settings    (quando type=PUBLIC)
events ──< event_participants
event_participants ──< availability_responses
events ──< public_event_registrations
users ──< public_event_registrations
users ──? private_event_settings (key_person_user_id)
users ──? event_participants (user_id, nullable)
```

## Contratos de API

Base URL: `/api/v1`

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
| POST | /private-events | Criar |
| GET | /private-events/:id | Detalhe |
| PUT | /private-events/:id | Editar |
| DELETE | /private-events/:id | Cancelar |
| POST | /private-events/:id/participants | Convidar |
| DELETE | /private-events/:id/participants/:pid | Remover convidado |
| POST | /invites/:token/accept | Aceitar convite via link |
| POST | /private-events/:id/availability | Registrar disponibilidade |
| GET | /private-events/:id/availability | Ver mapa de disponibilidade |
| GET | /private-events/:id/suggestion | Calcular melhor data |
| POST | /private-events/:id/confirm | Confirmar data final |

### Public Events
| Método | Rota | Descrição |
|--------|------|-----------|
| POST | /public-events | Criar |
| GET | /public-events | Listar (paginação + filtros) |
| GET | /public-events/:id | Detalhe |
| PUT | /public-events/:id | Editar |
| DELETE | /public-events/:id | Cancelar |
| POST | /public-events/:id/registrations | Inscrever-se |
| DELETE | /public-events/:id/registrations/me | Cancelar inscrição |
| GET | /public-events/:id/registrations | Listar inscritos (owner only) |

## Regras de autorização

- Mutações em eventos: verificar `events.owner_id = auth.user_id`
- Disponibilidade: verificar participação ativa no evento
- Lista de inscritos: `owner_id` only

## See Also

- [System Design](system-design.md)
- [Business Rules](../product/business-rules.md)
