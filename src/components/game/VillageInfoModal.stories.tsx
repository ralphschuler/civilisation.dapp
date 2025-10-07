import type { Meta, StoryObj } from "@storybook/react";
import { VillageInfoModal } from "@/components/game/VillageInfoModal";

const playerVillage = {
  id: "v-100",
  name: "Korinth",
  x: 132,
  y: 87,
  level: 12,
  player: "Alexios",
  points: 12430,
  population: 220,
  maxPopulation: 300,
  buildings: {
    townhall: 6,
    barracks: 4,
    wall: 5,
    storage: 6,
    farm: 7,
    market: 3,
  },
  army: {
    spearman: 120,
    soldier: 80,
    archer: 60,
    knight: 12,
    trebuchet: 2,
  },
  wall: 5,
  lastActivity: "vor 12 Min",
  alliance: "Hellenen",
  playerRank: 57,
  defenseBonus: 25,
};

const barbarianVillage = {
  id: "v-200",
  name: "Barbarendorf (Ruinen)",
  x: 148,
  y: 102,
  level: 5,
  player: null,
  points: 2100,
  population: 60,
  maxPopulation: 120,
  buildings: {
    townhall: 2,
    wall: 1,
    storage: 2,
  },
  army: {
    spearman: 15,
    soldier: 0,
    archer: 8,
    knight: 0,
    trebuchet: 0,
  },
  wall: 1,
  lastActivity: "unbekannt",
  defenseBonus: 5,
};

const strongVillage = {
  id: "v-300",
  name: "Theben",
  x: 90,
  y: 60,
  level: 21,
  player: "Leonidas",
  points: 45210,
  population: 900,
  maxPopulation: 1200,
  buildings: {
    townhall: 15,
    barracks: 14,
    wall: 12,
    storage: 12,
    market: 10,
    farm: 13,
  },
  army: {
    spearman: 600,
    soldier: 420,
    archer: 350,
    knight: 85,
    trebuchet: 12,
  },
  wall: 12,
  lastActivity: "vor 3 Min",
  alliance: "Spartaner",
  playerRank: 9,
  defenseBonus: 60,
};

const meta: Meta<typeof VillageInfoModal> = {
  title: "Game/VillageInfoModal",
  component: VillageInfoModal,
  args: {
    isOpen: true,
    myVillageCoords: { x: 100, y: 80 },
    onClose: () => {},
    onAttack: () => {},
    onSpy: () => {},
    onTrade: () => {},
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const PlayerVillage: Story = {
  args: { villageInfo: playerVillage },
};

export const Barbarian: Story = {
  args: { villageInfo: barbarianVillage },
};

export const StrongPlayerVillage: Story = {
  args: { villageInfo: strongVillage },
};
