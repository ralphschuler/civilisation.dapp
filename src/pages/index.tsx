import { useEffect, useState } from 'react'
import { MiniKit } from '@worldcoin/minikit-js'
import { Button } from '@/components/ui/button'
import { IDKitWidget, ISuccessResult, useIDKit } from '@worldcoin/idkit'

export default function Home() {
  const { open, setOpen } = useIDKit()

  console.log('MiniKit Installed', MiniKit.isInstalled)

  useEffect(() => {
    console.log(JSON.stringify(MiniKit))
  }, [])

  const onSuccess = async (result: ISuccessResult) => {
    console.log('IDKit result:', JSON.stringify(result))
  }

  return (
    <div>
      {MiniKit.user.walletAddress && (
        <>
          <IDKitWidget
            app_id={process.env.NEXT_PUBLIC_WORLDCOIN_APP_ID!}
            action={process.env.NEXT_PUBLIC_WORLDCOIN_ACTION!}
            signal={MiniKit.user.walletAddress}
            onSuccess={onSuccess}
            credential_types={['orb']} // nur Orb-Verifications zulassen
            autoClose={true}
          ></IDKitWidget>
          <Button onClick={() => setOpen(!open)}>Verify Identity</Button>
        </>
      )}
    </div>
  )
}
