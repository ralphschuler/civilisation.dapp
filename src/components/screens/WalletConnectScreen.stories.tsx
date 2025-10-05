import type { Meta, StoryObj } from "@storybook/react";
import { WalletConnectScreen } from "@/components/screens/WalletConnectScreen";

const meta: Meta<typeof WalletConnectScreen> = {
  title: "Screens/WalletConnect",
  component: WalletConnectScreen,
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
