import type { Meta, StoryObj } from "@storybook/react";
import { Button } from "./button";
import { Plus } from "lucide-react";

const meta: Meta<typeof Button> = {
  title: "UI/Button",
  component: Button,
  args: { children: "Click me" },
  argTypes: {
    variant: { control: "select", options: ["default", "secondary", "outline", "destructive", "ghost", "link"] },
    size: { control: "select", options: ["sm", "default", "lg", "icon", "icon-sm", "icon-lg"] },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Variants: Story = {
  render: (args) => (
    <div className="flex flex-wrap gap-2">
      <Button {...args} variant="default">Default</Button>
      <Button {...args} variant="secondary">Secondary</Button>
      <Button {...args} variant="outline">Outline</Button>
      <Button {...args} variant="destructive">Destructive</Button>
      <Button {...args} variant="ghost">Ghost</Button>
      <Button {...args} variant="link">Link</Button>
    </div>
  ),
};

export const Sizes: Story = {
  render: (args) => (
    <div className="flex items-center gap-2">
      <Button {...args} size="sm">Small</Button>
      <Button {...args} size="default">Default</Button>
      <Button {...args} size="lg">Large</Button>
      <Button {...args} size="icon" aria-label="Add"><Plus /></Button>
      <Button {...args} size="icon-sm" aria-label="Add"><Plus /></Button>
      <Button {...args} size="icon-lg" aria-label="Add"><Plus /></Button>
    </div>
  ),
};

