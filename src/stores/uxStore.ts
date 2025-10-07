import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { openDB } from "idb";

const DB_NAME = "app-storage";
const STORE_NAME = "kv";
const DB_VERSION = 1;

type UXState = {
  hydrated: boolean;
  theme: "dark" | "light" | "system";
  soundVolume: number;
  tutorialDone: boolean;
  setTheme: (theme: UXState["theme"]) => void;
  setSoundVolume: (volume: number) => void;
  markTutorialDone: () => void;
  setHydrated: (hydrated: boolean) => void;
};

const dbPromise = openDB(DB_NAME, DB_VERSION, {
  upgrade(database) {
    if (!database.objectStoreNames.contains(STORE_NAME)) {
      database.createObjectStore(STORE_NAME);
    }
  },
});

const idbStorage = {
  async getItem(name: string) {
    const db = await dbPromise;
    const value = await db.get(STORE_NAME, name);
    return (value as string | null | undefined) ?? null;
  },
  async setItem(name: string, value: string) {
    const db = await dbPromise;
    await db.put(STORE_NAME, value, name);
  },
  async removeItem(name: string) {
    const db = await dbPromise;
    await db.delete(STORE_NAME, name);
  },
};

export const useUXStore = create<UXState>()(
  persist(
    (set) => ({
      hydrated: false,
      theme: "system",
      soundVolume: 0.7,
      tutorialDone: false,
      setTheme: (theme) => set({ theme }),
      setSoundVolume: (soundVolume) => set({ soundVolume }),
      markTutorialDone: () => set({ tutorialDone: true }),
      setHydrated: (hydrated) => set({ hydrated }),
    }),
    {
      name: "ux-preferences",
      version: 1,
      storage: createJSONStorage(() => idbStorage),
      partialize: ({ theme, soundVolume, tutorialDone }) => ({
        theme,
        soundVolume,
        tutorialDone,
      }),
      onRehydrateStorage: () => (state, error) => {
        if (error) {
          console.warn("UX store rehydration failed", error);
        }
        state?.setHydrated(true);
      },
    },
  ),
);
