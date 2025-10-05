import { Outlet } from "react-router-dom";
import { useGameState } from "@/hooks/useGameState";
import { GameHeader } from "@/components/game/GameHeader";
import { MobileNavigation } from "@/components/MobileNavigation";
import { useNavigate } from "react-router-dom";
import { calculateStorageCapacity } from "@/data/gameData";

export function GameLayout() {
  const navigate = useNavigate();
  const { gameState } = useGameState();
  const { village } = gameState;

  const storageCapacity = calculateStorageCapacity(
    village.buildings.storage?.level || 1,
  );

  return (
    <div className="min-h-screen bg-background flex flex-col max-w-md mx-auto">
      {/* Fixed Header */}
      <div className="sticky top-0 z-40">
        <GameHeader
          village={village}
          onNotificationsClick={() => navigate("/notifications")}
          onProfileClick={() => navigate("/profile")}
          onSettingsClick={() => navigate("/settings")}
        />
      </div>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto px-4 py-3 pb-20">
        <Outlet />
      </main>

      {/* Mobile Navigation */}
      <MobileNavigation />
    </div>
  );
}
