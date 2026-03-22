#!/usr/bin/env bash
# ─────────────────────────────────────────────────────────────────────────────
# GitHub/publish-all.sh
#
# Publishes all @disckit packages to the GitHub monorepo and to npm.
#
# Monorepo structure (github.com/disckit/disckit):
#   disckit/        ← meta-package (npm: disckit)
#   paginator/     ← npm: @disckit/paginator
#   i18n/          ← npm: @disckit/i18n
#   permissions/   ← npm: @disckit/permissions
#   cooldown/      ← npm: @disckit/cooldown
#
# Usage (from the dashboard root):
#   bash GitHub/publish-all.sh                          # publish all, default commit
#   bash GitHub/publish-all.sh cooldown                 # publish one package
#   bash GitHub/publish-all.sh i18n cooldown            # publish two packages
#   bash GitHub/publish-all.sh --message "fix: cooldown bypass" cooldown
# ─────────────────────────────────────────────────────────────────────────────

set -euo pipefail

# ── Python helper to read package.json fields (avoids Node.js v22 ERR_INVALID_PACKAGE_CONFIG) ──
_pkg_field() { python3 -c "import json,sys; d=json.load(open('$1')); print(d.get('$2',''))" 2>/dev/null || echo ""; }
_pkg_is_private() { python3 -c "import json,sys; d=json.load(open('$1')); print('true' if d.get('private') else 'false')" 2>/dev/null || echo "false"; }


GITHUB_ORG="disckit"
GITHUB_REPO="disckit"
NPM_SCOPE="@disckit"
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
ENV_FILE="${ROOT}/.env"
PACKAGES_SRC="${ROOT}/packages/GitHub"

ALL_PACKAGES=(
  "common"
  "antiflood"
  "caffeine"
  "cache"
  "placeholders"
  "paginator"
  "i18n"
  "permissions"
  "cooldown"
  "disckit"
)

# Apps (not @disckit/* scoped — published as top-level npm packages)
ALL_APPS=(
  "create-disckit-app"
  "disckit-docs"
)
APPS_SRC="${ROOT}/packages/GitHub/apps"

# ── Parse args (--message / -m support) ──────────────────────────────────────

CUSTOM_MESSAGE=""
CUSTOM_TAG=""
PACKAGES_ARGS=()

while [[ $# -gt 0 ]]; do
  case "$1" in
    --message|-m)
      CUSTOM_MESSAGE="$2"
      shift 2
      ;;
    --tag|-t)
      CUSTOM_TAG="$2"
      shift 2
      ;;
    *)
      PACKAGES_ARGS+=("$1")
      shift
      ;;
  esac
done

