# System Design — Farmei

> Sources: Internal Architecture Doc, 2026-05-16
> Raw: [Farmei Architecture](../../raw/architecture/2026-05-16-farmei-architecture.md)

## Overview

Farmei é um monorepo pnpm com três camadas: apps (web), services (api) e packages (compartilhados). A separação entre eventos privados e públicos é o bounded context mais crítico do sistema — as duas lógicas não devem vazar uma para a outra.

## Estrutura do monorepo

```
farmei/
├── apps/web/           Next.js 15 + React 19 + TypeScript
├── services/api/       Hono + TypeScript (REST /api/v1)
└── packages/
    ├── ui/             Componentes headless compartilhados
    ├── design-tokens/  CSS tokens → Tailwind config
    ├── types/          Contratos TypeScript (DTOs, enums)
    ├── utils/          Helpers, incluindo date-suggestion
    └── config/         tsconfig base, eslint, prettier
```

## Bounded contexts

| Contexto | Responsabilidade | Entidades principais |
|----------|-----------------|----------------------|
| Identity | Auth, sessão, perfil | User |
| Private Events | Agendamento colaborativo + sugestão de data | Event, PrivateEventSettings, EventParticipant, AvailabilityResponse |
| Public Events | Evento data fixa, inscrição, controle de lotação | Event, PublicEventSettings, PublicEventRegistration |

O contexto Host/Organizer é um overlay sobre Private e Public — não tem entidades próprias no MVP.

## Stack de tecnologias

| Camada | Tecnologia | Justificativa |
|--------|-----------|---------------|
| Web | Next.js 15 App Router | RSC + streaming, roteamento file-based |
| UI | React 19 + Tailwind CSS 4 | shadcn/ui como base acessível, visual sobrescrito |
| Forms | React Hook Form + Zod | Validação tipada, performance |
| API | Hono | Leve, edge-compatible, TypeScript first |
| ORM | Drizzle | SQL explícito, type-safe, migrations controladas |
| DB | Oracle (fonte primária) | Banco oficial do ambiente de produção |
| Auth | JWT emitido pelo backend Oracle | Fluxo único de identidade sem dependência externa |
| Datas | date-fns | Tree-shakeable, sem side effects |
| Testes | Vitest (unit) + Playwright (e2e) | |

## Estratégia de autenticação

O backend Oracle gerencia identidades e emite JWT. O token é enviado no header `Authorization: Bearer <token>`. A API valida assinatura/expiração e extrai `user_id` para ownership checks.

Convidados sem conta recebem um **token opaco (UUID)** por link. Esse token não codifica dados — é mapeado em `event_participants` para buscar o evento e o participante.

## Estratégia de convites (MVP)

1. Organizador adiciona email de convidado
2. Sistema gera UUID único em `event_participants`
3. Sistema retorna link `/invite/:token` ao organizador
4. Organizador compartilha manualmente
5. Convidado acessa link → responde disponibilidade (com ou sem conta, pendente decisão P1)

Ponto de evolução documentado: integrar Resend para envio automático de email.

## Roteamento do web app

```
/                     → landing / dashboard (auth-gated)
/login, /signup       → autenticação
/dashboard            → visão geral dos eventos
/events/new           → criar evento (private ou public)
/events/[id]          → detalhe do evento
/events/[id]/availability → preencher disponibilidade
/events/[id]/host     → painel do host
/invite/[token]       → aceitar convite / marcar disponibilidade
/public               → feed de eventos públicos
```

## Design system no código

`packages/design-tokens` exporta:
- `global.css` — CSS variables derivadas de `colors_and_type.css` (fonte de verdade visual)
- `tailwind.config.ts` — cores, fontes, spacing, shadows do design system mapeados para Tailwind

Regras invioláveis:
- Spark Yellow (`--spark-300 / #FFD93D`) **somente** em momentos de IA (card de sugestão, shimmer de loading)
- Vermillion (`--vermillion-500 / #FF3B2E`) em CTAs primários, máx. 5–10% dos pixels
- Nenhum componente shadcn deve aparecer com visual padrão — tudo sobrescrito

## Decisões pendentes com impacto em sistema

| # | Decisão | Impacto |
|---|---------|---------|
| P3 | Idioma único (PT-BR)? | i18n architecture |
| P4 | Papel host separado? | Middleware auth + permissões |

## See Also

- [Data Model](data-model.md)
- [Architectural Decisions](architectural-decisions.md)
- [Business Rules](../product/business-rules.md)
