import { useState } from 'react';
import { useMiniKit } from '@worldcoin/minikit-js/minikit-provider';
import { MiniKit } from '@worldcoin/minikit-js';
import { uuidv4 } from '@/utils/uuidv4';
import { Button } from '@/components/ui/button';

export const Home = () => {
  const { isInstalled, } = useMiniKit();
  const [ authenticated, setAuthenticated ] = useState(false)

  const authenticate = async () => {
    const nonce = uuidv4().replace(/-/g, '');
    const result = await MiniKit.commandsAsync.walletAuth({
  		nonce: nonce,
  		requestId: '0', // Optional
  		expirationTime: new Date(new Date().getTime() + 7 * 24 * 60 * 60 * 1000),
  		notBefore: new Date(new Date().getTime() - 24 * 60 * 60 * 1000),
  		statement: 'This is my statement and here is a link https://worldcoin.com/apps',
  	})

  	if (result.finalPayload.status === 'error') {
  		return
  	}

   setAuthenticated(true)
  }
  return (
    <>
      {isInstalled ? (
        <div>
          <p>MiniKit is installed</p>
          {authenticated ? (
            <div>
              <img src={MiniKit.user.profilePictureUrl} alt="User Avatar" />
              <p>User ID: {MiniKit.user.username}</p>
              <p>Address: {MiniKit.user.walletAddress}</p>
            </div>
          ) : (
            <div>
              <p>Not authenticated</p>
              <Button onClick={() => authenticate()}>Authenticate</Button>
            </div>
          )}
        </div>
      ) : (
        <div>
          <p>MiniKit is not installed</p>
          <Button onClick={() => MiniKit.install(import.meta.env.VITE_PUBLIC_APP_ID)}>Install MiniKit</Button>
        </div>
      )}
    </>
  )
}
