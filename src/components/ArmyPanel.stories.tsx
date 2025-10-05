import type { Meta, StoryObj } from "@storybook/react";
import { ArmyPanel } from "@/components/ArmyPanel";

const emptyArmy = { spearman: 0, swordsman: 0, archer: 0, knight: 0, trebuchet: 0 };
const lowBuildings = {
  townhall: { type: "townhall", level: 1 },
  barracks: { type: "barracks", level: 0 },
};
const resources = {
  bread: 100,
  clay: 500,
  coal: 50,
  gold: 20,
  iron: 300,
  meat: 40,
  villager: 10,
  wheat: 200,
  wood: 600,
  maxPopulation: 240,
};

const meta: Meta<typeof ArmyPanel> = {
  title: "App/ArmyPanel",
  component: ArmyPanel,
  args: {
    army: emptyArmy,
    buildings: lowBuildings as any,
    resources,
  },
  argTypes: { onTrainUnit: { action: "train" } },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const NoBarracks: Story = {};

export const BarracksLevel1: Story = {
  args: {
    buildings: { townhall: { type: "townhall", level: 2 }, barracks: { type: "barracks", level: 1 } } as any,
    resources: {
      bread: 500,
      clay: 1500,
      coal: 100,
      gold: 50,
      iron: 1200,
      meat: 120,
      villager: 50,
      wheat: 800,
      wood: 2000,
      maxPopulation: 300,
    },
  },
};

export const BarracksLevel10Rich: Story = {
  args: {
    buildings: { townhall: { type: "townhall", level: 10 }, barracks: { type: "barracks", level: 10 } } as any,
    resources: {
      bread: 5000,
      clay: 12000,
      coal: 2000,
      gold: 1500,
      iron: 10000,
      meat: 3000,
      villager: 180,
      wheat: 9000,
      wood: 15000,
      maxPopulation: 400,
    },
  },
};

export const WithArmyOverview: Story = {
  args: {
    army: { spearman: 120, swordsman: 60, archer: 45, knight: 10, trebuchet: 2 },
  },
};

export const NotEnoughResources: Story = {
  args: {
    buildings: { townhall: { type: "townhall", level: 3 }, barracks: { type: "barracks", level: 5 } } as any,
    resources: {
      bread: 1,
      clay: 2,
      coal: 0,
      gold: 0,
      iron: 3,
      meat: 0,
      villager: 0,
      wheat: 2,
      wood: 5,
      maxPopulation: 10,
    },
  },
};
