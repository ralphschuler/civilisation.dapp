import type { Meta, StoryObj } from "@storybook/react";
import { Button } from "@/components/ui/Button";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/Sheet";

const meta: Meta<typeof Sheet> = {
  title: "UI/Sheet",
  component: Sheet,
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Right: Story = {
  render: () => (
    <Sheet>
      <SheetTrigger asChild>
        <Button>Open Sheet</Button>
      </SheetTrigger>
      <SheetContent side="right">
        <SheetHeader>
          <SheetTitle>Side Panel</SheetTitle>
          <SheetDescription>Some content in a sheet.</SheetDescription>
        </SheetHeader>
        <div className="p-4 text-sm text-muted-foreground">Hello from the sheet.</div>
      </SheetContent>
    </Sheet>
  ),
};

export const Bottom: Story = {
  render: () => (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="outline">Open Bottom Sheet</Button>
      </SheetTrigger>
      <SheetContent side="bottom">
        <SheetHeader>
          <SheetTitle>Bottom Panel</SheetTitle>
          <SheetDescription>Fits mobile actions well.</SheetDescription>
        </SheetHeader>
      </SheetContent>
    </Sheet>
  ),
};
