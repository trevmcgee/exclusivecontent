# How to deploy your app

Your app deploys automatically when you push to `main`. This document covers
everything you need to know.

## First-time setup

### 1. Use this template

In the soundcloud-labs GitHub org, click **Use this template** on `vibecloud-template`.
Name your repo something descriptive (e.g. `churn-dashboard`, `reviews-radar`).

### 2. Push your code

Commit your code to `main`. The GitHub Actions workflow will:
1. Build your Docker image
2. Push it to Artifact Registry
3. Deploy it to Cloud Run
4. Print your app's URL in the Actions log

That's it. Any @soundcloud.com Google account can access your app immediately
after the first deploy — no manual onboarding step required.

### 3. Find your app URL

Go to your repo → Actions → latest run → "Print service URL" step.
The URL looks like: `https://YOUR-APP-NAME-xxxx-ew.a.run.app`

## Storing secrets and API keys

Never put secrets in your code or `.env` files in the repo.

**Step 1** — store the value in GCP Secret Manager:

  gcloud secrets create MY_API_KEY --data-file=- <<< "paste-key-here"

**Step 2** — add a line to `app-secrets.env` in your repo:

  MY_API_KEY=MY_API_KEY:latest

The deploy workflow reads `app-secrets.env` automatically and passes those
secrets into your Cloud Run service as environment variables.

Your app reads it as: `os.environ["MY_API_KEY"]`

## What NOT to do

| Don't | Why |
|-------|-----|
| Deploy to Railway, Netlify, Vercel, Render | Unsanctioned — no SSO, no security review |
| Commit `.env` files with real secrets | Leaks credentials into git history |
| Use `--allow-unauthenticated` | Exposes your app to the internet without auth |
| Modify `.github/workflows/deploy.yml` | Managed by platform team |

## Troubleshooting

**GitHub Actions failing on auth step**
→ The Workload Identity Federation binding may not cover your repo yet. Ping #ai-support.

**My image built but deploy failed**
→ Check that your Dockerfile exposes port 8080. Cloud Run expects it.

**I need a secret that's already in Secret Manager**
→ Add `MY_ENV_VAR=EXISTING_SECRET:latest` to `app-secrets.env` and push.

## Getting help

Slack: **#ai-support**
