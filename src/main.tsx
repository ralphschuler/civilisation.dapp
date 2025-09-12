import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from '@/App'
import "@/global.css"
import { QueryClient, QueryClientProvider } from 'react-query';
import { Eruda } from '@/providers/eruda-provider';
import { MiniKitProvider } from '@worldcoin/minikit-js/minikit-provider';

const queryClient = new QueryClient();

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Eruda>
      <MiniKitProvider app-id={{appId: import.meta.env.VITE_PUBLIC_APP_ID}}>
        <QueryClientProvider client={queryClient}>
          <App />
        </QueryClientProvider>
      </MiniKitProvider>
    </Eruda>
  </StrictMode>,
)
