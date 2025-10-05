import type { Meta, StoryObj } from "@storybook/react";
import { MemoryRouter, Routes, Route } from "react-router-dom";
import NotFound from "./NotFound";

const meta: Meta<typeof NotFound> = {
  title: "Screens/NotFound",
  component: NotFound,
  render: () => (
    <MemoryRouter initialEntries={["/missing"]}>
      <Routes>
        <Route path="*" element={<NotFound />} />
      </Routes>
    </MemoryRouter>
  ),
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

