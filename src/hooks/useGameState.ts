/**
 * useGameState Hook - Refactored Version
 * 
 * This is a compatibility layer that wraps the new Zustand stores
 * to provide the same interface as the old useGameState hook.
 * 
 * This allows for gradual migration of components.
 * 
 * Usage:
 * 1. Rename /hooks/useGameState.ts to /hooks/useGameState.old.ts
 * 2. Rename this file from UseGameState.new.ts to useGameState.ts
 * 3. Components will work without changes
 * 4. Gradually migrate components to use stores directly
 */

import { useCallback } from 'react';
import {
  useGameStore,
  useVillageStore,
  useMarchStore,
  useReportStore,
  usePlayerStatsStore,
  useTechTreeStore
} from '../lib/stores';
import { GameState, Village, BuildingId, UnitId, VillageInfo, March, MarchPreset } from '../types/game';

/**
 * Legacy hook interface - provides same API as old useGameState
 * @deprecated Use individual stores directly for better performance
 */
export function useGameState() {
  // Get state from all stores
  const village = useVillageStore(state => state.village);
  const currentScreen = useGameStore(state => state.currentScreen);
  const selectedBuilding = useGameStore(state => state.selectedBuilding);
  const selectedVillageInfo = useGameStore(state => state.selectedVillageInfo);
  const playerStats = usePlayerStatsStore(state => state.stats);
  const techTree = useTechTreeStore(state => state.techTree);
  const marches = useMarchStore(state => state.marches);
  const marchPresets = useMarchStore(state => state.marchPresets);

  // Get actions from stores
  const setSelectedBuilding = useGameStore(state => state.setSelectedBuilding);
  const setCurrentScreen = useGameStore(state => state.setCurrentScreen);
  const setSelectedVillageInfo = useGameStore(state => state.setSelectedVillageInfo);

  const upgradeBuilding = useVillageStore(state => state.upgradeBuilding);
  const collectResources = useVillageStore(state => state.collectResources);

  const createMarch = useMarchStore(state => state.createMarch);
  const cancelMarch = useMarchStore(state => state.cancelMarch);
  const createMarchPreset = useMarchStore(state => state.createMarchPreset);
  const deleteMarchPreset = useMarchStore(state => state.deleteMarchPreset);

  // Wrapper for trainUnit (needs to be implemented in a store)
  const trainUnit = useCallback(async (unitId: UnitId, quantity: number) => {
    // TODO: Implement in VillageStore or create UnitStore
    console.warn('trainUnit not yet implemented in new store system');
  }, []);

  // Helper function
  const getTotalUncollectedResources = useCallback(() => {
    if (!village) return 0;
    const uncollected = village.uncollectedResources;
    return Object.values(uncollected).reduce((sum, amount) => sum + amount, 0);
  }, [village]);

  // Construct gameState object for backward compatibility
  const gameState: GameState | null = village && playerStats && techTree ? {
    village,
    selectedBuilding,
    selectedVillageInfo,
    currentScreen,
    playerStats,
    techTree,
    marches,
    marchPresets
  } : null;

  // Wrapper for upgradeBuilding to match old signature
  const upgradeBuildingWrapper = useCallback((buildingId: string) => {
    if (!village) return;
    const building = village.buildings[buildingId];
    if (!building) return;

    upgradeBuilding(buildingId, {
      ...building,
      upgrading: {
        targetLevel: building.level + 1,
        completionTime: Date.now() + 300000 // 5 minutes
      }
    });
  }, [village, upgradeBuilding]);

  // Wrapper functions to match old API
  const createMarchWrapper = useCallback(async (march: Omit<March, 'id'>) => {
    await createMarch(march);
  }, [createMarch]);

  const cancelMarchWrapper = useCallback(async (marchId: string) => {
    await cancelMarch(marchId);
  }, [cancelMarch]);

  const createMarchPresetWrapper = useCallback(async (preset: Omit<MarchPreset, 'id'>) => {
    await createMarchPreset(preset);
  }, [createMarchPreset]);

  const deleteMarchPresetWrapper = useCallback(async (presetId: string) => {
    await deleteMarchPreset(presetId);
  }, [deleteMarchPreset]);

  return {
    // State
    gameState: (gameState as GameState),

    // Actions
    upgradeBuilding: upgradeBuildingWrapper,
    trainUnit,
    setSelectedBuilding,
    setCurrentScreen,
    collectResources,
    getTotalUncollectedResources,
    setSelectedVillageInfo,
    createMarch: createMarchWrapper,
    cancelMarch: cancelMarchWrapper,
    createMarchPreset: createMarchPresetWrapper,
    deleteMarchPreset: deleteMarchPresetWrapper,
  };
}

/**
 * Modern hook - use stores directly for better performance
 * @example
 * ```typescript
 * // Instead of:
 * const { gameState, upgradeBuilding } = useGameState();
 * 
 * // Use:
 * const village = useVillageStore(state => state.village);
 * const upgradeBuilding = useVillageStore(state => state.upgradeBuilding);
 * ```
 */
export function useModernGameState() {
  console.warn(
    'useModernGameState is deprecated. ' +
    'Import stores directly: import { useVillageStore } from "@/lib/stores"'
  );

  return {
    useVillageStore,
    useMarchStore,
    useReportStore,
    usePlayerStatsStore,
    useTechTreeStore,
    useGameStore
  };
}
