/**
 * TechTree Store - Manages technology tree using Zustand
 * Interacts with repositories for persistence
 */

import { create } from 'zustand';
import { devtools } from 'zustand/middleware';

import { BuildingId, TechTree, UnitId } from '@/types/game';
import { getRepository } from '@/lib/repositories/RepositoryFactory';

type SmithyLine = 'inf' | 'cav' | 'ranged' | 'siege';
type SmithyStat = 'attack' | 'defense';

interface TechTreeState {
  techTree: TechTree | null;
  isLoading: boolean;
  error: string | null;
  loadTechTree: () => Promise<void>;
  updateTechTree: (techTree: TechTree) => Promise<void>;
  unlockBuilding: (buildingId: BuildingId) => Promise<void>;
  unlockUnit: (unitId: UnitId) => Promise<void>;
  upgradeSmithyLine: (line: SmithyLine, stat: SmithyStat) => Promise<void>;
  advanceEra: (era: TechTree['era']) => Promise<void>;
  isBuildingUnlocked: (buildingId: BuildingId) => boolean;
  isUnitUnlocked: (unitId: UnitId) => boolean;
  reset: () => void;
}

export const useTechTreeStore = create<TechTreeState>()(
  devtools(
    (set, get) => ({
      techTree: null,
      isLoading: false,
      error: null,
      loadTechTree: async () => {
        set({ isLoading: true, error: null });
        try {
          const repository = getRepository();
          const techTree = await repository.techTree.getTechTree();
          set({ techTree, isLoading: false });
        } catch (error) {
          set({
            error: error instanceof Error ? error.message : 'Failed to load tech tree',
            isLoading: false,
          });
        }
      },
      updateTechTree: async (techTree: TechTree) => {
        try {
          const repository = getRepository();
          await repository.techTree.updateTechTree(techTree);
          set({ techTree });
        } catch (error) {
          set({
            error: error instanceof Error ? error.message : 'Failed to update tech tree',
          });
        }
      },
      unlockBuilding: async (buildingId: BuildingId) => {
        try {
          const repository = getRepository();
          await repository.techTree.unlockBuilding(buildingId);
          const techTree = await repository.techTree.getTechTree();
          set({ techTree });
        } catch (error) {
          set({
            error: error instanceof Error ? error.message : 'Failed to unlock building',
          });
        }
      },
      unlockUnit: async (unitId: UnitId) => {
        try {
          const repository = getRepository();
          await repository.techTree.unlockUnit(unitId);
          const techTree = await repository.techTree.getTechTree();
          set({ techTree });
        } catch (error) {
          set({
            error: error instanceof Error ? error.message : 'Failed to unlock unit',
          });
        }
      },
      upgradeSmithyLine: async (line: SmithyLine, stat: SmithyStat) => {
        try {
          const repository = getRepository();
          await repository.techTree.upgradeSmithyLine(line, stat);
          const techTree = await repository.techTree.getTechTree();
          set({ techTree });
        } catch (error) {
          set({
            error: error instanceof Error ? error.message : 'Failed to upgrade smithy line',
          });
        }
      },
      advanceEra: async (era: TechTree['era']) => {
        try {
          const repository = getRepository();
          await repository.techTree.advanceEra(era);
          const techTree = await repository.techTree.getTechTree();
          set({ techTree });
        } catch (error) {
          set({
            error: error instanceof Error ? error.message : 'Failed to advance era',
          });
        }
      },
      isBuildingUnlocked: (buildingId: BuildingId) => {
        const { techTree } = get();
        return techTree?.unlockedBuildings.includes(buildingId) ?? false;
      },
      isUnitUnlocked: (unitId: UnitId) => {
        const { techTree } = get();
        return techTree?.unlockedUnits.includes(unitId) ?? false;
      },
      reset: () => {
        set({ techTree: null, isLoading: false, error: null });
      },
    }),
    { name: 'TechTreeStore' },
  ),
);
