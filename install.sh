#!/usr/bin/env bash
# install.sh — install the tmux-menu CLI.
#
# Usage:
#   ./install.sh                 # install to ~/.local/bin
#   ./install.sh --prefix DIR    # install to DIR/bin (e.g. sudo ./install.sh --prefix /usr/local)
#   PREFIX=DIR ./install.sh      # same, via env
#   curl -fsSL https://raw.githubusercontent.com/Robrecht-V/tmux-menu/master/install.sh | bash
#
# Idempotent: re-running overwrites the installed binary.
set -euo pipefail

PREFIX="${PREFIX:-$HOME/.local}"
RAW_URL="https://raw.githubusercontent.com/Robrecht-V/tmux-menu/master/bin/tmux-menu"

while [ $# -gt 0 ]; do
  case "$1" in
    --prefix) PREFIX="$2"; shift 2 ;;
    --prefix=*) PREFIX="${1#*=}"; shift ;;
    -h|--help) sed -n '2,9p' "$0" | sed 's/^# \{0,1\}//'; exit 0 ;;
    *) echo "install.sh: unknown argument: $1" >&2; exit 2 ;;
  esac
done

BIN_DIR="$PREFIX/bin"
DEST="$BIN_DIR/tmux-menu"

# Prefer the copy shipped alongside this script; fall back to fetching it
# (covers the `curl ... | bash` install path where there is no local repo).
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]:-$0}")" >/dev/null 2>&1 && pwd)"
SRC="$SCRIPT_DIR/bin/tmux-menu"

mkdir -p "$BIN_DIR"

if [ -f "$SRC" ]; then
  install -m 0755 "$SRC" "$DEST"
  echo "installed $DEST (from $SRC)"
else
  curl -fsSL "$RAW_URL" -o "$DEST"
  chmod 0755 "$DEST"
  echo "installed $DEST (fetched from $RAW_URL)"
fi

# Soft dependency check. The binary is a self-contained node bundle, so it
# needs node and tmux at runtime.
for dep in node tmux; do
  command -v "$dep" >/dev/null 2>&1 || echo "warning: '$dep' not found on PATH — tmux-menu needs it at runtime." >&2
done

case ":$PATH:" in
  *":$BIN_DIR:"*) ;;
  *) echo "note: $BIN_DIR is not on your PATH. Add it, e.g.:"
     echo "      export PATH=\"$BIN_DIR:\$PATH\"" ;;
esac

echo "done. run: tmux-menu --help"
