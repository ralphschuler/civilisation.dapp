import { type ReactNode } from "react";
import { ErudaProvider } from "@/providers/eruda-provider";
import { MiniKitProvider } from "@/providers/minikit-provider";
import { RouterProvider } from "@/providers/router-provider";
import { QueryProvider } from "@/providers/query-provider";

export const ClientProvider = ({ children }: { children: ReactNode }) => {
  return (
    <ErudaProvider>
      <MiniKitProvider>
        <RouterProvider>
          <QueryProvider>
            {children}
          </QueryProvider>
        </RouterProvider>
      </MiniKitProvider>
    </ErudaProvider>
  );
};
