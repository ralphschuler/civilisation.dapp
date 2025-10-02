import { Routes, Route, Navigate } from "react-router-dom";
import Layout from "@/components/layout/layout";
import ProtectedRoute from "@/components/protectedRoute";
import { useAuthStore } from "@/stores/authStore";

import WalletConnectPage from "@/pages/walletConnect";
import NotFoundPage from "@/pages/notFound";
import VillagePage from "@/pages/Village";
import WorldPage from "@/pages/World";
import ResourcesPage from "@/pages/Resources";
import UnitsPage from "@/pages/Units";

export function App() {
  const { authenticated } = useAuthStore();
  return (
    <>
      <Routes>
        <Route path="/" element={<Navigate to="/village" />} />
        <Route path="/wallet-connect" element={<WalletConnectPage />} />

        <Route element={<Layout />}>
          <Route
            element={
              <ProtectedRoute
                condition={authenticated}
                redirectTo="/wallet-connect"
              />
            }
          >
            <Route path="/world" element={<WorldPage />} />
            <Route path="/village" element={<VillagePage />} />
            <Route path="/resources" element={<ResourcesPage />} />
            <Route path="/units" element={<UnitsPage />} />
          </Route>
        </Route>

        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </>
  );
}
