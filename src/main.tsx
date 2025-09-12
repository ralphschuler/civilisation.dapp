import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { App } from '@/App'
import "@/global.css"
import { ClientProvider } from './providers';


createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ClientProvider>
      <App />
    </ClientProvider>
  </StrictMode>,
)
