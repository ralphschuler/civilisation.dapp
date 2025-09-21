import { useMemo } from "react";
import { type Abi, createPublicClient, http } from "viem";
import { worldchain } from "viem/chains";
import { MiniKit } from "@worldcoin/minikit-js";

type UseContractProps = {
  address: `0x${string}`;
  abi: Abi;
  rpcUrl?: string;
};

export function useContract({ address, abi, rpcUrl }: UseContractProps) {
  const client = useMemo(
    () =>
      createPublicClient({
        chain: worldchain,
        transport: http(
          rpcUrl ?? "https://worldchain-mainnet.g.alchemy.com/public",
        ),
      }),
    [rpcUrl],
  );

  async function read<T = unknown>(
    functionName: string,
    args: unknown[] = [],
  ): Promise<T> {
    return client.readContract({
      address,
      abi,
      functionName,
      args,
    }) as Promise<T>;
  }

  async function write(
    functionName: string,
    args: unknown[] = [],
  ): Promise<unknown> {
    return MiniKit.commandsAsync.sendTransaction({
      transaction: [
        {
          address,
          abi,
          functionName,
          args,
        },
      ],
    });
  }

  return {
    read,
    write,
  };
}
