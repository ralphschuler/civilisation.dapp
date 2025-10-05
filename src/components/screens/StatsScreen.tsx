import { PlayerStats, Village, Resources } from '../../types/game';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/Card';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';
import { Separator } from '../ui/Separator';
import { ArrowLeft } from 'lucide-react';
import { useI18n } from '@/providers/i18n-provider';
import { useNavigate } from 'react-router-dom';
import { calculateResourceProduction, getResourceIcon } from '../../data/gameData';

interface StatsScreenProps {
  village: Village;
  resources: Resources;
  playerStats: PlayerStats;
}

export function StatsScreen({ village, resources, playerStats }: StatsScreenProps) {
  const navigate = useNavigate();
  const { t } = useI18n();
  const formatNumber = (num: number) => {
    if (num >= 1000000) {
      return `${(num / 1000000).toFixed(1)}M`;
    }
    if (num >= 1000) {
      return `${(num / 1000).toFixed(1)}k`;
    }
    return Math.floor(num).toLocaleString();
  };

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const days = Math.floor(hours / 24);
    const remainingHours = hours % 24;
    
    if (days > 0) {
      return `${days}d ${remainingHours}h`;
    }
    if (hours > 0) {
      return `${hours}h ${Math.floor((seconds % 3600) / 60)}m`;
    }
    return `${Math.floor(seconds / 60)}m`;
  };

  const getTotalArmySize = () => {
    return Object.values(village.army).reduce((sum, count) => sum + count, 0);
  };

  const getTotalBuildingLevels = () => {
    return Object.values(village.buildings).reduce((sum, building) => sum + building.level, 0);
  };

  const getCurrentResourceProduction = () => {
    return calculateResourceProduction(village.buildings);
  };

  const production = getCurrentResourceProduction();
  const totalArmy = getTotalArmySize();
  const totalBuildingLevels = getTotalBuildingLevels();

  const resourceNames: { [key: string]: string } = {
    bread: 'Brot',
    clay: 'Lehm',
    coal: 'Kohle',
    gold: 'Gold',
    iron: 'Eisen',
    meat: 'Fleisch',
    villager: 'Dorfbewohner',
    wheat: 'Weizen',
    wood: 'Holz'
  };

  return (
    <div className="space-y-6">
      {/* Header with Back Button */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate('/more')}
              className="mr-2 h-auto p-1"
            >
              <ArrowLeft className="h-4 w-4" />
            </Button>
            {t('screens.stats.title', 'Spielerstatistiken')}
          </CardTitle>
        </CardHeader>
      </Card>

      {/* General Stats */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <span>📊</span>
            {t('screens.stats.general.title', 'Allgemeine Statistiken')}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            <div className="text-center p-4 bg-gradient-to-r from-blue-50 to-blue-100 dark:from-blue-950/20 dark:to-blue-900/20 rounded-lg">
              <div className="text-3xl font-bold text-blue-600 dark:text-blue-400">{totalBuildingLevels}</div>
              <div className="text-sm text-blue-700 dark:text-blue-300">{t('screens.stats.general.totalBuildingLevels', 'Gesamt-Gebäudestufen')}</div>
            </div>
            <div className="text-center p-4 bg-gradient-to-r from-green-50 to-green-100 dark:from-green-950/20 dark:to-green-900/20 rounded-lg">
              <div className="text-3xl font-bold text-green-600 dark:text-green-400">{totalArmy}</div>
              <div className="text-sm text-green-700 dark:text-green-300">{t('screens.stats.general.armyUnits', 'Armeeeinheiten')}</div>
            </div>
          </div>
          
          <Separator className="my-4" />
          
          <div className="grid grid-cols-2 gap-4">
            <div className="text-center p-4 bg-gradient-to-r from-purple-50 to-purple-100 dark:from-purple-950/20 dark:to-purple-900/20 rounded-lg">
              <div className="text-3xl font-bold text-purple-600 dark:text-purple-400">{playerStats.battlesWon}</div>
              <div className="text-sm text-purple-700 dark:text-purple-300">{t('screens.stats.general.battlesWon', 'Gewonnene Kämpfe')}</div>
            </div>
            <div className="text-center p-4 bg-gradient-to-r from-orange-50 to-orange-100 dark:from-orange-950/20 dark:to-orange-900/20 rounded-lg">
              <div className="text-3xl font-bold text-orange-600 dark:text-orange-400">{formatTime(playerStats.playtime)}</div>
              <div className="text-sm text-orange-700 dark:text-orange-300">{t('screens.stats.general.playtime', 'Spielzeit')}</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Current Resources */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <span>💰</span>
            {t('screens.stats.currentResources.title', 'Aktuelle Ressourcen')}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-3">
            {Object.entries(resources).map(([resource, amount]) => {
              if (resource === 'maxPopulation') return null;
              return (
                <div key={resource} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                  <div className="flex items-center gap-2">
                    <span className="text-lg">{getResourceIcon(resource)}</span>
                    <span className="text-sm font-medium">{resourceNames[resource]}</span>
                  </div>
                  <Badge variant="secondary">{formatNumber(amount)}</Badge>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Production Stats */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <span>🏭</span>
            {t('screens.stats.production.title', 'Produktion pro Stunde')}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-3">
            {Object.entries(production).map(([resource, amount]) => (
              <div key={resource} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                <div className="flex items-center gap-2">
                  <span className="text-lg">{getResourceIcon(resource)}</span>
                  <span className="text-sm font-medium">{resourceNames[resource]}</span>
                </div>
                <Badge variant="outline" className="text-green-600 border-green-600 dark:text-green-400 dark:border-green-400">
                  +{formatNumber(amount)}
                </Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Lifetime Stats */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <span>🏆</span>
            {t('screens.stats.total.title', 'Gesamtstatistiken')}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="text-center p-4 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-950/20 dark:to-purple-950/20 rounded-lg">
            <div className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              {formatNumber(
                Object.values(playerStats.totalResourcesGathered).reduce((sum, val) => sum + val, 0)
              )}
            </div>
            <div className="text-sm text-muted-foreground">{t('screens.stats.total.totalResources', 'Gesamte Ressourcen gesammelt')}</div>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="text-center p-3 bg-muted/50 rounded-lg">
              <div className="text-xl font-bold">{playerStats.totalUnitsTrained}</div>
              <div className="text-xs text-muted-foreground">{t('screens.stats.total.unitsTrained', 'Einheiten ausgebildet')}</div>
            </div>
            <div className="text-center p-3 bg-muted/50 rounded-lg">
              <div className="text-xl font-bold">{playerStats.totalBuildingsUpgraded}</div>
              <div className="text-xs text-muted-foreground">{t('screens.stats.total.buildingsUpgraded', 'Gebäude ausgebaut')}</div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="text-center p-3 bg-green-50 dark:bg-green-950/20 rounded-lg">
              <div className="text-xl font-bold text-green-700 dark:text-green-400">{playerStats.battlesWon}</div>
              <div className="text-xs text-green-600 dark:text-green-300">{t('screens.stats.total.victories', 'Siege')}</div>
            </div>
            <div className="text-center p-3 bg-red-50 dark:bg-red-950/20 rounded-lg">
              <div className="text-xl font-bold text-red-700 dark:text-red-400">{playerStats.battlesLost}</div>
              <div className="text-xs text-red-600 dark:text-red-300">{t('screens.stats.total.defeats', 'Niederlagen')}</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Detailed Resource Collection */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <span>📈</span>
            {t('screens.stats.collected.title', 'Gesammelte Ressourcen (Gesamt)')}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {Object.entries(playerStats.totalResourcesGathered).map(([resource, amount]) => (
              <div key={resource} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                <div className="flex items-center gap-2">
                  <span className="text-lg">{getResourceIcon(resource)}</span>
                  <span className="text-sm font-medium">{resourceNames[resource]}</span>
                </div>
                <Badge variant="outline">{formatNumber(amount)}</Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
