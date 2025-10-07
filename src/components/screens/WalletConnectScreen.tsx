import { useMiniKit } from "@worldcoin/minikit-js/minikit-provider";
import { Button } from "@/components/ui/Button";
import { Navigate } from "react-router-dom";
import { useAuthStore } from "@/stores/authStore";
import { useI18n } from "@/providers/i18n-provider";
import { ShieldCheck } from "lucide-react";

export function WalletConnectScreen() {
  const { isInstalled } = useMiniKit();
  const { authenticated, authenticate, isAuthenticating, error } = useAuthStore();
  const { t } = useI18n();

  if (!isInstalled) {
    return (
      <div className="flex min-h-[100dvh] items-center justify-center bg-background px-6 text-center">
        <div className="space-y-3">
          <h2 className="text-section font-semibold">
            {t("screens.wallet.minikitMissing", "MiniKit is not installed")}
          </h2>
          <p className="text-body text-muted-foreground">
            {t(
              "screens.wallet.runInApp",
              "Open this mini app inside the World App to connect your identity and wallet.",
            )}
          </p>
        </div>
      </div>
    );
  }

  if (authenticated) {
    return <Navigate to="/" />;
  }

  return (
    <div className="flex min-h-[100dvh] flex-col bg-background px-6 py-10 text-center">
      <div className="mx-auto flex w-full max-w-sm flex-1 flex-col items-center justify-center gap-6">
        <div className="flex flex-col items-center gap-3">
          <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-primary/10 text-primary">
            <ShieldCheck className="h-10 w-10" />
          </div>
          <h1 className="text-title font-semibold">
            {t("screens.wallet.authenticateTitle", "Sign in with World App")}
          </h1>
          <p className="text-body text-muted-foreground">
            {t(
              "screens.wallet.authenticateDescription",
              "Connect your verified identity to sync progress and unlock multiplayer features.",
            )}
          </p>
        </div>

        <Button
          onClick={() => void authenticate()}
          className="min-touch w-full"
          disabled={isAuthenticating}
          aria-busy={isAuthenticating}
        >
          {isAuthenticating
            ? t("screens.wallet.authenticating", "Authenticating…")
            : t("screens.wallet.authenticate", "Authenticate")}
        </Button>

        {error && <p className="text-caption text-destructive">{error}</p>}
      </div>
    </div>
  );
}
