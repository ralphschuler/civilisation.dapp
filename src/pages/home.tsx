import { MiniKit } from '@worldcoin/minikit-js';

export default function Home() {
  return (
    <>
      <div>
        <img src={MiniKit.user.profilePictureUrl} alt="User Avatar" />
        <p>User ID: {MiniKit.user.username}</p>
        <p>Address: {MiniKit.user.walletAddress}</p>
      </div>
    </>
  )
}
