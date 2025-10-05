import type { Meta, StoryObj } from "@storybook/react";
import { Separator } from "@/components/ui/Separator";

const meta: Meta<typeof Separator> = {
  title: "UI/Separator",
  component: Separator,
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Horizontal: Story = {
  render: () => (
    <div className="space-y-4">
      <div>Above</div>
      <Separator />
      <div>Below</div>
    </div>
  ),
};

export const Vertical: Story = {
  render: () => (
    <div className="flex items-center gap-4">
      <div>Left</div>
      <Separator orientation="vertical" className="h-6" />
      <div>Right</div>
    </div>
  ),
};
