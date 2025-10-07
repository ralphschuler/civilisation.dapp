import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { App } from "@/App";
import "@/globals.css";
import { ClientProvider } from "@/providers";
import { ErrorBoundary } from "@/components/game/ErrorBoundary";
import { configureRepository } from "@/lib/repositories/RepositoryFactory";

// Ensure localStorage-based persistence even in development
configureRepository({ type: "localStorage" });

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ErrorBoundary>
      <ClientProvider>
        <App />
      </ClientProvider>
    </ErrorBoundary>
  </StrictMode>,
);
