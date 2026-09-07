# Sprint 4 Runbook — Alembic Paralelo ao Drizzle

Objetivo: manter Drizzle ativo e adicionar trilha de migração paralela com SQLAlchemy + Alembic para evolução controlada de schema.

## Estrutura criada

- `services/api/sqlalchemy_models/*` (metadata + modelos de auth)
- `services/api/alembic.ini`
- `services/api/alembic_py/env.py`
- `services/api/alembic_py/versions/*`

## Pré-requisitos

```bash
cd services/api
python -m venv .venv
source .venv/bin/activate
pip install -r python-requirements.txt
```

## Comandos operacionais

### 1) Sanidade de histórico

```bash
alembic -c alembic.ini heads
alembic -c alembic.ini current
alembic -c alembic.ini history
```

### 2) Gerar nova revision (autogenerate)

```bash
alembic -c alembic.ini revision --autogenerate -m "describe change"
```

### 3) Aplicar migração online

```bash
DATABASE_URL="postgresql://..." alembic -c alembic.ini upgrade head
```

### 4) Gerar SQL offline (produção)

```bash
DATABASE_URL="postgresql://..." alembic -c alembic.ini upgrade head --sql > migration.sql
```

### 5) Rollback

```bash
DATABASE_URL="postgresql://..." alembic -c alembic.ini downgrade -1
```

## Regras de convivência Drizzle x Alembic

1. Drizzle continua sendo fonte ativa do deploy atual.
2. Alembic roda em paralelo para trilha SQLAlchemy futura.
3. Não aplicar migração da mesma tabela por ambos no mesmo release sem plano explícito.
4. Antes de produção: obrigatoriamente rodar `heads/current` e gerar SQL offline para revisão.

## Checklist de fechamento (Sprint 4)

- [ ] `alembic heads` sem divergência inesperada.
- [ ] `alembic current` coerente com ambiente.
- [ ] SQL offline gerado e revisado.
- [ ] Backup lógico/imagem do DB executado antes do upgrade.
- [ ] Teste de downgrade realizado em stage.
