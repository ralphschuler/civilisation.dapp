# Repository System Documentation

The repository system provides an abstraction layer for data persistence. This allows you to easily switch between different storage backends (Mock, LocalStorage, IndexedDB, API) without changing your application code.

## Architecture

```
Application Code
      ↓
  Zustand Stores
      ↓
  IRepository Interface
      ↓
  ┌──────────────────────────┐
  │ Repository Implementations│
  ├──────────────────────────┤
  │ • MockRepository         │
  │ • LocalStorageRepository │
  │ • IndexedDBRepository    │ (Future)
  │ • APIRepository          │ (Future)
  └──────────────────────────┘
```

## Files

### IRepository.ts

Defines the interface contracts for all repositories. Each sub-repository handles a specific domain:

- **IVillageRepository** - Village data
- **IGameStateRepository** - Overall game state
- **IMarchRepository** - Marches/attacks
- **IMarchPresetRepository** - Army presets
- **IReportRepository** - Battle/spy reports
- **IPlayerStatsRepository** - Player statistics
- **ITechTreeRepository** - Technology tree
- **IProvinceRepository** - Map provinces
- **INeutralCampRepository** - PvE camps

### MockRepository.ts

In-memory implementation for development and testing. Data is lost on page refresh.

**Use cases:**

- Development
- Testing
- Demo mode

### LocalStorageRepository.ts

Browser localStorage implementation. Data persists across sessions.

**Use cases:**

- Production (single-player)
- Offline mode
- Small to medium datasets (<5MB)

**Limitations:**

- 5-10MB storage limit
- Synchronous API (can block UI on large datasets)
- String-only storage (requires JSON serialization)

### IndexedDBRepository.ts (Future)

Browser IndexedDB implementation for larger datasets.

**Use cases:**

- Large datasets (>5MB)
- Complex queries
- Better performance

### APIRepository.ts (Future)

Backend API implementation for multiplayer.

**Use cases:**

- Multiplayer mode
- Cross-device sync
- Server-side validation

### RepositoryFactory.ts

Factory pattern for creating and managing repository instances.

## Usage

### 1. Configure Repository Type

Set repository type at app initialization:

```typescript
import { configureRepository } from "./lib/repositories/RepositoryFactory";

// Use Mock for development
configureRepository({ type: "mock" });

// Use LocalStorage for production
configureRepository({ type: "localStorage" });

// Use API for multiplayer (future)
configureRepository({
  type: "api",
  apiUrl: "https://api.your-game.com",
});
```

### 2. Get Repository Instance

```typescript
import { getRepository } from "./lib/repositories/RepositoryFactory";

// Get repository instance
const repository = getRepository();

// Access sub-repositories
const village = await repository.village.getVillage("village1");
const reports = await repository.report.getReports();
```

### 3. Use in Stores (Recommended)

Stores already use repositories internally:

```typescript
import { useVillageStore } from "./lib/stores";

function MyComponent() {
  const loadVillage = useVillageStore((state) => state.loadVillage);

  useEffect(() => {
    loadVillage("village1"); // Uses repository under the hood
  }, []);
}
```

## Repository Methods

### VillageRepository

```typescript
// Get single village
const village = await repository.village.getVillage("village1");

// Get all villages
const villages = await repository.village.getAllVillages();

// Create village
await repository.village.createVillage(newVillage);

// Update village
await repository.village.updateVillage(village);

// Delete village
await repository.village.deleteVillage("village1");

// Get village info (summary)
const info = await repository.village.getVillageInfo("village1");
```

### GameStateRepository

```typescript
// Get game state
const state = await repository.gameState.getGameState();

// Save game state
await repository.gameState.saveGameState(state);

// Reset game
await repository.gameState.resetGameState();

// Get last update time
const lastUpdate = await repository.gameState.getLastUpdate();
```

### MarchRepository

```typescript
// Get all marches
const marches = await repository.march.getMarches();

// Get single march
const march = await repository.march.getMarch("march1");

// Create march
const newMarch = await repository.march.createMarch({
  type: "raid",
  status: "planning",
  // ... other properties
});

// Update march
await repository.march.updateMarch(march);

// Cancel march
await repository.march.cancelMarch("march1");

// Get active marches for village
const activeMarches = await repository.march.getActiveMarchesForVillage("village1");
```

### ReportRepository

