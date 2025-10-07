import { create } from "zustand";
import { MiniKit } from "@worldcoin/minikit-js";
import { uuidv4 } from "@/lib/uuidv4";

interface AuthState {
  authenticated: boolean;
  authenticate: () => Promise<void>;
  reset: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  authenticated: false,

  authenticate: async () => {
    const nonce = uuidv4().replace(/-/g, "");
    const result = await MiniKit.commandsAsync.walletAuth({
      nonce,
      requestId: "0",
      expirationTime: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // +7 days
      notBefore: new Date(Date.now() - 24 * 60 * 60 * 1000), // -1 day
      statement: "",
    });

    if (result.finalPayload.status === "error") {
      return;
    }

    set({ authenticated: true });
  },

  reset: () => set({ authenticated: false }),
}));