if [[ ${#PACKAGES_ARGS[@]} -gt 0 ]]; then
  PACKAGES=("${PACKAGES_ARGS[@]}")
  echo "📋  Publishing selected: ${PACKAGES[*]}"
else
  PACKAGES=("${ALL_PACKAGES[@]}")
  echo "📋  Publishing all ${#PACKAGES[@]} packages"
fi

# ── Load tokens ───────────────────────────────────────────────────────────────

if [[ ! -f "$ENV_FILE" ]]; then echo "❌  .env not found at: $ENV_FILE"; exit 1; fi

GITHUB_TOKEN=$(grep -E '^GITHUB_TOKEN=' "$ENV_FILE" | head -1 | cut -d '=' -f2- | tr -d '\r' | tr -d ' ')
NPM_TOKEN=$(grep -E '^NPM_TOKEN_GITHUB=' "$ENV_FILE" | head -1 | cut -d '=' -f2- | tr -d '\r' | tr -d ' ')
NPM_TOKEN_UNSCOPED=$(grep -E '^NPM_TOKEN_UNSCOPED=' "$ENV_FILE" | head -1 | cut -d '=' -f2- | tr -d '\r' | tr -d ' ')

[[ -z "$GITHUB_TOKEN" ]]       && echo "❌  GITHUB_TOKEN not set in .env" && exit 1
[[ -z "$NPM_TOKEN" ]]          && echo "❌  NPM_TOKEN_GITHUB not set in .env" && exit 1
[[ -z "$NPM_TOKEN_UNSCOPED" ]] && echo "❌  NPM_TOKEN_UNSCOPED not set in .env" && exit 1

echo "✅  Tokens loaded"

# ── Check GitHub org ──────────────────────────────────────────────────────────

echo ""; echo "🏢  Checking GitHub org: ${GITHUB_ORG}..."

ORG_STATUS=$(curl -s -o /dev/null -w "%{http_code}" \
  -H "Authorization: Bearer $GITHUB_TOKEN" \
  -H "Accept: application/vnd.github+json" \
  "https://api.github.com/orgs/${GITHUB_ORG}")

if [[ "$ORG_STATUS" == "200" ]]; then
  echo "✅  Org exists: https://github.com/${GITHUB_ORG}"
else
  echo "⚠️  Org '${GITHUB_ORG}' not found."
  echo "   Create it at: https://github.com/organizations/plan  (name: ${GITHUB_ORG})"
  exit 1
fi

# ── Run tests ─────────────────────────────────────────────────────────────────

echo ""; echo "🧪  Running tests..."

FAILED=(); PASSED_PACKAGES=()

for PKG in "${PACKAGES[@]}"; do
  PKG_DIR="${PACKAGES_SRC}/${PKG}"
  [[ ! -d "${PKG_DIR}/src" ]] && echo "  ❌  ${PKG} — source not found" && FAILED+=("$PKG") && continue

  if [[ -f "${PKG_DIR}/tests/run.js" ]]; then
    # Symlink local @disckit/* dependencies so tests resolve without needing to publish first
    LOCAL_DEPS=$(python3 -c "
import json, sys
d = json.load(open('${PKG_DIR}/package.json')).get('dependencies', {})
for k in d:
    if k.startswith('@disckit/'):
        print(k)
" 2>/dev/null || true)

    if [[ -n "$LOCAL_DEPS" ]]; then
      mkdir -p "${PKG_DIR}/node_modules/@disckit"
      while IFS= read -r DEP; do
        DEP_FOLDER=$(echo "$DEP" | sed 's|@disckit/||')
        DEP_PATH="${PACKAGES_SRC}/${DEP_FOLDER}"
        LINK_PATH="${PKG_DIR}/node_modules/${DEP}"
        if [[ -d "$DEP_PATH" && ! -e "$LINK_PATH" ]]; then
          ln -sf "$DEP_PATH" "$LINK_PATH"
        fi
      done <<< "$LOCAL_DEPS"
    fi

    if node --test "${PKG_DIR}/tests/run.js" > /tmp/test-out-${PKG}.txt 2>&1; then
      echo "  ✅  ${PKG}"; PASSED_PACKAGES+=("$PKG")
    else
      echo "  ❌  ${PKG} — tests failed:"; tail -5 /tmp/test-out-${PKG}.txt; FAILED+=("$PKG")
    fi
  else
    echo "  ⚠️   ${PKG} — no tests"; PASSED_PACKAGES+=("$PKG")
  fi
done

[[ ${#FAILED[@]} -gt 0 ]] && echo "" && echo "❌  Aborting — fix tests: ${FAILED[*]}" && exit 1
echo ""; echo "✅  All tests passed"

# ── Run tests for apps ───────────────────────────────────────────────────────

APPS_TO_PUBLISH=("${ALL_APPS[@]}")

for APP in "${ALL_APPS[@]}"; do
  APP_DIR="${APPS_SRC}/${APP}"
  if [[ ! -d "${APP_DIR}/bin" && ! -d "${APP_DIR}/docs" && ! -f "${APP_DIR}/package.json" ]]; then
    echo "  ❌  ${APP} — no bin/, docs/ or package.json found"; FAILED+=("$APP"); continue
  fi
  echo "  ✅  ${APP} (no unit tests — validated via package.json)"
done

# ── Build monorepo snapshot ───────────────────────────────────────────────────

MONO_DIR="/tmp/${GITHUB_REPO}-publish-$$"
# ── npm publish apps ─────────────────────────────────────────────────────────

echo ""; echo "📤  Publishing apps..."

for APP in "${APPS_TO_PUBLISH[@]}"; do
  APP_DIR="${APPS_SRC}/${APP}"
  APP_NAME=$(_pkg_field "${APP_DIR}/package.json" "name")
  APP_VERSION=$(_pkg_field "${APP_DIR}/package.json" "version")
  APP_PRIVATE=$(_pkg_is_private "${APP_DIR}/package.json")

  echo ""; echo "  ── ${APP_NAME}@${APP_VERSION}"

  # Skip private apps (e.g. disckit-docs — static site, not published to npm)
  if [[ "$APP_PRIVATE" == "true" ]]; then
    echo "  ℹ️   private package — skipping npm publish (included in GitHub only)"
    SKIPPED_NPM+=("$APP")
    continue
  fi

  NPM_TMP="/tmp/${APP}-npm-$$"
  rm -rf "$NPM_TMP"; cp -r "$APP_DIR" "$NPM_TMP"
  echo "  🔑  Using NPM_TOKEN_UNSCOPED (unscoped)"
  echo "//registry.npmjs.org/:_authToken=${NPM_TOKEN_UNSCOPED}" > "${NPM_TMP}/.npmrc"

  EXISTING=$(npm view "${APP_NAME}@${APP_VERSION}" version 2>/dev/null || true)

  if [[ "$EXISTING" == "$APP_VERSION" ]]; then
    echo "  ⚠️   Already on npm — skipping"; SKIPPED_NPM+=("$APP")
  else
    cd "$NPM_TMP"
    if npm publish --access public 2>&1; then
      echo "  ✅  Published"; PUBLISHED+=("$APP")
    else
      echo "  ❌  npm publish failed"; NPM_FAILED+=("$APP")
    fi
    cd /
  fi
  rm -rf "$NPM_TMP"
done

rm -rf "$MONO_DIR"; mkdir -p "$MONO_DIR"

echo ""; echo "📂  Building monorepo snapshot..."

for PKG in "${ALL_PACKAGES[@]}"; do
  [[ -d "${PACKAGES_SRC}/${PKG}" ]] && cp -r "${PACKAGES_SRC}/${PKG}" "${MONO_DIR}/${PKG}" && echo "  + ${PKG}"
done

# Copy apps into monorepo under apps/
if [[ -d "$APPS_SRC" ]]; then
  mkdir -p "${MONO_DIR}/apps"
  for APP in "${ALL_APPS[@]}"; do
    [[ -d "${APPS_SRC}/${APP}" ]] && cp -r "${APPS_SRC}/${APP}" "${MONO_DIR}/apps/${APP}" && echo "  + apps/${APP}"
  done
fi

# Copy root files if they exist
[[ -f "${PACKAGES_SRC}/README.md"           ]] && cp    "${PACKAGES_SRC}/README.md"           "${MONO_DIR}/README.md"           && echo "  + README.md"
[[ -f "${PACKAGES_SRC}/LICENSE"             ]] && cp    "${PACKAGES_SRC}/LICENSE"             "${MONO_DIR}/LICENSE"             && echo "  + LICENSE"
[[ -d "${PACKAGES_SRC}/assets"              ]] && cp -r "${PACKAGES_SRC}/assets"              "${MONO_DIR}/assets"              && echo "  + assets/"
[[ -f "${PACKAGES_SRC}/biome.json"          ]] && cp    "${PACKAGES_SRC}/biome.json"          "${MONO_DIR}/biome.json"          && echo "  + biome.json"
[[ -f "${PACKAGES_SRC}/package.json"        ]] && cp    "${PACKAGES_SRC}/package.json"        "${MONO_DIR}/package.json"        && echo "  + package.json"
[[ -f "${PACKAGES_SRC}/.gitignore"          ]] && cp    "${PACKAGES_SRC}/.gitignore"          "${MONO_DIR}/.gitignore"          && echo "  + .gitignore"
[[ -f "${PACKAGES_SRC}/pnpm-workspace.yaml" ]] && cp    "${PACKAGES_SRC}/pnpm-workspace.yaml" "${MONO_DIR}/pnpm-workspace.yaml" && echo "  + pnpm-workspace.yaml"
[[ -f "${PACKAGES_SRC}/turbo.json"          ]] && cp    "${PACKAGES_SRC}/turbo.json"          "${MONO_DIR}/turbo.json"          && echo "  + turbo.json"
[[ -d "${PACKAGES_SRC}/.github"             ]] && cp -r "${PACKAGES_SRC}/.github"             "${MONO_DIR}/.github"             && echo "  + .github/"

# Copy GitHub/ scripts (only what's relevant for contributors)
GITHUB_SRC="$(cd "$(dirname "$0")" && pwd)"
mkdir -p "${MONO_DIR}/GitHub"
[[ -f "${GITHUB_SRC}/publish-all.sh"           ]] && cp "${GITHUB_SRC}/publish-all.sh"           "${MONO_DIR}/GitHub/publish-all.sh"           && echo "  + GitHub/publish-all.sh"
[[ -f "${GITHUB_SRC}/delete-duplicate-tags.sh" ]] && cp "${GITHUB_SRC}/delete-duplicate-tags.sh" "${MONO_DIR}/GitHub/delete-duplicate-tags.sh" && echo "  + GitHub/delete-duplicate-tags.sh"
[[ -f "${GITHUB_SRC}/README.md"                ]] && cp "${GITHUB_SRC}/README.md"                "${MONO_DIR}/GitHub/README.md"                && echo "  + GitHub/README.md"

# ── Generate versions.json ────────────────────────────────────────────────────

echo ""; echo "📄  Generating versions.json..."

VERSIONS_JSON="${MONO_DIR}/apps/disckit-docs/versions.json"
VERSIONS_LIVE="${PACKAGES_SRC}/apps/disckit-docs/versions.json"

_gen_versions() {
  local timestamp
  timestamp=$(date -u '+%Y-%m-%dT%H:%M:%S.000Z')
  local entries=""
  local count=0

  for pkg in "${ALL_PACKAGES[@]}"; do
    local name version
    name=$(_pkg_field "${PACKAGES_SRC}/${pkg}/package.json" "name")
    version=$(_pkg_field "${PACKAGES_SRC}/${pkg}/package.json" "version")
    [[ -z "$name" || -z "$version" ]] && continue
    [[ -n "$entries" ]] && entries="${entries},"$'\n'
    entries="${entries}    \"${name}\": \"${version}\""
    (( count++ )) || true
  done

  printf '{\n  "generated": "%s",\n  "packages": {\n%s\n  }\n}\n' \
    "$timestamp" "$entries"
  echo "  ✅  versions.json written (${count} packages)" >&2
}

mkdir -p "${MONO_DIR}/apps/disckit-docs"
_gen_versions > "${VERSIONS_JSON}"

# Also update the live local file so Vercel picks it up on next deploy
mkdir -p "${PACKAGES_SRC}/apps/disckit-docs"
cp "${VERSIONS_JSON}" "${VERSIONS_LIVE}"

# ── Ensure GitHub repo exists ─────────────────────────────────────────────────

echo ""; echo "📦  Checking GitHub repo: ${GITHUB_ORG}/${GITHUB_REPO}..."

REPO_STATUS=$(curl -s -o /dev/null -w "%{http_code}" \
  -H "Authorization: Bearer $GITHUB_TOKEN" \
  -H "Accept: application/vnd.github+json" \
  "https://api.github.com/repos/${GITHUB_ORG}/${GITHUB_REPO}")

if [[ "$REPO_STATUS" == "200" ]]; then
  echo "✅  Repo exists"
else
  echo "🔨  Creating ${GITHUB_ORG}/${GITHUB_REPO}..."
  CREATE_RESP=$(curl -s -w "\n%{http_code}" -X POST \
    -H "Authorization: Bearer $GITHUB_TOKEN" \
    -H "Accept: application/vnd.github+json" \
    -H "Content-Type: application/json" \
    "https://api.github.com/orgs/${GITHUB_ORG}/repos" \
    -d "{\"name\":\"${GITHUB_REPO}\",\"description\":\"Monorepo for all @disckit npm packages\",\"private\":false,\"has_issues\":true,\"has_projects\":false,\"has_wiki\":false,\"auto_init\":false}")
  CS=$(echo "$CREATE_RESP" | tail -1)
  if [[ "$CS" != "201" ]]; then
    echo "❌  Failed to create repo (HTTP $CS)"
    echo "   Possible causes:"
    echo "   → Token missing 'admin:org' scope — edit at: https://github.com/settings/tokens"
    echo "   → You are not an Owner of the '${GITHUB_ORG}' org"
    echo "   Response: $(echo "$CREATE_RESP" | head -1)"
    rm -rf "$MONO_DIR"; exit 1
  fi
  echo "✅  Repo created: https://github.com/${GITHUB_ORG}/${GITHUB_REPO}"
fi

# ── Git push ──────────────────────────────────────────────────────────────────

echo ""; echo "🚀  Pushing to GitHub..."

# Build version summary for commit message
VERSION_SUMMARY=""
for PKG in "${PASSED_PACKAGES[@]}"; do
  V=$(_pkg_field "${PACKAGES_SRC}/${PKG}/package.json" "version")
  N=$(_pkg_field "${PACKAGES_SRC}/${PKG}/package.json" "name")
  [[ -z "$N" ]] && N="$PKG" 
  [[ -n "$V" ]] && VERSION_SUMMARY="${VERSION_SUMMARY}\n  ${N}@${V}"
done

# Use custom message if provided, otherwise auto-generate
if [[ -n "$CUSTOM_MESSAGE" ]]; then
  COMMIT_MSG="${CUSTOM_MESSAGE}"
else
  COMMIT_MSG="release: ${PACKAGES[*]}
$(echo -e "$VERSION_SUMMARY")"
fi

cd "$MONO_DIR"
git init -q
git config user.email "bot@disckit.dev"
git config user.name "disckit"
git checkout -b main
git add .
git commit -q -m "$COMMIT_MSG"

# Only the custom --tag is created (ex: v1.0.2) — no per-package tags
if [[ -n "$CUSTOM_TAG" ]]; then
  git tag -f "$CUSTOM_TAG" -m "$CUSTOM_TAG" 2>/dev/null || true
  echo "  🏷️   ${CUSTOM_TAG}"
else
  echo "  ⚠️   No tag created — use --tag vX.Y.Z to tag the release"
fi

REMOTE_URL="https://${GITHUB_TOKEN}@github.com/${GITHUB_ORG}/${GITHUB_REPO}.git"
git remote add origin "$REMOTE_URL"
git push -u origin main --force -q
git push origin --tags --force -q 2>/dev/null || true

echo "✅  Pushed: https://github.com/${GITHUB_ORG}/${GITHUB_REPO}"

# ── npm publish ───────────────────────────────────────────────────────────────

echo ""; echo "📤  Publishing to npm..."

PUBLISHED=(); SKIPPED_NPM=(); NPM_FAILED=()

for PKG in "${PASSED_PACKAGES[@]}"; do
  PKG_DIR="${PACKAGES_SRC}/${PKG}"
  PKG_NAME=$(_pkg_field "${PKG_DIR}/package.json" "name")
  PKG_VERSION=$(_pkg_field "${PKG_DIR}/package.json" "version")

  echo ""; echo "  ── ${PKG_NAME}@${PKG_VERSION}"

  NPM_TMP="/tmp/${PKG}-npm-$$"
  rm -rf "$NPM_TMP"; cp -r "$PKG_DIR" "$NPM_TMP"

  # Scoped packages (@disckit/*) use NPM_TOKEN_GITHUB, unscoped (disckit) uses NPM_TOKEN_UNSCOPED
  if [[ "$PKG_NAME" == @* ]]; then
    ACTIVE_TOKEN="$NPM_TOKEN"
    echo "  🔑  Using NPM_TOKEN_GITHUB (scoped)"
  else
    ACTIVE_TOKEN="$NPM_TOKEN_UNSCOPED"
    echo "  🔑  Using NPM_TOKEN_UNSCOPED (unscoped)"
  fi
  echo "//registry.npmjs.org/:_authToken=${ACTIVE_TOKEN}" > "${NPM_TMP}/.npmrc"

  EXISTING=$(npm view "${PKG_NAME}@${PKG_VERSION}" version 2>/dev/null || true)

  if [[ "$EXISTING" == "$PKG_VERSION" ]]; then
    echo "  ⚠️   Already on npm — skipping"; SKIPPED_NPM+=("$PKG")
  else
    cd "$NPM_TMP"
    if npm publish --access public 2>&1; then
      echo "  ✅  Published"; PUBLISHED+=("$PKG")
    else
      echo "  ❌  npm publish failed"; NPM_FAILED+=("$PKG")
    fi
    cd /
  fi
  rm -rf "$NPM_TMP"
done

rm -rf "$MONO_DIR"

# ── Summary ───────────────────────────────────────────────────────────────────

echo ""
echo "════════════════════════════════════════════════════════════"
[[ ${#NPM_FAILED[@]} -eq 0 && ${#FAILED[@]} -eq 0 ]] && echo "  ✅  DONE" || echo "  ⚠️   DONE WITH ERRORS"
echo "════════════════════════════════════════════════════════════"
echo ""
echo "  🏠  https://github.com/${GITHUB_ORG}/${GITHUB_REPO}"
echo ""

if [[ ${#PUBLISHED[@]} -gt 0 ]]; then
  echo "  Published:"
  for pkg in "${PUBLISHED[@]}"; do
    N=$(_pkg_field "${PACKAGES_SRC}/${pkg}/package.json" "name")
    V=$(_pkg_field "${PACKAGES_SRC}/${pkg}/package.json" "version")
    echo "    ✅  ${N}@${V}"
    echo "        npm    : https://www.npmjs.com/package/${N}"
    echo "        source : https://github.com/${GITHUB_ORG}/${GITHUB_REPO}/tree/main/packages/${pkg}"
  done
  echo ""
fi

[[ ${#SKIPPED_NPM[@]} -gt 0 ]] && echo "  Skipped (already on npm): ${SKIPPED_NPM[*]}" && echo ""

# Show scaffold usage if create-disckit-app was published
for pkg in "${PUBLISHED[@]}"; do
  if [[ "$pkg" == "create-disckit-app" ]]; then
    echo "  ─────────────────────────────────────────────────"
    echo "  Users can now scaffold a bot with:"
    echo ""
    echo "    npx create-disckit-app my-bot"
    echo "    npm create disckit-app my-bot"
    echo "  ─────────────────────────────────────────────────"
    echo ""
  fi
done

[[ ${#FAILED[@]} -gt 0 || ${#NPM_FAILED[@]} -gt 0 ]] && exit 1 || true
