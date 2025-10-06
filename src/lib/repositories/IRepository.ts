/**
 * Repository Interface - Abstraction for data access
 * Can be implemented with: Mock data, LocalStorage, IndexedDB, or API calls
 * Following Civilization Mobile Guidelines
 */

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

/**
 * Village Repository - Manages player villages
 */
export interface IVillageRepository {
  getVillage(villageId: string): Promise<Village>;
  updateVillage(village: Village): Promise<void>;
  getAllVillages(): Promise<Village[]>;
  createVillage(village: Village): Promise<void>;
  deleteVillage(villageId: string): Promise<void>;
  getVillageInfo(villageId: string): Promise<VillageInfo | null>;
}

/**
 * GameState Repository - Manages overall game state
 */
export interface IGameStateRepository {
  getGameState(): Promise<GameState>;
  saveGameState(state: GameState): Promise<void>;
  resetGameState(): Promise<void>;
  getLastUpdate(): Promise<number>;
}

/**
 * March Repository - Manages attacks and marches
 */
export interface IMarchRepository {
  getMarches(): Promise<March[]>;
  getMarch(marchId: string): Promise<March | null>;
  createMarch(march: Omit<March, 'id'>): Promise<March>;
  cancelMarch(marchId: string): Promise<void>;
  updateMarch(march: March): Promise<void>;
  getActiveMarchesForVillage(villageId: string): Promise<March[]>;
}

/**
 * MarchPreset Repository - Manages army presets
 */
export interface IMarchPresetRepository {
  getPresets(): Promise<MarchPreset[]>;
  getPreset(presetId: string): Promise<MarchPreset | null>;
  createPreset(preset: Omit<MarchPreset, 'id'>): Promise<MarchPreset>;
  updatePreset(preset: MarchPreset): Promise<void>;
  deletePreset(presetId: string): Promise<void>;
}

/**
 * Report Repository - Manages battle and spy reports
 */
export interface IReportRepository {
  getReports(): Promise<Report[]>;
  getReport(reportId: string): Promise<Report | null>;
  createReport(report: Omit<Report, 'id'>): Promise<Report>;
  markReportAsRead(reportId: string): Promise<void>;
  deleteReport(reportId: string): Promise<void>;
  getUnreadCount(): Promise<number>;
}

/**
 * PlayerStats Repository - Manages player statistics
 */
export interface IPlayerStatsRepository {
  getStats(): Promise<PlayerStats>;
  updateStats(stats: PlayerStats): Promise<void>;
  incrementBattlesWon(): Promise<void>;
  incrementBattlesLost(): Promise<void>;
  incrementBuildingsUpgraded(): Promise<void>;
  incrementUnitsTrained(count: number): Promise<void>;
  addResourcesGathered(resources: Partial<PlayerStats['totalResourcesGathered']>): Promise<void>;
}

/**
 * TechTree Repository - Manages technology progression
 */
export interface ITechTreeRepository {
  getTechTree(): Promise<TechTree>;
  updateTechTree(techTree: TechTree): Promise<void>;
  unlockBuilding(buildingId: BuildingId): Promise<void>;
  unlockUnit(unitId: UnitId): Promise<void>;
  upgradeSmithyLine(line: 'inf' | 'cav' | 'ranged' | 'siege', stat: 'attack' | 'defense'): Promise<void>;
  advanceEra(era: TechTree['era']): Promise<void>;
}

/**
 * Province Repository - Manages map provinces
 */
export interface IProvinceRepository {
  getProvince(provinceId: string): Promise<Province | null>;
  getAllProvinces(): Promise<Province[]>;
  updateProvince(province: Province): Promise<void>;
  getProvincesInArea(x: number, y: number, radius: number): Promise<Province[]>;
}

/**
 * NeutralCamp Repository - Manages PvE camps
 */
export interface INeutralCampRepository {
  getCamp(campId: string): Promise<NeutralCamp | null>;
  getAllCamps(): Promise<NeutralCamp[]>;
  defeatCamp(campId: string): Promise<void>;
  getCampsInProvince(provinceId: string): Promise<NeutralCamp[]>;
}

/**
 * Main Repository Interface - Aggregates all repositories
 * This is the single entry point for data access
 */
export interface IRepository {
  village: IVillageRepository;
  gameState: IGameStateRepository;
  march: IMarchRepository;
  marchPreset: IMarchPresetRepository;
  report: IReportRepository;
  playerStats: IPlayerStatsRepository;
  techTree: ITechTreeRepository;
  province: IProvinceRepository;
  neutralCamp: INeutralCampRepository;
}