import type { Meta, StoryObj } from "@storybook/react";
import { MemoryRouter } from "react-router-dom";
import { MobileNavigation } from "@/components/MobileNavigation";

const meta: Meta<typeof MobileNavigation> = {
  title: "App/MobileNavigation",
  component: MobileNavigation,
  decorators: [
    (Story) => (
      <MemoryRouter initialEntries={["/village"]}>
        <div style={{ minHeight: 200 }}>
          <Story />
        </div>
      </MemoryRouter>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

