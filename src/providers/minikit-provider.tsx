import { type ReactNode } from 'react'
import { MiniKitProvider as MiniKit } from '@worldcoin/minikit-js/minikit-provider'

export const MiniKitProvider = (props: { children: ReactNode }) => {
  return <MiniKit app-id={import.meta.env.VITE_PUBLIC_APP_ID}>{props.children}</MiniKit>
}
