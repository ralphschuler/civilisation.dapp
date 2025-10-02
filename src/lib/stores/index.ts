/**
 * Store exports - Central export point for all Zustand stores
 */

export { useGameStore } from './GameStore';
export { useVillageStore } from './VillageStore';
export { useMarchStore } from './MarchStore';
export { useReportStore } from './ReportStore';
export { usePlayerStatsStore } from './PlayerStatsStore';
export { useTechTreeStore } from './TechTreeStore';

/**
 * Initialize all stores
 * Call this on app startup
 */
export async function initializeStores() {
  const { useGameStore } = await import('./GameStore');
  const { useVillageStore } = await import('./VillageStore');
  const { useMarchStore } = await import('./MarchStore');
  const { useReportStore } = await import('./ReportStore');
  const { usePlayerStatsStore } = await import('./PlayerStatsStore');
  const { useTechTreeStore } = await import('./TechTreeStore');

  // Initialize game store
  await useGameStore.getState().initialize();

  // Load initial data
  await Promise.all([
    useVillageStore.getState().loadVillage('village1'),
    useMarchStore.getState().loadMarches(),
    useMarchStore.getState().loadMarchPresets(),
    useReportStore.getState().loadReports(),
    usePlayerStatsStore.getState().loadStats(),
    useTechTreeStore.getState().loadTechTree()
  ]);

  console.log('✅ All stores initialized');
}

/**
 * Reset all stores
 * Useful for testing or logout
 */
export function resetAllStores() {
  const { useGameStore } = require('./GameStore');
  const { useVillageStore } = require('./VillageStore');
  const { useMarchStore } = require('./MarchStore');
  const { useReportStore } = require('./ReportStore');
  const { usePlayerStatsStore } = require('./PlayerStatsStore');
  const { useTechTreeStore } = require('./TechTreeStore');

  useGameStore.getState().reset();
  useVillageStore.getState().reset();
  useMarchStore.getState().reset();
  useReportStore.getState().reset();
  usePlayerStatsStore.getState().reset();
  useTechTreeStore.getState().reset();

  console.log('🔄 All stores reset');
}