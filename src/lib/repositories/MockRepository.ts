/**
 * Mock Repository Implementation
 * For development and testing - stores data in memory
 */

import {
  IRepository,
  IVillageRepository,
  IGameStateRepository,
  IMarchRepository,
  IMarchPresetRepository,
  IReportRepository,
  IPlayerStatsRepository,
  ITechTreeRepository,
  IProvinceRepository,
  INeutralCampRepository
} from './IRepository';
import {
  Village,
  GameState,
  March,
  MarchPreset,
  PlayerStats,
  TechTree,
  Province,
  NeutralCamp,
  VillageInfo
} from '@/types/game';
import { Report } from '@/types/reports';

// Initial mock data
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

const INITIAL_TECH_TREE: TechTree = {
  era: 'village',
  unlockedBuildings: ['townhall', 'house', 'farm', 'woodcutter', 'claypit'],
  unlockedUnits: ['spearman', 'archer'],
  smithyUpgrades: {
    inf: { attack: 0, defense: 0 },
    cav: { attack: 0, defense: 0 },
    ranged: { attack: 0, defense: 0 },
    siege: { attack: 0, defense: 0 }
  }
};

const DEFAULT_PRESET: MarchPreset = {
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
};

/**
 * Village Repository Implementation
 */
class MockVillageRepository implements IVillageRepository {
  private villages: Map<string, Village> = new Map([[INITIAL_VILLAGE.id, INITIAL_VILLAGE]]);

  async getVillage(villageId: string): Promise<Village> {
    const village = this.villages.get(villageId);
    if (!village) throw new Error(`Village ${villageId} not found`);
    return { ...village };
  }

  async updateVillage(village: Village): Promise<void> {
    this.villages.set(village.id, { ...village });
  }

  async getAllVillages(): Promise<Village[]> {
    return Array.from(this.villages.values()).map(v => ({ ...v }));
  }

  async createVillage(village: Village): Promise<void> {
    this.villages.set(village.id, { ...village });
  }

  async deleteVillage(villageId: string): Promise<void> {
    this.villages.delete(villageId);
  }

  async getVillageInfo(villageId: string): Promise<VillageInfo | null> {
    const village = this.villages.get(villageId);
    if (!village) return null;

    return {
      id: village.id,
      name: village.name,
      x: village.x || 0,
      y: village.y || 0,
      level: village.buildings.townhall?.level || 1,
      player: 'Player Name',
      points: 1000,
      population: village.resources.villager,
      maxPopulation: village.resources.maxPopulation,
      buildings: Object.fromEntries(
        Object.entries(village.buildings).map(([key, building]) => [key, building.level])
      ),
      army: village.army,
      wall: village.buildings.wall?.level || 0,
      lastActivity: new Date().toISOString(),
      defenseBonus: 0
    };
  }
}

/**
 * GameState Repository Implementation
 */
class MockGameStateRepository implements IGameStateRepository {
  private gameState: GameState | null = null;

  async getGameState(): Promise<GameState> {
    if (!this.gameState) {
      this.gameState = {
        village: INITIAL_VILLAGE,
        selectedBuilding: null,
        selectedVillageInfo: null,
        currentScreen: 'city',
        playerStats: INITIAL_STATS,
        techTree: INITIAL_TECH_TREE,
        marches: [],
        marchPresets: [DEFAULT_PRESET]
      };
    }
    return { ...this.gameState };
  }

  async saveGameState(state: GameState): Promise<void> {
    this.gameState = { ...state };
  }

  async resetGameState(): Promise<void> {
    this.gameState = null;
  }

  async getLastUpdate(): Promise<number> {
    const state = await this.getGameState();
    return state.village.lastUpdate;
  }
}

/**
 * March Repository Implementation
 */
class MockMarchRepository implements IMarchRepository {
  private marches: Map<string, March> = new Map();

  async getMarches(): Promise<March[]> {
    return Array.from(this.marches.values()).map(m => ({ ...m }));
  }

