# Launch checklist

Everything is **committed locally** on branch `main`. You only need to **push** from your Mac (GitHub login or SSH).

## One command (recommended)

```bash
cd /Users/trevormcgee/Downloads/sc-data-knowledge-base-main/exclusivecontent
chmod +x scripts/push-and-deploy.sh
./scripts/push-and-deploy.sh
```

This pushes to:

1. `origin` → `trevmcgee/exclusivecontent`
2. `labs` → `soundcloud-labs/exclusivecontent` (triggers VibeCloud deploy)

## If GitHub asks for a password

Use a **Personal Access Token** as the password, or switch to SSH:

```bash
git remote set-url origin git@github.com:trevmcgee/exclusivecontent.git
git remote set-url labs git@github.com:soundcloud-labs/exclusivecontent.git
./scripts/push-and-deploy.sh
```

## After push succeeds

1. Open [Actions on soundcloud-labs/exclusivecontent](https://github.com/soundcloud-labs/exclusivecontent/actions)
2. Wait for the green **Deploy to Cloud Run** run
3. Open step **Print service URL**
4. Visit **https://exclusivecontent.vibecloud.soundcloud.com** (sign in with @soundcloud.com)

## Local preview (optional)

```bash
cd web
npm install
export DASHBOARD_DATA_PATH="$(cd .. && pwd)/data/dashboard.json"
npm run dev
```

Open http://localhost:3000
