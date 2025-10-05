import type { Meta, StoryObj } from "@storybook/react";
import { BattleReportDetail } from "@/components/game/BattleReportDetail";
import type { BattleResult } from "@/types/reports";

const baseBattleData: BattleResult = {
  attacker: {
    village: "Athen",
    player: "Perikles",
    units: {
      Speerkämpfer: { sent: 120, lost: 15 },
      Schwertkämpfer: { sent: 80, lost: 22 },
      Bogenschützen: { sent: 60, lost: 30 },
      Reiter: { sent: 25, lost: 5 },
    },
  },
  defender: {
    village: "Sparta",
    player: "Leonidas",
    units: {
      Speerkämpfer: { defending: 150, lost: 40 },
      Schwertkämpfer: { defending: 60, lost: 10 },
      Bogenschützen: { defending: 40, lost: 15 },
    },
  },
  result: "victory",
  loot: {
    Holz: 320,
    Lehm: 210,
    Eisen: 125,
  },
  wallDamage: 20,
  reasons: {
    counter: [
      "Bogenschützen konterten gegnerische Speerkämpfer effektiv",
      "Reiter überrannten leichte Infanterie",
    ],
    wall: ["Mauerschutz verringerte ankommenden Schaden"],
    tech: ["Schmiede Stufe 3 erhöhte Angriffsstärke"],
    terrain: ["Offenes Feld begünstigte Reiter"],
    moral: ["Höhere Moral durch letzte Siege"],
  },
  suggestions: [
    "Mehr Rammböcke für schnelleren Mauerdurchbruch mitnehmen",
    "Bogenschützen weiter aufrüsten",
    "Späher zur besseren Aufklärung entsenden",
  ],
  phases: {
    ranged: {
      attackerLosses: { Bogenschützen: 10 },
      defenderLosses: { Speerkämpfer: 20 },
    },
    charge: {
      attackerLosses: { Reiter: 2 },
      defenderLosses: { Schwertkämpfer: 8 },
    },
    melee: {
      attackerLosses: { Schwertkämpfer: 12 },
      defenderLosses: { Speerkämpfer: 20, Schwertkämpfer: 10 },
    },
    siege: {
      wallDamage: 20,
    },
  },
};

const meta: Meta<typeof BattleReportDetail> = {
  title: "Game/BattleReportDetail",
  component: BattleReportDetail,
  args: {
    onClose: () => alert("Close clicked"),
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Victory: Story = {
  args: {
    battleData: { ...baseBattleData, result: "victory" },
  },
};

export const Defeat: Story = {
  args: {
    battleData: {
      ...baseBattleData,
      result: "defeat",
      loot: {},
      reasons: {
        ...baseBattleData.reasons!,
        counter: [
          "Verteidiger hatte starken Speerkämpfer-Kontereinfluss",
          "Mangelnde Unterstützung im Nahkampf",
        ],
      },
      phases: {
        ...baseBattleData.phases,
        siege: { wallDamage: 5 },
      },
    },
  },
};

export const Draw: Story = {
  args: {
    battleData: {
      ...baseBattleData,
      result: "draw",
      loot: undefined,
      wallDamage: 0,
      suggestions: [
        "Mehr Einheitenvielfalt für nächste Schlacht",
        "Technologien balanciert verbessern",
      ],
      phases: {
        ranged: {
          attackerLosses: { Bogenschützen: 15 },
          defenderLosses: { Bogenschützen: 15 },
        },
        charge: {
          attackerLosses: { Reiter: 4 },
          defenderLosses: { Reiter: 4 },
        },
        melee: {
          attackerLosses: { Schwertkämpfer: 20 },
          defenderLosses: { Schwertkämpfer: 20 },
        },
        siege: { wallDamage: 0 },
      },
    },
  },
};

