// Resource types following guidelines: Bread, Clay, Coal, Gold, Iron, Meat, Villager, Wheat, Wood
export type ResourceType =
  | "bread"
  | "clay"
  | "coal"
  | "gold"
  | "iron"
  | "meat"
  | "villager"
  | "wheat"
  | "wood";

export type Amounts = Partial<Record<ResourceType, number>>;

export interface Resources {
  bread: number;
  clay: number;
  coal: number;
  gold: number;
  iron: number;
  meat: number;
  villager: number;
  wheat: number;
  wood: number;
  maxPopulation: number;
}

export interface UncollectedResources {
  bread: number;
  clay: number;
  coal: number;
  gold: number;
  iron: number;
  meat: number;
  villager: number;
  wheat: number;
  wood: number;
}

// Building types following guidelines (14 buildings)
export type BuildingId =
  | "townhall"
  | "house"
  | "farm"
  | "bakery"
  | "huntershut"
  | "fisher"
  | "storage"
  | "market"
  | "woodcutter"
  | "claypit"
  | "ironmine"
  | "coalpit"
  | "barracks"
  | "wall";

export interface BuildingDef {
  id: BuildingId;
  name: string;
  description: string;
  maxLevel: number;
  costs(level: number): Amounts;
  productionPerHour?(level: number): Amounts;
  effects?(level: number): Record<string, number>;
  category: "economy" | "resource" | "military" | "defense";
}

export interface Building {
  type: BuildingId;
  level: number;
  upgrading?: {
    targetLevel: number;
    completionTime: number;
  };
}

// Unit types following guidelines (10 units)
export type UnitId =
  | "spearman"
  | "swordsman"
  | "axeman"
  | "archer"
  | "crossbow"
  | "lightcav"
  | "knight"
  | "pikeman"
  | "ram"
  | "trebuchet";

export interface UnitDef {
  id: UnitId;
  name: string;
  pop: number;
  speed: number; // min/tile
  carry: number;
  trainCost: Amounts;
  trainTime: number; // seconds
  attackType: "inf" | "cav" | "ranged" | "siege";
  attack: number;
  def: { inf: number; cav: number; ranged: number };
  counters?: Partial<
    Record<UnitId | "class:cav" | "class:inf" | "class:ranged" | "class:siege", number>
  >; // %
  buildingRequired: BuildingId;
  buildingLevelRequired: number;
}

export interface Army {
  [unitId: string]: number;
}

export interface TrainingQueue {
  unitId: UnitId;
  quantity: number;
  completionTime: number;
}

export interface Village {
  id: string;
  name: string;
  x?: number;
  y?: number;
  resources: Resources;
  uncollectedResources: UncollectedResources;
  buildings: { [buildingId: string]: Building };
  army: Army;
  trainingQueue: TrainingQueue[];
  lastUpdate: number;
}

export interface VillageInfo {
  id: string;
  name: string;
  x: number;
  y: number;
  level: number;
  player: string | null;
  points: number;
  population: number;
  maxPopulation: number;
  buildings: {
    [key: string]: number;
  };
  army: {
    spearman: number;
    swordsman: number;
    archer: number;
    knight: number;
    trebuchet: number;
  };
  wall: number;
  lastActivity: string;
  alliance?: string;
  playerRank?: number;
  defenseBonus: number;
}

// Tech & Progression following guidelines
export type Era = "village" | "settlement" | "city" | "duchy";

export interface TechTree {
  era: Era;
  unlockedBuildings: BuildingId[];
  unlockedUnits: UnitId[];
  smithyUpgrades: {
    inf: { attack: number; defense: number };
    cav: { attack: number; defense: number };
    ranged: { attack: number; defense: number };
    siege: { attack: number; defense: number };
  };
}

// Screen types following guidelines (4 tabs + resources + additional screens)
export type ScreenType =
  | "city"
  | "world"
  | "army"
  | "resources"
  | "more"
  | "stats"
  | "achievements";

export interface GameState {
  village: Village;
  selectedBuilding: string | null;
  selectedVillageInfo: VillageInfo | null;
  currentScreen: ScreenType;
  playerStats: PlayerStats;
  techTree: TechTree;
  marches: March[];
  marchPresets: MarchPreset[];
}

export interface PlayerStats {
  totalResourcesGathered: {
    bread: number;
    clay: number;
    coal: number;
    gold: number;
    iron: number;
    meat: number;
    villager: number;
    wheat: number;
    wood: number;
  };
  totalUnitsTrained: number;
  totalBuildingsUpgraded: number;
  battlesWon: number;
  battlesLost: number;
  playtime: number; // in seconds
}

// Province & Map types following guidelines
export interface Province {
  id: string;
  name: string;
  x: number;
  y: number;
  type: "forest" | "river" | "hills" | "plains" | "coast";
  bonus: Amounts;
  owner?: string;
  villages: Village[];
  neutralCamps: NeutralCamp[];
}

export interface NeutralCamp {
  id: string;
  type: "bandit" | "ruins" | "resources";
  level: number;
  rewards: Amounts;
  army: Army;
}

// Combat & Reports following guidelines
export type AttackType = "raid" | "siege" | "conquer";

export interface BattleReport {
  id: string;
  timestamp: number;
  attacker: string;
  defender: string;
  attackType: AttackType;
  attackerArmy: Army;
  defenderArmy: Army;
  attackerLosses: Army;
  defenderLosses: Army;
  winner: "attacker" | "defender";
  loot?: Amounts;
  factors: {
    counter: number;
    wall: number;
    moral: number;
    tech: number;
    terrain: number;
    variance: number;
  };
  suggestions: string[];
  replay: BattlePhase[];
}

export interface BattlePhase {
  phase: "ranged" | "charge" | "melee" | "siege";
  attackerUnits: Army;
  defenderUnits: Army;
  damage: { attacker: number; defender: number };
}

// March/Attack planning types
export type MarchStatus =
  | "planning"
  | "marching"
  | "arrived"
  | "returning"
  | "completed"
  | "cancelled";

export interface March {
  id: string;
  type: AttackType;
  status: MarchStatus;
  fromVillage: {
    id: string;
    name: string;
    x: number;
    y: number;
  };
  targetVillage: {
    id: string;
    name: string;
    x: number;
    y: number;
    player?: string;
  };
  army: Army;
  departureTime: number;
  arrivalTime: number;
  returnTime?: number;
  carry: number;
  loot?: Amounts;
  battleReport?: BattleReport;
  distance: number;
  travelSpeed: number; // tiles per hour
  notes?: string;
}

export interface MarchPreset {
  id: string;
  name: string;
  description: string;
  army: Army;
  attackType: AttackType;
  isDefault?: boolean;
}
