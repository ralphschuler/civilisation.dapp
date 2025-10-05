import type { Meta, StoryObj } from "@storybook/react";
import { MarchReportsScreen } from "@/components/screens/MarchReportsScreen";
import type { March, BattleReport, Army } from "@/types/game";

const makeArmy = (a: Partial<Army>): Army => ({
  spearman: 0,
  swordsman: 0,
  axeman: 0,
  archer: 0,
  crossbow: 0,
  lightcav: 0,
  knight: 0,
  pikeman: 0,
  ram: 0,
  trebuchet: 0,
  ...a,
});

const now = Date.now();

const battleReports: BattleReport[] = [
  {
    id: "br-1",
    timestamp: now - 1000 * 60 * 45,
    attacker: "Athen",
    defender: "Eisengrund",
    attackType: "raid",
    attackerArmy: makeArmy({ lightcav: 30, archer: 15 }),
    defenderArmy: makeArmy({ spearman: 20, swordsman: 10 }),
    attackerLosses: makeArmy({ lightcav: 3, archer: 1 }),
    defenderLosses: makeArmy({ spearman: 12, swordsman: 6 }),
    winner: "attacker",
    loot: { wood: 600, iron: 800, gold: 200 },
    factors: { counter: 10, wall: 0, moral: 5, tech: 10, terrain: 10, variance: 5 },
    suggestions: ["Mehr Reiter für schnelle Raids"],
    replay: [
      { phase: "ranged", attackerUnits: makeArmy({ archer: 15 }), defenderUnits: makeArmy({ spearman: 20 }), damage: { attacker: 2, defender: 10 } },
      { phase: "charge", attackerUnits: makeArmy({ lightcav: 30 }), defenderUnits: makeArmy({ swordsman: 10 }), damage: { attacker: 3, defender: 12 } },
    ],
  },
  {
    id: "br-2",
    timestamp: now - 1000 * 60 * 120,
    attacker: "Athen",
    defender: "Steinburg",
    attackType: "siege",
    attackerArmy: makeArmy({ ram: 5, swordsman: 40 }),
    defenderArmy: makeArmy({ spearman: 30, pikeman: 25 }),
    attackerLosses: makeArmy({ ram: 2, swordsman: 15 }),
    defenderLosses: makeArmy({ spearman: 18, pikeman: 10 }),
    winner: "defender",
    factors: { counter: 25, wall: 20, moral: 0, tech: 5, terrain: 10, variance: 5 },
    suggestions: ["Mehr Rammböcke mitnehmen", "Bogenschützen gegen Piken"],
    replay: [
      { phase: "siege", attackerUnits: makeArmy({ ram: 5 }), defenderUnits: makeArmy({}), damage: { attacker: 0, defender: 0 } },
      { phase: "melee", attackerUnits: makeArmy({ swordsman: 40 }), defenderUnits: makeArmy({ spearman: 30, pikeman: 25 }), damage: { attacker: 20, defender: 25 } },
    ],
  },
];

const marches: March[] = [
  {
    id: "m1",
    type: "raid",
    status: "completed",
    fromVillage: { id: "v1", name: "Athen", x: 100, y: 200 },
    targetVillage: { id: "v2", name: "Eisengrund", x: 110, y: 210, player: "Neuling42" },
    army: makeArmy({ lightcav: 30, archer: 15 }),
    departureTime: now - 1000 * 60 * 90,
    arrivalTime: now - 1000 * 60 * 60,
    returnTime: now - 1000 * 60 * 30,
    carry: 1000,
    loot: { wood: 600, iron: 800, gold: 200 },
    battleReport: battleReports[0],
    distance: 14,
    travelSpeed: 12,
  },
  {
    id: "m2",
    type: "siege",
    status: "completed",
    fromVillage: { id: "v1", name: "Athen", x: 100, y: 200 },
    targetVillage: { id: "v3", name: "Steinburg", x: 140, y: 240, player: "Boss77" },
    army: makeArmy({ ram: 5, swordsman: 40 }),
    departureTime: now - 1000 * 60 * 240,
    arrivalTime: now - 1000 * 60 * 180,
    returnTime: now - 1000 * 60 * 120,
    carry: 0,
    battleReport: battleReports[1],
    distance: 25,
    travelSpeed: 8,
  },
  {
    id: "m3",
    type: "raid",
    status: "returning",
    fromVillage: { id: "v1", name: "Athen", x: 100, y: 200 },
    targetVillage: { id: "v4", name: "Holzheim", x: 120, y: 210, player: "Holzi" },
    army: makeArmy({ lightcav: 20 }),
    departureTime: now - 1000 * 60 * 30,
    arrivalTime: now - 1000 * 60 * 10,
    returnTime: now + 1000 * 60 * 10,
    carry: 800,
    loot: { wood: 500 },
    distance: 10,
    travelSpeed: 12,
  },
];

const meta: Meta<typeof MarchReportsScreen> = {
  title: "Screens/MarchReportsScreen",
  component: MarchReportsScreen,
  args: {
    marches,
    battleReports,
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
