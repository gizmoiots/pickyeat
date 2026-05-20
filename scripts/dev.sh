#!/usr/bin/env bash
# dev.sh — one-command local dev. Boots backend on :4000 and frontend on :3000.
#
#   ./scripts/dev.sh          # starts both, frontend in foreground
#   Ctrl-C                    # stops both cleanly
#
# Frontend defaults to mock mode so it works even if the backend isn't reachable.
# Logs from the backend stream to /tmp/pickyeat-backend.log.

set -e
cd "$(dirname "$0")/.."
ROOT="$(pwd)"

# ── deps ────────────────────────────────────────────────────────────────
if [ ! -d "app/frontend/node_modules" ]; then
  echo "→ installing frontend deps (first run, ~30s)…"
  (cd app/frontend && npm install --silent --no-audit --no-fund)
fi
if [ ! -d "app/backend/node_modules" ]; then
  echo "→ installing backend deps (first run, ~30s)…"
  (cd app/backend && npm install --silent --no-audit --no-fund)
fi

# ── env defaults so it runs without any setup ───────────────────────────
[ ! -f "app/backend/.env" ] && cp app/.env.example app/backend/.env 2>/dev/null || true
[ ! -f "app/frontend/.env.local" ] && cp app/.env.example app/frontend/.env.local 2>/dev/null || true

# ── boot ────────────────────────────────────────────────────────────────
LOG=/tmp/pickyeat-backend.log
> "$LOG"

echo "→ starting backend on http://localhost:4000  (logs → $LOG)"
(cd app/backend && npm run dev > "$LOG" 2>&1) &
BACKEND_PID=$!

cleanup() {
  echo
  echo "→ stopping backend (pid $BACKEND_PID)…"
  kill "$BACKEND_PID" 2>/dev/null || true
  wait 2>/dev/null
  echo "→ stopped."
  exit 0
}
trap cleanup INT TERM

sleep 2
if ! kill -0 "$BACKEND_PID" 2>/dev/null; then
  echo "✗ backend failed to start. last log:"
  tail -20 "$LOG"
  exit 1
fi

echo "→ backend up. starting frontend on http://localhost:3000"
echo
echo "Open http://localhost:3000 in your browser."
echo "Ctrl-C here stops both servers."
echo

cd app/frontend && npm run dev
