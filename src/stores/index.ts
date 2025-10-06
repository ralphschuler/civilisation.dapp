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

/**
 * Initialize all stores
 * Call this on app startup
 */
export async function initializeStores() {
  const { useGameStore } = await import('./gameStore');
  const { useVillageStore } = await import('./VillageStore');
  const { useMarchStore } = await import('./MarchStore');
  const { useReportStore } = await import('./ReportStore');
  const { usePlayerStatsStore } = await import('./PlayerStatsStore');
  const { useTechTreeStore } = await import('./TechTreeStore');

  await useGameStore.getState().initialize();

  await Promise.all([
    useVillageStore.getState().loadVillage('village1'),
    useMarchStore.getState().loadMarches(),
    useMarchStore.getState().loadMarchPresets(),
    useReportStore.getState().loadReports(),
    usePlayerStatsStore.getState().loadStats(),
    useTechTreeStore.getState().loadTechTree(),
  ]);

  console.log('✅ All stores initialized');
}

/**
 * Reset all stores
 * Useful for testing or logout
 */
export function resetAllStores() {
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const { useGameStore } = require('./gameStore');
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const { useVillageStore } = require('./VillageStore');
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const { useMarchStore } = require('./MarchStore');
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const { useReportStore } = require('./ReportStore');
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const { usePlayerStatsStore } = require('./PlayerStatsStore');
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const { useTechTreeStore } = require('./TechTreeStore');

  useGameStore.getState().reset();
  useVillageStore.getState().reset();
  useMarchStore.getState().reset();
  useReportStore.getState().reset();
  usePlayerStatsStore.getState().reset();
  useTechTreeStore.getState().reset();

  console.log('🔄 All stores reset');
}
