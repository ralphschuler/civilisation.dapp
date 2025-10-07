import { useNavigate, useLocation } from "react-router-dom";
import { Button } from "./ui/Button";
import { useI18n } from "@/providers/i18n-provider";

const NAVIGATION_ITEMS = [
  { id: "/village", icon: "🏛️", key: "screens.village.title", fallback: "Village" },
  { id: "/world", icon: "🗺️", key: "screens.world.tabs.map", fallback: "World" },
  { id: "/units", icon: "⚔️", key: "screens.units.training.title", fallback: "Units" },
  {
    id: "/resources",
    icon: "💰",
    key: "screens.stats.currentResources.title",
    fallback: "Resources",
  },
];

export function MobileNavigation() {
  const navigate = useNavigate();
  const location = useLocation();
  const { t } = useI18n();

  return (
    <nav
      aria-label={t("navigation.primary", "Primary navigation")}
      className="fixed inset-x-0 bottom-0 z-50 flex justify-center bg-card/95 backdrop-blur"
    >
      <div className="safe-area-pb safe-area-px w-full max-w-md border-t border-border/80 bg-transparent">
        <div className="grid grid-cols-4 gap-1 p-2">
          {NAVIGATION_ITEMS.map((item) => {
            const isActive = location.pathname === item.id;
            return (
              <Button
                key={item.id}
                variant={isActive ? "default" : "ghost"}
                size="sm"
                className="flex h-auto min-h-[44px] min-w-[44px] flex-col items-center gap-1 px-1 py-2 text-caption"
                onClick={() => navigate(item.id)}
                aria-label={t(item.key as string, item.fallback as string)}
                aria-current={isActive ? "page" : undefined}
              >
                <span className="text-lg" aria-hidden>
                  {item.icon}
                </span>
                <span className="text-micro leading-tight">
                  {t(item.key as string, item.fallback as string)}
                </span>
              </Button>
            );
          })}
        </div>
      </div>
    </nav>
  );
}
