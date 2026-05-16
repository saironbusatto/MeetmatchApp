# DECISIONS — Farmei

> Registro de decisões arquiteturais e de produto. Cada entrada tem contexto, decisão tomada e alternativas descartadas.

---

## ADR-001 — Web-first, mobile depois

**Data:** 2026-05-16  
**Status:** Aceito

**Contexto:** O maior risco do produto é a corretude do domínio (auth, convites, algoritmo, controle de lotação), não a presença em múltiplas plataformas.

**Decisão:** Entregar primeiro um web app funcional com API real. App mobile (Expo) fica para depois do MVP validado.

**Alternativas descartadas:**
- Web + mobile simultaneamente: dilui foco, dobra superfície de bug, atrasa o core.
- Só mobile: protótipo já existe em JSX mobile-style, mas não existe backend real.

---

## ADR-002 — Monorepo com pnpm workspaces

**Data:** 2026-05-16  
**Status:** Aceito

**Contexto:** Há packages compartilhados (tipos, utils, design tokens, UI) que serão consumidos por web e futuramente por mobile e API.

**Decisão:** pnpm workspaces como gerenciador de monorepo. Turbo como task runner se necessário.

**Alternativas descartadas:**
- Repos separados: overhead de publicação de packages para um projeto ainda sem versão estável.
- Nx: mais complexidade do que o projeto exige agora.

---

## ADR-003 — Supabase Auth para autenticação

**Data:** 2026-05-16  
**Status:** Aceito

**Contexto:** O MVP precisa de autenticação funcional rapidamente sem gerenciar infra de tokens, hashing e sessões.

**Decisão:** Supabase Auth com email/senha. JWT validado pela própria API Hono via Supabase SDK.

**Alternativas descartadas:**
- Clerk: bom DX, mas adiciona dependência externa de billing desde cedo.
- Auth própria: custo de desenvolvimento e segurança desproporcionais para MVP.
- NextAuth: acoplado ao Next.js; a API Hono precisaria de outro mecanismo.

---

## ADR-004 — Drizzle ORM sobre Prisma

**Data:** 2026-05-16  
**Status:** Aceito

**Contexto:** Precisamos de um ORM type-safe que funcione bem com PostgreSQL e seja fácil de migrar.

**Decisão:** Drizzle ORM. Schema é código TypeScript, queries são type-safe, migrations são SQL explícito.

**Alternativas descartadas:**
- Prisma: schema próprio, geração de código, runtime mais pesado. Drizzle é mais próximo do SQL real.
- Kysely: bom, mas sem opinião sobre migrations.
- SQL puro: mais controle, mas sem type-safety na camada de acesso.

---

## ADR-005 — Hono para a API

**Data:** 2026-05-16  
**Status:** Aceito

**Contexto:** API leve, rápida e compatível com edge runtimes. O projeto pode precisar escalar para Cloudflare Workers no futuro.

**Decisão:** Hono como framework de API.

**Alternativas descartadas:**
- Express: sem suporte nativo a TypeScript e edge, ecosystem mais legado.
- Fastify: bom, mas mais pesado para o que precisamos.
- tRPC: ótimo para monorepo full-stack, mas requer Next.js diretamente. Deixa acoplamento maior.

---

## ADR-006 — Convites por link no MVP (sem email transacional imediato)

**Data:** 2026-05-16  
**Status:** Aceito

**Contexto:** Configurar email transacional (Resend, Sendgrid) pode atrasar a entrega do fluxo de convites. O valor central do MVP não depende do envio automático de email.

**Decisão:** No MVP, convites funcionam por link compartilhável gerado pelo sistema. O organizador compartilha o link manualmente (WhatsApp, etc.).

**Ponto de evolução:** Adicionar Resend para envio automático de email em uma iteração posterior sem quebrar o fluxo.

---

## ADR-007 — Algoritmo de melhor data sem LLM

**Data:** 2026-05-16  
**Status:** Aceito

**Contexto:** O nome "IA" no produto é uma simplificação de marketing. A lógica é puramente determinística e baseada em pesos.

**Decisão:** Implementar como função pura em `packages/utils`. Sem dependência de serviço externo. Explicação textual via template baseado em dados.

**Ponto de evolução:** O campo `reasoning` no retorno pode ser preenchido por um LLM (Claude) em versão futura para explicações mais naturais.

---

## ADR-008 — Nome do produto e rebrand

**Data:** 2026-05-16  
**Status:** Em andamento

**Contexto:** O design system e documentação legada usam "Vamointao". O produto está sendo rebrandado para "Farmei".

**Decisão:**
- Todo código novo usa "Farmei" (nomes de package, variáveis de ambiente, textos de UI)
- Documentação nova usa "Farmei"
- CSS legado (`--vmt-*`) pode ser mantido como prefixo de token por enquanto sem impacto visual
- Uma tarefa explícita de migração de naming será criada para não bloquear o MVP

**Referências legadas a monitorar:**
- `README.md` raiz (menciona Vamointao)
- `colors_and_type.css` (classe `.vmt`)
- `SKILL.md`
- Comentários nos ui_kits

---

## ADR-009 — shadcn/ui como base técnica de componentes

**Data:** 2026-05-16  
**Status:** Aceito

**Contexto:** shadcn/ui fornece componentes acessíveis sem impor visual. Permite sobrescrever completamente com o design system Farmei.

**Decisão:** Usar shadcn/ui como base técnica (acessibilidade, composição). Sobrescrever estilos com Tailwind + tokens Farmei. Nenhum componente shadcn deve aparecer visualmente "padrão" na UI final.

---

## ADR-010 — Waitlist fora do MVP

**Data:** 2026-05-16  
**Status:** Aceito

**Contexto:** Eventos públicos podem lotar. Waitlist é útil mas aumenta a complexidade do fluxo de inscrição.

**Decisão:** No MVP, ao atingir capacidade máxima, novas inscrições são bloqueadas com mensagem clara. Nenhuma waitlist implementada.

**Ponto de evolução:** Tabela `public_event_waitlist` pode ser adicionada sem quebrar o fluxo principal.

---

## Decisões pendentes

| # | Questão | Prazo |
|---|---------|-------|
| P1 | Convidados precisam criar conta para responder disponibilidade? | Antes da Fase 4.2 |
| P2 | Eventos públicos terão geolocalização no MVP? | Antes da Fase 5.1 |
| P3 | O português será o único idioma inicial? | Antes da Fase 4 |
| P4 | Haverá papel separado de "host" com permissões distintas? | Antes da Fase 2.2 |