  async getMarch(marchId: string): Promise<March | null> {
    const march = this.marches.get(marchId);
    return march ? { ...march } : null;
  }

  async createMarch(march: Omit<March, 'id'>): Promise<March> {
    const id = `march_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const newMarch = { ...march, id };
    this.marches.set(id, newMarch);
    return { ...newMarch };
  }

  async cancelMarch(marchId: string): Promise<void> {
    this.marches.delete(marchId);
  }

  async updateMarch(march: March): Promise<void> {
    this.marches.set(march.id, { ...march });
  }

  async getActiveMarchesForVillage(villageId: string): Promise<March[]> {
    return Array.from(this.marches.values())
      .filter(m => m.fromVillage.id === villageId && m.status !== 'completed' && m.status !== 'cancelled')
      .map(m => ({ ...m }));
  }
}

/**
 * MarchPreset Repository Implementation
 */
class MockMarchPresetRepository implements IMarchPresetRepository {
  private presets: Map<string, MarchPreset> = new Map([[DEFAULT_PRESET.id, DEFAULT_PRESET]]);

  async getPresets(): Promise<MarchPreset[]> {
    return Array.from(this.presets.values()).map(p => ({ ...p }));
  }

  async getPreset(presetId: string): Promise<MarchPreset | null> {
    const preset = this.presets.get(presetId);
    return preset ? { ...preset } : null;
  }

  async createPreset(preset: Omit<MarchPreset, 'id'>): Promise<MarchPreset> {
    const id = `preset_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const newPreset = { ...preset, id };
    this.presets.set(id, newPreset);
    return { ...newPreset };
  }

  async updatePreset(preset: MarchPreset): Promise<void> {
    this.presets.set(preset.id, { ...preset });
  }

  async deletePreset(presetId: string): Promise<void> {
    const preset = this.presets.get(presetId);
    if (preset?.isDefault) {
      throw new Error('Cannot delete default preset');
    }
    this.presets.delete(presetId);
  }
}

/**
 * Report Repository Implementation
 */
class MockReportRepository implements IReportRepository {
  private reports: Map<string, Report> = new Map();

  async getReports(): Promise<Report[]> {
    return Array.from(this.reports.values())
      .sort((a, b) => b.timestamp - a.timestamp)
      .map(r => ({ ...r }));
  }

  async getReport(reportId: string): Promise<Report | null> {
    const report = this.reports.get(reportId);
    return report ? { ...report } : null;
  }

