import { BuildingDef, UnitDef, BuildingId, UnitId, Amounts } from '../types/game';

// Building definitions following guidelines (14 buildings)
export const BUILDING_TYPES: Record<BuildingId, BuildingDef> = {
  // Stadt & Wirtschaft
  townhall: {
    id: 'townhall',
    name: 'Rathaus',
    description: 'HQ, Bau-/Forschungs-Slots, Steuern',
    maxLevel: 30,
    category: 'economy',
    costs: (level: number) => ({
      wood: Math.floor(100 * Math.pow(1.26, level - 1)),
      clay: Math.floor(180 * Math.pow(1.26, level - 1)),
      iron: Math.floor(40 * Math.pow(1.26, level - 1)),
      gold: Math.floor(20 * Math.pow(1.26, level - 1))
    }),
    effects: (level: number) => ({
      buildSlots: Math.min(Math.floor(level / 5) + 1, 3),
      taxIncome: level * 5
    })
  },

  house: {
    id: 'house',
    name: 'Wohnhaus',
    description: 'Villager-Wachstum (Cap via Farm/Storage)',
    maxLevel: 25,
    category: 'economy',
    costs: (level: number) => ({
      wood: Math.floor(80 * Math.pow(1.2, level - 1)),
      clay: Math.floor(100 * Math.pow(1.2, level - 1))
    }),
    productionPerHour: (level: number) => ({
      villager: Math.floor(level * 0.5)
    }),
    effects: (level: number) => ({
      populationCap: level * 25
    })
  },

  farm: {
    id: 'farm',
    name: 'Bauernhof',
    description: 'Erzeugt Wheat',
    maxLevel: 30,
    category: 'resource',
    costs: (level: number) => ({
      wood: Math.floor(45 * Math.pow(1.21, level - 1)),
      clay: Math.floor(60 * Math.pow(1.21, level - 1))
    }),
    productionPerHour: (level: number) => ({
      wheat: Math.floor(22 * level * Math.pow(1.163, level - 1))
    })
  },

  bakery: {
    id: 'bakery',
    name: 'Bäckerei',
    description: 'Bread aus Wheat',
    maxLevel: 25,
    category: 'resource',
    costs: (level: number) => ({
      wood: Math.floor(40 * Math.pow(1.2, level - 1)),
      clay: Math.floor(65 * Math.pow(1.2, level - 1)),
      iron: Math.floor(10 * Math.pow(1.2, level - 1))
    }),
    productionPerHour: (level: number) => ({
      bread: Math.floor(18 * level * Math.pow(1.15, level - 1))
    }),
    effects: (level: number) => ({
      wheatConsumption: Math.floor(20 * level * Math.pow(1.15, level - 1))
    })
  },

  huntershut: {
    id: 'huntershut',
    name: 'Jägerhütte',
    description: 'Meat (ereignisgesteigerte Ausbeute)',
    maxLevel: 25,
    category: 'resource',
    costs: (level: number) => ({
      wood: Math.floor(60 * Math.pow(1.21, level - 1)),
      iron: Math.floor(20 * Math.pow(1.21, level - 1))
    }),
    productionPerHour: (level: number) => ({
      meat: Math.floor(15 * level * Math.pow(1.14, level - 1))
    })
  },

  fisher: {
    id: 'fisher',
    name: 'Fischerei',
    description: 'Meat (küstennah/provinzgebunden)',
    maxLevel: 25,
    category: 'resource',
    costs: (level: number) => ({
      wood: Math.floor(50 * Math.pow(1.19, level - 1)),
      clay: Math.floor(30 * Math.pow(1.19, level - 1))
    }),
    productionPerHour: (level: number) => ({
      meat: Math.floor(20 * level * Math.pow(1.16, level - 1))
    })
  },

  storage: {
    id: 'storage',
    name: 'Speicher',
    description: 'Lager-Cap & Diebstahlreduktion',
    maxLevel: 30,
    category: 'economy',
    costs: (level: number) => ({
      wood: Math.floor(60 * Math.pow(1.24, level - 1)),
      clay: Math.floor(50 * Math.pow(1.24, level - 1))
    }),
    effects: (level: number) => ({
      storageCapacity: Math.floor(1000 * Math.pow(1.229, level - 1)),
      theftReduction: Math.min(level * 2, 80)
    })
  },

  market: {
    id: 'market',
    name: 'Marktplatz',
    description: 'Gold, Handel, Karawanen (Routen-UI)',
    maxLevel: 25,
    category: 'economy',
    costs: (level: number) => ({
      wood: Math.floor(80 * Math.pow(1.22, level - 1)),
      clay: Math.floor(100 * Math.pow(1.22, level - 1)),
      iron: Math.floor(40 * Math.pow(1.22, level - 1))
    }),
    productionPerHour: (level: number) => ({
      gold: Math.floor(8 * level * Math.pow(1.12, level - 1))
    }),
    effects: (level: number) => ({
      tradeCapacity: level * 100,
      tradeRoutes: Math.floor(level / 5) + 1
    })
  },

  // Rohstoffe & Metall
  woodcutter: {
    id: 'woodcutter',
    name: 'Holzfäller',
    description: 'Wood',
    maxLevel: 30,
    category: 'resource',
    costs: (level: number) => ({
      wood: Math.floor(50 * Math.pow(1.25, level - 1)),
      iron: Math.floor(10 * Math.pow(1.25, level - 1))
    }),
    productionPerHour: (level: number) => ({
      wood: Math.floor(30 * level * Math.pow(1.163, level - 1))
    })
  },

  claypit: {
    id: 'claypit',
    name: 'Lehmgrube',
    description: 'Clay',
    maxLevel: 30,
    category: 'resource',
    costs: (level: number) => ({
      wood: Math.floor(65 * Math.pow(1.25, level - 1)),
      iron: Math.floor(15 * Math.pow(1.25, level - 1))
    }),
    productionPerHour: (level: number) => ({
      clay: Math.floor(35 * level * Math.pow(1.163, level - 1))
    })
  },

  ironmine: {
    id: 'ironmine',
    name: 'Eisenmine',
    description: 'Iron',
    maxLevel: 30,
    category: 'resource',
    costs: (level: number) => ({
      wood: Math.floor(75 * Math.pow(1.27, level - 1)),
      clay: Math.floor(65 * Math.pow(1.27, level - 1))
    }),
    productionPerHour: (level: number) => ({
      iron: Math.floor(25 * level * Math.pow(1.163, level - 1))
    })
  },

  coalpit: {
    id: 'coalpit',
    name: 'Kohlemine',
    description: 'Coal (Boost-Ressource)',
    maxLevel: 25,
    category: 'resource',
    costs: (level: number) => ({
      wood: Math.floor(90 * Math.pow(1.3, level - 1)),
      clay: Math.floor(80 * Math.pow(1.3, level - 1)),
      iron: Math.floor(30 * Math.pow(1.3, level - 1))
    }),
    productionPerHour: (level: number) => ({
      coal: Math.floor(12 * level * Math.pow(1.18, level - 1))
    })
  },

  // Militär & Def
  barracks: {
    id: 'barracks',
    name: 'Kaserne',
    description: 'Inf/Fern Training',
    maxLevel: 25,
    category: 'military',
    costs: (level: number) => ({
      wood: Math.floor(200 * Math.pow(1.25, level - 1)),
      clay: Math.floor(120 * Math.pow(1.25, level - 1)),
      iron: Math.floor(150 * Math.pow(1.25, level - 1))
    }),
    effects: (level: number) => ({
      trainingSpeed: 1 + (level - 1) * 0.05,
      trainingSlots: Math.min(Math.floor(level / 5) + 1, 3)
    })
  },

  wall: {
    id: 'wall',
    name: 'Stadtmauer',
    description: 'Stadt-DEF, Gate-HP (Synergie mit Rammbock)',
    maxLevel: 20,
    category: 'defense',
    costs: (level: number) => ({
      wood: Math.floor(50 * Math.pow(1.58, level - 1)),
      clay: Math.floor(100 * Math.pow(1.58, level - 1)),
      iron: Math.floor(20 * Math.pow(1.58, level - 1))
    }),
    effects: (level: number) => ({
      defenseBonus: level * 5,
      gateHp: level * 100
    })
  }
};

