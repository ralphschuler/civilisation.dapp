import { useMiniKit } from '@worldcoin/minikit-js/minikit-provider'
import { Button } from '@/components/ui/button'
import { Navigate } from 'react-router-dom'
import { useAuthStore } from '@/stores/authStore'

export default function WalletConnect() {
  const { isInstalled } = useMiniKit()
  const { authenticated, authenticate } = useAuthStore()

  if (!isInstalled) {
    return (
      <div>
        <p>MiniKit is not installed</p>
        <span>This app has to be run using the Worldcoin app.</span>
      </div>
    )
  }

  if (authenticated) {
    return <Navigate to="/" />
  }

  return <Button onClick={authenticate}>Authenticate</Button>
}
