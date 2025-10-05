import type { Meta, StoryObj } from "@storybook/react";
import { MemoryRouter, Routes, Route } from "react-router-dom";
import { NotFoundScreen } from "@/components/screens/NotFoundScreen";

const meta: Meta<typeof NotFoundScreen> = {
  title: "Screens/NotFoundScreen",
  component: NotFoundScreen,
  render: () => (
    <MemoryRouter initialEntries={["/missing"]}>
      <Routes>
        <Route path="*" element={<NotFoundScreen />} />
      </Routes>
    </MemoryRouter>
  ),
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
