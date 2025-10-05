import type { Meta, StoryObj } from "@storybook/react";
import { MintVillageScreen } from "@/components/screens/MintVillageScreen";

const meta: Meta<typeof MintVillageScreen> = {
  title: "Screens/MintVillageScreen",
  component: MintVillageScreen,
  argTypes: {
    onMintFree: { action: "mint-free" },
    onMintPaid: { action: "mint-paid" },
  },
};

export default meta;
type Story = StoryObj<typeof MintVillageScreen>;

export const FreeEligible: Story = {
  args: { hasFreeMint: true, worldBalance: 0 },
};

export const PaidWithBalance: Story = {
  args: { hasFreeMint: false, worldBalance: 25 },
};

export const PaidInsufficient: Story = {
  args: { hasFreeMint: false, worldBalance: 3 },
};

export const Minting: Story = {
  args: { hasFreeMint: false, worldBalance: 25, isMinting: true },
};

export const Success: Story = {
  args: { hasFreeMint: false, worldBalance: 12, txHash: "0x1234567890abcdef" },
};

