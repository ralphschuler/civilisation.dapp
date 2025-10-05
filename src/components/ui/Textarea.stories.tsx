import type { Meta, StoryObj } from "@storybook/react";
import { Textarea } from "@/components/ui/Textarea";
import { Label } from "@/components/ui/Label";

const meta: Meta<typeof Textarea> = {
  title: "UI/Textarea",
  component: Textarea,
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Basic: Story = {
  render: () => (
    <div className="space-y-2">
      <Label htmlFor="t1">Message</Label>
      <Textarea id="t1" placeholder="Type your message here" />
    </div>
  ),
};
