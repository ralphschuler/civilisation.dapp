import type { Meta, StoryObj } from "@storybook/react";
import { MarchPlannerScreen } from "@/components/screens/MarchPlannerScreen";
import type { Village, March, MarchPreset } from "@/types/game";

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
  uncollectedResources: { bread: 0, clay: 0, coal: 0, gold: 0, iron: 0, meat: 0, villager: 0, wheat: 0, wood: 0 },
  buildings: { townhall: { type: "townhall", level: 3 } },
  army: { spearman: 50, swordsman: 30, axeman: 10, archer: 20, crossbow: 0, lightcav: 15, knight: 2, pikeman: 0, ram: 1, trebuchet: 0 },
  trainingQueue: [],
  lastUpdate: Date.now(),
};

const marches: March[] = [
  {
    id: "m1",
    type: "raid",
    status: "planning",
    fromVillage: { id: "v1", name: "Athen", x: 100, y: 200 },
    targetVillage: { id: "v2", name: "Holzheim", x: 110, y: 210, player: "Holzi" },
    army: { spearman: 10, lightcav: 10 },
    departureTime: Date.now() + 5 * 60 * 1000,
    arrivalTime: Date.now() + 35 * 60 * 1000,
    carry: 600,
    distance: 14,
    travelSpeed: 12,
    notes: "Testmarsch",
  },
];

const presets: MarchPreset[] = [
  {
    id: "p1",
    name: "Schneller Raid",
    description: "Leichte Beute mit Kavallerie",
    army: { lightcav: 20, archer: 10 },
    attackType: "raid",
    isDefault: true,
  },
];

const meta: Meta<typeof MarchPlannerScreen> = {
  title: "Screens/MarchPlannerScreen",
  component: MarchPlannerScreen,
  args: {
    village,
    marches,
    marchPresets: presets,
  },
  argTypes: {
    onCreateMarch: { action: "create-march" },
    onCancelMarch: { action: "cancel-march" },
    onCreatePreset: { action: "create-preset" },
    onDeletePreset: { action: "delete-preset" },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
