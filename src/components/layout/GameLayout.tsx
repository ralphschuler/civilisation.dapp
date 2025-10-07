import { Outlet } from "react-router-dom";
import { GameHeader } from "@/components/game/GameHeader";
import { MobileNavigation } from "@/components/MobileNavigation";
import { useNavigate } from "react-router-dom";
import { useVillageStore } from "@/stores";
import { useAuthStore } from "@/stores/authStore";

export function GameLayout() {
  const navigate = useNavigate();
  const village = useVillageStore((state) => state.village);
  const username = useAuthStore((state) => state.user?.username);

  if (!village) {
    return null;
  }

  return (
    <div className="relative flex min-h-[100dvh] w-full flex-col bg-background">
      {/* Fixed Header */}
      <header className="sticky top-0 z-40 bg-card/95 backdrop-blur safe-area-pt">
        <GameHeader
          village={village}
          username={username}
          onNotificationsClick={() => navigate("/notifications")}
          onProfileClick={() => navigate("/profile")}
          onSettingsClick={() => navigate("/settings")}
        />
      </header>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto px-4 pb-28 pt-3 scroll-smooth">
        <Outlet />
      </main>

      {/* Mobile Navigation */}
      <MobileNavigation />
    </div>
  );
}
