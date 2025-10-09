#!/usr/bin/env bash
set -euo pipefail

echo ">> Installing Bun ${BUN_VERSION}, Foundry ${FOUNDRY_VERSION}, Codex CLI"

# --- Bun (pin exact version)
if ! command -v bun >/dev/null 2>&1; then
  curl -fsSL https://bun.sh/install | bash
  export PATH="$HOME/.bun/bin:$PATH"
fi
# Ensure pinned version (no canary flag; stick to the requested version)
if [[ -n "${BUN_VERSION:-}" ]]; then
  current_bun="$(bun --version || echo '')"
  if [[ "$current_bun" != "$BUN_VERSION" ]]; then
    bun upgrade --version "${BUN_VERSION}"
  fi
fi

# --- Foundry (pin or channel via foundryup)
if ! command -v forge >/dev/null 2>&1; then
  curl -L https://foundry.paradigm.xyz | bash
  export PATH="$HOME/.foundry/bin:$PATH"
fi
# Install requested foundry version (stable/nightly/commit hash)
foundryup -v "${FOUNDRY_VERSION}"

echo ">> Versions:"
echo "node:  $(node -v)"
echo "npm:   $(npm -v)"
echo "bun:   $(bun --version)"
echo "forge: $(forge --version || true)"
echo "anvil: $(anvil --version || true)"
echo "cast:  $(cast --version || true)"
echo ">> ✅ Setup complete."
