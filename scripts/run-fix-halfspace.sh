#!/usr/bin/env bash

set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PY="$ROOT/fix_halfspace.py"
ZWNJ=$'‌'
KEEP_BAK=0
TARGETS=()

for arg in "$@"; do
  case "$arg" in
    --keep-bak) KEEP_BAK=1 ;;
    -h | --help)
      sed -n '2,19p' "$0" | sed 's/^# \{0,1\}//'
      exit 0
      ;;
    -*)
      echo "unknown option: $arg" >&2
      exit 2
      ;;
    *) TARGETS+=("$arg") ;;
  esac
done
[ ${#TARGETS[@]} -eq 0 ] && TARGETS=(src)

if [ ! -f "$PY" ]; then
  echo "error: fix_halfspace.py not found next to this script ($PY)" >&2
  exit 1
fi

# Print the list of files still containing a ZWNJ, one per line.
# Prefer ripgrep; fall back to grep so the script works without rg installed.
find_zwnj() {
  if command -v rg >/dev/null 2>&1; then
    rg -l -F "$ZWNJ" "$@" --hidden \
      -g '!**/node_modules/**' -g '!**/.next/**' -g '!**/dist/**' -g '!**/build/**' \
      -g '!**/.git/**' -g '!*.bak' -g '!pnpm-lock.yaml' -g '!yarn.lock' \
      -g '!package-lock.json' -g '!**/halfspace-tool/**' 2>/dev/null || true
  else
    grep -rlF "$ZWNJ" "$@" \
      --exclude-dir=node_modules --exclude-dir=.next --exclude-dir=dist \
      --exclude-dir=build --exclude-dir=.git --exclude-dir=halfspace-tool \
      --exclude='*.bak' --exclude=pnpm-lock.yaml --exclude=yarn.lock \
      --exclude=package-lock.json 2>/dev/null || true
  fi
}

tmp="$(mktemp)"
trap 'rm -f "$tmp"' EXIT
find_zwnj "${TARGETS[@]}" >"$tmp"

count="$(grep -c . "$tmp" || true)"
if [ "${count:-0}" -eq 0 ]; then
  echo "No half-spaces found in: ${TARGETS[*]} — nothing to do."
  exit 0
fi

echo "Fixing $count file(s) in: ${TARGETS[*]}"
# NUL-delimit so paths with spaces survive.
tr '\n' '\0' <"$tmp" | xargs -0 python3 "$PY" --in-place

if [ "$KEEP_BAK" -eq 0 ]; then
  sed 's/$/.bak/' "$tmp" | tr '\n' '\0' | xargs -0 rm -f
  echo "Removed .bak backups (use --keep-bak to keep them)."
fi

echo "Done — $count file(s) processed."
