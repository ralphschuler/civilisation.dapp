import type { Meta, StoryObj } from "@storybook/react";
import { SettingsScreen } from "@/components/screens/SettingsScreen";

const meta: Meta<typeof SettingsScreen> = {
  title: "Screens/SettingsScreen",
  component: SettingsScreen,
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

