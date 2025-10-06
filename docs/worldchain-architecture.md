# Worldchain Architecture & Best Practices

The Civilisation DApp integrates tightly with Worldchain to deliver verifiable gameplay while maintaining a smooth user experience inside the World App. This document summarises how on-chain and off-chain components interact and lists best practices for future development.

## Execution environment

- **World App WebView**: Hosts the React frontend and provides MiniKit APIs for wallet, identity, and transaction flows.
- **Worldchain**: Acts as the settlement layer. All authoritative game mutations occur through smart contract calls.
- **MiniKit**: Abstracts transaction submission, sponsoring gas for end users and handling session keys when available.

## Data flow

1. The frontend reads static configuration from `configs/` and caches player state in IndexedDB.
2. When a player performs an action (e.g., constructs a building), the frontend executes a MiniKit `sendTransaction` call targeting the relevant facet.
3. The contract validates the action, updates storage, and emits events.
4. The frontend listens for confirmations and updates local state, reconciling with on-chain data when necessary.

## Best practices

- **Deterministic rules**: Keep all game rules that affect fairness on-chain. Off-chain calculations must be reproducible and validated by smart contracts.
- **Session security**: Use MiniKit session keys to avoid re-authentication loops while enforcing strict scopes.
- **Gas efficiency**: Batch resource updates and use compact storage structs to keep gas costs low.
- **Event design**: Emit detailed events after every state change so off-chain indexers can reconstruct player progress.
- **Versioning**: Expose contract version numbers via view functions to help the frontend adapt to upgrades.

## Network configuration

- Default RPC endpoints are provided via environment variables (`VITE_PUBLIC_RPC_URL` if required). Keep private keys and secrets in GitHub Action secrets or `.env.local`, never commit them.
- For testing, use `anvil` or Worldchain test environments and configure MiniKit with sandbox credentials.

## Observability

- Integrate with analytics or logging providers that respect player privacy (e.g., anonymised telemetry).
- Monitor key contract functions with on-chain dashboards and set alerts for anomalies such as sudden spikes in gas usage or failed transactions.

## Future enhancements

- Explore zkSync-style validity proofs for off-chain simulations.
- Investigate rollup-based scaling if Worldchain congestion impacts gameplay.
- Automate wiki updates whenever contract interfaces change (see [workflow automation](./workflows.md)).
