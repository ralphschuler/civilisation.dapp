/// <reference types="vite/client" />

interface ViteTypeOptions {
  strictImportMetaEnv: unknown;
}

interface ImportMetaEnv {
  VITE_PUBLIC_APP_ID: string
  VITE_PUBLIC_CONTRACT_ADDRESS: string
  VITE_BASE_PATH: string
  VITE_PUBLIC_WORLDCHAIN_ID?: string
  VITE_PUBLIC_WORLDCHAIN_RPC_URL?: string
  VITE_PUBLIC_WORLDCHAIN_WALLET_ADDRESS?: string
}
