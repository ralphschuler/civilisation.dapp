Persistence Overview

- Storage: Uses `localStorage` in the WebView/browser to persist non-sensitive game data.
- Scope: The entire `GameState` from `useGameState` is saved under the key `civ_mobile_game_state`.
- Load: On app start, the hook hydrates from storage and merges with defaults for forward compatibility.
- Save: Debounced save (~800ms) on state changes, plus final save on `beforeunload`.

Notes

- WebView: World App’s WebView exposes `localStorage`, so data persists across sessions for this origin.
- Limits: `localStorage` is string-only and space-limited; do not store secrets.
- Offline tick: `lastUpdate` is persisted so resource production catches up after a restart.
- Migration: The storage key aligns with repository docs (`civ_mobile_game_state`) to enable future backend/repository swaps.

Key Files

- `src/lib/storage.ts`: Safe helpers to read/write JSON to `localStorage`.
- `src/hooks/useGameState.ts`: Hydrates + persists the game state.
- `src/components/screens/ReportsScreen.tsx`: Uses `useReportStore` (repository-backed) to load/save reports.
- `src/main.tsx`: Forces RepositoryFactory to use `localStorage` for persistence in all modes.
