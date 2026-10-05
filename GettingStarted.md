# Citizen Coding at SoundCloud

So you want to build your own app, but you've been warned by Security, Steve, Legal, and your Grandmother to follow all the rules. 

No one has told you what those rules are.

Guess what! We're also figuring this out. 

VibeCloud is (hopefully) a solution for hosting applications behind our Google SSO. The goal is you do not have to worry about authentication, VibeCloud handles it for you. Correctly. Well, if Claude got it right.

This solution provisions a Container, in Google Cloud Run, behind a Load Balancer (*.vibecloud.soundcloud.com) that requires all connections to be authenticated by our Google Workspace. 

With it you can do anything you want to do with a container. Run code, host a static markdown file (like this one), use SQLLite, etc. 

**What is a citizen coder?**
> A Citizen Coder is a SoundCloud employee outside of engineering who builds small internal tools and product enhancements using AI coding assistants. They're skilled in their domain and effective with AI tools, but working outside their home turf when it comes to cloud infrastructure. The Citizen Coder program gives them a paved road — sanctioned hosting, enforced authentication, and AI tools pre-configured to steer them toward correct patterns — so engineering can enable them at scale without being in the critical path of every deployment.


## Getting started

### 0. Get into GitHub.
You'll need a GitHub account for this, and you'll need to be added to [soundcloud-labs](https://github.com/soundcloud-labs) our dedicated GitHub Organization for citizen coders. 

1. [Create a GitHub user](https://github.com/signup) if you don't have one already
2. [Add your SoundCloud.com email address](https://github.com/settings/emails) to your github account.
3. Reach out in #ai-support to be invited to [soundcloud-labs](https://github.com/soundcloud-labs)
    * You'll know you're in the right place if you can see this repo:
    [https://github.com/soundcloud-labs/vibecloud-template](https://github.com/soundcloud-labs/vibecloud-template)

### 1. Create your repo

In the soundcloud-labs GitHub org, click **Use this template** and give your repo
a short, descriptive name (e.g. `churn-dashboard`, `reviews-radar`). Note: this name will be the first part of your URL: `https://churn-dashboard.vibecloud.soundcloud.com`

### 2. Build your app

Open the repo in your AI coding assistant and describe what you want to build.
The assistant will read `AGENTS.md` and know how to deploy it correctly.

The template includes a minimal Python/Flask starter app in `src/main.py`.
Your assistant can replace this with whatever your app needs. You're not restricted to python, it's just what Claude decided to use as a demo. 

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
