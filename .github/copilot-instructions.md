# Civilisation DApp – Copilot Guide

## Project map
- `src/App/index.tsx` wires the mobile-first router inside `GameLayout`; individual screens live in `src/components/screens/**` and expect props pulled from the stores.
- `src/providers/index.tsx` stacks runtime providers (Eruda ➜ MiniKit ➜ HashRouter ➜ React Query ➜ i18n ➜ Stores). `StoresProvider` blocks rendering until `initializeStores()` has hydrated Zustand.
- `src/lib/stores/**` contains the Zustand modules documented in `src/lib/stores/README.md`. Always select slices (`useVillageStore(state => …)`) and use the provided actions/reset hooks so persistence and devtools keep working.
- Persistence sits behind `src/lib/repositories/**`. `RepositoryFactory` chooses between the in-memory `MockRepository` and the browser-backed `LocalStorageRepository`; `src/main.tsx` forces `localStorage` even in dev so progress survives reloads.

## State & data flow
- `useGameState()` is a compatibility wrapper around the new stores; prefer grabbing data/actions straight from `useVillageStore`, `useMarchStore`, etc. The wrapper still exposes a TODO `trainUnit`, so new unit features belong in the stores.
- Stores never touch `localStorage` directly—mutate a cloned slice and hand it to the repository-backed action (`updateVillage`, `createMarch`, …) to keep side effects consistent.
- Resource, building, and unit math lives in `src/data/gameData.ts` (see `BUILDING_TYPES`, `UNIT_TYPES`, `calculateStorageCapacity`). The JSON under `configs/**` and sprite map in `src/data/assetConfig.ts` must stay in sync when adding or renaming entities.

## UI conventions
- Styling runs through Tailwind v4 tokens declared in `src/globals.css` (light/dark palettes, spacing, typography). Reuse `components/ui/*` primitives (`Card`, `Button`, `Tabs`, …) and the `cn()` helper instead of hand-rolled class strings.
- Layout targets a max-width mobile viewport: `GameLayout` centers content, pins `GameHeader` on top, and `MobileNavigation` at the bottom. New screens should conform to this pattern and receive data via props.

## Routing, auth, providers
- Routing uses `HashRouter` to satisfy the World App WebView; mount new routes beneath `<GameLayout/>`. Guard authenticated areas with `ProtectedRoute` (`/wallet-connect` handles MiniKit login via `useAuthStore`).
- `ClientProvider` wraps everything in an `ErrorBoundary`; pass a custom `fallback` when adding risky async features. Eruda devtools are auto-enabled in browsers, so skip bespoke console overlays.

## Workflows & tooling
- Bun is the package manager: `bun install`, `bun run dev`, `bun run build`, `bun run preview`. Storybook lives at `bun run storybook`. Lint frontend code with `bun run lint:ts`; smart-contract linting is `bun run lint:sol`.
- Contracts live under `contracts/` (Foundry + Diamond). Use `cd contracts && forge build/test`; deployment scripts (`contracts/script/00_Deploy.s.sol`) rely on Foundry FFI to enumerate facet files.
- Formatting is enforced by Biome (`biome.config.json`); keep TypeScript and Solidity changes Biome-friendly to avoid CI churn.

## Testing & data seeding
- There are no frontend unit tests yet—lean on the Storybook stories in `src/components/**.stories.tsx` and manual QA. For future tests, call `resetAllStores()` and switch repositories via `RepositoryFactory.switchTo('mock')` for deterministic fixtures.
- Sample reports and march data live in `src/data/mockReports.ts`; prefer extending these mocks over inventing ad hoc payloads.

## Internationalisation & env
- Localisation comes from `src/i18n/locales/{de,en}.ts` through `useI18n()`. Register keys before calling `t('path.key')`; missing keys fall back to the lookup string, making typos obvious.
- MiniKit needs `VITE_PUBLIC_APP_ID`; routing prefixes come from `NEXT_PUBLIC_BASE_PATH` (GitHub Pages). Access env values via `import.meta.env` only.

## Performance notes
- Expensive views like `WorldMapScreen` depend on memoised chunk generation and the `generatedVillages` cache—preserve those hooks when modifying map logic.
- When adding new build/resource flows, prefer deriving totals with helpers such as `calculateStorageCapacity` and `calculateResourceProduction` to avoid desyncing UI and persistence.
