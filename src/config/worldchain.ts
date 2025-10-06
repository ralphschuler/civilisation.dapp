import { type Address } from 'viem'

const DEFAULT_CHAIN_ID = 480
const DEFAULT_RPC_URL = 'https://worldchain-rpc.placeholder.invalid'
const DEFAULT_GAME_ADDRESS = '0x0000000000000000000000000000000000000000'

const rawChainId = import.meta.env.VITE_PUBLIC_WORLDCHAIN_ID
const parsedChainId = Number.parseInt(rawChainId ?? `${DEFAULT_CHAIN_ID}`, 10)

export const WORLDCHAIN_CHAIN_ID = Number.isNaN(parsedChainId)
  ? DEFAULT_CHAIN_ID
  : parsedChainId

export const WORLDCHAIN_RPC_URL = import.meta.env.VITE_PUBLIC_WORLDCHAIN_RPC_URL ?? DEFAULT_RPC_URL

const rawGameAddress = import.meta.env.VITE_PUBLIC_WORLDCHAIN_GAME_ADDRESS
export const WORLDCHAIN_GAME_ADDRESS = (rawGameAddress as Address | undefined) ?? (DEFAULT_GAME_ADDRESS as Address)

export const isUsingPlaceholderRpc = WORLDCHAIN_RPC_URL === DEFAULT_RPC_URL
export const isUsingPlaceholderGameAddress = rawGameAddress == null
