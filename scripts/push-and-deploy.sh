#!/usr/bin/env bash
# Push exclusivecontent to GitHub and trigger VibeCloud deploy.
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT"

LABS_REMOTE="${LABS_REMOTE:-labs}"
LABS_URL="${LABS_URL:-https://github.com/soundcloud-labs/exclusivecontent.git}"

if ! git remote get-url "$LABS_REMOTE" &>/dev/null; then
  echo "Adding remote '$LABS_REMOTE' -> $LABS_URL"
  git remote add "$LABS_REMOTE" "$LABS_URL"
fi

echo "==> Pushing to origin (your fork)..."
git push origin main

echo "==> Pushing to $LABS_REMOTE (VibeCloud deploy on soundcloud-labs)..."
if git push "$LABS_REMOTE" main; then
  echo ""
  echo "Deploy started. In ~5–10 min open:"
  echo "  https://github.com/soundcloud-labs/exclusivecontent/actions"
  echo "Then open the 'Print service URL' step, e.g.:"
  echo "  https://exclusivecontent.vibecloud-stage.soundcloud.com"
  echo "(Confirm in Actions → Print service URL — non-stage host 404s if not in the URL map.)"
else
  echo ""
  echo "Push to soundcloud-labs failed (access or auth)."
  echo "Options:"
  echo "  1) Ask #ai-support to grant push access or merge your fork"
  echo "  2) Open a PR from trevmcgee/exclusivecontent -> soundcloud-labs/exclusivecontent"
  echo "  3) Use SSH: git remote set-url origin git@github.com:trevmcgee/exclusivecontent.git"
  exit 1
fi
