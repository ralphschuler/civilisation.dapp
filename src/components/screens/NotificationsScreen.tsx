import { Card, CardContent, CardHeader, CardTitle } from "../ui/Card";
import { Button } from "../ui/Button";
import { useI18n } from "@/providers/i18n-provider";
import { BellRing, Settings } from "lucide-react";
import { useNavigate } from "react-router-dom";

export function NotificationsScreen() {
  const { t } = useI18n();
  const navigate = useNavigate();

  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-6 text-center">
      <div className="flex flex-col items-center gap-3">
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 text-primary">
          <BellRing className="h-8 w-8" />
        </div>
        <h2 className="text-section font-semibold">
          {t("screens.notifications.title", "You're all caught up")}
        </h2>
        <p className="max-w-sm text-body text-muted-foreground">
          {t(
            "screens.notifications.subtitle",
            "Enable push notifications to hear about raids, completed upgrades, and market offers the moment they happen.",
          )}
        </p>
      </div>

      <Card className="w-full max-w-sm shadow-sm">
        <CardHeader className="pb-3">
          <CardTitle className="text-body font-medium">
            {t("screens.notifications.manage", "Manage alerts")}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <p className="text-caption text-muted-foreground">
            {t(
              "screens.notifications.instructions",
              "Notification settings live in the World App. You can adjust preferences anytime.",
            )}
          </p>
          <Button
            variant="ghost"
            className="min-touch w-full"
            onClick={() => navigate("/settings")}
          >
            <Settings className="mr-2 h-4 w-4" />
            {t("screens.notifications.goToSettings", "Open app settings")}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
