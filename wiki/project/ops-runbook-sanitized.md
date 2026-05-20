# Ops Runbook (Sanitized)

## Scope
Operational baseline for Farmei in production without exposing secrets, private IPs, OCIDs, usernames, or keys.

## Services
- `web`: Next.js app exposed on `:3000`
- `api`: Hono/Node API exposed on `:3001`
- `postgres`: PostgreSQL 16 (internal network + persistent volume)

## Required Ports
- Ingress TCP `22` (SSH)
- Ingress TCP `3000` (web)
- Ingress TCP `3001` (api)
- Keep database port private (no public ingress to `5432`).

## Deployment Flow
1. Connect with SSH key (stored locally, never committed).
2. Enter project directory on server.
3. Sync code from `main`.
4. Start/update containers with Docker Compose.
5. Verify health endpoints and container status.

## Database Flow
1. Ensure `DATABASE_URL` is configured for API.
2. Keep DB credentials in server-side `.env` only.
3. Apply schema migrations in order:
   - baseline migration
   - incremental migration(s)
4. Validate core auth routes after migrations.

## Verification Checklist
- `docker compose ps` shows `web`, `api`, `postgres` running.
- API health endpoint returns `status=ok`.
- Signup/login flow returns token + user.
- Authenticated `users/me` succeeds with Bearer token.

## Secrets and Security
- Do not commit `.env`, private keys, tenancy data, OCIDs, internal hostnames.
- Rotate `JWT_SECRET` and DB password when moving from bootstrap to stable production.
- Prefer least-privilege network rules and closed-by-default ingress.

## Backup and Restore (Minimum)
- Daily logical backup for PostgreSQL.
- Retention policy with at least 7 restore points.
- Quarterly restore drill in non-production environment.

## Local Private Notes
Use local private runbooks for:
- real server IP/hostname
- SSH user and key paths
- real OCI resource IDs
- production secrets/rotation history

These files must stay out of Git (covered by `.gitignore`).
