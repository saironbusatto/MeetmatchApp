# Security CI Baseline

This project enforces a minimum security gate in `.github/workflows/ci.yml` with job `security`.

## Gates

1. Dependency audit:
   - Command: `pnpm audit --prod --audit-level=high`
   - Fails pipeline on `high` or `critical` vulnerabilities in production dependencies.
2. Secret scanning:
   - Tool: `gitleaks/gitleaks-action`
   - Fails pipeline when leaked secrets are detected in git history/content.
3. SCA vulnerability scan:
   - Tool: `google/osv-scanner-action`
   - Scans repository recursively for known vulnerable packages.

## Local Reproduction

Run before opening PR:

```bash
pnpm install --frozen-lockfile
pnpm audit --prod --audit-level=high
```

Optional local scans:

```bash
gitleaks detect --source . --verbose
osv-scanner scan --recursive .
```

## Policy

- PR must pass both `checks` and `security` jobs.
- If a scan fails, either:
  - patch/upgrade dependencies, or
  - add a documented temporary exception with expiry date and owner.
