# Milestone 2: War & World Systems

## Purpose
Unlock the asynchronous PvP core through scouting, marching, and territorial control across shard-based provinces while establishing the counter-based combat meta.

## Current Coverage
- March planner, reports, and unit roster screens scaffolded with Zustand stores (`useMarchStore`, `MarchPlannerScreen`, `MarchReportsScreen`).
- Unit definitions follow the 10-unit roster with counter relationships implied in game data and UI placeholders.
- World map screen exists with village selection callbacks and placeholder province interactions.

## Expected Deliverables
1. March lifecycle implementation: queue, travel timers, combat resolution, loot distribution, and report generation with "Why did I lose?" insights.
2. Scouting & fog-of-war: scout missions reveal province info, watchtower-style visibility zones, and counterplay.
3. Province control mechanics: neutral camps, resource tiles, ruins, and alliance territories with shard-specific bonuses.
4. Alliance system MVP: join/leave flows, shared chat, alliance-wide buffs, and province ownership tracking.
5. Siege mechanics: walls, rams, trebuchets, loyalty reduction, and conquest win conditions aligned with design pillars.

## Definition of Done
- Combat resolver implemented with deterministic outcomes, unit counter logic, wall scaling, and tech modifiers covered by simulation tests.
- March reports surface counter breakdown, terrain effects, morale, and actionable recommendations.
- Province map supports pinch/zoom and one-thumb navigation with performance validated on target devices.
- Backend or contract interfaces for marches documented (ABI, endpoints) with integration tests hitting testnet/staging.

## Dependencies & Risks
- Requires combat math specifications and validation from design to avoid rework.
- Alliance and chat features may depend on external services; evaluate privacy/compliance implications early.
- Map rendering performance may require WebGL or canvas optimisation; plan prototyping time.