// Unit definitions following guidelines (10 units)
export const UNIT_TYPES: Record<UnitId, UnitDef> = {
  spearman: {
    id: 'spearman',
    name: 'Speerträger',
    pop: 1,
    speed: 18,
    carry: 15,
    trainCost: { wood: 30, clay: 15, iron: 10, bread: 1 },
    trainTime: 480, // 8 minutes
    attackType: 'inf',
    attack: 10,
    def: { inf: 15, cav: 45, ranged: 10 },
    counters: { 'class:cav': 0.25, lightcav: 0.3, knight: 0.15 },
    buildingRequired: 'barracks',
    buildingLevelRequired: 1
  },

  swordsman: {
    id: 'swordsman',
    name: 'Schwertkämpfer',
    pop: 1,
    speed: 22,
    carry: 20,
    trainCost: { wood: 20, clay: 10, iron: 30, bread: 1 },
    trainTime: 600, // 10 minutes
    attackType: 'inf',
    attack: 25,
    def: { inf: 30, cav: 15, ranged: 20 },
    counters: { 'class:inf': 0.15 },
    buildingRequired: 'barracks',
    buildingLevelRequired: 3
  },

  axeman: {
    id: 'axeman',
    name: 'Axtkämpfer',
    pop: 1,
    speed: 20,
    carry: 15,
    trainCost: { wood: 40, clay: 20, iron: 25, bread: 1 },
    trainTime: 720, // 12 minutes
    attackType: 'inf',
    attack: 35,
    def: { inf: 20, cav: 10, ranged: 15 },
    counters: { 'class:inf': 0.25, swordsman: 0.2 },
    buildingRequired: 'barracks',
    buildingLevelRequired: 5
  },

  archer: {
    id: 'archer',
    name: 'Bogenschütze',
    pop: 1,
    speed: 18,
    carry: 10,
    trainCost: { wood: 50, clay: 10, iron: 15, bread: 1 },
    trainTime: 840, // 14 minutes
    attackType: 'ranged',
    attack: 20,
    def: { inf: 5, cav: 5, ranged: 20 },
    counters: { 'class:inf': 0.15 },
    buildingRequired: 'barracks',
    buildingLevelRequired: 7
  },

  crossbow: {
    id: 'crossbow',
    name: 'Armbrustschütze',
    pop: 1,
    speed: 16,
    carry: 12,
    trainCost: { wood: 60, clay: 15, iron: 35, bread: 1, coal: 1 },
    trainTime: 1080, // 18 minutes
    attackType: 'ranged',
    attack: 30,
    def: { inf: 8, cav: 8, ranged: 25 },
    counters: { knight: 0.25, 'class:cav': 0.15 },
    buildingRequired: 'barracks',
    buildingLevelRequired: 10
  },

  lightcav: {
    id: 'lightcav',
    name: 'Leichte Kavallerie',
    pop: 4,
    speed: 10,
    carry: 50,
    trainCost: { wood: 80, clay: 30, iron: 40, bread: 2, meat: 1 },
    trainTime: 1200, // 20 minutes
    attackType: 'cav',
    attack: 40,
    def: { inf: 20, cav: 30, ranged: 40 },
    counters: { 'class:ranged': 0.3, archer: 0.25 },
    buildingRequired: 'barracks',
    buildingLevelRequired: 12
  },

  knight: {
    id: 'knight',
    name: 'Schwere Kavallerie',
    pop: 6,
    speed: 10,
    carry: 80,
    trainCost: { wood: 100, clay: 50, iron: 150, gold: 10, bread: 3, meat: 2 },
    trainTime: 1800, // 30 minutes
    attackType: 'cav',
    attack: 80,
    def: { inf: 50, cav: 50, ranged: 40 },
    counters: { 'class:inf': 0.2, swordsman: 0.25 },
    buildingRequired: 'barracks',
    buildingLevelRequired: 15
  },

  pikeman: {
    id: 'pikeman',
    name: 'Pikenier',
    pop: 1,
    speed: 20,
    carry: 18,
    trainCost: { wood: 45, clay: 25, iron: 50, bread: 1, coal: 1 },
    trainTime: 960, // 16 minutes
    attackType: 'inf',
    attack: 15,
    def: { inf: 25, cav: 60, ranged: 15 },
    counters: { 'class:cav': 0.35, knight: 0.4, lightcav: 0.3 },
    buildingRequired: 'barracks',
    buildingLevelRequired: 8
  },

  ram: {
    id: 'ram',
    name: 'Rammbock',
    pop: 8,
    speed: 30,
    carry: 0,
    trainCost: { wood: 300, clay: 200, iron: 200, gold: 20, coal: 5 },
    trainTime: 3600, // 60 minutes
    attackType: 'siege',
    attack: 2,
    def: { inf: 20, cav: 20, ranged: 50 },
    counters: { wall: 1.0 },
    buildingRequired: 'barracks',
    buildingLevelRequired: 18
  },

  trebuchet: {
    id: 'trebuchet',
    name: 'Trebuchet',
    pop: 10,
    speed: 30,
    carry: 0,
    trainCost: { wood: 400, clay: 300, iron: 250, gold: 30, coal: 8 },
    trainTime: 4800, // 80 minutes
    attackType: 'siege',
    attack: 1,
    def: { inf: 10, cav: 10, ranged: 30 },
    counters: { 'building': 1.0 },
    buildingRequired: 'barracks',
    buildingLevelRequired: 20
  }
};

