import { useState } from "react";
import { Building, Resources } from "../types/game";
import {
  BUILDING_TYPES,
  calculateBuildingCost,
  getBuildingIcon,
  getResourceIcon,
} from "../data/gameData";
import { Button } from "./ui/Button";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "./ui/Sheet";
import { Badge } from "./ui/Badge";
import { useI18n } from "@/providers/i18n-provider";

interface BuildingModalProps {
  building: Building | null;
  resources: Resources;
  isOpen: boolean;
  onClose: () => void;
  onUpgrade: (buildingType: string) => void;
}

export function BuildingModal({
  building,
  resources,
  isOpen,
  onClose,
  onUpgrade,
}: BuildingModalProps) {
  if (!building) return null;
  const { t } = useI18n();

  const buildingData = BUILDING_TYPES[building.type as keyof typeof BUILDING_TYPES];
  if (!buildingData) return null;

  const currentLevel = building.level;
  const nextLevel = currentLevel + 1;
  const maxLevel = buildingData.maxLevel;

  // Calculate correct upgrade cost for the next level
  const upgradeCost = calculateBuildingCost(
    building.type as keyof typeof BUILDING_TYPES,
    nextLevel,
  );

  const canUpgrade =
    nextLevel <= maxLevel &&
    Object.entries(upgradeCost).every(([resource, cost]) => (resources as any)[resource] >= cost);

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent side="bottom" className="h-[85vh] rounded-t-lg">
        <SheetHeader className="pb-4">
          <SheetTitle className="flex items-center gap-3">
            <span className="text-3xl">{getBuildingIcon(building.type)}</span>
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <span>{buildingData.name}</span>
                <Badge variant="outline">
                  {t("screens.units.common.level", "Level")} {currentLevel}
                </Badge>
              </div>
              <Badge variant="secondary" className="mt-1">
                {buildingData.category === "resource" &&
                  t("screens.building.category.resource", "Ressourcengebäude")}
                {buildingData.category === "military" &&
                  t("screens.building.category.military", "Militärgebäude")}
                {buildingData.category === "housing" &&
                  t("screens.building.category.housing", "Wohngebäude")}
                {buildingData.category === "defense" &&
                  t("screens.building.category.defense", "Verteidigung")}
                {buildingData.category === "special" &&
                  t("screens.building.category.special", "Spezialgebäude")}
              </Badge>
            </div>
          </SheetTitle>
        </SheetHeader>

        <div className="space-y-4">
          {/* Aktuelle Stufe Info */}
          <div className="bg-muted/50 rounded-lg p-3">
            <h4 className="font-medium mb-2">
              {t("screens.building.currentLevel", "Aktuelle Stufe")}
            </h4>
            <p className="text-sm text-muted-foreground mb-2">{buildingData.description}</p>

            {buildingData.category === "resource" && (
              <div className="flex items-center gap-1 text-sm">
                <span>⚡</span>
                <span>{t("screens.building.productionActive", "Produktion aktiv")}</span>
              </div>
            )}

            {buildingData.category === "military" && (
              <div className="flex items-center gap-1 text-sm">
                <span>⚔️</span>
                <span>{t("screens.building.category.military", "Militärgebäude")}</span>
              </div>
            )}

            {buildingData.category === "defense" && (
              <div className="flex items-center gap-1 text-sm">
                <span>🛡️</span>
                <span>{t("screens.building.defenseBuilding", "Verteidigungsgebäude")}</span>
              </div>
            )}
          </div>

          {/* Upgrade Info */}
          {nextLevel <= maxLevel && (
            <div className="space-y-3">
              <h4 className="font-medium">
                {t("screens.building.upgradeTitle", "Upgrade auf Level")} {nextLevel}
              </h4>

              {/* Upgrade Kosten */}
              <div className="space-y-2">
                <div className="text-sm font-medium">{t("screens.building.costs", "Kosten")}:</div>
                <div className="grid grid-cols-2 gap-2">
                  {Object.entries(upgradeCost).map(([resource, cost]) => {
                    const hasEnough = (resources as any)[resource] >= cost;
                    return (
                      <div
                        key={resource}
                        className={`flex items-center justify-between p-3 rounded-lg border transition-colors ${hasEnough ? "bg-green-50 border-green-200 dark:bg-green-950/20 dark:border-green-800" : "bg-red-50 border-red-200 dark:bg-red-950/20 dark:border-red-800"}`}
                      >
                        <div className="flex items-center gap-2">
                          <span className="text-lg">{getResourceIcon(resource)}</span>
                          <span className="font-medium">{cost}</span>
                        </div>
                        <span
                          className={`text-sm font-medium ${hasEnough ? "text-green-700 dark:text-green-400" : "text-red-700 dark:text-red-400"}`}
                        >
                          {(resources as any)[resource]}/{cost}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Upgrade Vorteile */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                <div className="text-sm font-medium mb-1">
                  {t("screens.building.benefits", "Verbesserungen")}:
                </div>
                <p className="text-sm text-blue-700">
                  {buildingData.category === "resource" &&
                    t("screens.building.benefit.resource", "Erhöht die Ressourcenproduktion")}
                  {buildingData.category === "military" &&
                    t(
                      "screens.building.benefit.military",
                      "Ermöglicht bessere Einheiten und schnelleres Training",
                    )}
                  {buildingData.category === "defense" &&
                    t("screens.building.benefit.defense", "Verbessert die Dorfverteidigung")}
                  {buildingData.category === "special" &&
                    t(
                      "screens.building.benefit.special",
                      "Verbessert Spezialfunktionen des Gebäudes",
                    )}
                </p>
              </div>

              {/* Upgrade Button */}
              <Button
                onClick={() => onUpgrade(building.type)}
                disabled={!canUpgrade}
                className="w-full"
                size="lg"
              >
                {!canUpgrade
                  ? t("screens.building.notEnough", "Nicht genügend Ressourcen")
                  : `${t("screens.building.upgradeTo", "Auf Level")} ${nextLevel} ${t("screens.building.upgrade", "upgraden")}`}
              </Button>
            </div>
          )}

          {nextLevel > maxLevel && (
            <div className="text-center text-muted-foreground py-4">
              <span>🏆</span>
              <p className="text-sm mt-1">
                {t("screens.building.maxLevel", "Maximale Stufe erreicht!")}
              </p>
            </div>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}
