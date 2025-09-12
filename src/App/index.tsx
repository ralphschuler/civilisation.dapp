import { Routes, Route } from 'react-router-dom';

import Home from '@/pages/home';
import WalletConnect from '@/pages/walletConnect';
import Layout from '@/components/layout/layout';
import ProtectedRoute from '@/components/protectedRoute';
import { useAuthStore } from '@/stores/authStore';

export function App() {
  const { authenticated } = useAuthStore();
  return (
    <>
      <Layout>
        <Routes>
          <Route path="/wallet-connect" element={<WalletConnect />} />

          <Route path="/" element={<ProtectedRoute condition={authenticated} redirectTo='/wallet-connect' />}>
            <Route path='/' element={<Home />} />
          </Route>
        </Routes>
      </Layout>
    </>
  )
}
