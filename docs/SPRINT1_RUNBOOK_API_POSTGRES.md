# Sprint 1 Runbook — API Publicada + Healthcheck

## Objetivo

Publicar `services/api` em produção, expor porta `3001` e validar healthcheck em `/api/v1/health`.

## Deploy

```bash
docker compose up -d --build api web
```

## Verificação

```bash
docker ps --format "table {{.Names}}\t{{.Status}}\t{{.Ports}}"
curl -i http://127.0.0.1:3001/api/v1/health
curl -i http://127.0.0.1:3000
```

## Critério de aceite

- `api` em estado `healthy`.
- `web` em estado `up`.
- `GET /api/v1/health` retorna HTTP 200 com `{"status":"ok","service":"farmei-api"}`.

## Rollback

```bash
docker compose stop api
docker compose rm -f api
docker compose up -d web
```

## Observação importante

Neste sprint, o objetivo é publicação e saúde de serviço. Fluxo de auth completo sem Supabase entra no Sprint 2.

