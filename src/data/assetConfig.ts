// Asset configuration for game icons and images
export const ASSET_PATHS = {
  buildings: {
    townhall: "/assets/buildings/town-hall.png",
    barracks: "/assets/buildings/barracks.png",
    woodcutter: "/assets/buildings/wood-cutter.png",
    claypit: "/assets/buildings/clay-pit.png",
    ironmine: "/assets/buildings/iron-mine.png",
    storage: "/assets/buildings/storage.png",
    farm: "/assets/buildings/farm.png",
    bakery: "/assets/buildings/bakery.png",
    house: "/assets/buildings/house.png",
    market: "/assets/buildings/market.png",
    wall: "/assets/buildings/wall.png",
    huntershut: "/assets/buildings/hunters-hut.png",
    coalpit: "/assets/buildings/coal-pit.png",
  },
  resources: {
    wood: "/assets/resources/wood.png",
    clay: "/assets/resources/clay.png",
    iron: "/assets/resources/iron.png",
    gold: "/assets/resources/gold.png",
    villager: "/assets/resources/villager.png",
    bread: "/assets/resources/bread.png",
    meat: "/assets/resources/meat.png",
    wheat: "/assets/resources/wheat.png",
    coal: "/assets/resources/coal.png",
  },
  units: {
    spearman: "/assets/units/spearman.png",
    soldier: "/assets/units/soldier.png",
    archer: "/assets/units/archer.png",
    knight: "/assets/units/knight.png",
    trebuchet: "/assets/units/trebuchet.png",
  },
};

// Helper function to get asset path
export function getAssetPath(category: keyof typeof ASSET_PATHS, item: string): string {
  const categoryAssets = ASSET_PATHS[category] as Record<string, string>;
  return categoryAssets[item] || "";
}

// Building icon mapping
export function getBuildingIcon(buildingId: string): string {
  const iconMap: Record<string, string> = {
    townhall: ASSET_PATHS.buildings.townhall,
    barracks: ASSET_PATHS.buildings.barracks,
    woodcutter: ASSET_PATHS.buildings.woodcutter,
    claypit: ASSET_PATHS.buildings.claypit,
    ironmine: ASSET_PATHS.buildings.ironmine,
    storage: ASSET_PATHS.buildings.storage,
    farm: ASSET_PATHS.buildings.farm,
    bakery: ASSET_PATHS.buildings.bakery,
    house: ASSET_PATHS.buildings.house,
    market: ASSET_PATHS.buildings.market,
    wall: ASSET_PATHS.buildings.wall,
    huntershut: ASSET_PATHS.buildings.huntershut,
    coalpit: ASSET_PATHS.buildings.coalpit,
  };
  return iconMap[buildingId] || ASSET_PATHS.buildings.townhall;
}

// Resource icon mapping
export function getResourceIcon(resourceId: string): string {
  const iconMap: Record<string, string> = {
    wood: ASSET_PATHS.resources.wood,
    clay: ASSET_PATHS.resources.clay,
    iron: ASSET_PATHS.resources.iron,
    gold: ASSET_PATHS.resources.gold,
    population: ASSET_PATHS.resources.villager,
    bread: ASSET_PATHS.resources.bread,
    meat: ASSET_PATHS.resources.meat,
    wheat: ASSET_PATHS.resources.wheat,
    coal: ASSET_PATHS.resources.coal,
  };
  return iconMap[resourceId] || ASSET_PATHS.resources.wood;
}

// Unit icon mapping
export function getUnitIcon(unitId: string): string {
  const iconMap: Record<string, string> = {
    spearman: ASSET_PATHS.units.spearman,
    soldier: ASSET_PATHS.units.soldier,
    archer: ASSET_PATHS.units.archer,
    knight: ASSET_PATHS.units.knight,
    trebuchet: ASSET_PATHS.units.trebuchet,
  };
  return iconMap[unitId] || ASSET_PATHS.units.spearman;
}
