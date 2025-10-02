import { Amounts, Resources, UncollectedResources } from '../../types/game';
import { BUILDING_TYPES } from '../../data/gameData';

export interface ProductionEngine {
  calculateHourlyProduction(buildings: { [key: string]: { level: number } }): Amounts;
  calculateOfflineProduction(buildings: { [key: string]: { level: number } }, hours: number): Amounts;
  applyCoalBoost(production: Amounts, coalLevel: number, boostActive: boolean): Amounts;
}

export class ResourceProductionEngine implements ProductionEngine {
  calculateHourlyProduction(buildings: { [key: string]: { level: number } }): Amounts {
    const production: Amounts = {};
    
    Object.entries(buildings).forEach(([buildingId, building]) => {
      const buildingDef = BUILDING_TYPES[buildingId as keyof typeof BUILDING_TYPES];
      if (buildingDef && buildingDef.productionPerHour) {
        const buildingProduction = buildingDef.productionPerHour(building.level);
        Object.entries(buildingProduction).forEach(([resource, amount]) => {
          production[resource as keyof Amounts] = (production[resource as keyof Amounts] || 0) + amount;
        });
      }
    });
    
    return production;
  }

  calculateOfflineProduction(buildings: { [key: string]: { level: number } }, hours: number): Amounts {
    const hourlyProduction = this.calculateHourlyProduction(buildings);
    const offlineProduction: Amounts = {};
    
    Object.entries(hourlyProduction).forEach(([resource, amount]) => {
      offlineProduction[resource as keyof Amounts] = Math.floor(amount * hours);
    });
    
    return offlineProduction;
  }

  applyCoalBoost(production: Amounts, coalLevel: number, boostActive: boolean): Amounts {
    if (!boostActive || coalLevel === 0) return production;
    
    const boostMultiplier = 1 + (coalLevel * 0.02); // 2% per coal level
    const boostedProduction: Amounts = {};
    
    Object.entries(production).forEach(([resource, amount]) => {
      // Coal boost affects smithy and production efficiency
      boostedProduction[resource as keyof Amounts] = Math.floor(amount * boostMultiplier);
    });
    
    return boostedProduction;
  }
}

export function processResourceCollection(
  uncollected: UncollectedResources,
  current: Resources,
  storageCapacity: number
): { collected: Amounts; remaining: UncollectedResources; overflow: Amounts } {
  const collected: Amounts = {};
  const remaining: UncollectedResources = { ...uncollected };
  const overflow: Amounts = {};
  
  Object.entries(uncollected).forEach(([resource, amount]) => {
    if (amount > 0) {
      const currentAmount = current[resource as keyof Resources] || 0;
      const availableSpace = storageCapacity - currentAmount;
      const collectableAmount = Math.min(amount, availableSpace);
      
      collected[resource as keyof Amounts] = collectableAmount;
      remaining[resource as keyof UncollectedResources] = amount - collectableAmount;
      
      if (amount > collectableAmount) {
        overflow[resource as keyof Amounts] = amount - collectableAmount;
      }
    }
  });
  
  return { collected, remaining, overflow };
}