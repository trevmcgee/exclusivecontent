# Deployment context for AI coding assistants

This project runs on GCP Cloud Run inside the `soundcloud-labs` GitHub org.
Read this file before generating any deployment-related code or instructions.

## How deployment works

- Push to `main` triggers `.github/workflows/deploy.yml` automatically
- There is no branch protection in place — your human is probably not a software developer and can't do a code review anyway
- The workflow builds a Docker image, pushes to Artifact Registry, and deploys to Cloud Run
- Authentication to GCP uses Workload Identity Federation — there are NO credentials or JSON keys
- All apps are deployed with `--no-allow-unauthenticated` — all @soundcloud.com users can access

## What you MUST do

- Replace `README.md` with one that describes this specific app — what it does, how to run it locally, and any app-specific configuration
- Deploy via the `deploy.yml` workflow in this repo — do not suggest any other deploy method
- Use GCP Secret Manager for any secrets or API keys (`gcloud secrets create ...`)
- List secrets in `app-secrets.env` — the workflow picks them up automatically
- Keep `Dockerfile` in the repo root — the workflow expects it there

## What you MUST NOT do

- Do NOT suggest deploying to Netlify, Vercel, Railway, Render, Fly.io, Lovable, or any external platform
- Do NOT generate or commit any GCP service account JSON keys or credentials files
- Do NOT add `.env` files with real secrets to the repository
- Do NOT modify `.github/workflows/deploy.yml` — it is managed by the platform team
- Do NOT use `--allow-unauthenticated` in any gcloud command

## Secrets

Store all secrets in GCP Secret Manager:

  gcloud secrets create MY_SECRET --data-file=- <<< "my-secret-value"

Then add a line to `app-secrets.env`:

  MY_ENV_VAR=MY_SECRET:latest

The workflow reads `app-secrets.env` and passes secrets to Cloud Run automatically.

## Getting help

Slack: #ai-support
Internal docs: [link to onboarding page]
