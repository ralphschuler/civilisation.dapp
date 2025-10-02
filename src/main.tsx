import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { App } from "@/App";
import "@/global.css";
import "@/globals.css";
import { ClientProvider } from "@/providers";
import { ErrorBoundary } from "@/components/errorBoundary";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ErrorBoundary>
      <ClientProvider>
        <App />
      </ClientProvider>
    </ErrorBoundary>
  </StrictMode>,
);
