export default function Home() {
  const { read, write } = useContract({
    address: import.meta.env.VITE_PUBLIC_CONTRACT_ADDRESS
    abi: Abi;
    rpcUrl?: string;
  });


  return (
    <>
      <div>HOME</div>
    </>
  )
}
