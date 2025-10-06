# Project Overview

Civilisation DApp is a village-building strategy game that runs inside the World App WebView. Players gather resources, expand their settlement, train units, and interact with smart contracts on Worldchain. The project is split across a modern web frontend and a set of Solidity contracts managed with Foundry.

## High-level goals

- Deliver a polished, mobile-friendly game experience that works inside the World App.
- Provide deterministic, verifiable game rules enforced by smart contracts.
- Allow the community to extend gameplay through configuration files and contract upgrades.

## Key technologies

| Area | Stack |
| ---- | ----- |
| Frontend | React, TypeScript, Vite, Zustand, wagmi, viem, Tailwind CSS |
| Smart contracts | Solidity, OpenZeppelin, Foundry, Diamond pattern |
| Tooling | Bun, Storybook, ESLint, Prettier, GitHub Actions |
| Infrastructure | GitHub Pages for static hosting, Worldchain for on-chain state |

## Repository structure

- `src/`: Web client source organised into features and shared libraries.
- `assets/`: Static art for buildings, resources, and units.
- `configs/`: JSON definitions that describe buildings, resources, and unit metadata.
- `contracts/`: Foundry workspace containing diamond proxy core, facets, and deployment scripts.
- `docs/`: Living documentation mirrored to the GitHub wiki via automation.
- `.github/workflows/`: CI pipelines for linting, deployment, contracts, and documentation.

## Cross-cutting concerns

- **State management**: Persistent Zustand stores maintain UI preferences and player progress across sessions using IndexedDB persistence.
- **World App integration**: `MiniKit` powers transaction execution with gas sponsorship while `wagmi`/`viem` supply RPC calls.
- **Audio and UX**: Async-loaded assets keep the initial bundle slim; global settings manage volume and tutorial progression.
- **Contracts**: A diamond proxy routes execution to modular facets, enabling upgrades without redeploying the entire system.

## When to update the docs

Update this overview whenever any of the following change:

- Core gameplay loop or resource system.
- Technology stack choices or tooling.
- Repository layout, especially when moving or renaming major folders.
- Supported deployment targets or integrations.
