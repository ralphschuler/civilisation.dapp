import { ReactNode, useEffect } from 'react';
import { initializeStores, useGameStore, useVillageStore } from '@/lib/stores';

export function StoresProvider({ children }: { children: ReactNode }) {
  const isInitialized = useGameStore((s) => s.isInitialized);
  const village = useVillageStore((s) => s.village);

  useEffect(() => {
    initializeStores().catch((err) => {
      console.warn('Store initialization failed', err);
    });
  }, []);

  if (!isInitialized || !village) {
    return null;
  }

  return <>{children}</>;
}
