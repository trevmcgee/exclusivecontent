# Exclusive Content Dashboard (VibeCloud)

Account, Series and partner exclusives — one view of the KPIs that matter. Built with [Next.js](https://nextjs.org/) and [shadcn/ui](https://ui.shadcn.com/) patterns, deployed on **GCP Cloud Run** via the soundcloud-labs template.

**Live URL (after deploy):** `https://exclusivecontent.vibecloud.soundcloud.com`  
Confirm in GitHub Actions → **Print service URL**.

## Architecture

| Layer | Location |
|-------|----------|
| **UI** | `web/` — Next.js App Router, shadcn-style components |
| **Data** | `data/dashboard.json` — generated from CSVs (see knowledge-base pipeline) |
| **Deploy** | Push to `main` → `.github/workflows/deploy.yml` (do not edit) |

Authentication is **not** implemented in the app — VibeCloud IAP + Google Workspace restrict access to `@soundcloud.com`.

## Run locally

Requires Node 20+.

```bash
cd web
npm install
export DASHBOARD_DATA_PATH="$(cd .. && pwd)/data/dashboard.json"
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). Health check: [http://localhost:3000/healthz](http://localhost:3000/healthz).

Production-like run:

```bash
cd web && npm run build && PORT=8080 npm start
```

## Refresh data

1. Drop CSV exports into the knowledge-base folder  
   `repos/analytics_creator_pod/personal/trevormcgee/exclusive-content-dashboard/csv/`
2. Run the builder (writes `dashboard.json` here):

```bash
python3 repos/analytics_creator_pod/personal/trevormcgee/exclusive-content-dashboard/build_dashboard.py \
  --csv-dir repos/analytics_creator_pod/personal/trevormcgee/exclusive-content-dashboard/csv \
  --out exclusivecontent/data/dashboard.json
```

3. Commit `data/dashboard.json` and push to `main`.

See `DATA_CONTRACT.md` in the pipeline folder for CSV column definitions.

## Deploy rules

Read **`AGENTS.md`** and **`DEPLOY.md`** before pushing:

- Deploy only through this repo’s GitHub Actions workflow
- No secrets in git — use Secret Manager + `app-secrets.env` if needed later
- Do not modify `.github/workflows/deploy.yml`

## Help

Slack: **#ai-support**
