import type { Meta, StoryObj } from "@storybook/react";
import { AchievementsScreen } from "@/components/screens/AchievementsScreen";

const meta: Meta<typeof AchievementsScreen> = {
  title: "Screens/AchievementsScreen",
  component: AchievementsScreen,
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

