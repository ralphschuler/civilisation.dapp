import type { Meta, StoryObj } from "@storybook/react";
import { VillageScreen } from "./VillageScreen";
import type { Village } from "../../types/game";

const village: Village = {
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
    farm: { type: "farm", level: 3 },
    bakery: { type: "bakery", level: 1 },
    huntershut: { type: "huntershut", level: 1 },
    house: { type: "house", level: 5 },
    market: { type: "market", level: 1 },
    wall: { type: "wall", level: 1 },
    coalpit: { type: "coalpit", level: 0 },
    fisher: { type: "fisher", level: 0 },
    barracks: { type: "barracks", level: 2 },
  },
  army: { spearman: 20, swordsman: 10, archer: 5, knight: 0, trebuchet: 0 },
  trainingQueue: [],
  lastUpdate: Date.now(),
};

const meta: Meta<typeof VillageScreen> = {
  title: "Screens/VillageScreen",
  component: VillageScreen,
  args: {
    village,
    selectedBuilding: null,
    onBuildingSelect: () => {},
    onUpgradeBuilding: () => {},
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

