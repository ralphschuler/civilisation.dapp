import type { Meta, StoryObj } from "@storybook/react";
import { UnitsScreen } from "@/components/screens/UnitsScreen";
import type { Village } from "@/types/game";

const village: Village = {
  id: "v1",
  name: "Athen",
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
    bread: 0, clay: 0, coal: 0, gold: 0, iron: 0, meat: 0, villager: 0, wheat: 0, wood: 0,
  },
  buildings: {
    townhall: { type: "townhall", level: 3 },
    barracks: { type: "barracks", level: 5 },
  },
  army: { spearman: 40, swordsman: 20, archer: 10, knight: 0, trebuchet: 0 },
  trainingQueue: [],
  lastUpdate: Date.now(),
};

const meta: Meta<typeof UnitsScreen> = {
  title: "Screens/UnitsScreen",
  component: UnitsScreen,
  args: {
    village,
    resources: village.resources,
    onTrainUnit: () => {},
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

