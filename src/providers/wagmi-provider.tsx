import { type ReactNode } from 'react'
import { WagmiProvider as Wagmi } from "wagmi"

const config = {
    
}

export const WagmiProvider = ({ children }: { children: ReactNode }) => {
    return <Wagmi config={config}>{ children }</Wagmi>
}
