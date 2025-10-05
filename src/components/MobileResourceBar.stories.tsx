import type { Meta, StoryObj } from "@storybook/react";
import { MobileResourceBar } from "./MobileResourceBar";

const baseResources = {
  bread: 220,
  clay: 1350,
  coal: 80,
  gold: 12,
  iron: 640,
  meat: 95,
  villager: 190,
  wheat: 410,
  wood: 1540,
  maxPopulation: 300,
};

const baseUncollected = {
  bread: 12,
  clay: 5,
  coal: 2,
  gold: 0,
  iron: 6,
  meat: 3,
  villager: 0,
  wheat: 8,
  wood: 12,
};

const buildingLevels = {
  woodcutter: { level: 6 },
  claypit: { level: 5 },
  ironmine: { level: 4 },
  coalpit: { level: 2 },
  farm: { level: 4 },
  bakery: { level: 2 },
  huntershut: { level: 2 },
  fisher: { level: 1 },
  market: { level: 2 },
};

const meta: Meta<typeof MobileResourceBar> = {
  title: "App/MobileResourceBar",
  component: MobileResourceBar,
  args: {
    resources: baseResources,
    uncollectedResources: baseUncollected,
    buildingLevels,
    storageCapacity: 5000,
  },
  argTypes: { onCollectResources: { action: "collect" } },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const WithCollect: Story = {
  args: { onCollectResources: () => {} },
};

