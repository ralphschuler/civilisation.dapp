import { MiniKit } from "@worldcoin/minikit-js";
import {
  useReadContract,
  type UseReadContractParameters,
  type UseReadContractReturnType,
} from "wagmi";
import type { Abi } from "viem";

export type UseContractReadParameters<
  TAbi extends Abi | readonly unknown[],
  TFunctionName extends string,
  TArgs extends readonly unknown[] | undefined,
  TSelectData = unknown,
> = UseReadContractParameters<TAbi, TFunctionName, TArgs, TSelectData> & {
  address: `0x${string}` | undefined;
  abi: TAbi;
  functionName: TFunctionName | undefined;
  args?: TArgs;
};

export function useContractRead<
  TAbi extends Abi | readonly unknown[],
  TFunctionName extends string,
  TArgs extends readonly unknown[] | undefined,
  TSelectData = unknown,
>(
  parameters: UseContractReadParameters<TAbi, TFunctionName, TArgs, TSelectData>,
): UseReadContractReturnType<TAbi, TFunctionName, TArgs, TSelectData> {
  return useReadContract({
    ...parameters,
    query: {
      enabled: true,
      refetchOnWindowFocus: true,
      staleTime: 15_000,
      ...parameters.query,
    },
  });
}

export type SendContractTransactionParameters = {
  address: `0x${string}`;
  abi: Abi;
  functionName: string;
  args?: unknown[];
};

export async function sendContractTransaction({
  address,
  abi,
  functionName,
  args = [],
}: SendContractTransactionParameters) {
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
