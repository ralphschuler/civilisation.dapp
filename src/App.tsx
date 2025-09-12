import { useState, useEffect } from 'react'
import { MiniKit } from '@worldcoin/minikit-js';

function App() {
  const [isInstalled, setIsInstalled] = useState(false)

  useEffect(() => {
    setIsInstalled(MiniKit.isInstalled());
  }, []);



  return (
    <>
      {isInstalled ? (
        <div>
          <p>MiniKit is installed</p>
        </div>
      ) : (
        <div>
          <p>MiniKit is not installed</p>
          <button onClick={() => MiniKit.install()}>Install MiniKit</button>
        </div>
      )}
    </>
  )
}

export default App