// Helper functions
export function calculateResourceProduction(buildings: { [key: string]: { level: number } }): Amounts {
  const production: Amounts = {};
  
  Object.entries(buildings).forEach(([buildingId, building]) => {
    const buildingDef = BUILDING_TYPES[buildingId as BuildingId];
    if (buildingDef && buildingDef.productionPerHour) {
      const buildingProduction = buildingDef.productionPerHour(building.level);
      Object.entries(buildingProduction).forEach(([resource, amount]) => {
        production[resource as keyof Amounts] = (production[resource as keyof Amounts] || 0) + amount;
      });
    }
  });
  
  return production;
}

export function calculateStorageCapacity(storageLevel: number): number {
  return BUILDING_TYPES.storage.effects!(storageLevel).storageCapacity;
}

export function calculatePopulationCapacity(buildings: { [key: string]: { level: number } }): number {
  const houseLevel = buildings.house?.level || 0;
  const farmLevel = buildings.farm?.level || 0;
  
  // Population cap is limited by the lower of house and farm capacity
  const houseCapacity = BUILDING_TYPES.house.effects!(houseLevel).populationCap;
  const farmCapacity = farmLevel * 30; // Farm provides food for population
  
  return Math.min(houseCapacity, farmCapacity);
}

export function calculateBuildingCost(buildingId: BuildingId, targetLevel: number): Amounts {
  const buildingDef = BUILDING_TYPES[buildingId];
  if (!buildingDef) return {};
  
  return buildingDef.costs(targetLevel);
}

