import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface Building {
  level: number;
  upgrading?: {
    targetLevel: number;
    completionTime: number;
  };
}

export interface Village {
  id: string;
  name: string;
  x: number;
  y: number;
  buildings: Record<string, Building>;
  resources: Record<string, number>;
  army: Record<string, number>;
}

export interface GameState {
  village: Village;
  selectedBuilding: string | null;
  isLoading: boolean;
  error: string | null;
}

interface GameActions {
  setSelectedBuilding: (buildingId: string | null) => void;
  upgradeBuilding: (buildingId: string) => Promise<void>;
  collectResources: () => void;
  trainUnit: (unitType: string, quantity: number) => Promise<void>;
  setError: (error: string | null) => void;
  setLoading: (loading: boolean) => void;
}

const INITIAL_VILLAGE: Village = {
  id: 'village1',
  name: 'Mein Dorf',
  x: 200,
  y: 200,
  resources: {
    wood: 1200,
    clay: 1000,
    iron: 800,
    population: 30,
    maxPopulation: 240,
    gold: 100
  },
  buildings: {
    headquarters: { level: 1 },
    barracks: { level: 1 },
    timberCamp: { level: 1 },
    clayPit: { level: 1 },
    ironMine: { level: 1 },
    storage: { level: 1 },
    wall: { level: 0 }
  },
  army: {
    spearman: 0,
    swordsman: 0,
    archer: 0,
    cavalry: 0
  }
};

export const useGameStore = create<GameState & GameActions>()(
  persist(
    (set, get) => ({
      // State
      village: INITIAL_VILLAGE,
      selectedBuilding: null,
      isLoading: false,
      error: null,

      // Actions
      setSelectedBuilding: (buildingId) => {
        set({ selectedBuilding: buildingId });
      },

      upgradeBuilding: async (buildingId) => {
        const { village } = get();
        const building = village.buildings[buildingId];
        
        if (!building) {
          set({ error: `Gebäude ${buildingId} nicht gefunden` });
          return;
        }

        if (building.upgrading) {
          set({ error: 'Gebäude wird bereits ausgebaut' });
          return;
        }

        // Calculate upgrade cost (simplified)
        const upgradeCost = {
          wood: building.level * 100,
          clay: building.level * 80,
          iron: building.level * 60
        };

        // Check resources
        if (village.resources.wood < upgradeCost.wood ||
            village.resources.clay < upgradeCost.clay ||
            village.resources.iron < upgradeCost.iron) {
          set({ error: 'Nicht genügend Ressourcen für den Ausbau' });
          return;
        }

        set({ isLoading: true, error: null });

        try {
          // Simulate upgrade time (1 minute per level)
          const upgradeTime = building.level * 60 * 1000;
          const completionTime = Date.now() + upgradeTime;

          // Deduct resources and start upgrade
          const updatedVillage = {
            ...village,
            resources: {
              ...village.resources,
              wood: village.resources.wood - upgradeCost.wood,
              clay: village.resources.clay - upgradeCost.clay,
              iron: village.resources.iron - upgradeCost.iron
            },
            buildings: {
              ...village.buildings,
              [buildingId]: {
                ...building,
                upgrading: {
                  targetLevel: building.level + 1,
                  completionTime
                }
              }
            }
          };

          set({ village: updatedVillage });

          // Complete upgrade after time
          setTimeout(() => {
            const currentState = get();
            const currentBuilding = currentState.village.buildings[buildingId];
            
            if (currentBuilding?.upgrading) {
              const finalVillage = {
                ...currentState.village,
                buildings: {
                  ...currentState.village.buildings,
                  [buildingId]: {
                    level: currentBuilding.upgrading.targetLevel,
                    upgrading: undefined
                  }
                }
              };
              
              set({ village: finalVillage });
            }
          }, upgradeTime);

        } catch (error) {
          set({ error: 'Fehler beim Ausbau des Gebäudes' });
        } finally {
          set({ isLoading: false });
        }
      },

      collectResources: () => {
        const { village } = get();
        
        // Simple resource collection (add 10% of current resources)
        const updatedResources = {
          ...village.resources,
          wood: Math.floor(village.resources.wood * 1.1),
          clay: Math.floor(village.resources.clay * 1.1),
          iron: Math.floor(village.resources.iron * 1.1)
        };

        set({
          village: {
            ...village,
            resources: updatedResources
          }
        });
      },

      trainUnit: async (unitType, quantity) => {
        const { village } = get();
        
        // Simple unit training cost
        const unitCost = {
          spearman: { wood: 50, clay: 30, iron: 20, population: 1 },
          swordsman: { wood: 30, clay: 30, iron: 70, population: 1 },
          archer: { wood: 80, clay: 10, iron: 10, population: 1 },
          cavalry: { wood: 100, clay: 50, iron: 150, population: 3 }
        };

        const cost = unitCost[unitType as keyof typeof unitCost];
        if (!cost) {
          set({ error: `Unbekannter Einheitentyp: ${unitType}` });
          return;
        }

        const totalCost = {
          wood: cost.wood * quantity,
          clay: cost.clay * quantity,
          iron: cost.iron * quantity,
          population: cost.population * quantity
        };

        // Check resources
        if (village.resources.wood < totalCost.wood ||
            village.resources.clay < totalCost.clay ||
            village.resources.iron < totalCost.iron ||
            village.resources.population < totalCost.population) {
          set({ error: 'Nicht genügend Ressourcen für die Ausbildung' });
          return;
        }

        set({ isLoading: true, error: null });

        try {
          const updatedVillage = {
            ...village,
            resources: {
              ...village.resources,
              wood: village.resources.wood - totalCost.wood,
              clay: village.resources.clay - totalCost.clay,
              iron: village.resources.iron - totalCost.iron,
              population: village.resources.population - totalCost.population
            },
            army: {
              ...village.army,
              [unitType]: (village.army[unitType] || 0) + quantity
            }
          };

          set({ village: updatedVillage });
        } catch (error) {
          set({ error: 'Fehler bei der Einheitenausbildung' });
        } finally {
          set({ isLoading: false });
        }
      },

      setError: (error) => set({ error }),
      setLoading: (loading) => set({ isLoading: loading })
    }),
    {
      name: 'civilisation-game-storage',
      partialize: (state) => ({
        village: state.village
      })
    }
  )
);
