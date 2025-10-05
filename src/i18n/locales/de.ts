export const de = {
  app: {
    title: 'Tribal Wars',
  },
  common: {
    close: 'Schließen',
    save: 'Speichern',
    cancel: 'Abbrechen',
    back: 'Zurück',
    delete: 'Löschen',
    details: 'Details',
    loading: 'Lade…',
    completed: 'Abgeschlossen',
    attack: 'Angreifen',
    spy: 'Ausspähen',
    trade: 'Handeln',
    light: 'Hell',
    dark: 'Dunkel',
    on: 'An',
    off: 'Aus',
    population: 'Bevölkerung',
  },
  loading: {
    title: 'Tribal Wars',
    message: 'Lade Spiel...',
    completed: 'abgeschlossen',
  },
  error: {
    title: 'Spielfehler aufgetreten',
    technicalDetails: 'Technische Details',
    reloadGame: 'Spiel neu laden',
    reloadPage: 'Seite neu laden',
  },
  screens: {
    march: {
      title: 'Marschplaner',
      stats: { active: 'Aktive Märsche', savedPresets: 'Gespeicherte Presets' },
      tabs: { planner: 'Planen', active: 'Aktive Märsche', presets: 'Presets' },
      attackType: {
        title: 'Angriffstyp',
        raid: { name: 'Plünderung', description: 'Schneller Angriff zum Erbeuten von Ressourcen' },
        siege: { name: 'Belagerung', description: 'Angriff auf Mauern und Verteidigungen' },
        conquer: { name: 'Eroberung', description: 'Vollständige Übernahme des Dorfes' },
      },
      target: {
        title: 'Ziel', x: 'X-Koordinate', y: 'Y-Koordinate',
        player: 'Spieler (optional)', playerPlaceholder: 'Spielername', playerShort: 'Spieler', unknown: 'Unbekannt', points: 'Punkte'
      },
      army: {
        title: 'Armee', usePreset: 'Preset verwenden', noPresetSelected: 'Kein Preset ausgewählt', noPreset: 'Kein Preset',
        units: 'Einheiten', custom: 'Eigene Zusammenstellung', available: 'Verfügbar', totalUnits: 'Gesamte Einheiten', carry: 'Tragfähigkeit'
      },
      timing: {
        title: 'Zeitplanung', departure: 'Abmarsch', now: 'Sofort', in5: 'In 5 Minuten', in15: 'In 15 Minuten', in30: 'In 30 Minuten', in60: 'In 1 Stunde',
        notesLabel: 'Notizen (optional)', notesPlaceholder: 'Notizen zum Angriff...'
      },
      actions: { start: 'Marsch starten' },
      confirm: { title: 'Marsch bestätigen', prefix: 'Möchtest du den', to: 'auf', suffix: 'wirklich starten?', confirm: 'Bestätigen' },
      preset: {
        createTitle: 'Preset erstellen', createQuestion: 'Möchtest du diese Armeezusammenstellung als Preset speichern?',
        nameLabel: 'Name', namePlaceholder: 'z.B. Schneller Raid', descriptionLabel: 'Beschreibung', descriptionPlaceholder: 'z.B. Optimiert für schnelle Plünderungen', create: 'Erstellen'
      },
      active: {
        title: 'Aktive Märsche', empty: 'Keine aktiven Märsche', planFirst: 'Ersten Marsch planen',
        target: 'Ziel', distance: 'Entfernung', fields: 'Felder', units: 'Einheiten', progress: 'Fortschritt', arrival: 'Ankunft', notes: 'Notizen'
      },
      presets: {
        title: 'Gespeicherte Presets', new: 'Neu erstellen', empty: 'Keine Presets gespeichert', createFirst: 'Erstes Preset erstellen',
        deleteTitle: 'Preset löschen', deleteQuestionPrefix: 'Möchtest du das Preset', deleteQuestionSuffix: 'wirklich löschen?', delete: 'Löschen'
      }
    },
    achievements: {
      title: 'Erfolge & Quests',
      tabs: { achievements: 'Erfolge', quests: 'Quests' },
      progress: 'Fortschritt',
      of: 'von',
      achievements: 'Erfolgen',
      rarity: { common: 'Gewöhnlich', uncommon: 'Ungewöhnlich', rare: 'Selten', epic: 'Episch', legendary: 'Legendär' },
      badges: { daily: 'Täglich', weekly: 'Wöchentlich', seasonal: 'Saison' },
      store: {
        title: 'Quest-Belohnungen',
        description: 'Sammle Quest-Punkte und tausche sie gegen wertvolle Belohnungen ein',
        comingSoon: 'Bald verfügbar',
      },
      items: {
        builder_novice: {
          name: 'Baumeister-Novize',
          description: 'Upgrade 10 Gebäude',
        },
        resource_collector: {
          name: 'Ressourcensammler',
          description: 'Sammle 10.000 Ressourcen',
        },
        first_victory: {
          name: 'Erster Sieg',
          description: 'Gewinne deinen ersten Kampf',
        },
        province_conqueror: {
          name: 'Provinzeroberer',
          description: 'Erobere 3 Provinzen',
        },
        army_commander: {
          name: 'Armeekommandant',
          description: 'Trainiere 100 Einheiten',
        },
        fortress_master: {
          name: 'Festungsmeister',
          description: 'Erreiche Wall Level 10',
          requirement: 'Rathaus Level 15 benötigt',
        },
      },
      rewards: {
        goldUnit: 'Gold',
        titleLabel: 'Titel',
        unknown: 'Unbekannte Belohnung',
      },
    },
    more: {
      title: 'Mehr',
      quickSettings: {
        title: 'Schnelleinstellungen',
        darkMode: 'Dunkles Design',
        darkModeHint: 'Augen schonen bei Nacht',
        sound: 'Sound-Effekte',
        soundHint: 'Bestätigungen und Warnungen',
      },
      features: { title: 'Spiel-Features' },
      settingsSupport: { title: 'Einstellungen & Support' },
      quick: {
        stats: { description: 'Fortschritt, Ranglisten, Erfolge' },
        achievements: { description: 'Belohnungen, Season-Ziele' },
      },
      badges: { new: 'Neu' },
      info: {
        version: 'Version', shard: 'Shard', online: 'Online', connected: 'Verbunden', sync: 'Sync', syncAgo: 'vor 2min',
        description: 'Ein mobiles 4X-Light-Strategiespiel im Stil von Tribal Wars/Civilization. Baue deine Stadt auf, trainiere Armeen und erobere Provinzen in asynchronen PvP-Kämpfen.',
        copyright: '© 2025 Civilization Mobile Team. Alle Rechte vorbehalten.'
      },
      settings: { description: 'Benachrichtigungen, Sprache, Account' },
      help: { description: 'Tutorial, FAQ, Kontakt' },
    },
    settings: {
      title: 'Einstellungen',
      sections: {
        notifications: 'Benachrichtigungen',
        display: 'Darstellung',
        audio: 'Audio',
        gameplay: 'Gameplay',
        privacy: 'Daten & Datenschutz',
      },
      notifications: {
        attacks: 'Angriffe',
        trades: 'Handel',
        buildings: 'Gebäude fertig',
        alliance: 'Allianz-Nachrichten',
        sound: 'Sound-Benachrichtigungen',
      },
      display: {
        darkMode: 'Dark Mode', animations: 'Animationen', compact: 'Kompakter Modus', language: 'Sprache',
        languages: { de: 'Deutsch', en: 'English', fr: 'Français' },
      },
      audio: { master: 'Master-Lautstärke', effects: 'Soundeffekte', music: 'Hintergrundmusik' },
      gameplay: {
        autoCollect: 'Auto-Ressourcen sammeln', confirmAttacks: 'Angriffe bestätigen', showCoordinates: 'Koordinaten anzeigen', quickActions: 'Schnellaktionen',
      },
      privacy: { export: 'Einstellungen exportieren', policy: 'Datenschutzerklärung', deleteAll: 'Alle Daten löschen' },
      actions: { reset: 'Zurücksetzen', save: 'Speichern' },
    },
    reports: {
      title: 'Berichte', all: 'Alle', unread: 'Neu', battle: 'Kämpfe', important: 'Wichtig',
      types: { battle: 'Kampf', trade: 'Handel', spy: 'Spionage', building: 'Gebäude', event: 'Ereignis', system: 'System' },
      badges: { important: 'Wichtig' },
      time: {
        ago: 'vor', day: 'Tag', days: 'Tagen', hour: 'Stunde', hours: 'Stunden', minute: 'Minute', minutes: 'Minuten', justNow: 'gerade eben'
      },
      unreadSummary: { prefix: 'Du hast', unread: 'ungelesene Berichte', ofWhich: 'davon', important: 'wichtige' },
      empty: { title: 'Keine Berichte', allRead: 'Alle Berichte wurden bereits gelesen.', noneInCategory: 'Keine Berichte in dieser Kategorie vorhanden.' },
      spy: {
        title: 'Spionage-Bericht', discovered: 'Deine Spione wurden entdeckt!', resources: 'Ressourcen', units: 'Einheiten', buildings: 'Gebäude', level: 'Stufe'
      },
    },
    trade: {
      title: 'Handel', market: 'Marktplatz', create: 'Angebot erstellen', history: 'Verlauf', available: 'Verfügbare Angebote',
      offers: 'Bietet:', wants: 'Möchte:', ratio: 'Ratio', distance: 'Entfernung', fields: 'Felder', travelTime: 'Reisezeit', minutesShort: 'min',
      execute: 'Handeln', details: 'Details',
      createTitle: 'Neues Handelsangebot erstellen', youOffer: 'Du bietest an:', availableAmount: 'Verfügbar', youWant: 'Du möchtest:', exchangeRatio: 'Tauschverhältnis', createOffer: 'Angebot erstellen',
      validation: { enterAmount: 'Gib eine Menge ein', notEnough: 'Nicht genügend Ressourcen', enterDesired: 'Gib eine gewünschte Menge ein' },
      historyTitle: 'Handelsgeschichte', noHistory: 'Noch keine Handelsgeschichte',
    },
    units: {
      overview: {
        title: 'Armeeübersicht', totalArmy: 'Gesamte Armee', noneTrained: 'Noch keine Einheiten trainiert'
      },
      training: {
        title: 'Einheiten ausbilden', time: 'Ausbildungszeit', required: 'benötigt', train: 'Ausbilden', noneAvailable: 'Keine Einheiten verfügbar',
        mustBuild: 'Muss erst gebaut werden', mustBuildBarracks: 'Kaserne muss erst gebaut werden', buildHint: 'Baue eine Kaserne im Dorf-Screen, um Einheiten zu trainieren', notEnough: 'Nicht genügend Ressourcen oder Bevölkerung'
      },
      stats: { attack: 'Angriff', def: 'DEF' },
      common: { units: 'Einheiten', level: 'Level', unavailable: 'Nicht verfügbar' },
    },
    world: {
      title: 'Welt & Märsche', coords: 'Koordinaten',
      tabs: { map: 'Karte', planner: 'Marschplaner' },
      scroll: { up: 'Nach oben scrollen', down: 'Nach unten scrollen', left: 'Nach links scrollen', right: 'Nach rechts scrollen' },
      zoom: { in: 'Hineinzoomen', out: 'Herauszoomen' },
    },
    help: {
      title: 'Hilfe & Support',
      quick: {
        title: 'Schnelle Hilfe',
        video: 'Video-Tutorial',
        faq: 'FAQ',
        support: 'Support',
        community: 'Community',
      },
      search: { placeholder: 'FAQ durchsuchen...' },
      faq: {
        title: 'Häufig gestellte Fragen',
        resources: {
          question: 'Wie sammle ich Ressourcen?',
          answer: 'Ressourcen werden automatisch von deinen Gebäuden produziert. Tippe auf das Sammeln-Symbol neben jeder Ressource, um sie zu sammeln. Du kannst auch die Produktionsgebäude upgraden, um mehr Ressourcen pro Stunde zu erhalten.',
        },
        buildings: {
          question: 'Wie upgrade ich Gebäude?',
          answer: 'Tippe auf ein Gebäude in deiner Stadt und dann auf "Upgrade". Du brauchst genügend Ressourcen und einen freien Bauslot. Höhere Townhall-Level schalten mehr Bauslots frei.',
        },
        army: {
          question: 'Wie trainiere ich Einheiten?',
          answer: 'Gehe zum Armee-Tab und wähle die Einheit aus, die du trainieren möchtest. Jede Einheit kostet bestimmte Ressourcen und Bevölkerung. Stelle sicher, dass du genug Houses für die Bevölkerung hast.',
        },
        combat: {
          question: 'Wie funktioniert das Kampfsystem?',
          answer: 'Jede Einheit hat Stärken und Schwächen. Kavallerie ist stark gegen Fernkämpfer, aber schwach gegen Speerkämpfer. Schwertkämpfer sind gut gegen Axtkämpfer. Nutze verschiedene Einheitentypen für eine ausgewogene Armee.',
        },
        defense: {
          question: 'Wie verteidige ich meine Stadt?',
          answer: 'Baue Mauern, um deine Stadt zu schützen. Höhere Mauerstufen bieten besseren Schutz. Stelle Verteidigungseinheiten in deiner Stadt ab und achte auf die Berichte über feindliche Angriffe.',
        },
        world: {
          question: 'Wie erkunde ich die Welt?',
          answer: 'Nutze die Weltkarte, um andere Spieler, neutrale Camps und Ressourcenfelder zu finden. Du kannst Späher schicken, um Informationen zu sammeln, oder Armeen für Angriffe entsenden.',
        },
      },
      tutorial: {
        'getting-started': {
          title: 'Erste Schritte',
          description: 'Grundlagen des Spiels verstehen',
          lessons: {
            1: 'Deine erste Stadt',
            2: 'Ressourcen verstehen',
            3: 'Gebäude bauen',
            4: 'Erste Einheiten trainieren',
          },
        },
        advanced: {
          title: 'Fortgeschritten',
          description: 'Strategien und Taktiken',
          lessons: {
            1: 'Armeen zusammenstellen',
            2: 'Angriffs- und Verteidigungsstrategien',
            3: 'Ressourcen-Management',
            4: 'Diplomatie und Allianzen',
          },
        },
      },
      contact: {
        title: 'Support kontaktieren',
        description: 'Beschreibe dein Problem so detailliert wie möglich. Wir antworten normalerweise innerhalb von 24 Stunden.',
        emailLabel: 'E-Mail-Adresse',
        emailPlaceholder: 'deine@email.com',
        messageLabel: 'Nachricht',
        messagePlaceholder: 'Beschreibe dein Problem oder deine Frage...',
        tip: 'Tipp: Füge Screenshots oder Spieler-ID hinzu, um eine schnellere Bearbeitung zu ermöglichen.',
        send: 'Nachricht senden',
      },
      more: {
        title: 'Weitere Hilfe',
        links: {
          rules: 'Spielregeln & Richtlinien',
          technical: 'Technische Probleme melden',
          feedback: 'Feedback & Verbesserungsvorschläge',
        },
        supportHours: {
          title: 'Support-Zeiten',
          weekdays: 'Mo-Fr: 9:00 - 18:00 CET',
          weekend: 'Sa-So: 10:00 - 16:00 CET',
        },
      },
    },
    stats: {
      title: 'Spielerstatistiken',
      general: {
        title: 'Allgemeine Statistiken', totalBuildingLevels: 'Gesamt-Gebäudestufen', armyUnits: 'Armeeeinheiten', battlesWon: 'Gewonnene Kämpfe', playtime: 'Spielzeit'
      },
      currentResources: { title: 'Aktuelle Ressourcen' },
      production: { title: 'Produktion pro Stunde' },
      total: {
        title: 'Gesamtstatistiken', totalResources: 'Gesamte Ressourcen gesammelt', unitsTrained: 'Einheiten ausgebildet', buildingsUpgraded: 'Gebäude ausgebaut', victories: 'Siege', defeats: 'Niederlagen'
      },
      collected: { title: 'Gesammelte Ressourcen (Gesamt)' },
    },
    village: { title: 'Dorf' },
    // Village extras
    village: {
      title: 'Dorf',
      active: 'Aktive Bauarbeiten',
      buildings: {
        headquarters: 'Hauptgebäude', barracks: 'Kaserne', timberCamp: 'Holzfäller', clayPit: 'Lehmgrube', ironMine: 'Eisenmine'
      }
    },
    wallet: { minikitMissing: 'MiniKit ist nicht installiert', runInApp: 'Diese App muss in der Worldcoin-App ausgeführt werden.', authenticate: 'Authentifizieren' },
    notfound: { title: 'Seite nicht gefunden', backHome: 'Zur Startseite' },
    mint: {
      title: 'Neues Dorf prägen', description: 'Dörfer sind NFTs. Jeder Spieler erhält beim Start ein Dorf kostenlos. Solltest du dein letztes Dorf verlieren, kannst du ein neues für 10 WORLD prägen.',
      minting: 'Mint wird ausgeführt… Dies kann einige Sekunden dauern.', success: 'Erfolgreich geprägt', transaction: 'Transaktion',
      free: {
        title: 'Kostenloses Startdorf', available: 'Verfügbar', used: 'Bereits genutzt', perk1: 'Level 1 Mauer, sichere Startressourcen', perk2: 'Einzigartige NFT-Zugehörigkeit',
        cta: 'Kostenloses Dorf prägen', unavailable: 'Nicht verfügbar', alreadyUsed: 'Dein kostenloses Mint wurde bereits verwendet.'
      },
      paid: { title: 'Dorf für 10 WORLD prägen', balance: 'Dein WORLD Guthaben', needFunds: 'Du benötigst mindestens 10 WORLD, um ein neues Dorf zu prägen.', cta: 'Für 10 WORLD prägen' },
      info: { title: 'Was bedeutet „Dorf als NFT“?', point1: 'Du besitzt dein Dorf on-chain; es ist übertragbar.', point2: 'Bei Verlust deines letzten Dorfs kannst du ein neues prägen.', point3: 'Das erste Dorf ist kostenlos, weitere kosten 10 WORLD.', preparing: 'Vorbereitung', running: 'Läuft…' },
    },
  },
  resources: { collect: 'Ressourcen sammeln' },
  // Resources screen
  resources: {
    collect: 'Ressourcen sammeln',
    names: { wood: 'Holz', clay: 'Lehm', iron: 'Eisen', coal: 'Kohle', wheat: 'Weizen', bread: 'Brot', meat: 'Fleisch', gold: 'Gold', villager: 'Dorfbewohner' },
    storage: { title: 'Lager', max: 'Max', full: 'Lager voll', upgradeHint: 'Ausbau über Lager-Gebäude' },
    of: 'von',
    collectAll: 'Alle sammeln', resources: 'Ressourcen',
  },
    battle: {
    resultTitle: 'Kampfergebnis',
    victory: 'Sieg',
    defeat: 'Niederlage',
    draw: 'Unentschieden',
    attacker: 'Angreifer',
    defender: 'Verteidiger',
    loot: 'Beute',
    wallDamage: 'Mauerschaden',
    tabs: { units: 'Einheiten', phases: 'Phasen', analysis: 'Analyse', tips: 'Tipps' },
    losses: { attacker: 'Angreifer Verluste', defender: 'Verteidiger Verluste' },
    phases: { ranged: 'Fernkampf', charge: 'Sturmangriff', melee: 'Nahkampf', siege: 'Belagerung' },
    why: { titleWon: 'Warum gewonnen?', titleLost: 'Warum verloren?', counter: 'Konter-Effekte', wall: 'Mauer-Effekte', tech: 'Technologie' },
    nextTime: 'Nächstes Mal besser',
  },
  marchReports: {
    backToOverview: 'Zurück zur Übersicht', battleReportTitle: 'Kampfbericht', units: 'Einheiten',
    factors: { title: 'Kampffaktoren', counter: 'Konter-Bonus', wall: 'Mauer-Bonus', moral: 'Moral', tech: 'Technologie', terrain: 'Gelände', variance: 'Glück' },
    noLosses: 'Keine Verluste', phase: 'Phase', damage: 'Schaden',
    stats: { title: 'Marsch-Statistiken', total: 'Märsche gesamt', winRate: 'Erfolgsquote', totalLoot: 'Beute gesamt', returning: 'Rückkehrend' },
    tabs: { completed: 'Abgeschlossen', returning: 'Rückkehrend', analysis: 'Analyse' },
    completed: { title: 'Abgeschlossene Märsche', empty: 'Noch keine abgeschlossenen Märsche', target: 'Ziel', arrival: 'Ankunft' },
    loot: 'Beute', notes: 'Notizen',
    returning: { title: 'Rückkehrende Truppen', empty: 'Keine rückkehrenden Truppen', from: 'Rückkehr aus' },
    progress: 'Fortschritt', arrival: 'Ankunft', unknown: 'Unbekannt', transporting: 'Transportiert',
  },
  villageInfo: {
    title: 'Dorfinfos',
    coords: 'Koordinaten',
    distance: 'Entfernung',
    fields: 'Felder',
    points: 'Punkte',
    level: 'Level',
    player: 'Spieler',
    alliance: 'Allianz',
    lastActivity: 'Letzte Aktivität',
    populationDefense: 'Bevölkerung & Verteidigung',
    wallLevel: 'Wall Level',
    defenseBonus: 'Verteidigungsbonus',
    estimatedStrength: 'Geschätzte Stärke',
    tabs: { army: 'Armee', buildings: 'Gebäude', travel: 'Reisezeit' },
    villageType: { barbarian: 'Barbarendorf', player: 'Spielerdorf' },
    description: 'Detaillierte Informationen über dieses Dorf und mögliche Aktionen',
    strength: { veryStrong: 'Sehr stark', strong: 'Stark', medium: 'Mittel', weak: 'Schwach' },
  },
  units: {
    spearman: 'Speerträger',
    swordsman: 'Schwertkämpfer',
    archer: 'Bogenschütze',
    knight: 'Schwere Kavallerie',
  },
};
