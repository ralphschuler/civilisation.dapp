import { useCallback, useMemo } from "react";
import { useAccount, useReadContract } from "wagmi";
import { resourceFacetAbi } from "@/lib/abi/resourceFacet";
import {
  WORLDCHAIN_WALLET_ADDRESS,
  isUsingPlaceholderWalletAddress,
} from "@/config/worldchain";
import { sendContractTransaction } from "@/lib/useContract";
import type { UncollectedResources } from "@/types/game";
import {
  ResourceId,
  resourceIdToKey,
  resourceKeyToId,
  type SupportedResourceKey,
} from "@/data/resourceIds";

const EMPTY_UNCOLLECTED: UncollectedResources = {
  bread: 0,
  clay: 0,
  coal: 0,
  gold: 0,
  iron: 0,
  meat: 0,
  villager: 0,
  wheat: 0,
  wood: 0,
};

function mapUncollected(values: bigint[] | undefined) {
  if (!values) return EMPTY_UNCOLLECTED;

  const mapped: UncollectedResources = { ...EMPTY_UNCOLLECTED };

  values.forEach((value, index) => {
    const key = resourceIdToKey[index as ResourceId];
    if (key) {
      mapped[key] = Number(value);
    }
  });

  return mapped;
}

export function useResourceGeneration() {
  const { address } = useAccount();
  const isOnChainEnabled =
    !isUsingPlaceholderWalletAddress && address != null && address !== "";

  const { data: uncollectedData, refetch: refetchUncollected } = useReadContract({
    address: isOnChainEnabled ? WORLDCHAIN_WALLET_ADDRESS : undefined,
    abi: resourceFacetAbi,
    functionName: "getUncollectedResources",
    args: isOnChainEnabled ? [address as `0x${string}`] : undefined,
    query: {
      enabled: isOnChainEnabled,
      staleTime: 15_000,
      refetchOnWindowFocus: true,
    },
  });

  const { data: productionConfig } = useReadContract({
    address: isOnChainEnabled ? WORLDCHAIN_WALLET_ADDRESS : undefined,
    abi: resourceFacetAbi,
    functionName: "getProductionConfig",
    query: {
      enabled: isOnChainEnabled,
      staleTime: Infinity,
    },
  });

  const uncollected = useMemo(() => {
    if (!Array.isArray(uncollectedData)) return EMPTY_UNCOLLECTED;
    const [claimable] = uncollectedData as unknown[];
    if (!Array.isArray(claimable)) return EMPTY_UNCOLLECTED;
    return mapUncollected(claimable as bigint[]);
  }, [uncollectedData]);

  const secondsUntilNextUnit = useMemo(() => {
    if (!Array.isArray(uncollectedData)) return 0;
    const [, next] = uncollectedData as unknown[];
    if (typeof next === "bigint") return Number(next);
    if (typeof next === "number") return next;
    return 0;
  }, [uncollectedData]);

  const productionPerHour = useMemo(() => {
    if (!Array.isArray(productionConfig)) return 0;
    const [rate] = productionConfig as unknown[];
    if (typeof rate === "bigint") return Number(rate);
    if (typeof rate === "number") return rate;
    return 0;
  }, [productionConfig]);

  const collectAllResources = useCallback(async () => {
    if (!isOnChainEnabled) return;

    await sendContractTransaction({
      address: WORLDCHAIN_WALLET_ADDRESS,
      abi: resourceFacetAbi,
      functionName: "collectAllResources",
    });

    await refetchUncollected();
  }, [isOnChainEnabled, refetchUncollected]);

  const collectResource = useCallback(
    async (resource: SupportedResourceKey) => {
      if (!isOnChainEnabled) return;

      const resourceId = resourceKeyToId[resource];
      await sendContractTransaction({
        address: WORLDCHAIN_WALLET_ADDRESS,
        abi: resourceFacetAbi,
        functionName: "collectResource",
        args: [BigInt(resourceId)],
      });

      await refetchUncollected();
    },
    [isOnChainEnabled, refetchUncollected],
  );

  return {
    isEnabled: isOnChainEnabled,
    uncollected,
    secondsUntilNextUnit,
    productionPerHour,
    collectAllResources,
    collectResource,
  };
}
