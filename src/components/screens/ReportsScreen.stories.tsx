import type { Meta, StoryObj } from "@storybook/react";
import { ReportsScreen } from "./ReportsScreen";

const meta: Meta<typeof ReportsScreen> = {
  title: "Screens/ReportsScreen",
  component: ReportsScreen,
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

