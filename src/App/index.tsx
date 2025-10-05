import { Routes, Route, Navigate, useNavigate } from "react-router-dom";
import { useGameState } from "@/hooks/useGameState";
import { ErrorBoundary } from "@/components/game/ErrorBoundary";
import { VillageInfoModal } from "@/components/game/VillageInfoModal";
import { GameLayout } from "@/components/layout/GameLayout";
import ProtectedRoute from "@/components/protectedRoute";
import { useAuthStore } from "@/stores/authStore";

// Screen imports
import { VillageScreen } from "@/components/screens/VillageScreen";
import { WorldMapScreen } from "@/components/screens/WorldMapScreen";
import { UnitsScreen } from "@/components/screens/UnitsScreen";
import { ResourcesScreen } from "@/components/screens/ResourcesScreen";
import { ReportsScreen } from "@/components/screens/ReportsScreen";
import { MoreScreen } from "@/components/screens/MoreScreen";
import { StatsScreen } from "@/components/screens/StatsScreen";
import { AchievementsScreen } from "@/components/screens/AchievementsScreen";
import { SettingsScreen } from "@/components/screens/SettingsScreen";
import { HelpSupportScreen } from "@/components/screens/HelpSupportScreen";
import { TradeScreen } from "@/components/screens/TradeScreen";
import { MarchPlannerScreen } from "@/components/screens/MarchPlannerScreen";
import { MarchReportsScreen } from "@/components/screens/MarchReportsScreen";
import { calculateStorageCapacity } from "@/data/gameData";

import WalletConnectPage from "@/components/screens/WalletConnect";
import NotFoundPage from "@/components/screens/NotFound";

function AppContent() {
  const navigate = useNavigate();
  const { authenticated } = useAuthStore();

  const {
    gameState,
    upgradeBuilding,
    trainUnit,
    setSelectedBuilding,
    collectResources,
    getTotalUncollectedResources,
    setSelectedVillageInfo,
    createMarch,
    cancelMarch,
    createMarchPreset,
    deleteMarchPreset,
  } = useGameState();

  const { village, selectedBuilding, selectedVillageInfo, playerStats } =
    gameState;

  const storageCapacity = calculateStorageCapacity(
    village.buildings.storage?.level || 1,
  );

  const handleVillageSelect = (villageId: string) => {
    if (villageId === village.id) {
      // Navigate to village when selecting own village
      navigate("/village");
    }
    // Handle other village selection for attacks/spying
  };

  return (
    <div className="min-h-screen bg-background flex flex-col max-w-md mx-auto">
      <Routes>
        <Route path="/" element={<Navigate to="/village" replace />} />
        <Route path="/wallet-connect" element={<WalletConnectPage />} />

        {/* Layout-based Routes */}
        <Route element={<GameLayout />}>
          <Route
            element={
              <ProtectedRoute
                condition={authenticated}
                redirectTo="/wallet-connect"
              />
            }
          >
            <Route
              path="/village"
              element={
                <VillageScreen
                  village={village}
                  selectedBuilding={selectedBuilding}
                  onBuildingSelect={setSelectedBuilding}
                  onUpgradeBuilding={upgradeBuilding}
                />
              }
            />
            <Route
              path="/world"
              element={
                <WorldMapScreen
                  village={village}
                  marches={gameState.marches}
                  marchPresets={gameState.marchPresets}
                  onVillageSelect={handleVillageSelect}
                  onVillageInfo={setSelectedVillageInfo}
                  onCreateMarch={createMarch}
                  onCancelMarch={cancelMarch}
                  onCreatePreset={createMarchPreset}
                  onDeletePreset={deleteMarchPreset}
                />
              }
            />
            <Route
              path="/units"
              element={
                <UnitsScreen
                  village={village}
                  resources={village.resources}
                  onTrainUnit={trainUnit}
                />
              }
            />
            <Route
              path="/resources"
              element={
                <ResourcesScreen
                  resources={village.resources}
                  uncollectedResources={village.uncollectedResources}
                  buildingLevels={village.buildings}
                  storageCapacity={storageCapacity}
                  onCollectResource={collectResources}
                />
              }
            />
            <Route path="/reports" element={<ReportsScreen />} />
            <Route path="/more" element={<MoreScreen />} />
            <Route
              path="/stats"
              element={
                <StatsScreen
                  village={village}
                  resources={village.resources}
                  playerStats={playerStats}
                />
              }
            />
            <Route path="/achievements" element={<AchievementsScreen />} />
            <Route path="/settings" element={<SettingsScreen />} />
            <Route path="/help" element={<HelpSupportScreen />} />
            <Route path="/trade" element={<TradeScreen />} />
            <Route path="/march-planner" element={<MarchPlannerScreen />} />
            <Route path="/march-reports" element={<MarchReportsScreen />} />
          </Route>
        </Route>

        <Route path="*" element={<NotFoundPage />} />
      </Routes>

      {/* Village Info Modal */}
      <VillageInfoModal
        isOpen={!!selectedVillageInfo}
        onClose={() => setSelectedVillageInfo(null)}
        villageInfo={selectedVillageInfo}
        myVillageCoords={{ x: 200, y: 200 }}
        onAttack={(villageId) => {
          console.log("Attack village:", villageId);
          setSelectedVillageInfo(null);
        }}
        onSpy={(villageId) => {
          console.log("Spy on village:", villageId);
          setSelectedVillageInfo(null);
        }}
        onTrade={(villageId) => {
          console.log("Trade with village:", villageId);
          setSelectedVillageInfo(null);
        }}
      />
    </div>
  );
}

export function App() {
  return (
    <ErrorBoundary>
      <AppContent />
    </ErrorBoundary>
  );
}
