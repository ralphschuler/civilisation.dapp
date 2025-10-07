import type { Meta, StoryObj } from "@storybook/react";
import { GameHeader } from "@/components/game/GameHeader";
import type { Village } from "@/types/game";

const sampleVillage: Village = {
  id: "v1",
  name: "Athen",
  x: 100,
  y: 200,
  resources: {
    bread: 500,
    clay: 800,
    coal: 120,
    gold: 75,
    iron: 300,
    meat: 200,
    villager: 150,
    wheat: 420,
    wood: 900,
    maxPopulation: 300,
  },
  uncollectedResources: {
    bread: 10,
    clay: 5,
    coal: 2,
    gold: 0,
    iron: 6,
    meat: 3,
    villager: 0,
    wheat: 8,
    wood: 12,
  },
  buildings: {
    townhall: { type: "townhall", level: 3 },
    storage: { type: "storage", level: 3 },
    woodcutter: { type: "woodcutter", level: 4 },
    claypit: { type: "claypit", level: 3 },
    ironmine: { type: "ironmine", level: 2 },
    coalpit: { type: "coalpit", level: 1 },
    barracks: { type: "barracks", level: 2 },
    wall: { type: "wall", level: 1 },
    house: { type: "house", level: 5 },
    market: { type: "market", level: 1 },
    farm: { type: "farm", level: 3 },
    bakery: { type: "bakery", level: 1 },
    huntershut: { type: "huntershut", level: 1 },
    fisher: { type: "fisher", level: 1 },
  },
  army: {
    spearman: 40,
    swordsman: 20,
    archer: 10,
  },
  trainingQueue: [],
  lastUpdate: Date.now(),
};

const meta: Meta<typeof GameHeader> = {
  title: "Game/GameHeader",
  component: GameHeader,
  args: {
    village: sampleVillage,
    onSettingsClick: () => console.log("Settings clicked"),
    onProfileClick: () => console.log("Profile clicked"),
    onNotificationsClick: () => console.log("Notifications clicked"),
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const WithHandlers: Story = {
  name: "With Click Handlers",
  args: {
    onSettingsClick: () => alert("Settings clicked"),
    onProfileClick: () => alert("Profile clicked"),
    onNotificationsClick: () => alert("Notifications clicked"),
  },
};
