/**
 * LocalStorage Repository Implementation
 * Persists data in browser's localStorage
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
  VillageInfo,
  BuildingId,
  UnitId,
} from '@/types/game';
import { Report } from '@/types/reports';

// Storage keys
const STORAGE_KEYS = {
  VILLAGES: 'civ_mobile_villages',
  GAME_STATE: 'civ_mobile_game_state',
  MARCHES: 'civ_mobile_marches',
  MARCH_PRESETS: 'civ_mobile_march_presets',
  REPORTS: 'civ_mobile_reports',
  PLAYER_STATS: 'civ_mobile_player_stats',
  TECH_TREE: 'civ_mobile_tech_tree',
  PROVINCES: 'civ_mobile_provinces',
  NEUTRAL_CAMPS: 'civ_mobile_neutral_camps',
} as const;

// Minimal initial data to seed a fresh install
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

/**
 * Helper to safely get from localStorage
 */
function getFromStorage<T>(key: string, defaultValue: T): T {
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : defaultValue;
  } catch (error) {
    console.error(`Error reading from localStorage (${key}):`, error);
    return defaultValue;
  }
}

/**
 * Helper to safely save to localStorage
 */
function saveToStorage<T>(key: string, value: T): void {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    console.error(`Error writing to localStorage (${key}):`, error);
  }
}

/**
 * Village Repository Implementation
 */
class LocalStorageVillageRepository implements IVillageRepository {
  private getVillages(): Map<string, Village> {
    const villages = getFromStorage<Record<string, Village>>(STORAGE_KEYS.VILLAGES, {});
    return new Map(Object.entries(villages));
  }

  private saveVillages(villages: Map<string, Village>): void {
    const villagesObj = Object.fromEntries(villages);
    saveToStorage(STORAGE_KEYS.VILLAGES, villagesObj);
  }

  async getVillage(villageId: string): Promise<Village> {
    const villages = this.getVillages();
    const village = villages.get(villageId);
    if (village) return village;
    // Seed default village on first access
    if (villageId === 'village1') {
      villages.set('village1', INITIAL_VILLAGE);
      this.saveVillages(villages);
      return INITIAL_VILLAGE;
    }
    throw new Error(`Village ${villageId} not found`);
  }

  async updateVillage(village: Village): Promise<void> {
    const villages = this.getVillages();
    villages.set(village.id, village);
    this.saveVillages(villages);
  }

  async getAllVillages(): Promise<Village[]> {
    const villages = this.getVillages();
    return Array.from(villages.values());
  }

  async createVillage(village: Village): Promise<void> {
    const villages = this.getVillages();
    villages.set(village.id, village);
    this.saveVillages(villages);
  }

  async deleteVillage(villageId: string): Promise<void> {
    const villages = this.getVillages();
    villages.delete(villageId);
    this.saveVillages(villages);
  }

  async getVillageInfo(villageId: string): Promise<VillageInfo | null> {
    try {
      const village = await this.getVillage(villageId);
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
    } catch {
      return null;
    }
  }
}

/**
 * GameState Repository Implementation
 */
class LocalStorageGameStateRepository implements IGameStateRepository {
  async getGameState(): Promise<GameState> {
    return getFromStorage<GameState>(STORAGE_KEYS.GAME_STATE, {} as GameState);
  }

  async saveGameState(state: GameState): Promise<void> {
    saveToStorage(STORAGE_KEYS.GAME_STATE, state);
  }

  async resetGameState(): Promise<void> {
    localStorage.removeItem(STORAGE_KEYS.GAME_STATE);
  }

  async getLastUpdate(): Promise<number> {
    const state = await this.getGameState();
    return state.village?.lastUpdate || Date.now();
  }
}

/**
 * March Repository Implementation
 */
class LocalStorageMarchRepository implements IMarchRepository {
  private readMarches(): Map<string, March> {
    const marches = getFromStorage<Record<string, March>>(STORAGE_KEYS.MARCHES, {});
    return new Map(Object.entries(marches));
  }

