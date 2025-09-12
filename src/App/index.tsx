import { Routes, Route } from 'react-router-dom';

import Home from '@/pages/home';
import Layout from '@/components/layout/layout';

export function App() {

  return (
    <>
      <Layout>
        <Routes>
          <Route path="/" element={<Home />} />
        </Routes>
      </Layout>
    </>
  )
}
