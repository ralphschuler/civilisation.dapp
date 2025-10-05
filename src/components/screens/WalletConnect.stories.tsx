import type { Meta, StoryObj } from "@storybook/react";
import WalletConnect from "./WalletConnect";

const meta: Meta<typeof WalletConnect> = {
  title: "Screens/WalletConnect",
  component: WalletConnect,
  parameters: {
    docs: {
      description: {
        component:
          "This screen integrates with Worldcoin MiniKit. In Storybook it will show the 'not installed' notice unless the provider is present.",
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

