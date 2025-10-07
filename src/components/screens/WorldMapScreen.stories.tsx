import type { Meta, StoryObj } from "@storybook/react";
import { WorldMapScreen } from "@/components/screens/WorldMapScreen";
import type { Village } from "@/types/game";

const village: Village = {
  id: "v1",
  name: "Athen",
  x: 25000,
  y: 25000,
  resources: {
    bread: 0,
    clay: 0,
    coal: 0,
    gold: 0,
    iron: 0,
    meat: 0,
    villager: 0,
    wheat: 0,
    wood: 0,
    maxPopulation: 0,
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
  buildings: {},
  army: {},
  trainingQueue: [],
  lastUpdate: Date.now(),
};

const meta: Meta<typeof WorldMapScreen> = {
  title: "Screens/WorldMapScreen",
  component: WorldMapScreen,
  render: (args) => (
    <div style={{ height: "70vh", border: "1px solid #e5e7eb" }}>
      <WorldMapScreen {...args} />
    </div>
  ),
  args: {
    village,
    marches: [],
    marchPresets: [],
    onVillageSelect: () => {},
    onVillageInfo: () => {},
    onCreateMarch: () => {},
    onCancelMarch: () => {},
    onCreatePreset: () => {},
    onDeletePreset: () => {},
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
