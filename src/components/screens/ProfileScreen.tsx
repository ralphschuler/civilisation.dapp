import { Card, CardContent, CardHeader, CardTitle } from "../ui/Card";
import { Badge } from "../ui/Badge";
import { Button } from "../ui/Button";
import { useAuthStore } from "@/stores/authStore";
import { useI18n } from "@/providers/i18n-provider";
import { useMemo } from "react";
import { Compass, Globe, Shield, UserCheck } from "lucide-react";
import { useNavigate } from "react-router-dom";

export function ProfileScreen() {
  const { user, authenticated } = useAuthStore();
  const { t } = useI18n();
  const navigate = useNavigate();

  const locale = useMemo(() => {
    if (typeof navigator !== "undefined") {
      return navigator.language;
    }
    return "en";
  }, []);

  const displayName = user?.username
    ? `@${user.username}`
    : t("screens.profile.guestName", "Guest commander");

  return (
    <div className="flex flex-col gap-4 pb-6">
      <Card className="shadow-sm">
        <CardHeader className="space-y-2 pb-3">
          <CardTitle className="flex items-center gap-2 text-section">
            <UserCheck className="h-5 w-5 text-primary" />
            {t("screens.profile.title", "Commander profile")}
          </CardTitle>
          <p className="text-caption text-muted-foreground">
            {authenticated
              ? t(
                  "screens.profile.subtitle.connected",
                  "Your World App identity keeps progress in sync across devices.",
                )
              : t(
                  "screens.profile.subtitle.disconnected",
                  "Sign in with World App to save progress and unlock multiplayer features.",
                )}
          </p>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center gap-3 rounded-lg bg-secondary/70 p-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-2xl">
              🛡️
            </div>
            <div className="flex flex-col gap-1">
              <Badge variant="secondary" className="w-fit text-xs">
                {t("screens.profile.identity", "World ID")}
              </Badge>
              <span className="text-body font-semibold">{displayName}</span>
              <span className="text-caption text-muted-foreground">
                {authenticated
                  ? t("screens.profile.status.connected", "Signed in with World App")
                  : t("screens.profile.status.disconnected", "Not authenticated")}
              </span>
            </div>
          </div>

          {!authenticated && (
            <Button className="w-full min-touch" onClick={() => navigate("/wallet-connect")}>
              {t("screens.profile.authenticate", "Sign in with World App")}
            </Button>
          )}
        </CardContent>
      </Card>

      <Card className="shadow-sm">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-section">
            <Globe className="h-5 w-5 text-primary" />
            {t("screens.profile.preferences", "Experience preferences")}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex items-center justify-between rounded-md border bg-background/80 p-3">
            <div className="flex items-center gap-3">
              <Compass className="h-5 w-5 text-muted-foreground" />
              <div>
                <div className="text-body font-medium">
                  {t("screens.profile.locale", "Language")}
                </div>
                <div className="text-caption text-muted-foreground">{locale}</div>
              </div>
            </div>
            <Button
              variant="ghost"
              size="sm"
              className="min-touch"
              onClick={() => navigate("/settings")}
            >
              {t("common.edit", "Edit")}
            </Button>
          </div>

          <div className="flex items-start gap-3 rounded-md border bg-background/80 p-3">
            <Shield className="mt-1 h-5 w-5 text-muted-foreground" />
            <div className="space-y-1">
              <div className="text-body font-medium">
                {t("screens.profile.privacy", "Privacy first")}
              </div>
              <p className="text-caption text-muted-foreground">
                {t(
                  "screens.profile.privacyDetails",
                  "Only your World App username is stored. Wallet addresses stay private.",
                )}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
