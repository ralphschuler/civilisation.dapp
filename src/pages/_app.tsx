import '@/styles/globals.css'
import type { AppProps } from 'next/app'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { MiniKitProvider, MiniKit } from '@worldcoin/minikit-js/minikit-provider'

const queryClient = new QueryClient()

export default function App({ Component, pageProps }: AppProps) {
  console.log(MiniKit.isInstalled())

  return (
    <MiniKitProvider>
      <QueryClientProvider client={queryClient}>
        <Component {...pageProps} />
      </QueryClientProvider>
    </MiniKitProvider>
  )
}
