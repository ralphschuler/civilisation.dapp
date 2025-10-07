# Milestone 0: Project Audit & Alignment

## Purpose

Establish a shared understanding of the current implementation, surface missing artifacts, and align the team on the design pillars for the Civilization 4X-light experience described in the vision brief.

## Current Coverage

- Frontend stack, routing shell, and provider hierarchy documented in `/docs`, with working screens for village, world map, units, reports, and auxiliary flows wired through Zustand stores and hooks. [Refs: `docs/overview.md`, `docs/frontend.md`, `src/App/index.tsx`]
- Core resource, building, and unit definitions exist in TypeScript via `src/data/gameData.ts` and JSON configs under `configs/`.
- On-chain resource collection bridge implemented through `useResourceGeneration`, integrating Worldchain wallet addresses and `resourceFacet` ABI calls.
- Zustand stores manage village, marches, player stats, and tech progression, backed by repository abstractions for persistence.
- Continuous integration now runs dedicated `test-app` and `test-contracts` workflows covering the Vitest and Foundry suites for the React app and smart contracts.

## Expected Outcomes

1. Comprehensive architectural audit summarised in `docs/overview.md` and linked wiki pages (frontend, contracts, workflows, glossary) updated for current realities.
2. Inventory of implemented screens, stores, and hooks mapped to the design pillars (One-Thumb flow, quick sessions, fairness, readability).
3. Gap analysis outlining missing features, technical debt, and doc discrepancies surfaced as GitHub issues or Notion tasks.
4. Decision log capturing technology or scope pivots agreed during the audit.

## Definition of Done

- All documentation pages referenced in `docs/index.md` reviewed and refreshed.
- Architecture diagram or sitemap added to the repo (SVG/PNG + source) highlighting data flow and shard interactions.
- Shared backlog workspace contains tickets tagged by loop (City / War / World) with owners or status placeholders.
- Cross-discipline workshop held to sign off milestone summary; notes committed or linked.

## Dependencies & Risks

- Requires availability of both gameplay and smart contract leads to validate assumptions.
- Documentation debt may exceed bandwidth; budget buffer time for asynchronous reviews.
- Missing telemetry or analytics may limit ability to quantify engagement baselines.
