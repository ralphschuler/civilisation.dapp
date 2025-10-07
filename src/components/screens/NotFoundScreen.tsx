import { Button } from "@/components/ui/Button";
import { useNavigate } from "react-router-dom";
import { useI18n } from "@/providers/i18n-provider";

export function NotFoundScreen() {
  const navigate = useNavigate();
  const { t } = useI18n();

  return (
    <div className="flex min-h-screen flex-col items-center justify-center py-2">
      <h1 className="text-4xl font-bold">404</h1>
      <p className="text-xl">{t("screens.notfound.title", "Page not found")}</p>
      <Button onClick={() => navigate("/")} variant="outline" className="mt-4">
        {t("screens.notfound.backHome", "Go back to home")}
      </Button>
    </div>
  );
}
