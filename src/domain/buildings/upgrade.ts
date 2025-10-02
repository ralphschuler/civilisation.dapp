import { BuildingId, BuildingDef, Amounts } from '../../types/game';
import { BUILDING_TYPES, canAfford } from '../../data/gameData';

export interface UpgradeEngine {
  canUpgradeBuilding(buildingId: BuildingId, currentLevel: number, resources: Amounts): boolean;
  calculateUpgradeCost(buildingId: BuildingId, targetLevel: number): Amounts;
  calculateUpgradeTime(buildingId: BuildingId, targetLevel: number, townhallLevel: number): number;
  getBuildingQueue(): UpgradeQueueItem[];
}

export interface UpgradeQueueItem {
  buildingId: BuildingId;
  targetLevel: number;
  cost: Amounts;
  completionTime: number;
  slot: number;
}

export class BuildingUpgradeEngine implements UpgradeEngine {
  private queue: UpgradeQueueItem[] = [];

  canUpgradeBuilding(buildingId: BuildingId, currentLevel: number, resources: Amounts): boolean {
    const buildingDef = BUILDING_TYPES[buildingId];
    if (!buildingDef || currentLevel >= buildingDef.maxLevel) {
      return false;
    }

    const cost = this.calculateUpgradeCost(buildingId, currentLevel + 1);
    return canAfford(cost, resources);
  }

  calculateUpgradeCost(buildingId: BuildingId, targetLevel: number): Amounts {
    const buildingDef = BUILDING_TYPES[buildingId];
    if (!buildingDef) return {};
    
    return buildingDef.costs(targetLevel);
  }

  calculateUpgradeTime(buildingId: BuildingId, targetLevel: number, townhallLevel: number): number {
    // Base upgrade time increases with level
    const baseTime = Math.floor(300 * Math.pow(1.2, targetLevel - 1)); // 5 minutes base, exponential growth
    
    // Townhall reduces build time
    const townhallBonus = 1 - (townhallLevel * 0.02); // 2% reduction per level
    
    return Math.floor(baseTime * Math.max(0.5, townhallBonus));
  }

  getBuildingQueue(): UpgradeQueueItem[] {
    return [...this.queue];
  }

  addToQueue(
    buildingId: BuildingId, 
    currentLevel: number, 
    townhallLevel: number,
    resources: Amounts
  ): boolean {
    const targetLevel = currentLevel + 1;
    const cost = this.calculateUpgradeCost(buildingId, targetLevel);
    
    if (!canAfford(cost, resources)) {
      return false;
    }

    // Check available build slots (based on townhall level)
    const maxSlots = Math.min(Math.floor(townhallLevel / 5) + 1, 3);
    const usedSlots = this.queue.filter(item => item.completionTime > Date.now()).length;
    
    if (usedSlots >= maxSlots) {
      return false;
    }

    const upgradeTime = this.calculateUpgradeTime(buildingId, targetLevel, townhallLevel);
    const completionTime = Date.now() + upgradeTime * 1000;

    const queueItem: UpgradeQueueItem = {
      buildingId,
      targetLevel,
      cost,
      completionTime,
      slot: usedSlots + 1
    };

    this.queue.push(queueItem);
    return true;
  }

  processQueue(): { completed: UpgradeQueueItem[]; remaining: UpgradeQueueItem[] } {
    const now = Date.now();
    const completed = this.queue.filter(item => item.completionTime <= now);
    const remaining = this.queue.filter(item => item.completionTime > now);
    
    this.queue = remaining;
    
    return { completed, remaining };
  }
}

export function getRecommendedUpgrade(
  buildings: { [key: string]: { level: number } },
  resources: Amounts,
  bottlenecks: string[]
): { buildingId: BuildingId; reason: string } | null {
  // Analyze resource bottlenecks and suggest upgrades
  if (bottlenecks.includes('wood')) {
    return { buildingId: 'woodcutter', reason: 'Holz knapp → Holzfäller +1' };
  }
  
  if (bottlenecks.includes('clay')) {
    return { buildingId: 'claypit', reason: 'Lehm knapp → Lehmgrube +1' };
  }
  
  if (bottlenecks.includes('iron')) {
    return { buildingId: 'ironmine', reason: 'Eisen knapp → Eisenmine +1' };
  }
  
  if (bottlenecks.includes('wheat')) {
    return { buildingId: 'farm', reason: 'Weizen knapp → Bauernhof +1' };
  }
  
  if (bottlenecks.includes('storage')) {
    return { buildingId: 'storage', reason: 'Speicher voll → Speicher +1' };
  }
  
  // Default recommendation: upgrade townhall for more build slots
  const townhallLevel = buildings.townhall?.level || 1;
  if (townhallLevel < 15) {
    return { buildingId: 'townhall', reason: 'Mehr Bauslots → Rathaus +1' };
  }
  
  return null;
}