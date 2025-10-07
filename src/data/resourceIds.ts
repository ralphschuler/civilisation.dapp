import type { UncollectedResources } from "@/types/game";

export enum ResourceId {
  WOOD = 0,
  CLAY = 1,
  STONE = 2,
  IRON = 3,
  COAL = 4,
  WHEAT = 5,
  GOLD = 6,
  BREAD = 7,
  MEAT = 8,
  FISH = 9,
}

export type SupportedResourceKey = Exclude<keyof UncollectedResources, "villager">;

export const resourceIdToKey: Partial<Record<ResourceId, SupportedResourceKey>> = {
  [ResourceId.WOOD]: "wood",
  [ResourceId.CLAY]: "clay",
  [ResourceId.IRON]: "iron",
  [ResourceId.COAL]: "coal",
  [ResourceId.WHEAT]: "wheat",
  [ResourceId.GOLD]: "gold",
  [ResourceId.BREAD]: "bread",
  [ResourceId.MEAT]: "meat",
};

export const resourceKeyToId = Object.entries(resourceIdToKey).reduce(
  (acc, [id, key]) => {
    if (key) {
      acc[key] = Number(id) as ResourceId;
    }
    return acc;
  },
  {} as Record<SupportedResourceKey, ResourceId>,
);

export const supportedResourceIds = Object.values(resourceKeyToId);
