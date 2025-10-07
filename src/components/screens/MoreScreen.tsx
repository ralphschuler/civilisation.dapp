import { Card, CardContent, CardHeader, CardTitle } from "../ui/Card";
import { Button } from "../ui/Button";
import { Badge } from "../ui/Badge";
import { Separator } from "../ui/Separator";
import {
  Settings,
  BarChart3,
  Route,
  Trophy,
  HelpCircle,
  Info,
  Moon,
  Sun,
  Volume2,
  VolumeX,
  Users,
} from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useI18n } from "@/providers/i18n-provider";
import { useAuthStore } from "@/stores/authStore";

interface MoreScreenProps {}

export function MoreScreen({}: MoreScreenProps) {
  const navigate = useNavigate();
  const { t } = useI18n();
  const { user, authenticated } = useAuthStore();
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [darkMode, setDarkMode] = useState(false);

  const displayName = user?.username
    ? `@${user.username}`
    : t("screens.profile.guestName", "Guest commander");

  const quickActions = [
    {
      id: "stats",
      icon: BarChart3,
      title: t("screens.stats.title", "Spielerstatistiken"),
      description: t("screens.more.quick.stats.description", "Fortschritt, Ranglisten, Erfolge"),
      badge: t("screens.more.badges.new", "Neu"),
      color: "primary",
    },
    {
      id: "achievements",
      icon: Trophy,
      title: t("screens.achievements.title", "Erfolge & Quests"),
      description: t("screens.more.quick.achievements.description", "Belohnungen, Season-Ziele"),
      badge: "3",
      color: "warning",
    },
  ];

  const settingsActions = [
    {
      id: "settings",
      icon: Settings,
      title: t("screens.settings.title", "Einstellungen"),
      description: t("screens.more.settings.description", "Benachrichtigungen, Sprache, Account"),
      badge: null,
      color: "muted",
    },
    {
      id: "help",
      icon: HelpCircle,
      title: t("screens.help.title", "Hilfe & Support"),
      description: t("screens.more.help.description", "Tutorial, FAQ, Kontakt"),
      badge: null,
      color: "muted",
    },
  ];

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
    document.documentElement.classList.toggle("dark");
  };

  return (
    <div className="space-y-6">
      <Card className="bg-gradient-to-br from-primary/15 via-secondary/60 to-background border-none shadow-sm">
        <CardContent className="flex items-center justify-between gap-4 py-4">
          <div className="space-y-1">
            <p className="text-caption text-muted-foreground">
              {t("screens.more.identityLabel", "World App identity")}
            </p>
            <div className="text-section font-semibold">{displayName}</div>
            <p className="text-caption text-muted-foreground">
              {authenticated
                ? t(
                    "screens.more.identityConnected",
                    "Account verified and ready to sync across devices.",
                  )
                : t(
                    "screens.more.identityDisconnected",
                    "Sign in with World App to back up your settlement progress.",
                  )}
            </p>
          </div>
          <Button
            variant="outline"
            size="sm"
            className="min-touch"
            onClick={() => navigate(authenticated ? "/profile" : "/wallet-connect")}
          >
            {authenticated
              ? t("screens.more.manageProfile", "Profile")
              : t("screens.wallet.authenticate", "Authenticate")}
          </Button>
        </CardContent>
      </Card>

      {/* Quick Settings */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-section">
            {t("screens.more.quickSettings.title", "Schnelleinstellungen")}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              {darkMode ? <Moon className="h-5 w-5" /> : <Sun className="h-5 w-5" />}
              <div>
                <div className="font-medium text-body">
                  {t("screens.more.quickSettings.darkMode", "Dunkles Design")}
                </div>
                <div className="text-caption text-muted-foreground">
                  {t("screens.more.quickSettings.darkModeHint", "Augen schonen bei Nacht")}
                </div>
              </div>
            </div>
            <Button variant="outline" size="sm" onClick={toggleDarkMode} className="min-touch">
              {darkMode ? t("common.light", "Hell") : t("common.dark", "Dunkel")}
            </Button>
          </div>

          <Separator />

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              {soundEnabled ? <Volume2 className="h-5 w-5" /> : <VolumeX className="h-5 w-5" />}
              <div>
                <div className="font-medium text-body">
                  {t("screens.more.quickSettings.sound", "Sound-Effekte")}
                </div>
                <div className="text-caption text-muted-foreground">
                  {t("screens.more.quickSettings.soundHint", "Bestätigungen und Warnungen")}
                </div>
              </div>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setSoundEnabled(!soundEnabled)}
              className="min-touch"
            >
              {soundEnabled ? t("common.on", "An") : t("common.off", "Aus")}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Game Features */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-section">
            {t("screens.more.features.title", "Spiel-Features")}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          {quickActions.map((action) => (
            <Button
              key={action.id}
              variant="ghost"
              className="w-full justify-start h-auto p-3 min-touch"
              onClick={() => navigate(`/${action.id}`)}
            >
              <div className="flex items-center gap-3 w-full">
                <action.icon className="h-5 w-5 text-muted-foreground" />
                <div className="flex-1 text-left">
                  <div className="font-medium text-body flex items-center gap-2">
                    {action.title}
                    {action.badge && (
                      <Badge
                        variant={action.color === "primary" ? "default" : "secondary"}
                        className="text-micro"
                      >
                        {action.badge}
                      </Badge>
                    )}
                  </div>
                  <div className="text-caption text-muted-foreground">{action.description}</div>
                </div>
              </div>
            </Button>
          ))}
        </CardContent>
      </Card>

      {/* Settings & Support */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-section">
            {t("screens.more.settingsSupport.title", "Einstellungen & Support")}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          {settingsActions.map((action) => (
            <Button
              key={action.id}
              variant="ghost"
              className="w-full justify-start h-auto p-3 min-touch"
              onClick={() => navigate(`/${action.id}`)}
            >
              <div className="flex items-center gap-3 w-full">
                <action.icon className="h-5 w-5 text-muted-foreground" />
                <div className="flex-1 text-left">
                  <div className="font-medium text-body">{action.title}</div>
                  <div className="text-caption text-muted-foreground">{action.description}</div>
                </div>
              </div>
            </Button>
          ))}
        </CardContent>
      </Card>

      {/* Game Info */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-section flex items-center gap-2">
            <Info className="h-4 w-4" />
            {t("app.title", "Tribal Wars")}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="grid grid-cols-2 gap-3 text-caption">
            <div>
              <span className="text-muted-foreground">
                {t("screens.more.info.version", "Version")}:
              </span>
              <div className="font-medium">v2.0.0</div>
            </div>
            <div>
              <span className="text-muted-foreground">
                {t("screens.more.info.shard", "Shard")}:
              </span>
              <div className="font-medium">Europa-1</div>
            </div>
            <div>
              <span className="text-muted-foreground">
                {t("screens.more.info.online", "Online")}:
              </span>
              <div className="font-medium text-success">
                {t("screens.more.info.connected", "Verbunden")}
              </div>
            </div>
            <div>
              <span className="text-muted-foreground">{t("screens.more.info.sync", "Sync")}:</span>
              <div className="font-medium text-caption">
                {t("screens.more.info.syncAgo", "vor 2min")}
              </div>
            </div>
          </div>

          <Separator />

          <div className="text-caption text-muted-foreground leading-relaxed">
            {t(
              "screens.more.info.description",
              "Ein mobiles 4X-Light-Strategiespiel im Stil von Tribal Wars/Civilization. Baue deine Stadt auf, trainiere Armeen und erobere Provinzen in asynchronen PvP-Kämpfen.",
            )}
          </div>

          <div className="text-micro text-muted-foreground">
            {t(
              "screens.more.info.copyright",
              "© 2025 Civilization Mobile Team. Alle Rechte vorbehalten.",
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
