# Smart Contracts

The Civilisation DApp smart contracts are built with Solidity and organised as a diamond architecture managed through Foundry. This document outlines the layout, deployment process, and upgrade considerations.

## Directory layout

```
contracts/
├── foundry.toml          # Workspace configuration
├── script/               # Deployment and configuration scripts
├── src/
│   ├── core/             # Diamond proxy, loupe, ownership facets
│   ├── facets/           # Gameplay-specific facets (resources, buildings, battles)
│   └── libraries/        # Shared libraries for math, storage, and validation
└── test/                 # Forge unit and integration tests
```

## Diamond architecture

- **Proxy**: `Diamond.sol` implements the [EIP-2535](https://eips.ethereum.org/EIPS/eip-2535) diamond standard.
- **Facets**: Each gameplay domain (resources, armies, governance) lives in its own facet for modular upgrades.
- **Loupe**: `DiamondLoupeFacet.sol` exposes selectors for off-chain inspection.
- **Initialization**: `DiamondInit.sol` seeds storage with configuration IDs and initial parameters.

## Storage patterns

- Use dedicated storage libraries under `src/libraries/` to prevent slot collisions.
- Each facet accesses storage through `LibAppStorage` or more granular libraries.
- Never declare state variables directly inside facets.

## Testing

- Run `forge test --gas-report` regularly to track gas usage of critical flows.
- Use `forge snapshot` to capture baseline gas costs for regression detection.
- Integration tests should mock the MiniKit caller to simulate sponsored transactions.

## Deployment

1. Set secrets or environment variables required by scripts (RPC URLs, private keys, app IDs).
2. Execute `forge script script/Deploy.s.sol --broadcast --rpc-url <url>` to deploy the diamond and facets.
3. Verify contracts with `forge verify-contract` once deployment succeeds.
4. Update the frontend `.env` with the new diamond address and run the wiki deployment workflow to refresh docs.

## Upgrades

- Encode facet cuts using the provided helper library in `script/`.
- Review storage layout changes carefully; use `forge inspect <contract> storageLayout` before deploying upgrades.
- Document every upgrade in the [workflow reference](./workflows.md) and include migration steps for frontend state if necessary.

## Security practices

- Enforce access control via `LibDiamond.enforceIsContractOwner` or role-based modifiers.
- Validate all user inputs; never trust client-provided configuration IDs.
- Run `forge test --ffi` to execute script-driven invariants when available.
- Consider formal audits before mainnet (Worldchain) releases.

## When to update

Keep this page aligned with contract structure changes, new facets, or modified deployment scripts. For significant updates, create a changelog entry in the wiki summarising new mechanics and upgrade paths.
