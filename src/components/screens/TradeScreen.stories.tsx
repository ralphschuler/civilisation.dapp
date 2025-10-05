import type { Meta, StoryObj } from "@storybook/react";
import { TradeScreen } from "@/components/screens/TradeScreen";

const resources = {
  bread: 500,
  clay: 1200,
  coal: 200,
  gold: 150,
  iron: 900,
  meat: 300,
  villager: 180,
  wheat: 800,
  wood: 1800,
  maxPopulation: 300,
};

const meta: Meta<typeof TradeScreen> = {
  title: "Screens/TradeScreen",
  component: TradeScreen,
  args: {
    resources,
  },
  argTypes: {
    onExecuteTrade: { action: "execute" },
    onCreateTrade: { action: "create" },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
