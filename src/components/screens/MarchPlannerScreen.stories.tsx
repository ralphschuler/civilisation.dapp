import type { Meta, StoryObj } from "@storybook/react";
import { MarchPlannerScreen } from "./MarchPlannerScreen";

const meta: Meta<typeof MarchPlannerScreen> = {
  title: "Screens/MarchPlannerScreen",
  component: MarchPlannerScreen,
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

