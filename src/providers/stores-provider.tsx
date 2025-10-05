import { ReactNode, useEffect } from 'react';
import { initializeStores, useGameStore, useVillageStore, usePlayerStatsStore } from '@/stores';

export function StoresProvider({ children }: { children: ReactNode }) {
  const isInitialized = useGameStore((s) => s.isInitialized);
  const village = useVillageStore((s) => s.village);
  const playerStats = usePlayerStatsStore((s) => s.stats);

  useEffect(() => {
    initializeStores().catch((err) => {
      console.warn('Store initialization failed', err);
    });
  }, []);

  if (!isInitialized || !village || !playerStats) {
    return null;
  }

  return <>{children}</>;
}
