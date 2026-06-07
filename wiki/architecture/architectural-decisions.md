# Architectural Decisions — Farmei

> Sources: Internal DECISIONS.md, 2026-05-16
> Raw: [Farmei Decisions](../../raw/architecture/2026-05-16-farmei-decisions.md)

## Overview

Registro compilado dos ADRs do Farmei. Cada decisão inclui o raciocínio e o que foi descartado, para que futuras sessões possam avaliar se as premissas ainda valem antes de reverter.

## Decisões aceitas

### Stack core
| Decisão | Escolha | Principal alternativa descartada |
|---------|---------|----------------------------------|
| ADR-002 | pnpm workspaces (monorepo) | Nx (complexidade desnecessária para este estágio) |
| ADR-003 | Auth/Identity no backend Oracle (JWT próprio) | Supabase Auth (lock-in e divergência com infra atual) |
| ADR-004 | Drizzle ORM | Prisma (schema próprio, runtime mais pesado) |
| ADR-005 | Hono (API) | Express (legado, sem suporte nativo a TS/edge) |
| ADR-009 | shadcn/ui (base técnica) | Radix puro (menos conveniente), Material UI (visual incompatível) |

### Produto e escopo
| Decisão | Escolha | Razão |
|---------|---------|-------|
| ADR-001 | Web-first, mobile depois (mobile **agora ativo**) | Maior risco era domínio, não plataforma — backend + web entregues; mobile entra em paralelo |
| ADR-006 | Convites por link (sem email automático no MVP) | Email transacional não deve bloquear progresso |
| ADR-007 | Algoritmo de data sem LLM | Lógica é matemática simples e testável; LLM é enriquecimento futuro |
| ADR-010 | Sem waitlist no MVP | Aumenta complexidade do fluxo de inscrição desnecessariamente |
| ADR-011 | Mobile com Expo Router + NativeWind | Stack única, OTA updates, reaproveita 100% dos packages e tokens. Descartados: bare RN (overhead), Flutter (sem compartilhamento de tipos), Tamagui (sem ganho sobre NativeWind). Detalhes em [Mobile Architecture](mobile-architecture.md). |

### Rebrand
| Decisão | Regra |
|---------|-------|
| ADR-008 | Todo código novo usa "Farmei". CSS legado (.vmt-*) mantido como prefixo temporário. Migração controlada em tarefa separada. |
| ADR-012 | ✅ **Concluído 2026-06-07** — Migração operacional Supabase → Oracle como fonte única de verdade. API usa JWT próprio, PostgreSQL no Oracle. |
| ADR-013 | SQLAlchemy + Alembic em trilho paralelo ao Drizzle | Permite governança de migração sem interromper o deploy atual. |
| ADR-014 | **Mobile: remoção do cliente Supabase** — `@supabase/supabase-js` removido do `apps/mobile`. Auth passa por `lib/auth.ts` (fetch direto na API Oracle). Razão: API já não aceita tokens Supabase desde ADR-012; manter o SDK criava dependência desnecessária e erros de env em produção. Fallback `localStorage` para `expo start --web`. |

## Pontos de evolução documentados

Essas são intenções registradas — não features para implementar agora:

- **Convites:** adicionar Resend/Sendgrid sem quebrar fluxo de link (ADR-006)
- **Algoritmo:** campo `reasoning` já previsto no response do suggestion endpoint para LLM futura (ADR-007)
- **Mobile:** `packages/ui` deve ter componentes headless para Expo reutilizar (ADR-001)
- **Geolocalização:** colunas lat/lng podem ser adicionadas ao schema sem breaking change (ARCHITECTURE.md §10)
- **Waitlist:** tabela `public_event_waitlist` adicionável independentemente (ADR-010)
- **Migração DB (Alembic Pro mindset):** mudanças de schema no backend Oracle seguem rotina de migração versionada, revisão obrigatória e rollout seguro (ADR-012).

## Decisões pendentes

| # | Questão | Prazo / fase |
|---|---------|-------------|
| P1 | Convidados precisam criar conta para responder? | Antes da Fase 4.2 |
| P2 | Eventos públicos terão geolocalização no MVP? | Antes da Fase 5.1 |
| P3 | Português como único idioma inicial? | Antes da Fase 4 |
| P4 | Papel separado de "host" com permissões distintas? | Antes da Fase 2.2 |

> Quando P1–P4 forem decididas, atualizar este artigo e propagar para [Data Model](data-model.md) e [Business Rules](../product/business-rules.md).

## See Also

- [System Design](system-design.md)
- [Data Model](data-model.md)
- [Mobile Architecture](mobile-architecture.md)
- [Business Rules](../product/business-rules.md)
- [MVP Backlog](../backlog/mvp-backlog.md)
