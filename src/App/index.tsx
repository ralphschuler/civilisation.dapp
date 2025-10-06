import { useCallback, useMemo } from "react";
import { Routes, Route, Navigate, useNavigate } from "react-router-dom";
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

import { WalletConnectScreen } from "@/components/screens/WalletConnectScreen";
import { NotFoundScreen } from "@/components/screens/NotFoundScreen";
import type { March, MarchPreset } from "@/types/game";
import {
  useGameStore,
  useVillageStore,
  useMarchStore,
  usePlayerStatsStore,
} from "@/stores";

function AppContent() {
  const navigate = useNavigate();
  const { authenticated } = useAuthStore();
  const village = useVillageStore((state) => state.village);
  const upgradeBuilding = useVillageStore((state) => state.upgradeBuilding);
  const collectResources = useVillageStore((state) => state.collectResources);

  const selectedBuilding = useGameStore((state) => state.selectedBuilding);
  const setSelectedBuilding = useGameStore((state) => state.setSelectedBuilding);
  const selectedVillageInfo = useGameStore(
    (state) => state.selectedVillageInfo,
  );
  const setSelectedVillageInfo = useGameStore(
    (state) => state.setSelectedVillageInfo,
  );

  const marches = useMarchStore((state) => state.marches);
  const marchPresets = useMarchStore((state) => state.marchPresets);
  const createMarch = useMarchStore((state) => state.createMarch);
  const cancelMarch = useMarchStore((state) => state.cancelMarch);
  const createMarchPreset = useMarchStore((state) => state.createMarchPreset);
  const deleteMarchPreset = useMarchStore((state) => state.deleteMarchPreset);

  const playerStats = usePlayerStatsStore((state) => state.stats);

  const storageCapacity = useMemo(() => {
    if (!village) return 0;
    return calculateStorageCapacity(village.buildings.storage?.level || 1);
  }, [village]);

  const battleReports = useMemo(
    () =>
      marches
        .filter((march) => march.battleReport)
        .map((march) => march.battleReport!)
        .sort((a, b) => b.timestamp - a.timestamp),
    [marches],
  );

  const handleVillageSelect = useCallback(
    (villageId: string) => {
      if (!village) return;

      if (villageId === village.id) {
        navigate("/village");
      }
    },
    [village, navigate],
  );

  const handleTrainUnit = useCallback((unitId: string, quantity: number) => {
    console.warn("trainUnit not yet implemented", { unitId, quantity });
  }, []);

  const handleUpgradeBuilding = useCallback(
    (buildingId: string) => {
      if (!village) return;
      const building = village.buildings[buildingId];
      if (!building) return;

      void upgradeBuilding(buildingId, {
        ...building,
        upgrading: {
          targetLevel: building.level + 1,
          completionTime: Date.now() + 300000,
        },
      });
    },
    [upgradeBuilding, village],
  );

  const handleCollectResources = useCallback(
    (resourceType?: Parameters<typeof collectResources>[0]) => {
      void collectResources(resourceType);
    },
    [collectResources],
  );

  const handleCreateMarch = useCallback(
    (march: Omit<March, "id">) => {
      void createMarch(march);
    },
    [createMarch],
  );

  const handleCancelMarch = useCallback(
    (marchId: string) => {
      void cancelMarch(marchId);
    },
    [cancelMarch],
  );

  const handleCreatePreset = useCallback(
    (preset: Omit<MarchPreset, "id">) => {
      void createMarchPreset(preset);
    },
    [createMarchPreset],
  );

  const handleDeletePreset = useCallback(
    (presetId: string) => {
      void deleteMarchPreset(presetId);
    },
    [deleteMarchPreset],
  );

  const handleBackToMore = useCallback(() => {
    navigate("/more");
  }, [navigate]);

  if (!village || !playerStats) {
    return null;
  }

  return (
    <div className="min-h-screen bg-background flex flex-col max-w-md mx-auto">
      <Routes>
        <Route path="/" element={<Navigate to="/village" replace />} />
        <Route path="/wallet-connect" element={<WalletConnectScreen />} />

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
                  onUpgradeBuilding={handleUpgradeBuilding}
                />
              }
            />
            <Route
              path="/world"
              element={
                <WorldMapScreen
                  village={village}
                  marches={marches}
                  marchPresets={marchPresets}
                  onVillageSelect={handleVillageSelect}
                  onVillageInfo={setSelectedVillageInfo}
                  onCreateMarch={handleCreateMarch}
                  onCancelMarch={handleCancelMarch}
                  onCreatePreset={handleCreatePreset}
                  onDeletePreset={handleDeletePreset}
                />
              }
            />
            <Route
              path="/units"
              element={
                <UnitsScreen
                  village={village}
                  resources={village.resources}
                  onTrainUnit={handleTrainUnit}
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
                  onCollectResource={handleCollectResources}
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
            <Route
              path="/achievements"
              element={<AchievementsScreen onBack={handleBackToMore} />}
            />
            <Route path="/settings" element={<SettingsScreen />} />
            <Route path="/help" element={<HelpSupportScreen />} />
            <Route
              path="/trade"
              element={<TradeScreen resources={village.resources} />}
            />
            <Route
              path="/march-planner"
              element={
                <MarchPlannerScreen
                  village={village}
                  marches={marches}
                  marchPresets={marchPresets}
                  onCreateMarch={handleCreateMarch}
                  onCancelMarch={handleCancelMarch}
                  onCreatePreset={handleCreatePreset}
                  onDeletePreset={handleDeletePreset}
                  selectedTarget={selectedVillageInfo}
                />
              }
            />
            <Route
              path="/march-reports"
              element={
                <MarchReportsScreen
                  marches={marches}
                  battleReports={battleReports}
                />
              }
            />
          </Route>
        </Route>

        <Route path="*" element={<NotFoundScreen />} />
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
