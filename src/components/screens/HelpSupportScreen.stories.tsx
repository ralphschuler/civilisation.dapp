import type { Meta, StoryObj } from "@storybook/react";
import { HelpSupportScreen } from "@/components/screens/HelpSupportScreen";

const meta: Meta<typeof HelpSupportScreen> = {
  title: "Screens/HelpSupportScreen",
  component: HelpSupportScreen,
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

