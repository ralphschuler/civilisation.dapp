import { useState, useEffect, useCallback } from 'react';
import { GameState, Village, Resources, UncollectedResources, PlayerStats, VillageInfo, BuildingId, March, MarchPreset } from '../types/game';
import { BUILDING_TYPES, calculateResourceProduction, calculateStorageCapacity, calculatePopulationCapacity, calculateBuildingCost } from '../data/gameData';

const INITIAL_VILLAGE: Village = {
  id: 'village1',
  name: 'Mein Dorf',
  x: 200,
  y: 200,
  resources: {
    bread: 100,
    clay: 1000,
    coal: 500,
    gold: 100,
    iron: 800,
    meat: 200,
    villager: 30,
    wheat: 500,
    wood: 1200,
    maxPopulation: 240
  },
  uncollectedResources: {
    bread: 0,
    clay: 0,
    coal: 0,
    gold: 0,
    iron: 0,
    meat: 0,
    villager: 0,
    wheat: 0,
    wood: 0
  },
  buildings: {
    townhall: { type: 'townhall', level: 1 },
    bakery: { type: 'bakery', level: 1 },
    barracks: { type: 'barracks', level: 0 },
    claypit: { type: 'claypit', level: 1 },
    coalpit: { type: 'coalpit', level: 0 },
    fisher: { type: 'fisher', level: 1 },
    ironmine: { type: 'ironmine', level: 1 },
    farm: { type: 'farm', level: 1 },
    house: { type: 'house', level: 1 },
    huntershut: { type: 'huntershut', level: 1 },
    market: { type: 'market', level: 1 },
    storage: { type: 'storage', level: 1 },
    wall: { type: 'wall', level: 0 },
    woodcutter: { type: 'woodcutter', level: 1 }
  },
  army: {
    spearman: 0,
    swordsman: 0,
    archer: 0,
    knight: 0,
    trebuchet: 0
  },
  trainingQueue: [],
  lastUpdate: Date.now()
};

const INITIAL_STATS: PlayerStats = {
  totalResourcesGathered: {
    bread: 0,
    clay: 0,
    coal: 0,
    gold: 0,
    iron: 0,
    meat: 0,
    villager: 0,
    wheat: 0,
    wood: 0
  },
  totalUnitsTrained: 0,
  totalBuildingsUpgraded: 0,
  battlesWon: 0,
  battlesLost: 0,
  playtime: 0
};

const INITIAL_STATE: GameState = {
  village: INITIAL_VILLAGE,
  selectedBuilding: null,
  selectedVillageInfo: null,
  currentScreen: 'city',
  playerStats: INITIAL_STATS,
  techTree: {
    era: 'village',
    unlockedBuildings: ['townhall', 'house', 'farm', 'woodcutter', 'claypit'],
    unlockedUnits: ['spearman', 'archer'],
    smithyUpgrades: {
      inf: { attack: 0, defense: 0 },
      cav: { attack: 0, defense: 0 },
      ranged: { attack: 0, defense: 0 },
      siege: { attack: 0, defense: 0 }
    }
  },
  marches: [],
  marchPresets: [
    {
      id: 'default-raid',
      name: 'Schneller Raid',
      description: 'Optimiert für schnelle Plünderungen',
      army: {
        spearman: 50,
        swordsman: 30,
        axeman: 20,
        archer: 40,
        crossbow: 0,
        lightcav: 20,
        knight: 0,
        pikeman: 0,
        ram: 0,
        trebuchet: 0
      },
      attackType: 'raid',
      isDefault: true
    }
  ]
};

