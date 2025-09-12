import { Routes, Route } from 'react-router-dom';

import { Home } from '@/pages/home';

export const App = () => {

  return (
    <>
      <Routes>
        <Route path="/" element={<Home />} />
      </Routes>
    </>
  )
}
