import { Routes, Route } from 'react-router-dom'

import Home from '@/pages/home'
import WalletConnect from '@/pages/walletConnect'
import NotFound from '@/pages/notFound'
import Layout from '@/components/layout/layout'
import ProtectedRoute from '@/components/protectedRoute'
import { useAuthStore } from '@/stores/authStore'

export function App() {
  const { authenticated } = useAuthStore()
  return (
    <>
      <Routes>
        <Route path="/wallet-connect" element={<WalletConnect />} />

        <Route element={<Layout />}>
          <Route
            element={<ProtectedRoute condition={authenticated} redirectTo="/wallet-connect" />}
          >
            <Route path="/" element={<Home />} />
          </Route>
        </Route>

        <Route path="*" element={<NotFound />} />
      </Routes>
    </>
  )
}
