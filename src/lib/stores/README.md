# Zustand Stores Documentation

This directory contains all Zustand stores for the Civilization Mobile game. Stores interact with repositories to persist and retrieve data.

## Architecture

```
Stores (Zustand) → Repositories (Interface) → Implementation (Mock/LocalStorage/IndexedDB/API)
```

## Available Stores

### 1. GameStore
**File:** `GameStore.ts`

Manages overall game state including current screen, selected building, and UI state.

```typescript
import { useGameStore } from './lib/stores';

// Usage
const currentScreen = useGameStore(state => state.currentScreen);
const setCurrentScreen = useGameStore(state => state.setCurrentScreen);
```

**Actions:**
- `initialize()` - Initialize the game
- `saveGameState(state)` - Save game state
- `setCurrentScreen(screen)` - Change current screen
- `setSelectedBuilding(buildingId)` - Set selected building
- `setSelectedVillageInfo(info)` - Set selected village info
- `reset()` - Reset store

### 2. VillageStore
**File:** `VillageStore.ts`

Manages village data including buildings, resources, army, and training queues.

```typescript
import { useVillageStore } from './lib/stores';

// Usage
const village = useVillageStore(state => state.village);
const upgradeBuilding = useVillageStore(state => state.upgradeBuilding);
```

**Actions:**
- `loadVillage(villageId)` - Load village data
- `updateVillage(village)` - Update village
- `upgradeBuilding(buildingId, building)` - Upgrade a building
- `addToTrainingQueue(training)` - Add unit training
- `removeFromTrainingQueue(index)` - Remove from queue
- `updateResources(resources)` - Update resources
- `collectResources(resourceType?)` - Collect resources
- `reset()` - Reset store

### 3. MarchStore
**File:** `MarchStore.ts`

Manages marches (attacks) and army presets.

```typescript
import { useMarchStore } from './lib/stores';

// Usage
const marches = useMarchStore(state => state.marches);
const createMarch = useMarchStore(state => state.createMarch);
```

**Actions:**
- `loadMarches()` - Load all marches
- `loadMarchPresets()` - Load army presets
- `createMarch(march)` - Create new march
- `cancelMarch(marchId)` - Cancel a march
- `updateMarch(march)` - Update march
- `createMarchPreset(preset)` - Create army preset
- `updateMarchPreset(preset)` - Update preset
- `deleteMarchPreset(presetId)` - Delete preset
- `getActiveMarchesForVillage(villageId)` - Get active marches
- `reset()` - Reset store

### 4. ReportStore
**File:** `ReportStore.ts`

Manages battle reports, spy reports, and other game reports.

```typescript
import { useReportStore } from './lib/stores';

// Usage
const reports = useReportStore(state => state.reports);
const unreadCount = useReportStore(state => state.unreadCount);
```

**Actions:**
- `loadReports()` - Load all reports
- `loadUnreadCount()` - Load unread count
- `getReport(reportId)` - Get specific report
- `createReport(report)` - Create new report
- `markAsRead(reportId)` - Mark report as read
- `deleteReport(reportId)` - Delete report
- `setSelectedReport(report)` - Set selected report
- `reset()` - Reset store

### 5. PlayerStatsStore
**File:** `PlayerStatsStore.ts`

Manages player statistics and achievements.

```typescript
import { usePlayerStatsStore } from './lib/stores';

// Usage
const stats = usePlayerStatsStore(state => state.stats);
const incrementBattlesWon = usePlayerStatsStore(state => state.incrementBattlesWon);
```

**Actions:**
- `loadStats()` - Load player stats
- `updateStats(stats)` - Update stats
- `incrementBattlesWon()` - Increment battles won
- `incrementBattlesLost()` - Increment battles lost
- `incrementBuildingsUpgraded()` - Increment buildings upgraded
- `incrementUnitsTrained(count)` - Increment units trained
- `addResourcesGathered(resources)` - Add resources gathered
- `incrementPlaytime(seconds)` - Increment playtime
- `reset()` - Reset store

### 6. TechTreeStore
**File:** `TechTreeStore.ts`

Manages technology tree, unlocks, and progression.

```typescript
import { useTechTreeStore } from './lib/stores';

// Usage
const techTree = useTechTreeStore(state => state.techTree);
const isBuildingUnlocked = useTechTreeStore(state => state.isBuildingUnlocked);
```

**Actions:**
- `loadTechTree()` - Load tech tree
- `updateTechTree(techTree)` - Update tech tree
- `unlockBuilding(buildingId)` - Unlock building
- `unlockUnit(unitId)` - Unlock unit
- `upgradeSmithyLine(line, stat)` - Upgrade smithy
- `advanceEra(era)` - Advance to new era
- `isBuildingUnlocked(buildingId)` - Check if building unlocked
- `isUnitUnlocked(unitId)` - Check if unit unlocked
- `reset()` - Reset store

## Initialization

Initialize all stores on app startup:

```typescript
import { initializeStores } from './lib/stores';

// In your App.tsx or main entry point
useEffect(() => {
  initializeStores();
}, []);
```

## Best Practices

### 1. Use Selectors
Select only the data you need to prevent unnecessary re-renders:

```typescript
// ❌ Bad - subscribes to entire store
const store = useVillageStore();

// ✅ Good - subscribes only to village
const village = useVillageStore(state => state.village);
```

### 2. Use Actions in Event Handlers
```typescript
function MyComponent() {
  const upgradeBuilding = useVillageStore(state => state.upgradeBuilding);

  const handleUpgrade = () => {
    upgradeBuilding('townhall', { type: 'townhall', level: 2 });
  };

  return <button onClick={handleUpgrade}>Upgrade</button>;
}
```

### 3. Combine Selectors for Computed Values
```typescript
const hasEnoughResources = useVillageStore(state => {
  const { wood, clay, iron } = state.village?.resources || {};
  return (wood || 0) >= 100 && (clay || 0) >= 100 && (iron || 0) >= 50;
});
```

### 4. Handle Loading and Error States
```typescript
function MyComponent() {
  const { village, isLoading, error } = useVillageStore(state => ({
    village: state.village,
    isLoading: state.isLoading,
    error: state.error
  }));

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;
  if (!village) return null;

  return <div>{village.name}</div>;
}
```

## Testing

Reset all stores between tests:

```typescript
import { resetAllStores } from './lib/stores';

beforeEach(() => {
  resetAllStores();
});
```

## DevTools

All stores are configured with Redux DevTools support for debugging. Install the [Redux DevTools Extension](https://github.com/reduxjs/redux-devtools) to inspect store state and actions.

## Persistence

The GameStore uses Zustand's persist middleware to save UI state to localStorage. Other stores use repositories for persistence, which can be swapped out (Mock → LocalStorage → IndexedDB → API).