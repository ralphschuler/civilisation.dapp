import type { Meta, StoryObj } from "@storybook/react";
import { useState } from "react";
import { BuildingModal } from "./BuildingModal";

const resources = {
  bread: 200,
  clay: 1200,
  coal: 50,
  gold: 40,
  iron: 800,
  meat: 60,
  villager: 120,
  wheat: 400,
  wood: 1500,
  maxPopulation: 300,
};

const meta: Meta<typeof BuildingModal> = {
  title: "App/BuildingModal",
  component: BuildingModal,
  args: {
    isOpen: true,
    resources,
    onClose: () => {},
    onUpgrade: () => {},
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const TownhallLevel1: Story = {
  render: (args) => {
    const [open, setOpen] = useState(true);
    return (
      <BuildingModal
        {...args}
        isOpen={open}
        onClose={() => setOpen(false)}
        building={{ type: "townhall", level: 1 }}
      />
    );
  },
};

export const WallLevel5: Story = {
  args: {
    building: { type: "wall", level: 5 },
  },
};

export const WoodcutterLevel3: Story = {
  args: {
    building: { type: "woodcutter", level: 3 },
  },
};

export const BarracksLevel5: Story = {
  args: {
    building: { type: "barracks", level: 5 },
  },
};

export const StorageMaxed: Story = {
  name: "Storage Max Level",
  args: {
    building: { type: "storage", level: 30 },
  },
};

export const ExpensiveUpgradeNotAffordable: Story = {
  name: "Not Enough Resources",
  args: {
    building: { type: "market", level: 10 },
    resources: {
      bread: 0,
      clay: 10,
      coal: 0,
      gold: 0,
      iron: 10,
      meat: 0,
      villager: 50,
      wheat: 0,
      wood: 10,
      maxPopulation: 300,
    },
  },
};
