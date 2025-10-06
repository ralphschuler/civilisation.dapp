# Frontend Architecture

The Civilisation DApp frontend is a single-page application built with React and Vite. It prioritises fast load times, offline readiness, and seamless integration with the World App WebView.

## Application shell

- **Entry point**: `src/main.tsx` sets up the React root, mounts the app, and wires global providers (routing, theme, stores).
- **Routing**: Vite's file-based router is not used; navigation relies on in-app state machines and modals because the WebView runs in a single-page environment.
- **Styling**: Tailwind CSS (configured via `postcss.config.cjs`) defines utility-first styling, with component-specific overrides where necessary.

## State management

- **Zustand stores** (located under `src/store/` and `src/features/**/store.ts`) hold gameplay and UI state.
- **Persistence**: The `persist` middleware writes selected slices to IndexedDB so that tutorial progress, preferences, and settlement state survive reloads.
- **Selectors**: Components consume minimal state through selectors to avoid unnecessary re-renders. Follow the pattern used in `src/hooks/useStoreSelector.ts`.

## Data sources

- **Configurations**: Static JSON files in `configs/` define the canonical list of buildings, resources, and units. They are imported at build time.
- **Worldchain**: `wagmi` and `viem` provide contract reads. Transactions are executed through the World App MiniKit integration, which exposes `sendTransaction` APIs inside the WebView.
- **Audio**: Preloaded via dynamic imports to keep the initial bundle slim.

## UI composition

- **Components**: Shared UI primitives live in `src/components/`. Feature-specific UIs sit under `src/features/<feature-name>/`.
- **Hooks**: Reusable logic is centralised under `src/hooks/` (e.g., for timers, resource production, battle resolution).
- **Assets**: Images and sprites are stored in `assets/` and referenced through Vite's asset handling.

## Error handling

- Network and contract errors propagate through custom hooks that translate RPC failures into player-friendly messaging.
- Global error boundaries in `src/components/ErrorBoundary.tsx` capture unexpected runtime issues and surface retry options.

## Testing strategy

- **Unit tests**: Implemented with Vitest (Bun-compatible). Place tests alongside components using the `.test.tsx` suffix.
- **Interaction tests**: Use React Testing Library to verify complex UI flows.
- **Storybook**: Stories double as documentation and manual test beds. Keep them synchronised with component props.

## Performance guidelines

- Lazy-load heavyweight screens and modals using `React.lazy`.
- Memoise expensive calculations (e.g., resource production) with `useMemo` or dedicated selectors.
- Monitor bundle size via `bun run build -- --analyze` before major releases.

## Accessibility

- Provide keyboard navigation for all interactive components.
- Use `aria-` attributes on modals and forms.
- Prefer semantic HTML for lists, tables, and headings.

## When contributing

1. Co-locate state and UI with the feature to keep modules cohesive.
2. Document any new configuration schema fields inside `configs/README.md` (create if missing).
3. Update this page when adding new cross-cutting libraries or changing the store architecture.