  async createReport(report: Omit<Report, 'id'>): Promise<Report> {
    const id = `report_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const newReport = { ...report, id } as Report;
    this.reports.set(id, newReport);
    return { ...newReport };
  }

  async markReportAsRead(reportId: string): Promise<void> {
    const report = this.reports.get(reportId);
    if (report) {
      report.read = true;
      this.reports.set(reportId, report);
    }
  }

  async deleteReport(reportId: string): Promise<void> {
    this.reports.delete(reportId);
  }

  async getUnreadCount(): Promise<number> {
    return Array.from(this.reports.values()).filter(r => !r.read).length;
  }
}

/**
 * PlayerStats Repository Implementation
 */
class MockPlayerStatsRepository implements IPlayerStatsRepository {
  private stats: PlayerStats = { ...INITIAL_STATS };

  async getStats(): Promise<PlayerStats> {
    return { ...this.stats };
  }

  async updateStats(stats: PlayerStats): Promise<void> {
    this.stats = { ...stats };
  }

  async incrementBattlesWon(): Promise<void> {
    this.stats.battlesWon++;
  }

  async incrementBattlesLost(): Promise<void> {
    this.stats.battlesLost++;
  }

  async incrementBuildingsUpgraded(): Promise<void> {
    this.stats.totalBuildingsUpgraded++;
  }

  async incrementUnitsTrained(count: number): Promise<void> {
    this.stats.totalUnitsTrained += count;
  }

  async addResourcesGathered(resources: Partial<PlayerStats['totalResourcesGathered']>): Promise<void> {
    Object.entries(resources).forEach(([key, value]) => {
      this.stats.totalResourcesGathered[key as keyof PlayerStats['totalResourcesGathered']] += value || 0;
    });
  }
}

/**
 * TechTree Repository Implementation
 */
class MockTechTreeRepository implements ITechTreeRepository {
  private techTree: TechTree = { ...INITIAL_TECH_TREE };

  async getTechTree(): Promise<TechTree> {
    return { ...this.techTree };
  }

  async updateTechTree(techTree: TechTree): Promise<void> {
    this.techTree = { ...techTree };
  }

  async unlockBuilding(buildingId: string): Promise<void> {
    if (!this.techTree.unlockedBuildings.includes(buildingId as any)) {
      this.techTree.unlockedBuildings.push(buildingId as any);
    }
  }

  async unlockUnit(unitId: string): Promise<void> {
    if (!this.techTree.unlockedUnits.includes(unitId as any)) {
      this.techTree.unlockedUnits.push(unitId as any);
    }
  }

  async upgradeSmithyLine(line: 'inf' | 'cav' | 'ranged' | 'siege', stat: 'attack' | 'defense'): Promise<void> {
    this.techTree.smithyUpgrades[line][stat]++;
  }

  async advanceEra(era: TechTree['era']): Promise<void> {
    this.techTree.era = era;
  }
}

/**
 * Province Repository Implementation
 */
class MockProvinceRepository implements IProvinceRepository {
  private provinces: Map<string, Province> = new Map();

  async getProvince(provinceId: string): Promise<Province | null> {
    const province = this.provinces.get(provinceId);
    return province ? { ...province } : null;
  }

  async getAllProvinces(): Promise<Province[]> {
    return Array.from(this.provinces.values()).map(p => ({ ...p }));
  }

  async updateProvince(province: Province): Promise<void> {
    this.provinces.set(province.id, { ...province });
  }

  async getProvincesInArea(x: number, y: number, radius: number): Promise<Province[]> {
    return Array.from(this.provinces.values())
      .filter(p => {
        const distance = Math.sqrt(Math.pow(p.x - x, 2) + Math.pow(p.y - y, 2));
        return distance <= radius;
      })
      .map(p => ({ ...p }));
  }
}

/**
 * NeutralCamp Repository Implementation
 */
class MockNeutralCampRepository implements INeutralCampRepository {
  private camps: Map<string, NeutralCamp> = new Map();

  async getCamp(campId: string): Promise<NeutralCamp | null> {
    const camp = this.camps.get(campId);
    return camp ? { ...camp } : null;
  }

  async getAllCamps(): Promise<NeutralCamp[]> {
    return Array.from(this.camps.values()).map(c => ({ ...c }));
  }

  async defeatCamp(campId: string): Promise<void> {
    this.camps.delete(campId);
  }

  async getCampsInProvince(provinceId: string): Promise<NeutralCamp[]> {
    // In a real implementation, this would filter by provinceId
    return this.getAllCamps();
  }
}

/**
 * Main Mock Repository - Aggregates all repositories
 */
export class MockRepository implements IRepository {
  public village: IVillageRepository;
  public gameState: IGameStateRepository;
  public march: IMarchRepository;
  public marchPreset: IMarchPresetRepository;
  public report: IReportRepository;
  public playerStats: IPlayerStatsRepository;
  public techTree: ITechTreeRepository;
  public province: IProvinceRepository;
  public neutralCamp: INeutralCampRepository;

  constructor() {
    this.village = new MockVillageRepository();
    this.gameState = new MockGameStateRepository();
    this.march = new MockMarchRepository();
    this.marchPreset = new MockMarchPresetRepository();
    this.report = new MockReportRepository();
    this.playerStats = new MockPlayerStatsRepository();
    this.techTree = new MockTechTreeRepository();
    this.province = new MockProvinceRepository();
    this.neutralCamp = new MockNeutralCampRepository();
  }
}