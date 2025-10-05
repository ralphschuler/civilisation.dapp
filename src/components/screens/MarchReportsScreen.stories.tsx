import type { Meta, StoryObj } from "@storybook/react";
import { MarchReportsScreen } from "@/components/screens/MarchReportsScreen";

const meta: Meta<typeof MarchReportsScreen> = {
  title: "Screens/MarchReportsScreen",
  component: MarchReportsScreen,
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

