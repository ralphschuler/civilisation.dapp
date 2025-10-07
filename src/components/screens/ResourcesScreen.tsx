import { Resources, UncollectedResources } from "../../types/game";
import { calculateResourceProduction } from "../../data/gameData";
import { Button } from "../ui/Button";
import { Badge } from "../ui/Badge";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/Card";
import { Package, TrendingUp, Clock } from "lucide-react";
import { useI18n } from "@/providers/i18n-provider";

interface ResourcesScreenProps {
  resources: Resources;
  uncollectedResources: UncollectedResources;
  buildingLevels: {
    [key: string]: { level: number };
  };
  storageCapacity: number;
  onCollectResource?: (resourceType?: keyof UncollectedResources) => void;
  autoProductionPerHour?: Partial<Record<keyof UncollectedResources, number>>;
  nextProductionInSeconds?: number;
  isOnChainProductionActive?: boolean;
}

export function ResourcesScreen({
  resources,
  uncollectedResources,
  buildingLevels,
  storageCapacity,
  onCollectResource,
  autoProductionPerHour,
  nextProductionInSeconds,
  isOnChainProductionActive,
}: ResourcesScreenProps) {
  const { t } = useI18n();
  const formatNumber = (num: number) => {
    if (num >= 1000000) {
      return `${(num / 1000000).toFixed(1)}M`;
    }
    if (num >= 1000) {
      return `${(num / 1000).toFixed(1)}k`;
    }
    return Math.floor(num).toString();
  };

  const getResourcePercentage = (amount: number) => {
    return Math.min((amount / storageCapacity) * 100, 100);
  };

  const getTotalUncollected = () => {
    return Object.values(uncollectedResources).reduce((sum, amount) => sum + amount, 0);
  };

  const hasUncollectedResources = getTotalUncollected() > 0;

  // Calculate total production from all buildings
  const totalProduction = calculateResourceProduction(buildingLevels);

  const formatDuration = (seconds: number) => {
    if (seconds <= 0) return "0s";
    const rounded = Math.floor(seconds);
    if (rounded < 60) {
      return `${rounded}s`;
    }
    const minutes = Math.floor(rounded / 60);
    const secs = rounded % 60;
    if (minutes < 60) {
      return secs > 0 ? `${minutes}m ${secs}s` : `${minutes}m`;
    }
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    if (hours < 24) {
      if (mins === 0) return `${hours}h`;
      return `${hours}h ${mins}m`;
    }
    const days = Math.floor(hours / 24);
    const remHours = hours % 24;
    if (remHours === 0) return `${days}d`;
    return `${days}d ${remHours}h`;
  };

  const autoProduction = autoProductionPerHour ?? {};
  const onChainRate = autoProductionPerHour?.wood ?? 0;
  const isAutoProductionActive = Boolean(isOnChainProductionActive && autoProductionPerHour);

  const resourceData = [
    {
      key: "wood",
      name: t("screens.resources.names.wood", "Holz"),
      icon: "🪵",
      amount: resources.wood,
      uncollected: uncollectedResources.wood,
      production: (totalProduction.wood || 0) + (autoProduction.wood || 0),
      color: "bg-amber-600",
    },
    {
      key: "clay",
      name: t("screens.resources.names.clay", "Lehm"),
      icon: "🧱",
      amount: resources.clay,
      uncollected: uncollectedResources.clay,
      production: (totalProduction.clay || 0) + (autoProduction.clay || 0),
      color: "bg-orange-700",
    },
    {
      key: "iron",
      name: t("screens.resources.names.iron", "Eisen"),
      icon: "⚔️",
      amount: resources.iron,
      uncollected: uncollectedResources.iron,
      production: (totalProduction.iron || 0) + (autoProduction.iron || 0),
      color: "bg-gray-600",
    },
    {
      key: "coal",
      name: t("screens.resources.names.coal", "Kohle"),
      icon: "⚫",
      amount: resources.coal,
      uncollected: uncollectedResources.coal,
      production: (totalProduction.coal || 0) + (autoProduction.coal || 0),
      color: "bg-slate-800",
    },
    {
      key: "wheat",
      name: t("screens.resources.names.wheat", "Weizen"),
      icon: "🌾",
      amount: resources.wheat,
      uncollected: uncollectedResources.wheat,
      production: (totalProduction.wheat || 0) + (autoProduction.wheat || 0),
      color: "bg-yellow-600",
    },
    {
      key: "bread",
      name: t("screens.resources.names.bread", "Brot"),
      icon: "🍞",
      amount: resources.bread,
      uncollected: uncollectedResources.bread,
      production: (totalProduction.bread || 0) + (autoProduction.bread || 0),
      color: "bg-yellow-500",
    },
    {
      key: "meat",
      name: t("screens.resources.names.meat", "Fleisch"),
      icon: "🥩",
      amount: resources.meat,
      uncollected: uncollectedResources.meat,
      production: (totalProduction.meat || 0) + (autoProduction.meat || 0),
      color: "bg-red-600",
    },
    {
      key: "gold",
      name: t("screens.resources.names.gold", "Gold"),
      icon: "🪙",
      amount: resources.gold,
      uncollected: uncollectedResources.gold,
      production: (totalProduction.gold || 0) + (autoProduction.gold || 0),
      color: "bg-yellow-500",
    },
  ];

  return (
    <div className="space-y-4">
      {isAutoProductionActive && (
        <div className="flex items-center justify-between rounded-lg border border-primary/30 bg-primary/5 p-3">
          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4 text-primary" />
            <div>
              <p className="text-caption font-medium">
                {t("screens.resources.autoProduction.active", "Automatische Produktion aktiv")}
              </p>
              <p className="text-micro text-muted-foreground">
                {t("screens.resources.autoProduction.rate", "+{{amount}} pro Stunde je Ressource", {
                  amount: onChainRate,
                })}
                {nextProductionInSeconds != null && nextProductionInSeconds > 0 && (
                  <span>
                    {` • ${t(
                      "screens.resources.autoProduction.next",
                      "Nächste Einheit in {{time}}",
                      { time: formatDuration(nextProductionInSeconds) },
                    )}`}
                  </span>
                )}
              </p>
            </div>
          </div>
          {hasUncollectedResources && onCollectResource && (
            <Button size="sm" onClick={() => onCollectResource()} className="h-8">
              {t("screens.resources.collectAll", "Alle einsammeln")}
            </Button>
          )}
        </div>
      )}

      {/* Compact Resource Grid - 2x4 Layout with individual collect buttons */}
      <div className="grid grid-cols-2 gap-3">
        {resourceData.map((resource) => {
          const collectableAmount = Math.min(
            resource.uncollected,
            storageCapacity - resource.amount,
          );

          return (
            <Card key={resource.key}>
              <CardContent className="p-3">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-1.5">
                    <span className="text-lg">{resource.icon}</span>
                    <span className="text-caption font-medium">{resource.name}</span>
                  </div>
                  {resource.uncollected > 0 && (
                    <div className="w-1.5 h-1.5 bg-success rounded-full animate-pulse" />
                  )}
                </div>

                <div className="space-y-1.5">
                  {/* Current amount with storage indicator */}
                  <div className="flex items-baseline justify-between">
                    <span className="text-section font-medium">
                      {formatNumber(resource.amount)}
                    </span>
                    <span className="text-micro text-muted-foreground">
                      {Math.round(getResourcePercentage(resource.amount))}%
                    </span>
                  </div>

                  {/* Compact storage bar */}
                  <div className="w-full bg-muted rounded-full h-1.5">
                    <div
                      className={`${resource.color} h-1.5 rounded-full transition-all duration-300`}
                      style={{
                        width: `${getResourcePercentage(resource.amount)}%`,
                      }}
                    />
                  </div>

                  {/* Production info */}
                  {resource.production > 0 && (
                    <div className="flex items-center gap-1 text-micro text-muted-foreground">
                      <TrendingUp className="w-3 h-3" />
                      <span>+{formatNumber(resource.production)}/h</span>
                    </div>
                  )}

                  {/* Individual collect button for each resource */}
                  {resource.uncollected > 0 && onCollectResource && (
                    <Button
                      size="sm"
                      onClick={() => onCollectResource(resource.key as keyof UncollectedResources)}
                      disabled={collectableAmount === 0}
                      className="w-full h-8 text-micro"
                      variant={collectableAmount === 0 ? "secondary" : "default"}
                    >
                      <Package className="w-3 h-3 mr-1" />
                      {collectableAmount === 0
                        ? t("screens.resources.storage.full", "Lager voll")
                        : `+${formatNumber(collectableAmount)}`}
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Population & Storage - Compact Combined Card */}
      <div className="grid grid-cols-2 gap-3">
        <Card>
          <CardContent className="p-3">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-lg">👥</span>
              <span className="text-caption font-medium">
                {t("common.population", "Bevölkerung")}
              </span>
            </div>
            <div className="space-y-1.5">
              <div className="flex items-baseline justify-between">
                <span className="text-section font-medium">{formatNumber(resources.villager)}</span>
                <span className="text-micro text-muted-foreground">
                  /{formatNumber(resources.maxPopulation)}
                </span>
              </div>
              <div className="w-full bg-muted rounded-full h-1.5">
                <div
                  className="bg-primary h-1.5 rounded-full transition-all duration-300"
                  style={{
                    width: `${Math.min((resources.villager / resources.maxPopulation) * 100, 100)}%`,
                  }}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-3">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-lg">📦</span>
              <span className="text-caption font-medium">
                {t("screens.resources.storage.title", "Lager")}
              </span>
            </div>
            <div className="space-y-1.5">
              <div className="flex items-baseline justify-between">
                <span className="text-section font-medium">{formatNumber(storageCapacity)}</span>
                <span className="text-micro text-muted-foreground">
                  {t("screens.resources.storage.max", "Max")}
                </span>
              </div>
              <div className="text-micro text-muted-foreground">
                {t("screens.resources.storage.upgradeHint", "Ausbau über Lager-Gebäude")}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick collect all button if multiple resources available */}
      {hasUncollectedResources && onCollectResource && (
        <Card className="bg-success/5 border-success/20">
          <CardContent className="p-3">
            <Button onClick={() => onCollectResource()} className="w-full min-touch" size="sm">
              <Package className="w-4 h-4 mr-2" />
              {t("screens.resources.collectAll", "Alle sammeln")} (
              {Math.floor(getTotalUncollected())} {t("screens.resources.resources", "Ressourcen")})
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
