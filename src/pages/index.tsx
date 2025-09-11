import { ethers } from 'ethers'
import { useState } from 'react'
import abi from '@/abi/ContractAbi.json'
import { decodeAbiParameters, parseAbiParameters } from 'viem'
import { IDKitWidget, ISuccessResult, useIDKit } from '@worldcoin/idkit'

export default function Home() {
  const { open, setOpen } = useIDKit()
  const [done, setDone] = useState(false)
  const [account, setAccount] = useState<string | null>(null)

  async function connectWallet() {
    if (window.ethereum) {
      try {
        const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' })
        if (accounts.length > 0) {
          setAccount(accounts[0])
        }
      } catch (e) {
        console.error('Wallet connection failed', e)
      }
    } else {
      alert('MetaMask nicht gefunden. Bitte installiere eine Web3-Wallet.')
    }
  }

  const onSuccess = async (result: ISuccessResult) => {
    // Dieser Callback wird NACH erfolgreicher World-ID Verifikation ausgelöst
    const { proof, merkle_root, nullifier_hash } = result
    console.log('Proof erhalten:', result)
    try {
      if (!account) throw new Error('Wallet nicht verbunden')
      // Verbinde mit Ethereum Provider (MetaMask)
      const provider = new ethers.providers.Web3Provider(window.ethereum)
      const signer = provider.getSigner()
      const tokenContract = new ethers.Contract(import.meta.env.NEXT_APP_CONTRACT_ADDRESS, abi, signer)
      // Aufruf der claimToken-Funktion des Contracts
      const tx = await tokenContract.claimToken(
        merkle_root,
        nullifier_hash,
        proof // Achtung: proof muss evtl. passend formatiert werden
      )
      await tx.wait()
      alert('Token erfolgreich geminted!')
    } catch (err) {
      console.error(err)
      alert('Fehler beim Claim: ' + (err as Error).message)
    }
  }

  return (
    <div>
      {account && (
        <IDKitWidget
          app_id={process.env.NEXT_PUBLIC_WORLDCOIN_APP_ID!}
          action={process.env.NEXT_PUBLIC_WORLDCOIN_ACTION!}
          signal={account}
          onSuccess={onSuccess}
          credential_types={['orb']} // nur Orb-Verifications zulassen
          autoClose={true}
        >
          {({ open }) => (
            <button onClick={open} disabled={!account}>
              World ID verifizieren & Token claimen
            </button>
          )}
        </IDKitWidget>
      )}
    </div>
  )
}
