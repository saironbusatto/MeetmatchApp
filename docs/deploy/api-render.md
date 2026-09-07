# Deploy API (Render)

Suggested service type: Web Service.

Settings:
- Root Directory: `services/api`
- Build Command: `pnpm install && pnpm -F @farmei/api build`
- Start Command: `pnpm -F @farmei/api dev`

Environment variables:
- `DATABASE_URL`
- `SUPABASE_URL`
- `SUPABASE_SERVICE_ROLE_KEY`
- `PORT`
- `CORS_ORIGIN`
