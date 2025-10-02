/**
 * Button Component Stories
 * Storybook stories for the Button component
 */

import type { Meta, StoryObj } from '@storybook/react';
import { Button } from './button';
import { Sword, Shield, Home, ChevronRight } from 'lucide-react';

const meta: Meta<typeof Button> = {
  title: 'UI/Button',
  component: Button,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['default', 'destructive', 'outline', 'secondary', 'ghost', 'link'],
    },
    size: {
      control: 'select',
      options: ['default', 'sm', 'lg', 'icon'],
    },
    disabled: {
      control: 'boolean',
    },
  },
};

export default meta;
type Story = StoryObj<typeof Button>;

// Primary button
export const Primary: Story = {
  args: {
    children: 'Gebäude upgraden',
    variant: 'default',
  },
};

// Secondary button
export const Secondary: Story = {
  args: {
    children: 'Abbrechen',
    variant: 'secondary',
  },
};

// Outline button
export const Outline: Story = {
  args: {
    children: 'Details ansehen',
    variant: 'outline',
  },
};

// Destructive button
export const Destructive: Story = {
  args: {
    children: 'Truppen angreifen',
    variant: 'destructive',
  },
};

// Ghost button
export const Ghost: Story = {
  args: {
    children: 'Mehr',
    variant: 'ghost',
  },
};

// With Icon
export const WithIcon: Story = {
  args: {
    children: (
      <>
        <Sword className="mr-2 h-4 w-4" />
        Angreifen
      </>
    ),
  },
};

// Icon Only
export const IconOnly: Story = {
  args: {
    size: 'icon',
    children: <Shield className="h-4 w-4" />,
  },
};

// Large button
export const Large: Story = {
  args: {
    children: 'Großer Button',
    size: 'lg',
  },
};

// Small button
export const Small: Story = {
  args: {
    children: 'Kleiner Button',
    size: 'sm',
  },
};

// Disabled button
export const Disabled: Story = {
  args: {
    children: 'Deaktiviert',
    disabled: true,
  },
};

// Loading state
export const Loading: Story = {
  args: {
    children: 'Wird geladen...',
    disabled: true,
  },
};

// Full width
export const FullWidth: Story = {
  args: {
    children: 'Volle Breite',
    className: 'w-full',
  },
  parameters: {
    layout: 'padded',
  },
};

// With right icon
export const WithRightIcon: Story = {
  args: {
    children: (
      <>
        Weiter
        <ChevronRight className="ml-2 h-4 w-4" />
      </>
    ),
  },
};

// Button group
export const ButtonGroup: Story = {
  render: () => (
    <div className="flex gap-2">
      <Button variant="outline">
        <Home className="mr-2 h-4 w-4" />
        Stadt
      </Button>
      <Button variant="outline">
        <Sword className="mr-2 h-4 w-4" />
        Armee
      </Button>
      <Button variant="outline">
        <Shield className="mr-2 h-4 w-4" />
        Verteidigung
      </Button>
    </div>
  ),
};