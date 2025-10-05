import type { Meta, StoryObj } from "@storybook/react";
import { useMemo } from "react";
import { CountdownTimer } from "@/components/shared/CountdownTimer";

type Args = {
  seconds: number;
  showProgress: boolean;
  variant: "default" | "outline" | "secondary" | "destructive";
};

const meta: Meta<typeof CountdownTimer> = {
  title: "Shared/CountdownTimer",
  component: CountdownTimer,
  argTypes: {
    seconds: { control: { type: "range", min: 1, max: 3600, step: 1 } },
    showProgress: { control: "boolean" },
    variant: {
      control: "select",
      options: ["default", "outline", "secondary", "destructive"],
    },
  },
  args: {
    seconds: 90,
    showProgress: true,
    variant: "secondary",
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Short: Story = {
  render: (args: Args) => {
    const targetTime = useMemo(() => Date.now() + args.seconds * 1000, [args.seconds]);
    return (
      <div className="p-4">
        <CountdownTimer targetTime={targetTime} showProgress={args.showProgress} variant={args.variant} />
      </div>
    );
  },
};

export const Long: Story = {
  args: { seconds: 60 * 30, variant: "default" },
  render: (args: Args) => {
    const targetTime = useMemo(() => Date.now() + args.seconds * 1000, [args.seconds]);
    return (
      <div className="p-4">
        <CountdownTimer targetTime={targetTime} showProgress={args.showProgress} variant={args.variant} />
      </div>
    );
  },
};

export const Completed: Story = {
  render: () => (
    <div className="p-4">
      <CountdownTimer targetTime={Date.now() - 1000} showProgress />
    </div>
  ),
};

export const DestructiveVariant: Story = {
  args: { seconds: 10, showProgress: true, variant: "destructive" },
  render: (args: Args) => {
    const targetTime = useMemo(() => Date.now() + args.seconds * 1000, [args.seconds]);
    return (
      <div className="p-4">
        <CountdownTimer targetTime={targetTime} showProgress={args.showProgress} variant={args.variant} />
      </div>
    );
  },
};
