/**
 * PlayerStats Store - Manages player statistics using Zustand
 * Interacts with repositories for persistence
 */

import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import { PlayerStats } from '@/types/game';
import { getRepository } from '../repositories/RepositoryFactory';

interface PlayerStatsState {
  // State
  stats: PlayerStats | null;
  isLoading: boolean;
  error: string | null;

  // Actions
  loadStats: () => Promise<void>;
  updateStats: (stats: PlayerStats) => Promise<void>;
  incrementBattlesWon: () => Promise<void>;
  incrementBattlesLost: () => Promise<void>;
  incrementBuildingsUpgraded: () => Promise<void>;
  incrementUnitsTrained: (count: number) => Promise<void>;
  addResourcesGathered: (resources: Partial<PlayerStats['totalResourcesGathered']>) => Promise<void>;
  incrementPlaytime: (seconds: number) => void;
  reset: () => void;
}

export const usePlayerStatsStore = create<PlayerStatsState>()(
  devtools(
    (set, get) => ({
      // Initial State
      stats: null,
      isLoading: false,
      error: null,

      // Actions
      loadStats: async () => {
        set({ isLoading: true, error: null });
        try {
          const repository = getRepository();
          const stats = await repository.playerStats.getStats();
          set({ stats, isLoading: false });
        } catch (error) {
          set({ 
            error: error instanceof Error ? error.message : 'Failed to load stats',
            isLoading: false
          });
        }
      },

      updateStats: async (stats: PlayerStats) => {
        try {
          const repository = getRepository();
          await repository.playerStats.updateStats(stats);
          set({ stats });
        } catch (error) {
          set({ error: error instanceof Error ? error.message : 'Failed to update stats' });
        }
      },

      incrementBattlesWon: async () => {
        try {
          const repository = getRepository();
          await repository.playerStats.incrementBattlesWon();
          const stats = await repository.playerStats.getStats();
          set({ stats });
        } catch (error) {
          set({ error: error instanceof Error ? error.message : 'Failed to increment battles won' });
        }
      },

      incrementBattlesLost: async () => {
        try {
          const repository = getRepository();
          await repository.playerStats.incrementBattlesLost();
          const stats = await repository.playerStats.getStats();
          set({ stats });
        } catch (error) {
          set({ error: error instanceof Error ? error.message : 'Failed to increment battles lost' });
        }
      },

      incrementBuildingsUpgraded: async () => {
        try {
          const repository = getRepository();
          await repository.playerStats.incrementBuildingsUpgraded();
          const stats = await repository.playerStats.getStats();
          set({ stats });
        } catch (error) {
          set({ error: error instanceof Error ? error.message : 'Failed to increment buildings upgraded' });
        }
      },

      incrementUnitsTrained: async (count: number) => {
        try {
          const repository = getRepository();
          await repository.playerStats.incrementUnitsTrained(count);
          const stats = await repository.playerStats.getStats();
          set({ stats });
        } catch (error) {
          set({ error: error instanceof Error ? error.message : 'Failed to increment units trained' });
        }
      },

      addResourcesGathered: async (resources: Partial<PlayerStats['totalResourcesGathered']>) => {
        try {
          const repository = getRepository();
          await repository.playerStats.addResourcesGathered(resources);
          const stats = await repository.playerStats.getStats();
          set({ stats });
        } catch (error) {
          set({ error: error instanceof Error ? error.message : 'Failed to add resources gathered' });
        }
      },

      incrementPlaytime: (seconds: number) => {
        const { stats } = get();
        if (!stats) return;

        const updatedStats = {
          ...stats,
          playtime: stats.playtime + seconds
        };

        get().updateStats(updatedStats);
      },

      reset: () => {
        set({ stats: null, isLoading: false, error: null });
      }
    }),
    { name: 'PlayerStatsStore' }
  )
);