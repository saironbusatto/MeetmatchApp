# Sprints Plan — Postgres + API Própria (Sem Supabase)

Data: 2026-05-20  
Objetivo: migrar de forma suave para backend próprio com PostgreSQL, auth/JWT local e governança de migrações com SQLAlchemy + Alembic.

## Diretrizes

- Estratégia de rollout incremental, sem big bang.
- Cada sprint precisa de critério de aceite e plano de rollback.
- Cada grupo de tasks indica skill obrigatória a consultar antes da execução.
- Fechamento obrigatório de sprint com skills `debugger` e `alembic-pro`.

## Sprint 0 — Baseline, Segurança e Alinhamento (2-3 dias)

### Deliverables

- Inventário de ambiente (`dev/stage/prod`) com variáveis e segredos.
- Contrato de auth alvo (`/api/v1/auth/*`) documentado.
- Checklist de rollback por deploy.
- Runbook de observabilidade mínima (health, logs, erros).

### Tasks

1. Mapear configuração atual de runtime e rede.
Skill: `deployment-validation-config-validate`

2. Auditar endpoints críticos (`signup/login/me`) e identificar gaps de integração.
Skill: `api-patterns`

3. Definir contrato de resposta/erro unificado (status code, payload e request id).
Skill: `api-patterns`

4. Consolidar riscos e dependências de migração em documento operacional.
Skill: `business-analyst`

5. Aprovar critérios de aceite/rollback por sprint.
Skill: `concise-planning`

### Fechamento técnico do sprint

- Rodar revisão de falhas e regressões de fluxo.
Skill: `debugger`

- Rodar pre-check de estratégia de migrations (heads, versionamento e SQL offline).
Skill: `alembic-pro`

---

## Sprint 1 — API Farmei Publicada + Postgres Operacional (1 semana)

### Deliverables

- Serviço `api` ativo em produção (porta publicada).
- `DATABASE_URL` configurada em segredo.
- Healthcheck de API respondendo em produção.
- Primeiro smoke test de API em produção com evidência.

### Tasks

1. Publicar serviço `services/api` via Compose com healthcheck.
Skill: `backend-architect`

2. Configurar segredos de ambiente e validação de startup.
Skill: `deployment-validation-config-validate`

3. Conectar `DATABASE_URL` e validar conectividade real.
Skill: `database-design`

4. Executar migrações iniciais controladas e registrar versão.
Skill: `alembic-pro`

5. Expor API por IP/porta com regras de ingress revisadas.
Skill: `deployment-procedures`

6. Executar smoke tests em `/api/v1/health` e rotas core.
Skill: `api-testing-observability-api-mock`

### Fechamento técnico do sprint

- Validar erros de runtime, timeout e regressões de deployment.
Skill: `debugger`

- Validar estado de migrations (`heads/current`) e estratégia de rollback SQL.
Skill: `alembic-pro`

---

## Sprint 2 — Auth Própria com JWT + Password Hash (1 semana)

### Deliverables

- `signup/login/logout/me` sem dependência Supabase.
- Middleware JWT próprio em produção.
- Senhas armazenadas com hash seguro.
- Testes de auth cobrindo casos críticos.

### Tasks

1. Definir modelo de credenciais (`users_auth`) e política de hash.
Skill: `auth-implementation-patterns`

2. Implementar signup/login com hash e validações de entrada.
Skill: `backend-development-feature-development`

3. Implementar emissão e validação de JWT (expiração, claims mínimos).
Skill: `api-patterns`

4. Substituir middleware `requireAuth` para JWT próprio.
Skill: `auth-implementation-patterns`

5. Remover dependências ativas de Supabase do fluxo de auth.
Skill: `code-refactoring-tech-debt`

6. Criar testes de auth (credenciais inválidas, token expirado, acesso sem token).
Skill: `e2e-testing-patterns`

### Fechamento técnico do sprint

- Rodar debugging orientado a causa raiz para falhas de auth.
Skill: `debugger`

- Conferir migrações e integridade de versão para tabelas novas de auth.
Skill: `alembic-pro`

---

## Sprint 3 — Integração Web + Estabilização de Fluxo (4-5 dias)

### Deliverables

- Web consumindo API própria em produção.
- Fluxo `signup -> login -> dashboard` estável.
- Tratamento de erro padronizado no frontend.
- Evidência de teste ponta a ponta.

### Tasks

1. Configurar `NEXT_PUBLIC_API_URL` para endpoint de produção.
Skill: `frontend-dev-guidelines`

2. Validar fluxo de autenticação do web com API publicada.
Skill: `debugging-strategies`

3. Ajustar mensagens de erro e estado de carregamento nas telas de auth.
Skill: `frontend-patterns`

4. Rodar suíte E2E mínima de autenticação e sessão.
Skill: `e2e-testing-patterns`

5. Revisar CORS, headers de segurança e política de cookies/token.
Skill: `api-security-best-practices`

### Fechamento técnico do sprint

- Rodar debug de regressões funcionais do fluxo web.
Skill: `debugger`

- Rodar verificação de versionamento de banco/migrations após integração.
Skill: `alembic-pro`

---

## Sprint 4 — Governança de Migração com SQLAlchemy + Alembic (1 semana)

### Deliverables

- Pipeline de migração padronizado com SQLAlchemy/Alembic.
- Processo para `heads`, `merge`, `upgrade`, `downgrade` e SQL offline.
- Procedimento de backup/restauração com evidência.
- Política de release de schema documentada.

### Tasks

1. Definir estrutura SQLAlchemy metadata e bridge de coexistência com schema atual.
Skill: `alembic-pro`

2. Configurar Alembic (`env.py`, revisão, naming conventions, branch labels).
Skill: `alembic-pro`

3. Implantar fluxo de pre-check (`alembic heads`, `current`, `history`) no CI.
Skill: `cicd-automation-workflow-automate`

4. Implementar geração de SQL offline para produção.
Skill: `alembic-pro`

5. Definir backup de imagem/lógico do banco antes de cada upgrade.
Skill: `database-admin`

6. Testar rollback controlado em ambiente de stage.
Skill: `database-migrations-migration-observability`

### Fechamento técnico do sprint

- Rodar debugging de incidentes de migration/compatibilidade.
Skill: `debugger`

- Rodar checklist completo Alembic Pro antes de promover para produção.
Skill: `alembic-pro`

---

## Métricas de sucesso por sprint

- Taxa de sucesso de deploy por sprint >= 95%.
- Zero downtime em fluxo de login/cadastro no go-live.
- Tempo médio de recuperação (MTTR) < 30 min em regressão crítica.
- 100% das migrations com revisão e evidência de execução.

## Observações finais

- Preferência técnica confirmada: PostgreSQL como base principal.
- Migrações futuras padronizadas em SQLAlchemy + Alembic.
- Supabase deve permanecer apenas como legado temporário até desativação completa.
