/**
 * Game Store - Manages overall game state using Zustand
 * Orchestrates other stores and handles game logic
 */

import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';
import { GameState, ScreenType } from '@/types/game';
import { getRepository } from '../repositories/RepositoryFactory';

interface GameStoreState {
  // State
  currentScreen: ScreenType;
  selectedBuilding: string | null;
  selectedVillageInfo: any | null;
  isInitialized: boolean;
  isLoading: boolean;
  error: string | null;

  // Actions
  initialize: () => Promise<void>;
  saveGameState: (state: GameState) => Promise<void>;
  setCurrentScreen: (screen: ScreenType) => void;
  setSelectedBuilding: (buildingId: string | null) => void;
  setSelectedVillageInfo: (villageInfo: any | null) => void;
  reset: () => void;
}

export const useGameStore = create<GameStoreState>()(
  devtools(
    persist(
      (set, get) => ({
        // Initial State
        currentScreen: 'city',
        selectedBuilding: null,
        selectedVillageInfo: null,
        isInitialized: false,
        isLoading: false,
        error: null,

        // Actions
        initialize: async () => {
          if (get().isInitialized) return;

          set({ isLoading: true, error: null });
          try {
            const repository = getRepository();
            const gameState = await repository.gameState.getGameState();
            
            set({ 
              currentScreen: gameState.currentScreen || 'city',
              selectedBuilding: gameState.selectedBuilding || null,
              selectedVillageInfo: gameState.selectedVillageInfo || null,
              isInitialized: true,
              isLoading: false
            });
          } catch (error) {
            set({ 
              error: error instanceof Error ? error.message : 'Failed to initialize game',
              isLoading: false
            });
          }
        },

        saveGameState: async (state: GameState) => {
          try {
            const repository = getRepository();
            await repository.gameState.saveGameState(state);
          } catch (error) {
            set({ error: error instanceof Error ? error.message : 'Failed to save game state' });
          }
        },

        setCurrentScreen: (screen: ScreenType) => {
          set({ currentScreen: screen });
        },

        setSelectedBuilding: (buildingId: string | null) => {
          set({ selectedBuilding: buildingId });
        },

        setSelectedVillageInfo: (villageInfo: any | null) => {
          set({ selectedVillageInfo: villageInfo });
        },

        reset: () => {
          set({ 
            currentScreen: 'city',
            selectedBuilding: null,
            selectedVillageInfo: null,
            isInitialized: false,
            isLoading: false,
            error: null
          });
        }
      }),
      {
        name: 'game-storage',
        partialize: (state) => ({ 
          currentScreen: state.currentScreen,
          selectedBuilding: state.selectedBuilding
        })
      }
    ),
    { name: 'GameStore' }
  )
);