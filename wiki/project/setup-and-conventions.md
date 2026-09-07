# Setup & Conventions — Farmei

> Sources: CLAUDE.md, 2026-05-16; wiki/CHANGELOG.md, 2026-05-16; raw/wiki-ingest/2026-05-16_19-50-00.md
> Raw: [CLAUDE.md](../../raw/project/2026-05-16-claude-md.md)

## Overview

Instruções operacionais do projeto: o que já existe, o que não existe, como rodar localmente e as convenções que devem ser respeitadas em qualquer nova sessão de desenvolvimento.

## O que já existe no repositório

### Design system completo (PRONTO — referência visual)
- `colors_and_type.css` — fonte de verdade visual (todos os tokens)
- `README.md` — guia da marca: voz, cor, tipografia, componentes, regras
- `assets/` — logo.svg, logomark.svg, sparkle.svg
- `preview/` — 23 cards de preview do design system

### UI kits visuais (PROTÓTIPOS — não produção)
- `ui_kits/mobile/` — 7 telas originais + 7 novas (público + social + host), iOS frames, React inline
- `ui_kits/web/` — app web desktop: sidebar, dashboard, calendário
- `ui_kits/marketing/` — site de marketing: hero, features, pricing, footer

### Protótipo clicável
- `prototype.html` — 14 telas mockadas, navegáveis, URL com hash para posição

### Documentação operacional
- `docs/PRD.md`, `docs/ARCHITECTURE.md`, `docs/TASKS.md`, `docs/DECISIONS.md`
- `wiki/` — base de conhecimento viva (este repositório)

### Estrutura de monorepo (scaffoldada)
Criada em 2026-05-16. Diretórios: apps/web, packages/ui, packages/design-tokens, packages/types, packages/utils, services/api.

## O que NÃO existe (a construir)

- Backend real (API, banco, autenticação)
- Lógica de domínio implementada
- App mobile real (o ui_kit mobile é apenas visual)
- Integrações externas (Instagram, GPS, calendar, push notifications)

## Como rodar localmente (estado atual)

Tudo é HTML estático + React via CDN. Sem build, sem instalação.

```bash
python3 -m http.server 8000
# ou
npx serve .
```

| URL | Conteúdo |
|-----|---------|
| /prototype.html | Protótipo clicável end-to-end |
| /ui_kits/mobile/index.html | Telas mobile lado a lado |
| /ui_kits/marketing/index.html | Site de marketing |
| /ui_kits/web/index.html | App web desktop |

## Rebrand: Farmei → Farmei

**Estado atual:** rebrand em andamento.

- Nome visual do app: **Farmei**
- Código legado ainda usa "Farmei" (~15 ocorrências)
- CSS legado usa classe `.vmt` e prefixo `--vmt-*` em algumas variáveis

**Regra para novas sessões:** Todo código novo usa "Farmei". Não renomear em massa sem estratégia — criará conflitos.

**Localizar ocorrências legadas:**
```bash
grep -ri "farmei" . --include="*.{js,jsx,ts,tsx,css,md,html}"
```

**Arquivos com referências legadas conhecidas:**
- `README.md` raiz (título "Farmei Design System")
- `colors_and_type.css` (classe `.vmt`)
- `SKILL.md`
- Comentários nos ui_kits (`// Farmei mobile UI kit`)

## Prioridade de leitura para novas sessões

1. `CLAUDE.md` — instruções centrais
2. `docs/PRD.md` — produto
3. `docs/ARCHITECTURE.md` — arquitetura
4. `docs/DECISIONS.md` — decisões
5. `docs/TASKS.md` — backlog
6. `wiki/index.md` — índice da knowledge base
7. `README.md` — design system (se trabalho visual)
8. `colors_and_type.css` — tokens (se trabalho de UI)

## Regras de implementação não negociáveis

1. **Protótipos não são código de produção** — usar como referência de fluxo e design, não copiar JSX diretamente
2. **Spark Yellow exclusivo para IA** — qualquer uso em contexto não-IA viola o sistema
3. **shadcn/ui como base técnica** — estilos sempre sobrescritos com tokens Farmei
4. **TypeScript estrito** — sem any implícito, sem mocks no fluxo real
5. **Validação com Zod** — em todos os endpoints da API
6. **Ownership checks** — antes de qualquer mutação (user só edita o que é seu)
7. **Sem secrets no código** — variáveis de ambiente

## Histórico de sessões

| Data | Ação | Evidência |
|------|------|-----------|
| 2026-05-16 | Bootstrap de estrutura de monorepo | raw/wiki-ingest/2026-05-16_19-50-00.md |
| 2026-05-16 | Criação de PRD, ARCHITECTURE, TASKS, DECISIONS | docs/ |
| 2026-05-16 | Ingest completo do repositório na wiki | wiki/ |

## See Also

- [MVP Backlog](../backlog/mvp-backlog.md)
- [Architectural Decisions](../architecture/architectural-decisions.md)
- [System Design](../architecture/system-design.md)
