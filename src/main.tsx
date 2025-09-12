import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { QueryClient, QueryClientProvider } from 'react-query';
import { Eruda } from './providers/eruda-provider.tsx';

const queryClient = new QueryClient();

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Eruda>
      <QueryClientProvider client={queryClient}>
        <App />
      </QueryClientProvider>
    </Eruda>
  </StrictMode>,
)
