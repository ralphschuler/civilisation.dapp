import type { Meta, StoryObj } from "@storybook/react";
import { Input } from "./input";
import { Label } from "./label";

const meta: Meta<typeof Input> = {
  title: "UI/Input",
  component: Input,
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Basic: Story = {
  render: () => (
    <div className="space-y-2">
      <Label htmlFor="i1">Your name</Label>
      <Input id="i1" placeholder="Jane Doe" />
    </div>
  ),
};

export const Invalid: Story = {
  render: () => <Input aria-invalid defaultValue="invalid value" />,
};

