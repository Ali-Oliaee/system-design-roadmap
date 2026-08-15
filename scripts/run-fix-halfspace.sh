#!/usr/bin/env bash
#
# Replace every Persian half-space (ZWNJ, U+200C) with a normal space.
#
# Usage:
#   ./scripts/run-fix-halfspace.sh              # whole project (default)
#   ./scripts/run-fix-halfspace.sh src          # only these paths
#   ./scripts/run-fix-halfspace.sh -n           # dry run: just list the files
#   ./scripts/run-fix-halfspace.sh --keep-bak   # keep the .bak backups
#
# Options:
#   -n, --dry-run    list the files that would change, change nothing
#       --keep-bak   keep the .bak backup written next to each fixed file
#   -h, --help       show this help
#
# Can be run from any directory. With no paths given it always processes the
# whole project, not the current directory. node_modules, .git, build output,
# lockfiles and the two halfspace scripts themselves are always skipped — the
# scripts contain a literal ZWNJ as their search constant and fixing them
# would break the tool.

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PY="$SCRIPT_DIR/fix_halfspace.py"
PROJECT_ROOT="$(git -C "$SCRIPT_DIR" rev-parse --show-toplevel 2>/dev/null || dirname "$SCRIPT_DIR")"
ZWNJ=$'‌'
KEEP_BAK=0
DRY_RUN=0
TARGETS=()

for arg in "$@"; do
  case "$arg" in
    --keep-bak) KEEP_BAK=1 ;;
    -n | --dry-run) DRY_RUN=1 ;;
    -h | --help)
      sed -n '3,20p' "$0" | sed 's/^#\{0,1\} \{0,1\}//'
      exit 0
      ;;
    -*)
      echo "unknown option: $arg" >&2
      exit 2
      ;;
    *) TARGETS+=("$arg") ;;
  esac
done

# No paths given -> scan the whole project. Run from the project root so the
# reported paths stay short and relative instead of long absolute ones.
if [ "${#TARGETS[@]}" -eq 0 ]; then
  cd "$PROJECT_ROOT"
  TARGETS=(.)
  SCOPE="the whole project ($PROJECT_ROOT)"
else
  SCOPE="${TARGETS[*]}"
fi

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
      -g '!package-lock.json' -g '!**/halfspace-tool/**' \
      -g '!**/fix_halfspace.py' -g '!**/run-fix-halfspace.sh' 2>/dev/null || true
  else
    grep -rlF "$ZWNJ" "$@" \
      --exclude-dir=node_modules --exclude-dir=.next --exclude-dir=dist \
      --exclude-dir=build --exclude-dir=.git --exclude-dir=halfspace-tool \
      --exclude='*.bak' --exclude=pnpm-lock.yaml --exclude=yarn.lock \
      --exclude=package-lock.json --exclude=fix_halfspace.py \
      --exclude=run-fix-halfspace.sh 2>/dev/null || true
  fi
}

tmp="$(mktemp)"
trap 'rm -f "$tmp"' EXIT
find_zwnj "${TARGETS[@]}" >"$tmp"

count="$(grep -c . "$tmp" || true)"
if [ "${count:-0}" -eq 0 ]; then
  echo "No half-spaces found in: $SCOPE — nothing to do."
  exit 0
fi

if [ "$DRY_RUN" -eq 1 ]; then
  echo "Dry run — $count file(s) contain a half-space in: $SCOPE"
  cat "$tmp"
  exit 0
fi

echo "Fixing $count file(s) in: $SCOPE"
# NUL-delimit so paths with spaces survive.
tr '\n' '\0' <"$tmp" | xargs -0 python3 "$PY" --in-place

if [ "$KEEP_BAK" -eq 0 ]; then
  sed 's/$/.bak/' "$tmp" | tr '\n' '\0' | xargs -0 rm -f
  echo "Removed .bak backups (use --keep-bak to keep them)."
fi

echo "Done — $count file(s) processed."
