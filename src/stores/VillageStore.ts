/**
 * Village Store - Manages village state using Zustand
 * Interacts with repositories for persistence
 */

import { create } from "zustand";
import { devtools } from "zustand/middleware";
import { type Village, type Building, type TrainingQueue } from "@/types/game";
import { getRepository } from "@/lib/repositories/RepositoryFactory";

type VillageState = {
  village: Village | null;
  isLoading: boolean;
  error: string | null;
  loadVillage: (villageId: string) => Promise<void>;
  updateVillage: (village: Village) => Promise<void>;
  upgradeBuilding: (buildingId: string, building: Building) => Promise<void>;
  addToTrainingQueue: (training: TrainingQueue) => Promise<void>;
  removeFromTrainingQueue: (index: number) => Promise<void>;
  updateResources: (resources: Partial<Village["resources"]>) => Promise<void>;
  collectResources: (
    resourceType?: keyof Village["uncollectedResources"],
  ) => Promise<void>;
  reset: () => void;
};

export const useVillageStore = create<VillageState>()(
  devtools(
    (set, get) => ({
      village: null,
      isLoading: false,
      error: null,
      loadVillage: async (villageId: string) => {
        set({ isLoading: true, error: null });
        try {
          const repository = getRepository();
          const village = await repository.village.getVillage(villageId);
          set({ village, isLoading: false });
        } catch (error) {
          set({
            error:
              error instanceof Error ? error.message : "Failed to load village",
            isLoading: false,
          });
        }
      },
      updateVillage: async (village: Village) => {
        try {
          const repository = getRepository();
          await repository.village.updateVillage(village);
          set({ village });
        } catch (error) {
          set({
            error:
              error instanceof Error ? error.message : "Failed to update village",
          });
        }
      },
      upgradeBuilding: async (buildingId: string, building: Building) => {
        const { village } = get();
        if (!village) return;

        const updatedVillage = {
          ...village,
          buildings: {
            ...village.buildings,
            [buildingId]: building,
          },
        };

        await get().updateVillage(updatedVillage);
      },
      addToTrainingQueue: async (training: TrainingQueue) => {
        const { village } = get();
        if (!village) return;

        const updatedVillage = {
          ...village,
          trainingQueue: [...village.trainingQueue, training],
        };

        await get().updateVillage(updatedVillage);
      },
      removeFromTrainingQueue: async (index: number) => {
        const { village } = get();
        if (!village) return;

        const updatedVillage = {
          ...village,
          trainingQueue: village.trainingQueue.filter((_, i) => i !== index),
        };

        await get().updateVillage(updatedVillage);
      },
      updateResources: async (resources: Partial<Village["resources"]>) => {
        const { village } = get();
        if (!village) return;

        const updatedVillage = {
          ...village,
          resources: {
            ...village.resources,
            ...resources,
          },
        };

        await get().updateVillage(updatedVillage);
      },
      collectResources: async (
        resourceType?: keyof Village["uncollectedResources"],
      ) => {
        const { village } = get();
        if (!village) return;

        const newResources = { ...village.resources };
        const newUncollectedResources = { ...village.uncollectedResources };

        if (resourceType) {
          const amount = newUncollectedResources[resourceType];
          newResources[resourceType] += amount;
          newUncollectedResources[resourceType] = 0;
        } else {
          (Object.keys(newUncollectedResources) as Array<
            keyof Village["uncollectedResources"]
          >).forEach((key) => {
            newResources[key] += newUncollectedResources[key];
            newUncollectedResources[key] = 0;
          });
        }

        const updatedVillage = {
          ...village,
          resources: newResources,
          uncollectedResources: newUncollectedResources,
        };

        await get().updateVillage(updatedVillage);
      },
      reset: () => {
        set({ village: null, isLoading: false, error: null });
      },
    }),
    { name: "VillageStore" },
  ),
);
