import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { App } from "@/App";
import "@/globals.css";
import { ClientProvider } from "@/providers";
import { ErrorBoundary } from "@/components/game/ErrorBoundary";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ErrorBoundary>
      <ClientProvider>
        <App />
      </ClientProvider>
    </ErrorBoundary>
  </StrictMode>,
);
