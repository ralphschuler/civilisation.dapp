import type { Meta, StoryObj } from "@storybook/react";
import { TradeScreen } from "./TradeScreen";

const meta: Meta<typeof TradeScreen> = {
  title: "Screens/TradeScreen",
  component: TradeScreen,
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

