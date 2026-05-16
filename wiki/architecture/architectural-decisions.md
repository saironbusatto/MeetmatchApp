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
| ADR-003 | Supabase Auth | Clerk (billing desde cedo), NextAuth (acoplado ao Next.js) |
| ADR-004 | Drizzle ORM | Prisma (schema próprio, runtime mais pesado) |
| ADR-005 | Hono (API) | Express (legado, sem suporte nativo a TS/edge) |
| ADR-009 | shadcn/ui (base técnica) | Radix puro (menos conveniente), Material UI (visual incompatível) |

### Produto e escopo
| Decisão | Escolha | Razão |
|---------|---------|-------|
| ADR-001 | Web-first, mobile depois | Maior risco é domínio, não plataforma |
| ADR-006 | Convites por link (sem email automático no MVP) | Email transacional não deve bloquear progresso |
| ADR-007 | Algoritmo de data sem LLM | Lógica é matemática simples e testável; LLM é enriquecimento futuro |
| ADR-010 | Sem waitlist no MVP | Aumenta complexidade do fluxo de inscrição desnecessariamente |

### Rebrand
| Decisão | Regra |
|---------|-------|
| ADR-008 | Todo código novo usa "Farmei". CSS legado (.vmt-*) mantido como prefixo temporário. Migração controlada em tarefa separada. |

## Pontos de evolução documentados

Essas são intenções registradas — não features para implementar agora:

- **Convites:** adicionar Resend/Sendgrid sem quebrar fluxo de link (ADR-006)
- **Algoritmo:** campo `reasoning` já previsto no response do suggestion endpoint para LLM futura (ADR-007)
- **Mobile:** `packages/ui` deve ter componentes headless para Expo reutilizar (ADR-001)
- **Geolocalização:** colunas lat/lng podem ser adicionadas ao schema sem breaking change (ARCHITECTURE.md §10)
- **Waitlist:** tabela `public_event_waitlist` adicionável independentemente (ADR-010)

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
- [Business Rules](../product/business-rules.md)
- [MVP Backlog](../backlog/mvp-backlog.md)
