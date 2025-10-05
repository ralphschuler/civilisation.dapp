export const en = {
  app: {
    title: 'Tribal Wars',
  },
  common: {
    close: 'Close',
    save: 'Save',
    cancel: 'Cancel',
    back: 'Back',
    delete: 'Delete',
    details: 'Details',
    loading: 'Loading…',
    completed: 'Completed',
    attack: 'Attack',
    spy: 'Spy',
    trade: 'Trade',
    light: 'Light',
    dark: 'Dark',
    on: 'On',
    off: 'Off',
    population: 'Population',
  },
  loading: {
    title: 'Tribal Wars',
    message: 'Loading game...',
    completed: 'completed',
  },
  error: {
    title: 'Game error occurred',
    technicalDetails: 'Technical Details',
    reloadGame: 'Reload Game',
    reloadPage: 'Reload Page',
  },
  screens: {
    march: {
      title: 'March Planner',
      stats: { active: 'Active marches', savedPresets: 'Saved presets' },
      tabs: { planner: 'Plan', active: 'Active marches', presets: 'Presets' },
      attackType: {
        title: 'Attack type',
        raid: { name: 'Raid', description: 'Fast attack to loot resources' },
        siege: { name: 'Siege', description: 'Attack on walls and defenses' },
        conquer: { name: 'Conquer', description: 'Full takeover of the village' },
      },
      target: {
        title: 'Target', x: 'X coordinate', y: 'Y coordinate',
        player: 'Player (optional)', playerPlaceholder: 'Player name', playerShort: 'Player', unknown: 'Unknown', points: 'Points'
      },
      army: {
        title: 'Army', usePreset: 'Use preset', noPresetSelected: 'No preset selected', noPreset: 'No preset',
        units: 'Units', custom: 'Custom composition', available: 'Available', totalUnits: 'Total units', carry: 'Carry capacity'
      },
      timing: {
        title: 'Timing', departure: 'Departure', now: 'Now', in5: 'In 5 minutes', in15: 'In 15 minutes', in30: 'In 30 minutes', in60: 'In 1 hour',
        notesLabel: 'Notes (optional)', notesPlaceholder: 'Notes about the attack...'
      },
      actions: { start: 'Start march' },
      confirm: { title: 'Confirm march', prefix: 'Do you want to start the', to: 'to', suffix: 'now?', confirm: 'Confirm' },
      preset: {
        createTitle: 'Create preset', createQuestion: 'Do you want to save this army composition as a preset?',
        nameLabel: 'Name', namePlaceholder: 'e.g., Fast raid', descriptionLabel: 'Description', descriptionPlaceholder: 'e.g., Optimized for fast raids', create: 'Create'
      },
      active: {
        title: 'Active marches', empty: 'No active marches', planFirst: 'Plan first march',
        target: 'Target', distance: 'Distance', fields: 'fields', units: 'Units', progress: 'Progress', arrival: 'Arrival', notes: 'Notes'
      },
      presets: {
        title: 'Saved presets', new: 'Create new', empty: 'No presets saved', createFirst: 'Create first preset',
        deleteTitle: 'Delete preset', deleteQuestionPrefix: 'Do you really want to delete preset', deleteQuestionSuffix: '?', delete: 'Delete'
      }
    },
    achievements: {
      title: 'Achievements & Quests',
      tabs: { achievements: 'Achievements', quests: 'Quests' },
      progress: 'Progress',
      of: 'of',
      achievements: 'achievements',
      rarity: { common: 'Common', uncommon: 'Uncommon', rare: 'Rare', epic: 'Epic', legendary: 'Legendary' },
      badges: { daily: 'Daily', weekly: 'Weekly', seasonal: 'Season' },
      store: {
        title: 'Quest Rewards',
        description: 'Collect quest points and exchange them for valuable rewards',
        comingSoon: 'Coming soon',
      },
      items: {
        builder_novice: {
          name: 'Builder Novice',
          description: 'Upgrade 10 buildings',
        },
        resource_collector: {
          name: 'Resource Collector',
          description: 'Collect 10,000 resources',
        },
        first_victory: {
          name: 'First Victory',
          description: 'Win your first battle',
        },
        province_conqueror: {
          name: 'Province Conqueror',
          description: 'Conquer 3 provinces',
        },
        army_commander: {
          name: 'Army Commander',
          description: 'Train 100 units',
        },
        fortress_master: {
          name: 'Fortress Master',
          description: 'Reach Wall level 10',
          requirement: 'Town Hall level 15 required',
        },
      },
      rewards: {
        goldUnit: 'Gold',
        titleLabel: 'Title',
        unknown: 'Unknown reward',
      },
    },
    more: { title: 'More' },
    settings: { title: 'Settings' },
    // Settings sections and labels
    settings: {
      title: 'Settings',
      sections: {
        notifications: 'Notifications',
        display: 'Display',
        audio: 'Audio',
        gameplay: 'Gameplay',
        privacy: 'Data & Privacy',
      },
      notifications: {
        attacks: 'Attacks',
        trades: 'Trades',
        buildings: 'Buildings done',
        alliance: 'Alliance messages',
        sound: 'Sound notifications',
      },
      display: {
        darkMode: 'Dark mode', animations: 'Animations', compact: 'Compact mode', language: 'Language',
        languages: { de: 'German', en: 'English', fr: 'French' },
      },
      audio: { master: 'Master volume', effects: 'Sound effects', music: 'Background music' },
      gameplay: {
        autoCollect: 'Auto-collect resources', confirmAttacks: 'Confirm attacks', showCoordinates: 'Show coordinates', quickActions: 'Quick actions',
      },
      privacy: { export: 'Export settings', policy: 'Privacy policy', deleteAll: 'Delete all data' },
      actions: { reset: 'Reset', save: 'Save' },
    },
    // More screen extra labels
    more: {
      title: 'More',
      quickSettings: {
        title: 'Quick settings',
        darkMode: 'Dark theme',
        darkModeHint: 'Reduce eye strain at night',
        sound: 'Sound effects',
        soundHint: 'Confirmations and warnings',
      },
      features: { title: 'Game features' },
      settingsSupport: { title: 'Settings & Support' },
      quick: {
        stats: { description: 'Progress, rankings, achievements' },
        achievements: { description: 'Rewards, season goals' },
      },
      badges: { new: 'New' },
      info: {
        version: 'Version', shard: 'Shard', online: 'Online', connected: 'Connected', sync: 'Sync', syncAgo: '2min ago',
        description: 'A mobile 4X-light strategy game in the style of Tribal Wars/Civilization. Build your city, train armies, and conquer provinces in asynchronous PvP battles.',
        copyright: '© 2025 Civilization Mobile Team. All rights reserved.'
      },
      settings: { description: 'Notifications, language, account' },
      help: { description: 'Tutorial, FAQ, contact' },
    },
    settings: { title: 'Settings' },
    reports: { title: 'Reports', all: 'All', unread: 'New', battle: 'Battles', important: 'Important' },
    // Reports extra labels
    reports: {
      title: 'Reports', all: 'All', unread: 'New', battle: 'Battles', important: 'Important',
      types: { battle: 'Battle', trade: 'Trade', spy: 'Espionage', building: 'Building', event: 'Event', system: 'System' },
      badges: { important: 'Important' },
      time: {
        ago: 'ago', day: 'day', days: 'days', hour: 'hour', hours: 'hours', minute: 'minute', minutes: 'minutes', justNow: 'just now'
      },
      unreadSummary: { prefix: 'You have', unread: 'unread reports', ofWhich: 'of which', important: 'important' },
      empty: { title: 'No reports', allRead: 'All reports have been read.', noneInCategory: 'No reports in this category.' },
      spy: {
        title: 'Spy report', discovered: 'Your spies were discovered!', resources: 'Resources', units: 'Units', buildings: 'Buildings', level: 'Level'
      },
    },
    marchReports: {
      backToOverview: 'Back to overview', battleReportTitle: 'Battle report', units: 'units',
      factors: { title: 'Battle factors', counter: 'Counter bonus', wall: 'Wall bonus', moral: 'Morale', tech: 'Technology', terrain: 'Terrain', variance: 'Luck' },
      noLosses: 'No losses', phase: 'Phase', damage: 'Damage',
      stats: { title: 'March statistics', total: 'Total marches', winRate: 'Win rate', totalLoot: 'Total loot', returning: 'Returning' },
      tabs: { completed: 'Completed', returning: 'Returning', analysis: 'Analysis' },
      completed: { title: 'Completed marches', empty: 'No completed marches', target: 'Target', arrival: 'Arrival' },
      loot: 'Loot', notes: 'Notes',
      returning: { title: 'Returning troops', empty: 'No returning troops', from: 'Returning from' },
      progress: 'Progress', arrival: 'Arrival', unknown: 'Unknown', transporting: 'Transporting',
    },
    trade: { title: 'Trade', market: 'Marketplace', create: 'Create Offer', history: 'History', available: 'Available offers' },
    world: {
      title: 'World & Marches', coords: 'Coordinates',
      tabs: { map: 'Map', planner: 'March Planner' },
      scroll: { up: 'Scroll up', down: 'Scroll down', left: 'Scroll left', right: 'Scroll right' },
      zoom: { in: 'Zoom in', out: 'Zoom out' },
    },
    units: {
      overview: {
        title: 'Army Overview', totalArmy: 'Total army', noneTrained: 'No units trained'
      },
      training: {
        title: 'Train units', time: 'Training time', required: 'required', train: 'Train', noneAvailable: 'No units available',
        mustBuild: 'Must be built first', mustBuildBarracks: 'Barracks must be built first', buildHint: 'Build a Barracks in the Village screen to train units', notEnough: 'Not enough resources or population'
      },
      stats: { attack: 'Attack', def: 'DEF' },
      common: { units: 'units', level: 'Level', unavailable: 'Unavailable' },
    },
    // Trade extras
    trade: {
      title: 'Trade', market: 'Marketplace', create: 'Create Offer', history: 'History', available: 'Available offers',
      offers: 'Offers:', wants: 'Wants:', ratio: 'Ratio', distance: 'Distance', fields: 'fields', travelTime: 'Travel time', minutesShort: 'min',
      execute: 'Trade', details: 'Details',
      createTitle: 'Create new trade offer', youOffer: 'You offer:', availableAmount: 'Available', youWant: 'You want:', exchangeRatio: 'Exchange ratio', createOffer: 'Create offer',
      validation: { enterAmount: 'Enter an amount', notEnough: 'Not enough resources', enterDesired: 'Enter a desired amount' },
      historyTitle: 'Trade history', noHistory: 'No trade history yet',
    },
    help: {
      title: 'Help & Support',
      quick: {
        title: 'Quick Help',
        video: 'Video Tutorial',
        faq: 'FAQ',
        support: 'Support',
        community: 'Community',
      },
      search: { placeholder: 'Search FAQ...' },
      faq: {
        title: 'Frequently Asked Questions',
        resources: {
          question: 'How do I collect resources?',
          answer: 'Resources are produced automatically by your buildings. Tap the collect icon next to each resource to gather them. You can also upgrade production buildings to increase hourly income.',
        },
        buildings: {
          question: 'How do I upgrade buildings?',
          answer: 'Tap a building in your city and then "Upgrade". You need enough resources and a free build slot. Higher Town Hall levels unlock more build slots.',
        },
        army: {
          question: 'How do I train units?',
          answer: 'Go to the army tab and choose the unit to train. Each unit costs specific resources and population. Make sure you have enough Houses for population.',
        },
        combat: {
          question: 'How does combat work?',
          answer: 'Each unit has strengths and weaknesses. Cavalry is strong against ranged but weak against spearmen. Swordsmen are good against axemen. Use a mix of units for a balanced army.',
        },
        defense: {
          question: 'How do I defend my city?',
          answer: 'Build walls to protect your city. Higher wall levels provide better defense. Station defensive units in your city and watch reports for enemy attacks.',
        },
        world: {
          question: 'How do I explore the world?',
          answer: 'Use the world map to find other players, neutral camps, and resource fields. You can send scouts for intel or dispatch armies to attack.',
        },
      },
      tutorial: {
        'getting-started': {
          title: 'Getting Started',
          description: 'Understand the game basics',
          lessons: {
            1: 'Your first city',
            2: 'Understanding resources',
            3: 'Construct buildings',
            4: 'Train your first units',
          },
        },
        advanced: {
          title: 'Advanced',
          description: 'Strategies and tactics',
          lessons: {
            1: 'Composing armies',
            2: 'Attack and defense strategies',
            3: 'Resource management',
            4: 'Diplomacy and alliances',
          },
        },
      },
      contact: {
        title: 'Contact Support',
        description: 'Describe your issue as detailed as possible. We typically respond within 24 hours.',
        emailLabel: 'Email address',
        emailPlaceholder: 'your@email.com',
        messageLabel: 'Message',
        messagePlaceholder: 'Describe your issue or question...',
        tip: 'Tip: Add screenshots or your player ID to speed up handling.',
        send: 'Send message',
      },
      more: {
        title: 'More Help',
        links: {
          rules: 'Game rules & guidelines',
          technical: 'Report technical issues',
          feedback: 'Feedback & suggestions',
        },
        supportHours: {
          title: 'Support hours',
          weekdays: 'Mon-Fri: 9:00 - 18:00 CET',
          weekend: 'Sat-Sun: 10:00 - 16:00 CET',
        },
      },
    },
    stats: { title: 'Player Stats' },
    // Stats extras
    stats: {
      title: 'Player Stats',
      general: {
        title: 'General statistics', totalBuildingLevels: 'Total building levels', armyUnits: 'Army units', battlesWon: 'Battles won', playtime: 'Playtime'
      },
      currentResources: { title: 'Current resources' },
      production: { title: 'Production per hour' },
      total: {
        title: 'Lifetime stats', totalResources: 'Total resources collected', unitsTrained: 'Units trained', buildingsUpgraded: 'Buildings upgraded', victories: 'Victories', defeats: 'Defeats'
      },
      collected: { title: 'Collected resources (total)' },
    },
    village: { title: 'Village' },
    // Village extras
    village: {
      title: 'Village',
      active: 'Active constructions',
      buildings: {
        headquarters: 'Headquarters', barracks: 'Barracks', timberCamp: 'Woodcutter', clayPit: 'Clay pit', ironMine: 'Iron mine'
      }
    },
    wallet: { minikitMissing: 'MiniKit is not installed', runInApp: 'This app has to be run using the Worldcoin app.', authenticate: 'Authenticate' },
    notfound: { title: 'Page not found', backHome: 'Go back to home' },
    mint: {
      title: 'Mint new village', description: 'Villages are NFTs. Each player gets one free village at the start. If you lose your last village, you can mint a new one for 10 WORLD.',
      minting: 'Mint in progress… This may take a few seconds.', success: 'Successfully minted', transaction: 'Transaction',
      free: {
        title: 'Free starter village', available: 'Available', used: 'Already used', perk1: 'Level 1 wall, secure starting resources', perk2: 'Unique NFT affiliation',
        cta: 'Mint free village', unavailable: 'Not available', alreadyUsed: 'Your free mint has already been used.'
      },
      paid: { title: 'Mint village for 10 WORLD', balance: 'Your WORLD balance', needFunds: 'You need at least 10 WORLD to mint a new village.', cta: 'Mint for 10 WORLD' },
      info: { title: 'What does “village as NFT” mean?', point1: 'You own your village on-chain; it is transferable.', point2: 'If you lose your last village, you can mint a new one.', point3: 'The first village is free; additional ones cost 10 WORLD.', preparing: 'Preparing', running: 'Running…' },
    },
  },
    resources: { collect: 'Collect resources' },
    // Resources screen
    resources: {
      collect: 'Collect resources',
      names: { wood: 'Wood', clay: 'Clay', iron: 'Iron', coal: 'Coal', wheat: 'Wheat', bread: 'Bread', meat: 'Meat', gold: 'Gold', villager: 'Villager' },
      storage: { title: 'Storage', max: 'Max', full: 'Storage full', upgradeHint: 'Upgrade via Storage building' },
      of: 'of',
      collectAll: 'Collect all', resources: 'resources',
    },
  battle: {
    resultTitle: 'Battle Result',
    victory: 'Victory',
    defeat: 'Defeat',
    draw: 'Draw',
    attacker: 'Attacker',
    defender: 'Defender',
    loot: 'Loot',
    wallDamage: 'Wall damage',
    tabs: { units: 'Units', phases: 'Phases', analysis: 'Analysis', tips: 'Tips' },
    losses: { attacker: 'Attacker Losses', defender: 'Defender Losses' },
    phases: { ranged: 'Ranged', charge: 'Charge', melee: 'Melee', siege: 'Siege' },
    why: { titleWon: 'Why won?', titleLost: 'Why lost?', counter: 'Counter Effects', wall: 'Wall Effects', tech: 'Technology' },
    nextTime: 'Improve Next Time',
  },
  villageInfo: {
    title: 'Village Info',
    coords: 'Coordinates',
    distance: 'Distance',
    fields: 'tiles',
    points: 'Points',
    level: 'Level',
    player: 'Player',
    alliance: 'Alliance',
    lastActivity: 'Last activity',
    populationDefense: 'Population & Defense',
    wallLevel: 'Wall level',
    defenseBonus: 'Defense bonus',
    estimatedStrength: 'Estimated strength',
    tabs: { army: 'Army', buildings: 'Buildings', travel: 'Travel Time' },
    villageType: { barbarian: 'Barbarian Village', player: 'Player Village' },
    description: 'Detailed information about this village and possible actions',
    strength: { veryStrong: 'Very strong', strong: 'Strong', medium: 'Medium', weak: 'Weak' },
  },
    units: {
      spearman: 'Spearman',
      swordsman: 'Swordsman',
      archer: 'Archer',
      knight: 'Knight',
    },
};
