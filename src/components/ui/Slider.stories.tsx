import type { Meta, StoryObj } from "@storybook/react";
import { Slider } from "./Slider";

const meta: Meta<typeof Slider> = {
  title: "UI/Slider",
  component: Slider,
  args: { defaultValue: [50], max: 100, step: 1 },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const SingleThumb: Story = {};

export const Range: Story = {
  args: { defaultValue: [20, 80], max: 100, step: 1 },
};
