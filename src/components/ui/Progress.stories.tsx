import type { Meta, StoryObj } from "@storybook/react";
import { Progress } from "./Progress";

const meta: Meta<typeof Progress> = {
  title: "UI/Progress",
  component: Progress,
  args: { value: 42 },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
export const NearlyDone: Story = { args: { value: 95 } };
