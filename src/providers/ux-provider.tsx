import { type ReactNode } from "react";
import { useUXStore } from "@/stores";

export function UXProvider({ children }: { children: ReactNode }) {
  const hydrated = useUXStore((state) => state.hydrated);

  if (!hydrated) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background text-muted-foreground">
        Loading preferences…
      </div>
    );
  }

  return <>{children}</>;
}
