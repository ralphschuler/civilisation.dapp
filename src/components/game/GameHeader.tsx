import { Village } from "../../types/game";
import { Button } from "../ui/Button";
import { Badge } from "../ui/Badge";
import { useI18n } from "@/providers/i18n-provider";
import { Bell, Settings, User } from "lucide-react";

interface GameHeaderProps {
  village: Village;
  username?: string | null;
  onSettingsClick?: () => void;
  onProfileClick?: () => void;
  onNotificationsClick?: () => void;
}

export function GameHeader({
  village,
  username,
  onSettingsClick,
  onProfileClick,
  onNotificationsClick,
}: GameHeaderProps) {
  const { t } = useI18n();
  const displayName = username ? `@${username}` : t("app.guestPlayer", "Guest commander");

  return (
    <div className="border-b px-4 py-3">
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-2xl">
            🏰
          </div>
          <div className="flex flex-col gap-1">
            <span className="text-caption uppercase tracking-wide text-muted-foreground">
              {t("app.playerLabel", "Commander")}
            </span>
            <div className="flex flex-wrap items-center gap-2">
              <h1 className="font-semibold text-lg leading-tight">
                {t("app.title", "Tribal Wars")}
              </h1>
              <Badge variant="secondary" className="text-xs font-medium">
                {displayName}
              </Badge>
            </div>
            <span className="text-caption text-muted-foreground">{village.name}</span>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <Button variant="ghost" size="sm" onClick={onNotificationsClick} className="relative">
            <Bell className="h-4 w-4" />
            {/* Notification badge */}
            <div className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full" />
          </Button>

          <Button variant="ghost" size="sm" onClick={onProfileClick}>
            <User className="h-4 w-4" />
          </Button>

          <Button variant="ghost" size="sm" onClick={onSettingsClick}>
            <Settings className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
