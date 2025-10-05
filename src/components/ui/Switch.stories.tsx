import type { Meta, StoryObj } from "@storybook/react";
import { Switch } from "@/components/ui/Switch";
import { Label } from "@/components/ui/Label";

const meta: Meta<typeof Switch> = {
  title: "UI/Switch",
  component: Switch,
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Basic: Story = {
  render: () => (
    <div className="flex items-center gap-2">
      <Switch id="s1" />
      <Label htmlFor="s1">Enable feature</Label>
    </div>
  ),
};
