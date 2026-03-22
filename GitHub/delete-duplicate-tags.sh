#!/usr/bin/env bash
# ─────────────────────────────────────────────────────────────────────────────
# GitHub/delete-duplicate-tags.sh
#
# Deletes ALL remote tags from disckit/disckit so the next publish starts clean.
#
# Usage (from the dashboard root):
#   bash GitHub/delete-duplicate-tags.sh
# ─────────────────────────────────────────────────────────────────────────────

set -euo pipefail

GITHUB_ORG="disckit"
GITHUB_REPO="disckit"
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
ENV_FILE="${ROOT}/.env"

GITHUB_TOKEN=$(grep -E '^GITHUB_TOKEN=' "$ENV_FILE" | head -1 | cut -d '=' -f2- | tr -d '\r' | tr -d ' ')
[[ -z "$GITHUB_TOKEN" ]] && echo "❌  GITHUB_TOKEN not set in .env" && exit 1

echo "🔍  Fetching all tags from ${GITHUB_ORG}/${GITHUB_REPO}..."

PAGE=1
DELETED=0

while true; do
  TAGS=$(curl -s \
    -H "Authorization: Bearer $GITHUB_TOKEN" \
    -H "Accept: application/vnd.github+json" \
    "https://api.github.com/repos/${GITHUB_ORG}/${GITHUB_REPO}/git/refs/tags?per_page=100&page=${PAGE}" \
    | grep '"ref"' \
    | sed 's|.*"refs/tags/||;s|".*||')

  [[ -z "$TAGS" ]] && break

  while IFS= read -r tag; do
    [[ -z "$tag" ]] && continue
    ENCODED=$(python3 -c "import urllib.parse; print(urllib.parse.quote('${tag}', safe=''))")
    STATUS=$(curl -s -o /dev/null -w "%{http_code}" -X DELETE \
      -H "Authorization: Bearer $GITHUB_TOKEN" \
      -H "Accept: application/vnd.github+json" \
      "https://api.github.com/repos/${GITHUB_ORG}/${GITHUB_REPO}/git/refs/tags/${ENCODED}")
    if [[ "$STATUS" == "204" ]]; then
      echo "  🗑️   Deleted: $tag"
      ((DELETED++)) || true
    else
      echo "  ❌  Failed ($STATUS): $tag"
    fi
  done <<< "$TAGS"

  ((PAGE++)) || true
done

echo ""
echo "════════════════════════════════════════"
echo "  ✅  Done — deleted ${DELETED} tag(s)"
echo "════════════════════════════════════════"
