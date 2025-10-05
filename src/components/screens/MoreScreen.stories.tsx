import type { Meta, StoryObj } from "@storybook/react";
import { MemoryRouter } from "react-router-dom";
import { MoreScreen } from "./MoreScreen";

const meta: Meta<typeof MoreScreen> = {
  title: "Screens/MoreScreen",
  component: MoreScreen,
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

