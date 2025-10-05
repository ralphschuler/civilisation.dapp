import type { Meta, StoryObj } from "@storybook/react";
import { MemoryRouter } from "react-router-dom";
import { SettingsScreen } from "@/components/screens/SettingsScreen";

const meta: Meta<typeof SettingsScreen> = {
  title: "Screens/SettingsScreen",
  component: SettingsScreen,
  decorators: [
    (Story) => (
      <MemoryRouter>
        <Story />
      </MemoryRouter>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
