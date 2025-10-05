import type { Meta, StoryObj } from "@storybook/react";
import { MemoryRouter } from "react-router-dom";
import { StatsScreen } from "@/components/screens/StatsScreen";
import type { Village, PlayerStats } from "@/types/game";

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
    bread: 0,
    clay: 0,
    coal: 0,
    gold: 0,
    iron: 0,
    meat: 0,
    villager: 0,
    wheat: 0,
    wood: 0,
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

const playerStats: PlayerStats = {
  totalResourcesGathered: {
    bread: 12000,
    clay: 34000,
    coal: 5000,
    gold: 1200,
    iron: 22000,
    meat: 8000,
    villager: 0,
    wheat: 26000,
    wood: 48000,
  },
  totalUnitsTrained: 680,
  totalBuildingsUpgraded: 54,
  battlesWon: 23,
  battlesLost: 5,
  playtime: 3600 * 27, // seconds
};

const meta: Meta<typeof StatsScreen> = {
  title: "Screens/StatsScreen",
  component: StatsScreen,
  decorators: [
    (Story) => (
      <MemoryRouter>
        <Story />
      </MemoryRouter>
    ),
  ],
  args: {
    village,
    resources: village.resources,
    playerStats,
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
