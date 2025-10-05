import type { Meta, StoryObj } from "@storybook/react";
import { LoadingScreen } from "./LoadingScreen";

const meta: Meta<typeof LoadingScreen> = {
  title: "Game/LoadingScreen",
  component: LoadingScreen,
  args: {
    message: "Lade Spiel...",
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const WithProgress: Story = {
  args: {
    progress: 42,
  },
};

export const WithSkeleton: Story = {
  args: {
    showSkeleton: true,
  },
};

export const CustomMessage: Story = {
  args: {
    message: "Verbinde mit Server...",
    progress: 73,
  },
};

