import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App'
import { QueryClient, QueryClientProvider } from 'react-query';
import { Eruda } from './providers/eruda-provider';
import { MiniKitProvider } from '@worldcoin/minikit-js/minikit-provider';

const queryClient = new QueryClient();

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Eruda>
      <MiniKitProvider>
        <QueryClientProvider client={queryClient}>
          <App />
        </QueryClientProvider>
      </MiniKitProvider>
    </Eruda>
  </StrictMode>,
)
