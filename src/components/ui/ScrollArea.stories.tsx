import type { Meta, StoryObj } from "@storybook/react";
import { ScrollArea } from "./scroll-area";

const meta: Meta<typeof ScrollArea> = {
  title: "UI/ScrollArea",
  component: ScrollArea,
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Basic: Story = {
  render: () => (
    <ScrollArea className="h-48 w-64 rounded-md border p-2">
      <div className="space-y-2">
        {Array.from({ length: 40 }).map((_, i) => (
          <div key={i} className="text-sm">Item {i + 1}</div>
        ))}
      </div>
    </ScrollArea>
  ),
};