```typescript
// Get all reports
const reports = await repository.report.getReports();

// Get single report
const report = await repository.report.getReport("report1");

// Create report
const newReport = await repository.report.createReport({
  type: "battle",
  timestamp: Date.now(),
  // ... other properties
});

// Mark as read
await repository.report.markReportAsRead("report1");

// Delete report
await repository.report.deleteReport("report1");

// Get unread count
const unreadCount = await repository.report.getUnreadCount();
```

### PlayerStatsRepository

```typescript
// Get stats
const stats = await repository.playerStats.getStats();

// Update stats
await repository.playerStats.updateStats(stats);

// Increment counters
await repository.playerStats.incrementBattlesWon();
await repository.playerStats.incrementBattlesLost();
await repository.playerStats.incrementBuildingsUpgraded();
await repository.playerStats.incrementUnitsTrained(10);

// Add resources gathered
await repository.playerStats.addResourcesGathered({
  wood: 100,
  clay: 50,
});
```

### TechTreeRepository

```typescript
// Get tech tree
const techTree = await repository.techTree.getTechTree();

// Update tech tree
await repository.techTree.updateTechTree(techTree);

// Unlock building
await repository.techTree.unlockBuilding("barracks");

// Unlock unit
await repository.techTree.unlockUnit("knight");

// Upgrade smithy line
await repository.techTree.upgradeSmithyLine("inf", "attack");

// Advance era
await repository.techTree.advanceEra("city");
```

## Switching Repositories at Runtime

```typescript
import { RepositoryFactory } from "./lib/repositories/RepositoryFactory";

// Switch to mock for testing
RepositoryFactory.switchTo("mock");

// Switch to localStorage for production
RepositoryFactory.switchTo("localStorage");

// Reset repository instance
RepositoryFactory.reset();
```

## Creating a New Repository Implementation

1. Create new file: `YourRepository.ts`
2. Implement `IRepository` interface
3. Implement all sub-repository interfaces
4. Update `RepositoryFactory.ts` to include your implementation

```typescript
// YourRepository.ts
import { IRepository, IVillageRepository /* ... */ } from "./IRepository";

class YourVillageRepository implements IVillageRepository {
  async getVillage(villageId: string): Promise<Village> {
    // Your implementation
  }
  // ... implement all methods
}

export class YourRepository implements IRepository {
  public village: IVillageRepository;
  // ... other repositories

  constructor() {
    this.village = new YourVillageRepository();
    // ... initialize other repositories
  }
}
```

## Error Handling

All repository methods can throw errors. Always handle them:

```typescript
try {
  const village = await repository.village.getVillage("village1");
} catch (error) {
  console.error("Failed to load village:", error);
  // Handle error appropriately
}
```

Stores already handle errors and expose them via the `error` state:

```typescript
const error = useVillageStore((state) => state.error);
if (error) {
  // Display error to user
}
```

## Migration Guide

### From useGameState Hook to Stores + Repositories

**Before:**

```typescript
const { gameState, upgradeBuilding } = useGameState();
```

**After:**

```typescript
// Use specific stores
const village = useVillageStore((state) => state.village);
const upgradeBuilding = useVillageStore((state) => state.upgradeBuilding);
```

## Best Practices

1. **Always use stores instead of repositories directly** - Stores provide caching, error handling, and state management
2. **Handle errors** - Check error state in stores or use try-catch with direct repository access
3. **Use TypeScript** - Repository interfaces provide type safety
4. **Test with MockRepository** - Easy to test without side effects
5. **Plan for multiplayer** - Design with APIRepository in mind for future multiplayer features

## Storage Limits

| Repository   | Limit     | Performance | Persistence  |
| ------------ | --------- | ----------- | ------------ |
| Mock         | RAM       | Fast        | Session only |
| LocalStorage | ~5-10MB   | Medium      | Permanent    |
| IndexedDB    | ~50MB+    | Fast        | Permanent    |
| API          | Unlimited | Network     | Server-side  |

## Future Improvements

- [ ] Implement IndexedDB repository for larger datasets
- [ ] Implement API repository for multiplayer
- [ ] Add data migration system
- [ ] Add offline sync for API repository
- [ ] Add compression for LocalStorage
- [ ] Add encryption for sensitive data
- [ ] Add repository caching layer
- [ ] Add optimistic updates