export function useGameState() {
  const [gameState, setGameState] = useState<GameState>(INITIAL_STATE);

  // Update resources based on production
  useEffect(() => {
    const updateResources = () => {
      setGameState(prev => {
        const now = Date.now();
        const timeDiff = (now - prev.village.lastUpdate) / 1000; // seconds
        
        if (timeDiff < 1) return prev; // Update at most once per second

        const village = prev.village;
        const newResources = { ...village.resources };
        const newUncollectedResources = { ...village.uncollectedResources };

        // Calculate production per second
        const totalProduction = calculateResourceProduction(village.buildings);
        const woodProduction = (totalProduction.wood || 0) / 3600;
        const clayProduction = (totalProduction.clay || 0) / 3600;
        const ironProduction = (totalProduction.iron || 0) / 3600;
        const coalProduction = (totalProduction.coal || 0) / 3600;
        const wheatProduction = (totalProduction.wheat || 0) / 3600;
        const breadProduction = (totalProduction.bread || 0) / 3600;
        const meatProduction = (totalProduction.meat || 0) / 3600;
        const goldProduction = (totalProduction.gold || 0) / 3600;

        // Calculate storage capacity
        const storageCapacity = calculateStorageCapacity(village.buildings.storage?.level || 1);

        // Add production to uncollected resources (not directly to resources)
        newUncollectedResources.wood += woodProduction * timeDiff;
        newUncollectedResources.clay += clayProduction * timeDiff;
        newUncollectedResources.iron += ironProduction * timeDiff;
        newUncollectedResources.coal += coalProduction * timeDiff;
        newUncollectedResources.wheat += wheatProduction * timeDiff;
        newUncollectedResources.bread += breadProduction * timeDiff;
        newUncollectedResources.meat += meatProduction * timeDiff;
        newUncollectedResources.gold += goldProduction * timeDiff;
        
        // Update population capacity
        newResources.maxPopulation = calculatePopulationCapacity(village.buildings);

        // Check for completed buildings
        const updatedBuildings = { ...village.buildings };
        let buildingsUpdated = false;

        Object.keys(updatedBuildings).forEach(buildingId => {
          const building = updatedBuildings[buildingId];
          if (building.upgrading && now >= building.upgrading.completionTime) {
            building.level = building.upgrading.targetLevel;
            delete building.upgrading;
            buildingsUpdated = true;
          }
        });

        // Check for completed training
        const updatedTrainingQueue = village.trainingQueue.filter(training => {
          if (now >= training.completionTime) {
            const newArmy = { ...village.army };
            newArmy[training.unitId] = (newArmy[training.unitId] || 0) + training.quantity;
            return false; // Remove from queue
          }
          return true;
        });

        return {
          ...prev,
          village: {
            ...village,
            resources: newResources,
            uncollectedResources: newUncollectedResources,
            buildings: updatedBuildings,
            trainingQueue: updatedTrainingQueue,
            lastUpdate: now
          }
        };
      });
    };

    const interval = setInterval(updateResources, 1000);
    return () => clearInterval(interval);
  }, []);

  const upgradeBuilding = useCallback((buildingId: string) => {
    setGameState(prev => {
      const building = prev.village.buildings[buildingId];
      const buildingType = BUILDING_TYPES[building.type as keyof typeof BUILDING_TYPES];
      
      if (!building || !buildingType || building.upgrading || building.level >= buildingType.maxLevel) {
        return prev;
      }

      // Calculate costs and check if affordable
      const upgradeCost = calculateBuildingCost(building.type as keyof typeof BUILDING_TYPES, building.level + 1);

      // Check if player has enough resources
      for (const [resource, cost] of Object.entries(upgradeCost)) {
        if ((prev.village.resources as any)[resource] < cost) {
          return prev;
        }
      }

      // Calculate build time
      const townhallLevel = prev.village.buildings.townhall?.level || 1;
      const buildTimeFactor = Math.pow(1.2, building.level);
      const townhallBonus = 1 - (townhallLevel * 0.02);
      // Base build time of 5 minutes (300 seconds), scaled by level
      const baseBuildTime = 300;
      const buildTime = Math.floor(baseBuildTime * buildTimeFactor * townhallBonus);

      const completionTime = Date.now() + (buildTime * 1000);

      // Deduct resources
      const newResources = { ...prev.village.resources };
      Object.entries(upgradeCost).forEach(([resource, cost]) => {
        (newResources as any)[resource] -= cost;
      });

      return {
        ...prev,
        village: {
          ...prev.village,
          resources: newResources,
          buildings: {
            ...prev.village.buildings,
            [buildingId]: {
              ...building,
              upgrading: {
                targetLevel: building.level + 1,
                completionTime
              }
            }
          }
        }
      };
    });
  }, []);

  const trainUnit = useCallback((unitId: string, quantity: number) => {
    setGameState(prev => {
      // Implementation for training units
      // This would check costs and add to training queue
      return prev;
    });
  }, []);

  const setSelectedBuilding = useCallback((buildingId: string | null) => {
    setGameState(prev => ({
      ...prev,
      selectedBuilding: buildingId
    }));
  }, []);

  const setCurrentScreen = useCallback((screen: GameState['currentScreen']) => {
    setGameState(prev => ({
      ...prev,
      currentScreen: screen
    }));
  }, []);

  const collectResources = useCallback((resourceType?: keyof UncollectedResources) => {
    setGameState(prev => {
      const village = prev.village;
      const storageCapacity = calculateStorageCapacity(village.buildings.storage?.level || 1);
      const newResources = { ...village.resources };
      const newUncollectedResources = { ...village.uncollectedResources };
      
      if (resourceType) {
        // Collect specific resource
        const collectableAmount = Math.min(
          newUncollectedResources[resourceType],
          storageCapacity - newResources[resourceType]
        );
        
        if (collectableAmount > 0) {
          newResources[resourceType] += collectableAmount;
          newUncollectedResources[resourceType] -= collectableAmount;
        }
      } else {
        // Collect all resources
        const resourceTypes: (keyof UncollectedResources)[] = [
          'wood', 'clay', 'iron', 'coal', 'wheat', 'bread', 'meat', 'gold', 'villager'
        ];
        
        resourceTypes.forEach(type => {
          const availableSpace = storageCapacity - newResources[type];
          const collectableAmount = Math.min(
            newUncollectedResources[type],
            availableSpace
          );
          
          if (collectableAmount > 0) {
            newResources[type] += collectableAmount;
            newUncollectedResources[type] -= collectableAmount;
          }
        });
      }

      return {
        ...prev,
        village: {
          ...village,
          resources: newResources,
          uncollectedResources: newUncollectedResources
        }
      };
    });
  }, []);

  const getTotalUncollectedResources = useCallback(() => {
    const uncollected = gameState.village.uncollectedResources;
    return Object.values(uncollected).reduce((sum, amount) => sum + amount, 0);
  }, [gameState.village.uncollectedResources]);

  const setSelectedVillageInfo = useCallback((villageInfo: VillageInfo | null) => {
    setGameState(prev => ({
      ...prev,
      selectedVillageInfo: villageInfo
    }));
  }, []);

  const createMarch = useCallback((march: Omit<March, 'id'>) => {
    setGameState(prev => ({
      ...prev,
      marches: [
        ...prev.marches,
        {
          ...march,
          id: `march_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
        }
      ]
    }));
  }, []);

  const cancelMarch = useCallback((marchId: string) => {
    setGameState(prev => ({
      ...prev,
      marches: prev.marches.filter(march => march.id !== marchId)
    }));
  }, []);

  const createMarchPreset = useCallback((preset: Omit<MarchPreset, 'id'>) => {
    setGameState(prev => ({
      ...prev,
      marchPresets: [
        ...prev.marchPresets,
        {
          ...preset,
          id: `preset_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
        }
      ]
    }));
  }, []);

  const deleteMarchPreset = useCallback((presetId: string) => {
    setGameState(prev => ({
      ...prev,
      marchPresets: prev.marchPresets.filter(preset => preset.id !== presetId && !preset.isDefault)
    }));
  }, []);

  return {
    gameState,
    upgradeBuilding,
    trainUnit,
    setSelectedBuilding,
    setCurrentScreen,
    collectResources,
    getTotalUncollectedResources,
    setSelectedVillageInfo,
    createMarch,
    cancelMarch,
    createMarchPreset,
    deleteMarchPreset
  };
}