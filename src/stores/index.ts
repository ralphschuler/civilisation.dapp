/**
 * Central export point for all Zustand stores
 */

export { useGameStore } from './gameStore';
export { useVillageStore } from './VillageStore';
export { useMarchStore } from './MarchStore';
export { useReportStore } from './ReportStore';
export { usePlayerStatsStore } from './PlayerStatsStore';
export { useTechTreeStore } from './TechTreeStore';
export { useAuthStore } from './authStore';
export { useUXStore } from './uxStore';

async function loadStores() {
  const [
    { useGameStore },
    { useVillageStore },
    { useMarchStore },
    { useReportStore },
    { usePlayerStatsStore },
    { useTechTreeStore },
  ] = await Promise.all([
    import('./gameStore'),
    import('./VillageStore'),
    import('./MarchStore'),
    import('./ReportStore'),
    import('./PlayerStatsStore'),
    import('./TechTreeStore'),
  ]);

  return {
    useGameStore,
    useVillageStore,
    useMarchStore,
    useReportStore,
    usePlayerStatsStore,
    useTechTreeStore,
  };
}

/**
 * Initialize all stores
 * Call this on app startup
 */
export async function initializeStores(): Promise<void> {
  const stores = await loadStores();

  await stores.useGameStore.getState().initialize();

  await Promise.all([
    stores.useVillageStore.getState().loadVillage('village1'),
    stores.useMarchStore.getState().loadMarches(),
    stores.useMarchStore.getState().loadMarchPresets(),
    stores.useReportStore.getState().loadReports(),
    stores.usePlayerStatsStore.getState().loadStats(),
    stores.useTechTreeStore.getState().loadTechTree(),
  ]);

  console.info('✅ All stores initialized');
}

/**
 * Reset all stores
 * Useful for testing or logout
 */
export async function resetAllStores(): Promise<void> {
  const stores = await loadStores();

  stores.useGameStore.getState().reset();
  stores.useVillageStore.getState().reset();
  stores.useMarchStore.getState().reset();
  stores.useReportStore.getState().reset();
  stores.usePlayerStatsStore.getState().reset();
  stores.useTechTreeStore.getState().reset();

  console.info('🔄 All stores reset');
}
