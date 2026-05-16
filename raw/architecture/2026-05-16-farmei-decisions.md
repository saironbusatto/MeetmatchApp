# Farmei Architectural Decisions (ADRs)

> Source: docs/DECISIONS.md (internal project document)
> Collected: 2026-05-16
> Published: 2026-05-16

## ADR-001 — Web-first, mobile depois
**Decisão:** Entregar web app + API real primeiro. App mobile (Expo) fica para pós-MVP.
**Por quê:** Maior risco é corretude do domínio, não presença multi-plataforma.
**Descartado:** Web + mobile simultâneos (dilui foco), só mobile (sem backend).

## ADR-002 — pnpm workspaces (monorepo)
**Decisão:** pnpm workspaces + Turbo como task runner opcional.
**Por quê:** Packages compartilhados (tipos, utils, tokens, UI) entre web, mobile e API.
**Descartado:** Repos separados (overhead), Nx (complexidade desnecessária).

## ADR-003 — Supabase Auth
**Decisão:** Supabase Auth com email/senha. JWT validado pela API via Supabase SDK.
**Por quê:** Auth funcional rápida sem gerenciar infra de tokens/hashing.
**Descartado:** Clerk (billing desde cedo), auth própria (custo/segurança), NextAuth (acoplado ao Next.js).

## ADR-004 — Drizzle ORM
**Decisão:** Drizzle ORM sobre PostgreSQL.
**Por quê:** Schema é código TS, queries type-safe, migrations são SQL explícito, próximo do SQL real.
**Descartado:** Prisma (schema próprio, runtime pesado), Kysely (sem opinião sobre migrations), SQL puro (sem type-safety).

## ADR-005 — Hono para a API
**Decisão:** Hono como framework de API.
**Por quê:** Leve, rápido, compatível com edge runtimes (Cloudflare Workers no futuro).
**Descartado:** Express (legado, sem suporte nativo a TS/edge), Fastify (mais pesado), tRPC (acopla demais ao Next.js).

## ADR-006 — Convites por link (sem email transacional imediato)
**Decisão:** MVP usa link compartilhável gerado pelo sistema. Organizador compartilha manualmente.
**Por quê:** Email transacional pode atrasar entrega; valor não depende de envio automático.
**Evolução:** Adicionar Resend em iteração posterior sem quebrar fluxo.

## ADR-007 — Algoritmo de data sem LLM
**Decisão:** Função pura determinística em packages/utils. Explicação por template baseado em dados.
**Por quê:** "IA" é simplificação de marketing. Lógica é matemática simples e testável.
**Evolução:** Campo reasoning pode ser preenchido por Claude em versão futura.

## ADR-008 — Rebrand Vamointao → Farmei
**Decisão:** Todo código novo usa "Farmei". CSS legado (.vmt-*) mantido como prefixo temporário. Migração controlada em tarefa separada.
**Referências legadas:** README.md raiz, colors_and_type.css (.vmt), SKILL.md, comentários nos ui_kits.

## ADR-009 — shadcn/ui como base técnica
**Decisão:** shadcn/ui para acessibilidade e composição. Estilos 100% sobrescritos com Tailwind + tokens Farmei.
**Por quê:** Componentes acessíveis sem impor visual; permite identidade visual própria.
**Regra:** Nenhum componente shadcn deve aparecer visualmente "padrão" na UI final.

## ADR-010 — Waitlist fora do MVP
**Decisão:** Ao lotar, inscrições bloqueadas com mensagem clara. Sem waitlist.
**Por quê:** Aumenta complexidade do fluxo de inscrição desnecessariamente.
**Evolução:** Tabela public_event_waitlist adicionável sem quebrar fluxo principal.

## Decisões pendentes

- P1: Convidados precisam criar conta para responder disponibilidade? (antes da Fase 4.2)
- P2: Eventos públicos terão geolocalização no MVP? (antes da Fase 5.1)
- P3: Português como único idioma inicial? (antes da Fase 4)
- P4: Papel separado de "host" com permissões distintas? (antes da Fase 2.2)
