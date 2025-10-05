import type { Meta, StoryObj } from "@storybook/react";
import { useState } from "react";
import { ErrorBoundary } from "./ErrorBoundary";
import { Button } from "../ui/Button";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/Card";

function Bomb({ shouldThrow }: { shouldThrow: boolean }) {
  if (shouldThrow) {
    throw new Error("Kaboom! Etwas ist schiefgelaufen.");
  }
  return (
    <Card>
      <CardHeader>
        <CardTitle>Alles gut ✅</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-muted-foreground">Klicke auf "Fehler auslösen" um den Fallback zu testen.</p>
      </CardContent>
    </Card>
  );
}

const meta: Meta<typeof ErrorBoundary> = {
  title: "Game/ErrorBoundary",
  component: ErrorBoundary,
};

export default meta;
type Story = StoryObj<typeof meta>;

export const DefaultFallbackTrigger: Story = {
  name: "Default Fallback (Trigger)",
  render: (args) => {
    const Demo = () => {
      const [shouldThrow, setShouldThrow] = useState(false);
      return (
        <div className="space-y-4 p-4 max-w-xl">
          <div className="flex gap-2">
            <Button onClick={() => setShouldThrow(true)}>Fehler auslösen</Button>
            <Button variant="outline" onClick={() => setShouldThrow(false)}>
              Zustand zurücksetzen
            </Button>
          </div>
          <ErrorBoundary {...args}>
            <Bomb shouldThrow={shouldThrow} />
          </ErrorBoundary>
        </div>
      );
    };
    return <Demo />;
  },
};

export const DefaultFallbackImmediate: Story = {
  name: "Default Fallback (Sofortiger Fehler)",
  render: (args) => (
    <div className="p-4">
      <ErrorBoundary {...args}>
        {(() => {
          throw new Error("Sofortiger Fehler – Demo");
        })() as unknown as JSX.Element}
      </ErrorBoundary>
    </div>
  ),
};

export const WithCustomFallback: Story = {
  name: "Custom Fallback",
  render: (args) => {
    const Demo = () => {
      const [shouldThrow, setShouldThrow] = useState(false);
      return (
        <div className="space-y-4 p-4 max-w-xl">
          <Button onClick={() => setShouldThrow(true)}>Fehler auslösen</Button>
          <ErrorBoundary
            {...args}
            fallback={
              <div className="p-6 rounded-md border bg-muted/30">
                <h3 className="font-medium mb-2">Eigener Fallback</h3>
                <p className="text-caption text-muted-foreground">
                  Ein benutzerdefinierter Fallback wird angezeigt.
                </p>
              </div>
            }
          >
            <Bomb shouldThrow={shouldThrow} />
          </ErrorBoundary>
        </div>
      );
    };
    return <Demo />;
  },
};

