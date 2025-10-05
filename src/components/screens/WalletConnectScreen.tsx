import { useMiniKit } from "@worldcoin/minikit-js/minikit-provider";
import { Button } from "@/components/ui/Button";
import { Navigate } from "react-router-dom";
import { useAuthStore } from "@/stores/authStore";
import { useI18n } from '@/providers/i18n-provider';

export function WalletConnectScreen() {
  const { isInstalled } = useMiniKit();
  const { authenticated, authenticate } = useAuthStore();
  const { t } = useI18n();

  if (!isInstalled) {
    return (
      <div>
        <p>{t('screens.wallet.minikitMissing', 'MiniKit is not installed')}</p>
        <span>{t('screens.wallet.runInApp', 'This app has to be run using the Worldcoin app.')}</span>
      </div>
    );
  }

  if (authenticated) {
    return <Navigate to="/" />;
  }

  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <Button
        onClick={authenticate}
        className="bg-blue-500 text-white px-4 py-2 rounded-md"
      >
        {t('screens.wallet.authenticate', 'Authenticate')}
      </Button>
    </div>
  );
}
