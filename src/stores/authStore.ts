import { create } from "zustand";
import { MiniKit } from "@worldcoin/minikit-js";
import { uuidv4 } from "@/lib/uuidv4";

interface AuthenticatedUser {
  address: string;
  username?: string;
}

interface AuthState {
  authenticated: boolean;
  isAuthenticating: boolean;
  error: string | null;
  user: AuthenticatedUser | null;
  authenticate: () => Promise<void>;
  reset: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  authenticated: false,
  isAuthenticating: false,
  error: null,
  user: null,

  authenticate: async () => {
    set({ isAuthenticating: true, error: null });

    try {
      const nonce = uuidv4().replace(/-/g, "");
      const result = await MiniKit.commandsAsync.walletAuth({
        nonce,
        requestId: "0",
        expirationTime: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // +7 days
        notBefore: new Date(Date.now() - 24 * 60 * 60 * 1000), // -1 day
        statement: "",
      });

      if (result.finalPayload.status === "error") {
        set({
          isAuthenticating: false,
          error: result.finalPayload.details ?? "Authentication was cancelled",
        });
        return;
      }

      const address = result.finalPayload.address;
      let username: string | undefined;

      try {
        const userInfo = await MiniKit.getUserInfo(address);
        username = userInfo.username ?? undefined;
      } catch (userInfoError) {
        console.warn("Failed to resolve username", userInfoError);
      }

      set({
        authenticated: true,
        isAuthenticating: false,
        error: null,
        user: { address, username },
      });
    } catch (error) {
      set({
        isAuthenticating: false,
        error: error instanceof Error ? error.message : "Authentication failed",
      });
    }
  },

  reset: () => set({ authenticated: false, user: null, error: null, isAuthenticating: false }),
}));
