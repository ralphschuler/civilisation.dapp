import { useMiniKit } from '@worldcoin/minikit-js/minikit-provider';
import { MiniKit } from '@worldcoin/minikit-js';

function App() {
  const { isInstalled, } = useMiniKit();

  const { user } = MiniKit;


  return (
    <>
      {isInstalled ? (
        <div>
          <p>MiniKit is installed</p>
          {user ? (
            <div>
              <p>User ID: {user.username}</p>
              <p>Address: {user.walletAddress}</p>
            </div>
          ) : (
            <p>User not found</p>
          )}
        </div>
      ) : (
        <div>
          <p>MiniKit is not installed</p>
          <button onClick={() => MiniKit.install(import.meta.env.VITE_PUBLIC_APP_ID)}>Install MiniKit</button>
        </div>
      )}
    </>
  )
}

export default App
