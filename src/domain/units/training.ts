import { UnitId, UnitDef, Amounts, Army } from '../../types/game';
import { UNIT_TYPES, canAfford, calculateUnitUpkeep } from '../../data/gameData';

export interface TrainingEngine {
  canTrainUnit(unitId: UnitId, quantity: number, resources: Amounts, population: number): boolean;
  calculateTrainingCost(unitId: UnitId, quantity: number): Amounts;
  calculateTrainingTime(unitId: UnitId, quantity: number, barracksLevel: number): number;
  getTrainingQueue(): TrainingQueueItem[];
}

export interface TrainingQueueItem {
  unitId: UnitId;
  quantity: number;
  cost: Amounts;
  completionTime: number;
  slot: number;
}

export interface ArmyPreset {
  id: string;
  name: string;
  purpose: 'raid' | 'siege' | 'conquer';
  composition: { [unitId: string]: number };
  speed: number; // slowest unit speed
  carry: number; // total carry capacity
  upkeep: Amounts;
  counters: string[]; // what this army is strong against
  weaknesses: string[]; // what this army is weak against
}

export class UnitTrainingEngine implements TrainingEngine {
  private queue: TrainingQueueItem[] = [];

  canTrainUnit(unitId: UnitId, quantity: number, resources: Amounts, population: number): boolean {
    const unitDef = UNIT_TYPES[unitId];
    if (!unitDef) return false;

    const cost = this.calculateTrainingCost(unitId, quantity);
    const populationCost = unitDef.pop * quantity;
    
    return canAfford(cost, resources) && populationCost <= population;
  }

  calculateTrainingCost(unitId: UnitId, quantity: number): Amounts {
    const unitDef = UNIT_TYPES[unitId];
    if (!unitDef) return {};
    
    const cost: Amounts = {};
    Object.entries(unitDef.trainCost).forEach(([resource, amount]) => {
      cost[resource as keyof Amounts] = amount * quantity;
    });
    
    return cost;
  }

  calculateTrainingTime(unitId: UnitId, quantity: number, barracksLevel: number): number {
    const unitDef = UNIT_TYPES[unitId];
    if (!unitDef) return 0;
    
    const baseTime = unitDef.trainTime * quantity;
    const speedBonus = 1 + (barracksLevel - 1) * 0.05; // 5% faster per barracks level
    
    return Math.floor(baseTime / speedBonus);
  }

  getTrainingQueue(): TrainingQueueItem[] {
    return [...this.queue];
  }

  addToQueue(
    unitId: UnitId,
    quantity: number,
    barracksLevel: number,
    resources: Amounts,
    population: number
  ): boolean {
    if (!this.canTrainUnit(unitId, quantity, resources, population)) {
      return false;
    }

    // Check available training slots (based on barracks level)
    const maxSlots = Math.min(Math.floor(barracksLevel / 5) + 1, 3);
    const usedSlots = this.queue.filter(item => item.completionTime > Date.now()).length;
    
    if (usedSlots >= maxSlots) {
      return false;
    }

    const cost = this.calculateTrainingCost(unitId, quantity);
    const trainingTime = this.calculateTrainingTime(unitId, quantity, barracksLevel);
    const completionTime = Date.now() + trainingTime * 1000;

    const queueItem: TrainingQueueItem = {
      unitId,
      quantity,
      cost,
      completionTime,
      slot: usedSlots + 1
    };

    this.queue.push(queueItem);
    return true;
  }

  processQueue(): { completed: TrainingQueueItem[]; remaining: TrainingQueueItem[] } {
    const now = Date.now();
    const completed = this.queue.filter(item => item.completionTime <= now);
    const remaining = this.queue.filter(item => item.completionTime > now);
    
    this.queue = remaining;
    
    return { completed, remaining };
  }
}

