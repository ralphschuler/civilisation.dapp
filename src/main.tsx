import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { Eruda } from './providers/eruda-provider.tsx';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Eruda>
      <App />
    </Eruda>
  </StrictMode>,
)
