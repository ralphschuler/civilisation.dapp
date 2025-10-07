export type ReportType = "battle" | "trade" | "spy" | "building" | "event" | "system";

export interface BattleResult {
  attacker: {
    village: string;
    player: string;
    units: Record<string, { sent: number; lost: number }>;
  };
  defender: {
    village: string;
    player: string;
    units: Record<string, { defending: number; lost: number }>;
  };
  result: "victory" | "defeat" | "draw";
  loot?: Record<string, number>;
  wallDamage?: number;
  reasons?: {
    counter: string[];
    wall: string[];
    tech: string[];
    terrain: string[];
    moral: string[];
  };
  suggestions?: string[];
  phases: {
    ranged: { attackerLosses: Record<string, number>; defenderLosses: Record<string, number> };
    charge: { attackerLosses: Record<string, number>; defenderLosses: Record<string, number> };
    melee: { attackerLosses: Record<string, number>; defenderLosses: Record<string, number> };
    siege: { wallDamage: number };
  };
}

export interface Report {
  id: string;
  type: ReportType;
  title: string;
  summary: string;
  timestamp: number;
  read: boolean;
  important?: boolean;
  archived?: boolean;

  // Type-specific data
  battleData?: BattleResult;
  tradeData?: {
    partner: string;
    sent: Record<string, number>;
    received: Record<string, number>;
  };
  spyData?: {
    target: string;
    discovered: boolean;
    resources?: Record<string, number>;
    units?: Record<string, number>;
    buildings?: Record<string, number>;
  };
  buildingData?: {
    building: string;
    level: number;
    village: string;
  };
  eventData?: {
    event: string;
    effects: string[];
  };
}
