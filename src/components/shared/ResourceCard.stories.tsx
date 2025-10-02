/**
 * ResourceCard Component Stories
 * Storybook stories for the ResourceCard component
 */

import type { Meta, StoryObj } from '@storybook/react';
import { ResourceCard } from './ResourceCard';

const meta: Meta<typeof ResourceCard> = {
  title: 'Shared/ResourceCard',
  component: ResourceCard,
  parameters: {
    layout: 'padded',
  },
  tags: ['autodocs'],
  argTypes: {
    resource: {
      control: 'select',
      options: ['wood', 'clay', 'iron', 'coal', 'wheat', 'bread', 'meat', 'gold', 'villager'],
    },
    amount: {
      control: { type: 'number', min: 0, max: 100000, step: 100 },
    },
    production: {
      control: { type: 'number', min: 0, max: 1000, step: 10 },
    },
    capacity: {
      control: { type: 'number', min: 0, max: 100000, step: 1000 },
    },
  },
};

export default meta;
type Story = StoryObj<typeof ResourceCard>;

// Wood resource
export const Wood: Story = {
  args: {
    resource: 'wood',
    amount: 1200,
    production: 450,
    capacity: 15000,
  },
};

// Clay resource
export const Clay: Story = {
  args: {
    resource: 'clay',
    amount: 8500,
    production: 380,
    capacity: 15000,
  },
};

// Iron resource
export const Iron: Story = {
  args: {
    resource: 'iron',
    amount: 3400,
    production: 290,
    capacity: 15000,
  },
};

// Coal resource
export const Coal: Story = {
  args: {
    resource: 'coal',
    amount: 500,
    production: 120,
    capacity: 10000,
  },
};

// Wheat resource
export const Wheat: Story = {
  args: {
    resource: 'wheat',
    amount: 2800,
    production: 520,
    capacity: 15000,
  },
};

// Bread resource
export const Bread: Story = {
  args: {
    resource: 'bread',
    amount: 450,
    production: 180,
    capacity: 5000,
  },
};

// Meat resource
export const Meat: Story = {
  args: {
    resource: 'meat',
    amount: 670,
    production: 150,
    capacity: 5000,
  },
};

// Gold resource
export const Gold: Story = {
  args: {
    resource: 'gold',
    amount: 1250,
    production: 85,
    capacity: 10000,
  },
};

// Villager (population)
export const Villager: Story = {
  args: {
    resource: 'villager',
    amount: 150,
    capacity: 240,
  },
};

// Nearly full storage
export const NearlyFull: Story = {
  args: {
    resource: 'wood',
    amount: 14500,
    production: 450,
    capacity: 15000,
  },
};

// Full storage
export const Full: Story = {
  args: {
    resource: 'clay',
    amount: 15000,
    production: 380,
    capacity: 15000,
  },
};

// Low resources
export const Low: Story = {
  args: {
    resource: 'iron',
    amount: 450,
    production: 290,
    capacity: 15000,
  },
};

// Without capacity
export const WithoutCapacity: Story = {
  args: {
    resource: 'gold',
    amount: 5420,
    production: 85,
  },
};

// Without production
export const WithoutProduction: Story = {
  args: {
    resource: 'coal',
    amount: 2300,
    capacity: 10000,
  },
};

// Large numbers
export const LargeNumbers: Story = {
  args: {
    resource: 'wood',
    amount: 1250000,
    production: 8500,
    capacity: 2000000,
  },
};

// Grid layout example
export const GridExample: Story = {
  render: () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
      <ResourceCard resource="wood" amount={1200} production={450} capacity={15000} />
      <ResourceCard resource="clay" amount={8500} production={380} capacity={15000} />
      <ResourceCard resource="iron" amount={3400} production={290} capacity={15000} />
      <ResourceCard resource="coal" amount={500} production={120} capacity={10000} />
      <ResourceCard resource="wheat" amount={2800} production={520} capacity={15000} />
      <ResourceCard resource="bread" amount={450} production={180} capacity={5000} />
      <ResourceCard resource="meat" amount={670} production={150} capacity={5000} />
      <ResourceCard resource="gold" amount={1250} production={85} capacity={10000} />
      <ResourceCard resource="villager" amount={150} capacity={240} />
    </div>
  ),
  parameters: {
    layout: 'fullscreen',
  },
};