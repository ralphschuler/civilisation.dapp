# Milestone 1: Core City Loop

## Purpose
Deliver the foundational city-building experience covering resource generation, storage, upgrades, and time-gated progression while reinforcing the mobile-first UX pillars.

## Current Coverage
- Building, resource, and unit definitions aligned with the 9-resource / 14-building spec, already codified in `src/data/gameData.ts` and `configs/` JSON datasets.
- Village screen, resource panels, and storage calculations implemented in React with Zustand-driven state updates and upgrade flows (`VillageScreen`, `ResourcesScreen`, `useVillageStore`).
- Auto-production hook (`useResourceGeneration`) supports on-chain collection where contracts are available, falling back to local state otherwise.

## Expected Deliverables
1. Functional build queue with slot limits derived from Townhall level, including timers, speed-ups, and upgrade prerequisites.
2. Resource economy tuned to the provided balancing guidelines (production curves, upkeep, storage caps) with UI feedback when caps or upkeep bottlenecks hit.
3. Tutorial/onboarding flow guiding first-session players through building Farm, Storage, Barracks, and first unit training.
4. Offline progression simulation that accrues resources when users return, respecting storage caps and boosting via Coal events.
5. Accessibility and UX passes ensuring one-thumb navigation, swipe panels between City/World/Army, and responsive layout for sub-6" devices.

## Definition of Done
- End-to-end QA script covering Build → Produce → Upgrade → Collect is executable without manual data seeding.
- Analytics events emitted for major actions (upgrade start/completion, resource capped, tutorial milestones) with schema documented.
- Translations for all new strings available in `src/i18n` files with fallbacks verified.
- Unit tests for production/upkeep calculators and upgrade cost scaling added (`bun test` suite green).

## Dependencies & Risks
- Requires stable resource facet on-chain interface; if delayed, implement deterministic mock provider.
- Asset pipeline for building/unit art must be finalised to avoid placeholder churn.
- Balancing iteration could extend timeline; plan buffer for telemetry-driven adjustments.
