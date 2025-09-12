import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { App } from '@/App'
import "@/global.css"
import { QueryClient, QueryClientProvider } from 'react-query';
import { Eruda } from '@/providers/eruda-provider';
import { MiniKitProvider } from '@worldcoin/minikit-js/minikit-provider';
import { HashRouter } from 'react-router-dom';

const queryClient = new QueryClient();

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Eruda>
      <HashRouter
        basename={import.meta.env.VITE_BASE_PATH}

      >
        <MiniKitProvider
          app-id={{appId: import.meta.env.VITE_PUBLIC_APP_ID}}
        >
          <QueryClientProvider client={queryClient}>
            <App />
          </QueryClientProvider>
        </MiniKitProvider>
      </HashRouter>
    </Eruda>
  </StrictMode>,
)
