import type { Meta, StoryObj } from "@storybook/react";
import { MemoryRouter, Routes, Route } from "react-router-dom";
import { GameLayout } from "./GameLayout";

const meta: Meta<typeof GameLayout> = {
  title: "Layout/GameLayout",
  component: GameLayout,
  render: () => (
    <MemoryRouter initialEntries={["/village"]}>
      <Routes>
        <Route path="/" element={<GameLayout />}>
          <Route index element={<div style={{ padding: 16 }}>Home Content</div>} />
          <Route path="village" element={<div style={{ padding: 16 }}>Village Content</div>} />
          <Route path="world" element={<div style={{ padding: 16 }}>World Content</div>} />
          <Route path="units" element={<div style={{ padding: 16 }}>Units Content</div>} />
          <Route path="resources" element={<div style={{ padding: 16 }}>Resources Content</div>} />
        </Route>
      </Routes>
    </MemoryRouter>
  ),
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
