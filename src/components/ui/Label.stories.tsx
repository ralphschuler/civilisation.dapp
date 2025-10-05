import type { Meta, StoryObj } from "@storybook/react";
import { Label } from "@/components/ui/Label";
import { Input } from "@/components/ui/Input";

const meta: Meta<typeof Label> = {
  title: "UI/Label",
  component: Label,
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Basic: Story = {
  render: () => (
    <div className="space-y-2">
      <Label htmlFor="email">Email</Label>
      <Input id="email" type="email" placeholder="you@example.com" />
    </div>
  ),
};
