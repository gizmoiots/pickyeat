#!/usr/bin/env bash
# fix-and-push.sh — finishes the git initial commit and pushes to GitHub.
# Run this from your Mac terminal, NOT from the Cowork sandbox.
#
# Usage:
#   chmod +x scripts/fix-and-push.sh
#   ./scripts/fix-and-push.sh git@github.com:YOUR_HANDLE/pickyeat.git
#
# Or call with no argument to just do the local fix and stop before pushing.

set -euo pipefail
cd "$(dirname "$0")/.."

REMOTE="${1:-}"

echo "→ releasing any stale git locks"
rm -f .git/HEAD.lock .git/index.lock || true

echo "→ removing inner .git from app/ (if any)"
rm -rf app/.git || true

echo "→ untracking the stale submodule pointer (if any)"
git rm --cached app 2>/dev/null || true

echo "→ re-adding app/ as files"
git add app/

echo "→ amending initial commit"
git commit --amend --no-edit -q

TRACKED=$(git ls-files | wc -l | tr -d ' ')
echo "→ done. $TRACKED files tracked."
echo
echo "Sample of what's now in the repo:"
git ls-files | head -10
echo "..."

if [[ -z "$REMOTE" ]]; then
  echo
  echo "No remote URL passed. To push to GitHub, run:"
  echo "  git remote add origin git@github.com:YOUR_HANDLE/pickyeat.git"
  echo "  git push -u origin main"
  exit 0
fi

echo
echo "→ adding remote: $REMOTE"
git remote remove origin 2>/dev/null || true
git remote add origin "$REMOTE"

echo "→ pushing to origin/main"
git push -u origin main
echo
echo "Done. Open the repo on github.com to verify."
