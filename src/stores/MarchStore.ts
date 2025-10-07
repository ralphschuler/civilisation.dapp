/**
 * March Store - Manages marches and army presets using Zustand
 * Interacts with repositories for persistence
 */

import { create } from "zustand";
import { devtools } from "zustand/middleware";
import { type March, type MarchPreset } from "@/types/game";
import { getRepository } from "@/lib/repositories/RepositoryFactory";

type MarchState = {
  marches: March[];
  marchPresets: MarchPreset[];
  isLoading: boolean;
  error: string | null;
  loadMarches: () => Promise<void>;
  loadMarchPresets: () => Promise<void>;
  createMarch: (march: Omit<March, "id">) => Promise<March | null>;
  cancelMarch: (marchId: string) => Promise<void>;
  updateMarch: (march: March) => Promise<void>;
  createMarchPreset: (preset: Omit<MarchPreset, "id">) => Promise<MarchPreset | null>;
  updateMarchPreset: (preset: MarchPreset) => Promise<void>;
  deleteMarchPreset: (presetId: string) => Promise<void>;
  getActiveMarchesForVillage: (villageId: string) => March[];
  reset: () => void;
};

export const useMarchStore = create<MarchState>()(
  devtools(
    (set, get) => ({
      marches: [],
      marchPresets: [],
      isLoading: false,
      error: null,
      loadMarches: async () => {
        set({ isLoading: true, error: null });
        try {
          const repository = getRepository();
          const marches = await repository.march.getMarches();
          set({ marches, isLoading: false });
        } catch (error) {
          set({
            error: error instanceof Error ? error.message : "Failed to load marches",
            isLoading: false,
          });
        }
      },
      loadMarchPresets: async () => {
        set({ isLoading: true, error: null });
        try {
          const repository = getRepository();
          const marchPresets = await repository.marchPreset.getPresets();
          set({ marchPresets, isLoading: false });
        } catch (error) {
          set({
            error: error instanceof Error ? error.message : "Failed to load march presets",
            isLoading: false,
          });
        }
      },
      createMarch: async (marchData: Omit<March, "id">) => {
        try {
          const repository = getRepository();
          const march = await repository.march.createMarch(marchData);
          set((state) => ({ marches: [...state.marches, march] }));
          return march;
        } catch (error) {
          set({
            error: error instanceof Error ? error.message : "Failed to create march",
          });
          return null;
        }
      },
      cancelMarch: async (marchId: string) => {
        try {
          const repository = getRepository();
          await repository.march.cancelMarch(marchId);
          set((state) => ({
            marches: state.marches.filter((march) => march.id !== marchId),
          }));
        } catch (error) {
          set({
            error: error instanceof Error ? error.message : "Failed to cancel march",
          });
        }
      },
      updateMarch: async (march: March) => {
        try {
          const repository = getRepository();
          await repository.march.updateMarch(march);
          set((state) => ({
            marches: state.marches.map((existing) => (existing.id === march.id ? march : existing)),
          }));
        } catch (error) {
          set({
            error: error instanceof Error ? error.message : "Failed to update march",
          });
        }
      },
      createMarchPreset: async (presetData: Omit<MarchPreset, "id">) => {
        try {
          const repository = getRepository();
          const preset = await repository.marchPreset.createPreset(presetData);
          set((state) => ({ marchPresets: [...state.marchPresets, preset] }));
          return preset;
        } catch (error) {
          set({
            error: error instanceof Error ? error.message : "Failed to create march preset",
          });
          return null;
        }
      },
      updateMarchPreset: async (preset: MarchPreset) => {
        try {
          const repository = getRepository();
          await repository.marchPreset.updatePreset(preset);
          set((state) => ({
            marchPresets: state.marchPresets.map((existing) =>
              existing.id === preset.id ? preset : existing,
            ),
          }));
        } catch (error) {
          set({
            error: error instanceof Error ? error.message : "Failed to update march preset",
          });
        }
      },
      deleteMarchPreset: async (presetId: string) => {
        try {
          const repository = getRepository();
          await repository.marchPreset.deletePreset(presetId);
          set((state) => ({
            marchPresets: state.marchPresets.filter((preset) => preset.id !== presetId),
          }));
        } catch (error) {
          set({
            error: error instanceof Error ? error.message : "Failed to delete march preset",
          });
        }
      },
      getActiveMarchesForVillage: (villageId: string) => {
        const { marches } = get();
        return marches.filter(
          (march) =>
            march.fromVillage.id === villageId &&
            march.status !== "completed" &&
            march.status !== "cancelled",
        );
      },
      reset: () => {
        set({ marches: [], marchPresets: [], isLoading: false, error: null });
      },
    }),
    { name: "MarchStore" },
  ),
);
