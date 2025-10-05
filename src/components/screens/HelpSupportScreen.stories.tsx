import type { Meta, StoryObj } from "@storybook/react";
import { MemoryRouter } from "react-router-dom";
import { HelpSupportScreen } from "@/components/screens/HelpSupportScreen";

const meta: Meta<typeof HelpSupportScreen> = {
  title: "Screens/HelpSupportScreen",
  component: HelpSupportScreen,
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
