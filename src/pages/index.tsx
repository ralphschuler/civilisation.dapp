'use_client'

import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import { IDKitWidget, ISuccessResult, useIDKit } from '@worldcoin/idkit'

export default function Home() {
  const { open, setOpen } = useIDKit()

  useEffect(() => {
    console.log(JSON.stringify(globalThis.window.MiniKit.walletAddress))
  }, [])

  const onSuccess = async (result: ISuccessResult) => {
    console.log('IDKit result:', JSON.stringify(result))
  }

  return (
    <div>
      {globalThis.window.MiniKit.walletAddress && (
        <>
          <IDKitWidget
            app_id={process.env.NEXT_PUBLIC_WORLDCOIN_APP_ID!}
            action={process.env.NEXT_PUBLIC_WORLDCOIN_ACTION!}
            signal={globalThis.window.MiniKit.walletAddress}
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
