# vibecloud-template

> **Replace this file.** When you start building your app, ask your AI coding
> assistant to replace this README with one that describes your specific project.

This is the starting point for a VibeCloud app — an internal tool that deploys
to GCP Cloud Run and is automatically accessible to everyone at soundcloud.com.

## Getting started

### 1. Create your repo

In the soundcloud-labs GitHub org, click **Use this template** and give your repo
a short, descriptive name (e.g. `churn-dashboard`, `reviews-radar`).

### 2. Build your app

Open the repo in your AI coding assistant and describe what you want to build.
The assistant will read `AGENTS.md` and know how to deploy it correctly.

The template includes a minimal Python/Flask starter app in `src/main.py`.
Your assistant can replace this with whatever your app needs.

### 3. Deploy

Push to `main`. The GitHub Actions workflow builds and deploys automatically.
Find your app URL in the Actions log under **Print service URL**.

Any @soundcloud.com Google account can access the app immediately — no extra
setup required.

## What's in this template

| File | Purpose |
|---|---|
| `src/main.py` | Starter Flask app — replace with your code |
| `Dockerfile` | Builds the container image — update if you change the stack |
| `requirements.txt` | Python dependencies |
| `app-secrets.env` | Map Secret Manager secrets to env vars (see DEPLOY.md) |
| `DEPLOY.md` | Full deployment and secrets guide |
| `AGENTS.md` | Instructions for AI coding assistants |
| `SECURITY.md` | What this platform can and can't access |
| `.github/workflows/deploy.yml` | Managed by platform team — do not edit |

## Getting help

Slack: **#ai-support**
