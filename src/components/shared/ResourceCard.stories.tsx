import type { Meta, StoryObj } from "@storybook/react";
import { ResourceCard } from "@/components/shared/ResourceCard";

const meta: Meta<typeof ResourceCard> = {
  title: "Shared/ResourceCard",
  component: ResourceCard,
  args: {
    resource: "wood",
    amount: 1540,
    production: 220,
    capacity: 5000,
  },
  argTypes: {
    resource: {
      control: "select",
      options: ["wood", "clay", "iron", "coal", "wheat", "bread", "meat", "gold", "villager"],
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const NearCapacity: Story = {
  args: {
    amount: 4800,
    capacity: 5000,
    production: 300,
  },
};

export const NoProduction: Story = {
  args: {
    production: 0,
  },
};

export const AllResourcesGrid: Story = {
  render: () => (
    <div className="grid grid-cols-2 md:grid-cols-3 gap-3 p-4">
      {["wood", "clay", "iron", "coal", "wheat", "bread", "meat", "gold", "villager"].map((r) => (
        <ResourceCard
          key={r}
          resource={r}
          amount={Math.floor(Math.random() * 5000)}
          production={Math.floor(Math.random() * 300)}
          capacity={5000}
        />
      ))}
    </div>
  ),
};