export function createArmyPreset(
  name: string,
  purpose: 'raid' | 'siege' | 'conquer',
  composition: { [unitId: string]: number }
): ArmyPreset {
  let slowestSpeed = 1;
  let totalCarry = 0;
  const counters: string[] = [];
  const weaknesses: string[] = [];

  // Calculate army characteristics
  Object.entries(composition).forEach(([unitId, count]) => {
    const unitDef = UNIT_TYPES[unitId as UnitId];
    if (unitDef && count > 0) {
      slowestSpeed = Math.max(slowestSpeed, unitDef.speed);
      totalCarry += unitDef.carry * count;
      
      // Analyze counters and weaknesses
      if (unitDef.counters) {
        Object.keys(unitDef.counters).forEach(counter => {
          if (!counters.includes(counter)) {
            counters.push(counter);
          }
        });
      }
    }
  });

  const upkeep = calculateUnitUpkeep(composition);

  return {
    id: `preset_${Date.now()}`,
    name,
    purpose,
    composition,
    speed: slowestSpeed,
    carry: totalCarry,
    upkeep,
    counters,
    weaknesses
  };
}

export function analyzeArmyWeaknesses(army: Army): string[] {
  const weaknesses: string[] = [];
  const composition = Object.entries(army).filter(([_, count]) => count > 0);
  
  // Check for lack of anti-cavalry
  const antiCav = composition.filter(([unitId]) => {
    const unit = UNIT_TYPES[unitId as UnitId];
    return unit && unit.counters && (unit.counters['class:cav'] || unit.counters.lightcav || unit.counters.knight);
  });
  
  if (antiCav.length === 0) {
    weaknesses.push('Schwach gegen: Kavallerie');
  }
  
  // Check for lack of anti-infantry
  const antiInf = composition.filter(([unitId]) => {
    const unit = UNIT_TYPES[unitId as UnitId];
    return unit && unit.counters && unit.counters['class:inf'];
  });
  
  if (antiInf.length === 0) {
    weaknesses.push('Schwach gegen: Infanterie');
  }
  
  // Check for lack of siege units
  const siege = composition.filter(([unitId]) => {
    const unit = UNIT_TYPES[unitId as UnitId];
    return unit && unit.attackType === 'siege';
  });
  
  if (siege.length === 0) {
    weaknesses.push('Kann keine Mauern brechen');
  }
  
  return weaknesses;
}

export function calculateMarchTime(
  fromX: number,
  fromY: number,
  toX: number,
  toY: number,
  army: Army
): number {
  // Calculate distance
  const distance = Math.sqrt(Math.pow(toX - fromX, 2) + Math.pow(toY - fromY, 2));
  
  // Find slowest unit in army
  let slowestSpeed = 1;
  Object.entries(army).forEach(([unitId, count]) => {
    if (count > 0) {
      const unit = UNIT_TYPES[unitId as UnitId];
      if (unit) {
        slowestSpeed = Math.max(slowestSpeed, unit.speed);
      }
    }
  });
  
  // Calculate march time in minutes
  return Math.ceil(distance * slowestSpeed);
}

export function calculateRouteRisk(
  fromX: number,
  fromY: number,
  toX: number,
  toY: number,
  scoutDensity: number,
  terrain: string[]
): { risk: 'low' | 'medium' | 'high'; factors: string[] } {
  const factors: string[] = [];
  let riskScore = 0;
  
  // Scout density increases risk
  if (scoutDensity > 0.7) {
    riskScore += 2;
    factors.push('Hohe Späherdichte');
  } else if (scoutDensity > 0.4) {
    riskScore += 1;
    factors.push('Mittlere Späherdichte');
  }
  
  // Terrain affects detection
  if (terrain.includes('open')) {
    riskScore += 1;
    factors.push('Offenes Gelände');
  }
  
  if (terrain.includes('forest')) {
    riskScore -= 1;
    factors.push('Waldbedeckung (versteckt)');
  }
  
  // Distance affects risk
  const distance = Math.sqrt(Math.pow(toX - fromX, 2) + Math.pow(toY - fromY, 2));
  if (distance > 50) {
    riskScore += 1;
    factors.push('Lange Marschroute');
  }
  
  let risk: 'low' | 'medium' | 'high' = 'low';
  if (riskScore >= 3) risk = 'high';
  else if (riskScore >= 1) risk = 'medium';
  
  return { risk, factors };
}