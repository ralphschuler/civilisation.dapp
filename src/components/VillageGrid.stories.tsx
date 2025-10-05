import type { Meta, StoryObj } from "@storybook/react";
import { VillageGrid } from "./VillageGrid";

const buildings = {
  townhall: { type: "townhall", level: 3 },
  barracks: { type: "barracks", level: 0 },
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
};

const meta: Meta<typeof VillageGrid> = {
  title: "App/VillageGrid",
  component: VillageGrid,
  args: {
    buildings,
    selectedBuilding: null,
  },
  argTypes: {
    onBuildingSelect: { action: "select" },
    onUpgradeBuilding: { action: "upgrade" },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const WithSelection: Story = {
  args: { selectedBuilding: "woodcutter" },
};

