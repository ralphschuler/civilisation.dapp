# Getting Started

This guide explains how to install dependencies, run the app locally, execute contract tests, and build production artefacts.

## Dev container (recommended)

The repository ships with a [Development Container](https://containers.dev/) configuration under `.devcontainer/` that provides Bun, Node.js 20, and Foundry pre-installed. Launching the project in GitHub Codespaces or VS Code with the Dev Container
extension automatically:
extension automatically:

- Installs frontend dependencies via `bun install`.
- Fetches Foundry libraries inside `contracts/` with `forge install`.
- Exposes common ports (`5173` for Vite, `6006` for Storybook).
- Adds editor extensions for Bun, Solidity, ESLint, and Prettier.

Use this environment to avoid manual toolchain setup. The sections below outline the same steps for local machines without Codespaces support.

## Prerequisites

- **Node.js alternative**: [Bun](https://bun.sh/) v1.0 or newer.
- **Package manager**: Bun ships with its own package manager; no separate installation is required.
- **Smart contract tooling**: [Foundry](https://book.getfoundry.sh/) (`forge`, `cast`, `anvil`).
- **Version control**: Git.
- **Optional**: [MiniKit](https://docs.worldcoin.org/world-app/minikit) test harness for end-to-end World App flows.

## Repository setup

Clone the repository and install dependencies with Bun:

```bash
bun install
```

The lockfile (`bun.lock`) is committed to ensure reproducible installs. Use `bun install --frozen-lockfile` in CI.

## Running the web client

Start the Vite development server:

```bash
bun run dev
```

This exposes the app at `http://localhost:5173`. The app expects the following environment variables (configure via `.env.local`):

- `VITE_PUBLIC_APP_ID`: World App identifier for the dApp.
- `VITE_PUBLIC_CONTRACT_ADDRESS`: Deployed diamond address on Worldchain.

## Storybook

Storybook helps validate components in isolation:

```bash
bun run storybook
```

## Linting and formatting

Run ESLint using the Bun script:

```bash
bun run lint
```

Prettier is configured via ESLint. Fix issues automatically with:

```bash
bun run lint -- --fix
```

## Building for production

Create an optimised bundle:

```bash
VITE_PUBLIC_APP_ID=<app-id> \
VITE_PUBLIC_CONTRACT_ADDRESS=<contract-address> \
bun run build
```

Outputs live in `dist/`. Deploy them through the `deploy-app.yml` workflow or your preferred static host.

## Smart contract development

Install dependencies and run tests:

```bash
cd contracts
forge install
forge test
```

Set `FOUNDRY_PROFILE` to select between configurations (e.g., `default`, `ci`). Deployment scripts reside in `contracts/script/` and rely on environment variables documented inside each script.

## Troubleshooting

- Ensure Bun is the latest stable release; `bun upgrade` resolves many dependency issues.
- Delete `.turbo` and `node_modules` if builds fail unexpectedly, then reinstall.
- Use `anvil` to spin up a local Ethereum-compatible node when iterating on contract interactions.

## Next steps

- Read the [frontend architecture](./frontend.md) documentation for implementation details.
- Review [smart contracts](./smart-contracts.md) for diamond layout, facets, and upgrade processes.
- Inspect the [workflow reference](./workflows.md) to understand CI/CD automation.
