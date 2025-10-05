import { type Abi} from "viem";
import { useReadContract } from "wagmi";
import { MiniKit } from "@worldcoin/minikit-js";

type UseContractProps = {
  address: `0x${string}`;
  abi: Abi;
};

export function useContract({ address, abi }: UseContractProps) {
  async function read<T = unknown>(
    functionName: string,
    args: unknown[] = [],
  ): Promise<T> {
    return useReadContract({
      address,
      abi,
      functionName,
      args,
      query: {
        enabled: true,
        refetchOnWindowFocus: true,
        staleTime: 15_000
      }
    }).data as T;
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
