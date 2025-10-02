/**
 * Card Component Stories
 * Storybook stories for the Card component
 */

import type { Meta, StoryObj } from '@storybook/react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from './card';
import { Button } from './button';

const meta: Meta<typeof Card> = {
  title: 'UI/Card',
  component: Card,
  parameters: {
    layout: 'padded',
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof Card>;

// Basic card
export const Basic: Story = {
  render: () => (
    <Card>
      <CardHeader>
        <CardTitle>Rathaus</CardTitle>
        <CardDescription>Stufe 5</CardDescription>
      </CardHeader>
      <CardContent>
        <p>Das Rathaus ist das zentrale Gebäude deines Dorfes. Es ermöglicht den Bau weiterer Gebäude und erhöht die Effizienz deiner Produktion.</p>
      </CardContent>
      <CardFooter>
        <Button>Upgraden auf Stufe 6</Button>
      </CardFooter>
    </Card>
  ),
};

// Building card
export const BuildingCard: Story = {
  render: () => (
    <Card>
      <CardHeader>
        <CardTitle>Holzfäller</CardTitle>
        <CardDescription>Stufe 10 → 11</CardDescription>
      </CardHeader>
      <CardContent className="space-y-2">
        <div className="text-caption">
          <strong>Kosten:</strong>
        </div>
        <div className="flex gap-4">
          <span>🪵 Holz: 1.200</span>
          <span>🧱 Lehm: 800</span>
        </div>
        <div className="text-caption mt-4">
          <strong>Produktion:</strong> +150 Holz/Stunde
        </div>
        <div className="text-caption text-muted-foreground">
          Dauer: 45 Minuten
        </div>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button variant="outline">Abbrechen</Button>
        <Button>Upgraden</Button>
      </CardFooter>
    </Card>
  ),
};

// Unit card
export const UnitCard: Story = {
  render: () => (
    <Card>
      <CardHeader>
        <CardTitle>⚔️ Speerträger</CardTitle>
        <CardDescription>Infanterie • Anti-Kavallerie</CardDescription>
      </CardHeader>
      <CardContent className="space-y-2">
        <div className="grid grid-cols-2 gap-2 text-caption">
          <div>Angriff: 15</div>
          <div>Verteidigung: 25</div>
          <div>Geschwindigkeit: 6 min/Feld</div>
          <div>Bevölkerung: 1</div>
        </div>
        <div className="mt-4">
          <strong className="text-caption">Trainingskosten:</strong>
          <div className="flex gap-3 mt-1">
            <span>🪵 50</span>
            <span>🧱 30</span>
            <span>⚙️ 20</span>
          </div>
        </div>
      </CardContent>
      <CardFooter>
        <Button className="w-full">5 Einheiten trainieren</Button>
      </CardFooter>
    </Card>
  ),
};

// Resource card
export const ResourceCard: Story = {
  render: () => (
    <Card>
      <CardHeader>
        <CardTitle>🪵 Holz</CardTitle>
        <CardDescription>Produktion: +450/Stunde</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <span>Verfügbar:</span>
            <span className="font-medium">12.450 / 15.000</span>
          </div>
          <div className="w-full bg-secondary rounded-full h-2">
            <div className="bg-primary h-2 rounded-full" style={{ width: '83%' }} />
          </div>
          <div className="flex justify-between text-caption text-muted-foreground">
            <span>Nicht eingesammelt: 234</span>
            <span>Voll in: 5h 42m</span>
          </div>
        </div>
      </CardContent>
      <CardFooter>
        <Button variant="secondary" className="w-full">Einsammeln</Button>
      </CardFooter>
    </Card>
  ),
};

// Report card
export const ReportCard: Story = {
  render: () => (
    <Card>
      <CardHeader>
        <div className="flex items-start justify-between">
          <div>
            <CardTitle>⚔️ Angriffsbericht</CardTitle>
            <CardDescription>vor 2 Stunden</CardDescription>
          </div>
          <span className="text-success">Sieg</span>
        </div>
      </CardHeader>
      <CardContent className="space-y-2">
        <div className="flex justify-between text-caption">
          <span>Angreifer:</span>
          <span className="font-medium">DeinDorf (Du)</span>
        </div>
        <div className="flex justify-between text-caption">
          <span>Verteidiger:</span>
          <span className="font-medium">Gegnerdorf (Spieler123)</span>
        </div>
        <div className="mt-3 p-2 bg-success/10 rounded">
          <div className="text-caption">
            <strong>Beute:</strong> 🪵 500, 🧱 300, ⚙️ 200
          </div>
        </div>
      </CardContent>
      <CardFooter>
        <Button variant="outline" className="w-full">Details ansehen</Button>
      </CardFooter>
    </Card>
  ),
};

// Simple card without footer
export const WithoutFooter: Story = {
  render: () => (
    <Card>
      <CardHeader>
        <CardTitle>Statistiken</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <div className="flex justify-between">
            <span>Gewonnene Schlachten:</span>
            <span className="font-medium">45</span>
          </div>
          <div className="flex justify-between">
            <span>Verlorene Schlachten:</span>
            <span className="font-medium">12</span>
          </div>
          <div className="flex justify-between">
            <span>Win-Rate:</span>
            <span className="font-medium">78.9%</span>
          </div>
        </div>
      </CardContent>
    </Card>
  ),
};

// Compact card
export const Compact: Story = {
  render: () => (
    <Card className="p-3">
      <div className="flex items-center justify-between">
        <div>
          <div className="font-medium">Bauernhof</div>
          <div className="text-caption text-muted-foreground">Stufe 8</div>
        </div>
        <Button size="sm">Upgrade</Button>
      </div>
    </Card>
  ),
};