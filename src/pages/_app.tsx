import '@/styles/globals.css'
import type { AppProps } from 'next/app'
import MiniKitProvider from '@/providers/minikit'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

const queryClient = new QueryClient()

export default function App({ Component, pageProps }: AppProps) {
  return (
    <MiniKitProvider>
      <QueryClientProvider client={queryClient}>
        <Component {...pageProps} />
      </QueryClientProvider>
    </MiniKitProvider>
  )
}
