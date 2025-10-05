import type { Meta, StoryObj } from "@storybook/react";
import { StatsScreen } from "@/components/screens/StatsScreen";

const meta: Meta<typeof StatsScreen> = {
  title: "Screens/StatsScreen",
  component: StatsScreen,
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