  private saveMarches(marches: Map<string, March>): void {
    const marchesObj = Object.fromEntries(marches);
    saveToStorage(STORAGE_KEYS.MARCHES, marchesObj);
  }

  async getMarches(): Promise<March[]> {
    const marches = this.readMarches();
    return Array.from(marches.values());
  }

  async getMarch(marchId: string): Promise<March | null> {
    const marches = this.readMarches();
    return marches.get(marchId) || null;
  }

  async createMarch(march: Omit<March, 'id'>): Promise<March> {
    const marches = this.readMarches();
    const id = `march_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const newMarch = { ...march, id };
    marches.set(id, newMarch);
    this.saveMarches(marches);
    return newMarch;
  }

  async cancelMarch(marchId: string): Promise<void> {
    const marches = this.readMarches();
    marches.delete(marchId);
    this.saveMarches(marches);
  }

  async updateMarch(march: March): Promise<void> {
    const marches = this.readMarches();
    marches.set(march.id, march);
    this.saveMarches(marches);
  }

  async getActiveMarchesForVillage(villageId: string): Promise<March[]> {
    const marches = await this.getMarches();
    return marches.filter(
      m => m.fromVillage.id === villageId && 
           m.status !== 'completed' && 
           m.status !== 'cancelled'
    );
  }
}

/**
 * MarchPreset Repository Implementation
 */
class LocalStorageMarchPresetRepository implements IMarchPresetRepository {
  private readPresets(): Map<string, MarchPreset> {
    const presets = getFromStorage<Record<string, MarchPreset>>(STORAGE_KEYS.MARCH_PRESETS, {});
    return new Map(Object.entries(presets));
  }

  private savePresets(presets: Map<string, MarchPreset>): void {
    const presetsObj = Object.fromEntries(presets);
    saveToStorage(STORAGE_KEYS.MARCH_PRESETS, presetsObj);
  }

  async getPresets(): Promise<MarchPreset[]> {
    const presets = this.readPresets();
    return Array.from(presets.values());
  }

  async getPreset(presetId: string): Promise<MarchPreset | null> {
    const presets = this.readPresets();
    return presets.get(presetId) || null;
  }

  async createPreset(preset: Omit<MarchPreset, 'id'>): Promise<MarchPreset> {
    const presets = this.readPresets();
    const id = `preset_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const newPreset = { ...preset, id };
    presets.set(id, newPreset);
    this.savePresets(presets);
    return newPreset;
  }

  async updatePreset(preset: MarchPreset): Promise<void> {
    const presets = this.readPresets();
    presets.set(preset.id, preset);
    this.savePresets(presets);
  }

  async deletePreset(presetId: string): Promise<void> {
    const presets = this.readPresets();
    const preset = presets.get(presetId);
    if (preset?.isDefault) {
      throw new Error('Cannot delete default preset');
    }
    presets.delete(presetId);
    this.savePresets(presets);
  }
}

/**
 * Report Repository Implementation
 */
class LocalStorageReportRepository implements IReportRepository {
  private readReports(): Map<string, Report> {
    const reports = getFromStorage<Record<string, Report>>(STORAGE_KEYS.REPORTS, {});
    return new Map(Object.entries(reports));
  }

  private saveReports(reports: Map<string, Report>): void {
    const reportsObj = Object.fromEntries(reports);
    saveToStorage(STORAGE_KEYS.REPORTS, reportsObj);
  }

  async getReports(): Promise<Report[]> {
    const reports = this.readReports();
    return Array.from(reports.values()).sort((a, b) => b.timestamp - a.timestamp);
  }

  async getReport(reportId: string): Promise<Report | null> {
    const reports = this.readReports();
    return reports.get(reportId) || null;
  }

