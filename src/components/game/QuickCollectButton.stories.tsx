import type { Meta, StoryObj } from "@storybook/react";
import { QuickCollectButton } from "@/components/game/QuickCollectButton";
import type { UncollectedResources } from "@/types/game";

type ResourceKey = keyof UncollectedResources;

const meta: Meta<typeof QuickCollectButton> = {
  title: "Game/QuickCollectButton",
  component: QuickCollectButton,
  argTypes: {
    onCollect: { action: "collect" },
    resourceType: {
      control: "select",
      options: [
        "bread",
        "clay",
        "coal",
        "gold",
        "iron",
        "meat",
        "villager",
        "wheat",
        "wood",
      ] satisfies ResourceKey[],
    },
  },
  args: {
    onCollect: () => {},
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const WoodSmall: Story = {
  args: {
    resourceType: "wood",
    uncollectedAmount: 12,
  },
};

export const GoldLarge: Story = {
  args: {
    resourceType: "gold",
    uncollectedAmount: 1200, // shows 1k formatting
  },
};

export const VillagerFew: Story = {
  args: {
    resourceType: "villager",
    uncollectedAmount: 3,
  },
};

export const InGrid: Story = {
  name: "Multiple Resources",
  render: (args) => (
    <div className="flex flex-wrap gap-2 p-4">
      <QuickCollectButton {...args} resourceType="wood" uncollectedAmount={250} />
      <QuickCollectButton {...args} resourceType="clay" uncollectedAmount={95} />
      <QuickCollectButton {...args} resourceType="iron" uncollectedAmount={640} />
      <QuickCollectButton {...args} resourceType="gold" uncollectedAmount={5} />
      <QuickCollectButton {...args} resourceType="bread" uncollectedAmount={120} />
      <QuickCollectButton {...args} resourceType="meat" uncollectedAmount={42} />
      <QuickCollectButton {...args} resourceType="wheat" uncollectedAmount={380} />
      <QuickCollectButton {...args} resourceType="villager" uncollectedAmount={1} />
      <QuickCollectButton {...args} resourceType="coal" uncollectedAmount={18} />
    </div>
  ),
};
