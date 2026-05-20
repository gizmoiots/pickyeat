# scripts

Helper shell scripts for one-time setup tasks. Run from your real terminal — not from the Cowork sandbox, which has restrictive filesystem permissions on this mount.

## fix-and-push.sh

Finishes the initial git commit (the sandbox can't fully complete it) and optionally pushes to GitHub.

```bash
chmod +x scripts/fix-and-push.sh

# Local fix only — won't touch any remote:
./scripts/fix-and-push.sh

# Or fix + push in one go:
./scripts/fix-and-push.sh git@github.com:YOUR_HANDLE/pickyeat.git
```

What it does:
1. Releases any stale `.git/HEAD.lock` files
2. Removes the stray `app/.git` (an inner repo that confused the initial commit)
3. Un-tracks the submodule pointer at `app`
4. Re-adds `app/` as actual files
5. Amends the initial commit so the tree is clean
6. (Optional) Adds the GitHub remote and pushes
