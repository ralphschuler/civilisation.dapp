import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App'
import { QueryClient, QueryClientProvider } from 'react-query';
import { Eruda } from './providers/eruda-provider';

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
