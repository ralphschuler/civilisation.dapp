import type { Meta, StoryObj } from "@storybook/react";
import { MemoryRouter } from "react-router-dom";
import { ReportsScreen } from "@/components/screens/ReportsScreen";

const meta: Meta<typeof ReportsScreen> = {
  title: "Screens/ReportsScreen",
  component: ReportsScreen,
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