  async createReport(report: Omit<Report, 'id'>): Promise<Report> {
    const reports = this.readReports();
    const id = `report_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const newReport = { ...report, id } as Report;
    reports.set(id, newReport);
    this.saveReports(reports);
    return newReport;
  }

  async markReportAsRead(reportId: string): Promise<void> {
    const reports = this.readReports();
    const report = reports.get(reportId);
    if (report) {
      reports.set(reportId, { ...report, read: true });
      this.saveReports(reports);
    }
  }

  async deleteReport(reportId: string): Promise<void> {
    const reports = this.readReports();
    reports.delete(reportId);
    this.saveReports(reports);
  }

  async getUnreadCount(): Promise<number> {
    const reports = this.readReports();
    return Array.from(reports.values()).filter(r => !r.read).length;
  }
}

/**
 * PlayerStats Repository Implementation
 */
class LocalStoragePlayerStatsRepository implements IPlayerStatsRepository {
  async getStats(): Promise<PlayerStats> {
    return getFromStorage<PlayerStats>(STORAGE_KEYS.PLAYER_STATS, {
      totalResourcesGathered: {
        bread: 0, clay: 0, coal: 0, gold: 0, iron: 0,
        meat: 0, villager: 0, wheat: 0, wood: 0
      },
      totalUnitsTrained: 0,
      totalBuildingsUpgraded: 0,
      battlesWon: 0,
      battlesLost: 0,
      playtime: 0
    });
  }

  async updateStats(stats: PlayerStats): Promise<void> {
    saveToStorage(STORAGE_KEYS.PLAYER_STATS, stats);
  }

  async incrementBattlesWon(): Promise<void> {
    const stats = await this.getStats();
    stats.battlesWon++;
    await this.updateStats(stats);
  }

  async incrementBattlesLost(): Promise<void> {
    const stats = await this.getStats();
    stats.battlesLost++;
    await this.updateStats(stats);
  }

  async incrementBuildingsUpgraded(): Promise<void> {
    const stats = await this.getStats();
    stats.totalBuildingsUpgraded++;
    await this.updateStats(stats);
  }

  async incrementUnitsTrained(count: number): Promise<void> {
    const stats = await this.getStats();
    stats.totalUnitsTrained += count;
    await this.updateStats(stats);
  }

  async addResourcesGathered(resources: Partial<PlayerStats['totalResourcesGathered']>): Promise<void> {
    const stats = await this.getStats();
    Object.entries(resources).forEach(([key, value]) => {
      stats.totalResourcesGathered[key as keyof PlayerStats['totalResourcesGathered']] += value || 0;
    });
    await this.updateStats(stats);
  }
}

/**
 * TechTree Repository Implementation
 */
class LocalStorageTechTreeRepository implements ITechTreeRepository {
  async getTechTree(): Promise<TechTree> {
    return getFromStorage<TechTree>(STORAGE_KEYS.TECH_TREE, {
      era: 'village',
      unlockedBuildings: ['townhall', 'house', 'farm', 'woodcutter', 'claypit'],
      unlockedUnits: ['spearman', 'archer'],
      smithyUpgrades: {
        inf: { attack: 0, defense: 0 },
        cav: { attack: 0, defense: 0 },
        ranged: { attack: 0, defense: 0 },
        siege: { attack: 0, defense: 0 }
      }
    });
  }

  async updateTechTree(techTree: TechTree): Promise<void> {
    saveToStorage(STORAGE_KEYS.TECH_TREE, techTree);
  }

  async unlockBuilding(buildingId: BuildingId): Promise<void> {
    const techTree = await this.getTechTree();
    if (techTree.unlockedBuildings.includes(buildingId)) {
      return;
    }

    const updated: TechTree = {
      ...techTree,
      unlockedBuildings: [...techTree.unlockedBuildings, buildingId],
    };

    await this.updateTechTree(updated);
  }

  async unlockUnit(unitId: UnitId): Promise<void> {
    const techTree = await this.getTechTree();
    if (techTree.unlockedUnits.includes(unitId)) {
      return;
    }

    const updated: TechTree = {
      ...techTree,
      unlockedUnits: [...techTree.unlockedUnits, unitId],
    };

    await this.updateTechTree(updated);
  }

  async upgradeSmithyLine(line: 'inf' | 'cav' | 'ranged' | 'siege', stat: 'attack' | 'defense'): Promise<void> {
    const techTree = await this.getTechTree();
    techTree.smithyUpgrades[line][stat]++;
    await this.updateTechTree(techTree);
  }

  async advanceEra(era: TechTree['era']): Promise<void> {
    const techTree = await this.getTechTree();
    techTree.era = era;
    await this.updateTechTree(techTree);
  }
}

/**
 * Province Repository Implementation
 */
class LocalStorageProvinceRepository implements IProvinceRepository {
  private getProvinces(): Map<string, Province> {
    const provinces = getFromStorage<Record<string, Province>>(STORAGE_KEYS.PROVINCES, {});
    return new Map(Object.entries(provinces));
  }

  private saveProvinces(provinces: Map<string, Province>): void {
    const provincesObj = Object.fromEntries(provinces);
    saveToStorage(STORAGE_KEYS.PROVINCES, provincesObj);
  }

  async getProvince(provinceId: string): Promise<Province | null> {
    const provinces = this.getProvinces();
    return provinces.get(provinceId) || null;
  }

  async getAllProvinces(): Promise<Province[]> {
    const provinces = this.getProvinces();
    return Array.from(provinces.values());
  }

  async updateProvince(province: Province): Promise<void> {
    const provinces = this.getProvinces();
    provinces.set(province.id, province);
    this.saveProvinces(provinces);
  }

  async getProvincesInArea(x: number, y: number, radius: number): Promise<Province[]> {
    const provinces = await this.getAllProvinces();
    return provinces.filter(p => {
      const distance = Math.sqrt(Math.pow(p.x - x, 2) + Math.pow(p.y - y, 2));
      return distance <= radius;
    });
  }
}

/**
 * NeutralCamp Repository Implementation
 */
class LocalStorageNeutralCampRepository implements INeutralCampRepository {
  private getCamps(): Map<string, NeutralCamp> {
    const camps = getFromStorage<Record<string, NeutralCamp>>(STORAGE_KEYS.NEUTRAL_CAMPS, {});
    return new Map(Object.entries(camps));
  }

  private saveCamps(camps: Map<string, NeutralCamp>): void {
    const campsObj = Object.fromEntries(camps);
    saveToStorage(STORAGE_KEYS.NEUTRAL_CAMPS, campsObj);
  }

  async getCamp(campId: string): Promise<NeutralCamp | null> {
    const camps = this.getCamps();
    return camps.get(campId) || null;
  }

  async getAllCamps(): Promise<NeutralCamp[]> {
    const camps = this.getCamps();
    return Array.from(camps.values());
  }

  async defeatCamp(campId: string): Promise<void> {
    const camps = this.getCamps();
    camps.delete(campId);
    this.saveCamps(camps);
  }

  async getCampsInProvince(_provinceId: string): Promise<NeutralCamp[]> {
    // In a real implementation, this would filter by provinceId
    return this.getAllCamps();
  }
}

/**
 * Main LocalStorage Repository - Aggregates all repositories
 */
export class LocalStorageRepository implements IRepository {
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
    this.village = new LocalStorageVillageRepository();
    this.gameState = new LocalStorageGameStateRepository();
    this.march = new LocalStorageMarchRepository();
    this.marchPreset = new LocalStorageMarchPresetRepository();
    this.report = new LocalStorageReportRepository();
    this.playerStats = new LocalStoragePlayerStatsRepository();
    this.techTree = new LocalStorageTechTreeRepository();
    this.province = new LocalStorageProvinceRepository();
    this.neutralCamp = new LocalStorageNeutralCampRepository();
  }
}
