#!/usr/bin/env python3
"""
Replace every Persian half-space (ZWNJ, U+200C / نیم‌فاصله) with a normal space.

Example:
    "بسته‌بندی"   ->   "بسته بندی"
    "سفارش‌های"   ->   "سفارش های"

Runs of  space(s) + ZWNJ + space(s)  are collapsed into a single normal space,
so you never end up with double spaces where a half-space already had a stray
space next to it.

Usage:
    # print fixed text to stdout (does not modify the file)
    python3 fix_halfspace.py input.txt

    # overwrite the file in place (a .bak backup is created)
    python3 fix_halfspace.py --in-place input.txt

    # process many files at once
    python3 fix_halfspace.py --in-place *.txt

    # read from stdin, write to stdout (pipe friendly)
    cat input.txt | python3 fix_halfspace.py
"""

import argparse
import re
import sys

ZWNJ = "‌"  # half-space / نیم‌فاصله (U+200C)

# horizontal whitespace that may already sit next to a ZWNJ
# (regular space, tab, no-break space U+00A0) — NOT newlines
_SPACE = r"[ \t ]"

# space(s) + ZWNJ + space(s)  ->  a single normal space
_PATTERN = re.compile(rf"{_SPACE}*{ZWNJ}(?:{_SPACE}*{ZWNJ})*{_SPACE}*")


def fix(text: str) -> str:
    return _PATTERN.sub(" ", text)


def main() -> int:
    parser = argparse.ArgumentParser(
        description="Replace ZWNJ (half-space) with a normal space."
    )
    parser.add_argument(
        "files", nargs="*", help="files to process (omit to read from stdin)"
    )
    parser.add_argument(
        "-i",
        "--in-place",
        action="store_true",
        help="edit files in place (writes a .bak backup first)",
    )
    args = parser.parse_args()

    # stdin -> stdout
    if not args.files:
        sys.stdout.write(fix(sys.stdin.read()))
        return 0

    for path in args.files:
        with open(path, "r", encoding="utf-8") as f:
            original = f.read()
        fixed = fix(original)

        if not args.in_place:
            sys.stdout.write(fixed)
            continue

        if fixed == original:
            print(f"unchanged: {path}", file=sys.stderr)
            continue

        with open(path + ".bak", "w", encoding="utf-8") as f:
            f.write(original)
        with open(path, "w", encoding="utf-8") as f:
            f.write(fixed)
        print(f"fixed:     {path}  (backup -> {path}.bak)", file=sys.stderr)

    return 0


if __name__ == "__main__":
    raise SystemExit(main())
