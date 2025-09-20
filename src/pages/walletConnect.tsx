import { useMiniKit } from "@worldcoin/minikit-js/minikit-provider";
import { Button } from "@/components/ui/button";
import { Navigate } from "react-router-dom";
import { useAuthStore } from "@/stores/authStore";

export default function WalletConnect() {
  const { isInstalled } = useMiniKit();
  const { authenticated, authenticate } = useAuthStore();

  if (!isInstalled) {
    return (
      <div>
        <p>MiniKit is not installed</p>
        <span>This app has to be run using the Worldcoin app.</span>
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
        Authenticate
      </Button>
    </div>
  );
}
