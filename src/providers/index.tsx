import { type ReactNode } from "react";
import { ErudaProvider } from "@/providers/eruda-provider";
import { MiniKitProvider } from "@/providers/minikit-provider";
import { RouterProvider } from "@/providers/router-provider";
import { QueryProvider } from "@/providers/query-provider";
import { I18nProvider } from "@/providers/i18n-provider";
import { StoresProvider } from "@/providers/stores-provider";
import { UXProvider } from "@/providers/ux-provider";
import { WagmiProvider } from "@/providers/wagmi-provider";

export const ClientProvider = ({ children }: { children: ReactNode }) => {
  return (
    <ErudaProvider>
      <MiniKitProvider>
        <RouterProvider>
          <QueryProvider>
            <WagmiProvider>
              <I18nProvider>
                <UXProvider>
                  <StoresProvider>{children}</StoresProvider>
                </UXProvider>
              </I18nProvider>
            </WagmiProvider>
          </QueryProvider>
        </RouterProvider>
      </MiniKitProvider>
    </ErudaProvider>
  );
};