export function calculateUnitCost(unitId: UnitId, quantity: number): Amounts {
  const unitDef = UNIT_TYPES[unitId];
  if (!unitDef) return {};
  
  const cost: Amounts = {};
  Object.entries(unitDef.trainCost).forEach(([resource, amount]) => {
    cost[resource as keyof Amounts] = amount * quantity;
  });
  
  return cost;
}

export function canAfford(cost: Amounts, resources: { [key: string]: number }): boolean {
  return Object.entries(cost).every(([resource, amount]) => {
    return (resources[resource] || 0) >= amount;
  });
}

export function subtractResources(resources: { [key: string]: number }, cost: Amounts): { [key: string]: number } {
  const result = { ...resources };
  Object.entries(cost).forEach(([resource, amount]) => {
    result[resource] = Math.max(0, (result[resource] || 0) - amount);
  });
  return result;
}

// Unit upkeep following guidelines (Gold + Bread/Meat)
export function calculateUnitUpkeep(army: { [unitId: string]: number }): Amounts {
  const upkeep: Amounts = { gold: 0, bread: 0, meat: 0 };
  
  Object.entries(army).forEach(([unitId, count]) => {
    const unitDef = UNIT_TYPES[unitId as UnitId];
    if (unitDef && count > 0) {
      // Gold upkeep (wages)
      upkeep.gold! += count * Math.floor(unitDef.pop * 0.5);
      
      // Food upkeep (bread/meat)
      if (unitDef.attackType === 'cav') {
        // Cavalry needs more meat
        upkeep.meat! += count * unitDef.pop * 0.3;
        upkeep.bread! += count * unitDef.pop * 0.2;
      } else {
        // Infantry and ranged mainly need bread
        upkeep.bread! += count * unitDef.pop * 0.4;
        upkeep.meat! += count * unitDef.pop * 0.1;
      }
    }
  });
  
  return upkeep;
}

// Icon helper functions for UI compatibility
export function getResourceIcon(resourceType: ResourceType): string {
  const icons: Record<ResourceType, string> = {
    wood: '🪵',
    clay: '🧱', 
    iron: '⚔️',
    coal: '⚫',
    wheat: '🌾',
    bread: '🍞',
    meat: '🥩',
    gold: '🪙',
    villager: '👥'
  };
  return icons[resourceType] || '❓';
}

export function getBuildingIcon(buildingId: BuildingId): string {
  const icons: Record<BuildingId, string> = {
    townhall: '🏛️',
    house: '🏠',
    farm: '🌾',
    bakery: '🍞', 
    huntershut: '🏹',
    fisher: '🐟',
    storage: '📦',
    market: '🏪',
    woodcutter: '🪓',
    claypit: '🧱',
    ironmine: '⛏️',
    coalpit: '⚫',
    barracks: '🏰',
    wall: '🛡️'
  };
  return icons[buildingId] || '🏗️';
}

export function getUnitIcon(unitId: UnitId): string {
  const icons: Record<UnitId, string> = {
    spearman: '🛡️',
    swordsman: '⚔️',
    axeman: '🪓',
    archer: '🏹',
    crossbow: '🎯',
    lightcav: '🐎',
    knight: '♞',
    pikeman: '🗡️',
    ram: '🏗️',
    trebuchet: '🏰'
  };
  return icons[unitId] || '⚔️';
}