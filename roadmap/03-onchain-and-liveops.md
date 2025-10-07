# Milestone 3: On-Chain Progression & Live Ops

## Purpose
Strengthen trustless gameplay by migrating critical systems on-chain and prepare for live operations with events, telemetry, and economy balancing levers.

## Current Coverage
- Worldchain integration scaffolded through `wagmi`, `MiniKit`, and provider wrappers (`src/providers/wagmi-provider.tsx`, `src/providers/minikit-provider.tsx`).
- Resource facet ABI and collection flow already wired for hybrid on-chain/off-chain resource handling (`useResourceGeneration`).
- Contracts workspace (`/contracts`) includes diamond pattern setup ready for additional gameplay facets.

## Expected Deliverables
1. On-chain enforcement for key systems: building upgrades, unit training, marches, and alliance governance using modular facets.
2. Migration plan for existing client-side persistence to sync with contract state, including conflict resolution and versioning.
3. Event system enabling time-limited boosts (Coal efficiency, festivals) managed through contract configuration or admin dashboards.
4. Telemetry + analytics pipeline (e.g., Segment/PostHog) capturing engagement, economy metrics, and churn signals with dashboards for live ops.
5. Incident response playbooks covering contract pauses, rollback strategies, and communication templates.

## Definition of Done
- Smart contract test suite (Foundry) covers new facets with invariant checks and simulation scenarios.
- Frontend gracefully handles degraded network or paused contracts with user-friendly messaging.
- Deployment scripts and environment configs updated for staging/mainnet parity; runbooks stored in `/docs`.
- Live ops calendar template created with event definitions, asset needs, and localization requirements.

## Dependencies & Risks
- Gas sponsorship and MiniKit capabilities may limit complex on-chain loops; validate feasibility early.
- Contract upgrades require audit; budget for external review cycles.
- Analytics integrations must respect player privacy and platform policies (World App guidelines, GDPR).
