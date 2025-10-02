import { Report } from '../types/reports';

export const mockReports: Report[] = [
  {
    id: '1',
    type: 'battle',
    title: 'Angriff auf "Goldfeld"',
    summary: 'Deine Armee wurde besiegt. 23 Speerträger und 15 Bogenschützen verloren.',
    timestamp: Date.now() - 1000 * 60 * 15, // 15 min ago
    read: false,
    important: true,
    battleData: {
      attacker: {
        village: 'Mein Dorf',
        player: 'Du',
        units: {
          'Speerträger': { sent: 50, lost: 23 },
          'Bogenschütze': { sent: 30, lost: 15 },
          'Axtkämpfer': { sent: 20, lost: 8 }
        }
      },
      defender: {
        village: 'Goldfeld',
        player: 'Krieger123',
        units: {
          'Speerträger': { defending: 35, lost: 12 },
          'Schwere Kavallerie': { defending: 15, lost: 3 },
          'Pikenier': { defending: 25, lost: 7 }
        }
      },
      result: 'defeat',
      wallDamage: 15,
      reasons: {
        counter: [
          'Pikiere konterten deine Kavallerie effektiv (-40% Schaden)',
          'Schwere Kavallerie durchbrach deine Speerlinie'
        ],
        wall: [
          'Level 8 Mauer reduzierte Angriffschaden um 25%',
          'Tore verstärkten die Verteidigung zusätzlich'
        ],
        tech: [
          'Gegner hatte Schmiede-Upgrades für Kavallerie (+15% ATK)',
          'Deine Infanterie-Forschung war rückständig'
        ],
        terrain: ['Hügeliges Gelände begünstigte die Verteidigung'],
        moral: ['Hohe Moral der Verteidiger (+10% auf alle Werte)']
      },
      suggestions: [
        'Nächstes Mal: +10 Rammbock für Mauerschaden, -15 Axtkämpfer',
        'Forsche Pikenier-Abwehr in der Schmiede',
        'Verwende mehr Bogenschützen gegen schwere Kavallerie'
      ],
      phases: {
        ranged: {
          attackerLosses: { 'Bogenschütze': 5 },
          defenderLosses: { 'Speerträger': 3 }
        },
        charge: {
          attackerLosses: { 'Axtkämpfer': 8 },
          defenderLosses: { 'Schwere Kavallerie': 3 }
        },
        melee: {
          attackerLosses: { 'Speerträger': 18 },
          defenderLosses: { 'Speerträger': 9, 'Pikenier': 7 }
        },
        siege: {
          wallDamage: 15
        }
      }
    }
  },
  {
    id: '2',
    type: 'battle',
    title: 'Erfolgreicher Raid auf "Eisengrund"',
    summary: 'Plünderung erfolgreich! 1200 Eisen, 800 Holz und 600 Gold erbeutet.',
    timestamp: Date.now() - 1000 * 60 * 45, // 45 min ago
    read: false,
    important: false,
    battleData: {
      attacker: {
        village: 'Mein Dorf',
        player: 'Du',
        units: {
          'Leichte Kavallerie': { sent: 40, lost: 5 },
          'Bogenschütze': { sent: 20, lost: 2 }
        }
      },
      defender: {
        village: 'Eisengrund',
        player: 'Neuling42',
        units: {
          'Speerträger': { defending: 15, lost: 12 },
          'Schwertkämpfer': { defending: 8, lost: 6 }
        }
      },
      result: 'victory',
      loot: {
        'Eisen': 1200,
        'Holz': 800,
        'Gold': 600
      },
      wallDamage: 0,
      reasons: {
        counter: ['Kavallerie überwältigte schwache Infanterie'],
        wall: ['Keine Mauer vorhanden'],
        tech: ['Überlegene Technologie'],
        terrain: ['Flaches Gelände begünstigte Kavallerie'],
        moral: ['Hohe Angriffsmoral']
      },
      suggestions: [],
      phases: {
        ranged: {
          attackerLosses: {},
          defenderLosses: { 'Speerträger': 4 }
        },
        charge: {
          attackerLosses: { 'Leichte Kavallerie': 5, 'Bogenschütze': 2 },
          defenderLosses: { 'Speerträger': 8, 'Schwertkämpfer': 6 }
        },
        melee: {
          attackerLosses: {},
          defenderLosses: {}
        },
        siege: {
          wallDamage: 0
        }
      }
    }
  },
  {
    id: '3',
    type: 'spy',
    title: 'Spionage-Mission erfolgreich',
    summary: 'Deine Spione haben "Nordwind" ausgekundschaftet. Schwache Verteidigung entdeckt.',
    timestamp: Date.now() - 1000 * 60 * 90, // 1.5 hours ago
    read: false,
    spyData: {
      target: 'Nordwind',
      discovered: false,
      resources: {
        'Holz': 3200,
        'Eisen': 1800,
        'Gold': 950,
        'Brot': 400
      },
      units: {
        'Speerträger': 25,
        'Schwertkämpfer': 12,
        'Bogenschütze': 8
      },
      buildings: {
        'Mauer': 4,
        'Kaserne': 6,
        'Schmiede': 3
      }
    }
  },
  {
    id: '4',
    type: 'trade',
    title: 'Handel mit "Handelsgilde" abgeschlossen',
    summary: '1000 Holz gegen 800 Eisen getauscht. Karawane ist sicher angekommen.',
    timestamp: Date.now() - 1000 * 60 * 120, // 2 hours ago
    read: true,
    tradeData: {
      partner: 'Handelsgilde',
      sent: { 'Holz': 1000 },
      received: { 'Eisen': 800 }
    }
  },
  {
    id: '5',
    type: 'building',
    title: 'Schmiede auf Stufe 7 ausgebaut',
    summary: 'Der Ausbau der Schmiede wurde abgeschlossen. Neue Technologien verfügbar.',
    timestamp: Date.now() - 1000 * 60 * 180, // 3 hours ago
    read: true,
    buildingData: {
      building: 'Schmiede',
      level: 7,
      village: 'Mein Dorf'
    }
  },
  {
    id: '6',
    type: 'event',
    title: 'Reiche Ernte',
    summary: 'Eine besonders gute Ernte beschert deinem Dorf zusätzliche Ressourcen.',
    timestamp: Date.now() - 1000 * 60 * 300, // 5 hours ago
    read: true,
    eventData: {
      event: 'Reiche Ernte',
      effects: [
        '+25% Weizenproduktion für 24 Stunden',
        '+500 Brot sofort erhalten'
      ]
    }
  },
  {
    id: '7',
    type: 'system',
    title: 'Willkommen zurück!',
    summary: 'Du warst 8 Stunden offline. Deine Dörfer haben weiter produziert.',
    timestamp: Date.now() - 1000 * 60 * 480, // 8 hours ago
    read: true
  },
  {
    id: '8',
    type: 'battle',
    title: 'Verteidigung gegen "DieRäuber"',
    summary: 'Dein Dorf wurde erfolgreich verteidigt. Angreifer zurückgeschlagen.',
    timestamp: Date.now() - 1000 * 60 * 720, // 12 hours ago
    read: true,
    battleData: {
      attacker: {
        village: 'Räuberlager',
        player: 'DieRäuber',
        units: {
          'Axtkämpfer': { sent: 30, lost: 25 },
          'Leichte Kavallerie': { sent: 15, lost: 12 }
        }
      },
      defender: {
        village: 'Mein Dorf',
        player: 'Du',
        units: {
          'Speerträger': { defending: 40, lost: 8 },
          'Bogenschütze': { defending: 25, lost: 3 },
          'Pikenier': { defending: 20, lost: 5 }
        }
      },
      result: 'victory',
      wallDamage: 5,
      reasons: {
        counter: ['Pikenier konterten Kavallerie perfekt'],
        wall: ['Level 6 Mauer hielt den Angriff ab'],
        tech: ['Defensive Upgrades wirkten'],
        terrain: ['Befestigte Position'],
        moral: ['Heimvorteil']
      },
      suggestions: [],
      phases: {
        ranged: {
          attackerLosses: { 'Axtkämpfer': 8 },
          defenderLosses: { 'Bogenschütze': 3 }
        },
        charge: {
          attackerLosses: { 'Leichte Kavallerie': 12 },
          defenderLosses: { 'Pikenier': 5 }
        },
        melee: {
          attackerLosses: { 'Axtkämpfer': 17 },
          defenderLosses: { 'Speerträger': 8 }
        },
        siege: {
          wallDamage: 5
        }
      }
    }
  }
];