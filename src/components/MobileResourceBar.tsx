import { Resources, UncollectedResources } from '../types/game';
import { calculateResourceProduction } from '../data/gameData';
import { Button } from './ui/Button';
import { Badge } from './ui/Badge';
import { Package } from 'lucide-react';
import { useI18n } from '@/providers/i18n-provider';

interface MobileResourceBarProps {
  resources: Resources;
  uncollectedResources: UncollectedResources;
  buildingLevels: {
    [key: string]: { level: number };
  };
  storageCapacity: number;
  onCollectResources?: () => void;
}

export function MobileResourceBar({ 
  resources, 
  uncollectedResources,
  buildingLevels,
  storageCapacity,
  onCollectResources
}: MobileResourceBarProps) {
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

  const resourceData = [
    {
      key: 'wood',
      icon: '🪵',
      amount: resources.wood,
      uncollected: uncollectedResources.wood,
      production: totalProduction.wood || 0,
      color: 'bg-amber-600'
    },
    {
      key: 'clay',
      icon: '🧱',
      amount: resources.clay,
      uncollected: uncollectedResources.clay,
      production: totalProduction.clay || 0,
      color: 'bg-orange-700'
    },
    {
      key: 'iron',
      icon: '⚔️',
      amount: resources.iron,
      uncollected: uncollectedResources.iron,
      production: totalProduction.iron || 0,
      color: 'bg-gray-600'
    },
    {
      key: 'coal',
      icon: '⚫',
      amount: resources.coal,
      uncollected: uncollectedResources.coal,
      production: totalProduction.coal || 0,
      color: 'bg-slate-800'
    },
    {
      key: 'wheat',
      icon: '🌾',
      amount: resources.wheat,
      uncollected: uncollectedResources.wheat,
      production: totalProduction.wheat || 0,
      color: 'bg-yellow-600'
    },
    {
      key: 'bread',
      icon: '🍞',
      amount: resources.bread,
      uncollected: uncollectedResources.bread,
      production: totalProduction.bread || 0,
      color: 'bg-yellow-500'
    },
    {
      key: 'meat',
      icon: '🥩',
      amount: resources.meat,
      uncollected: uncollectedResources.meat,
      production: totalProduction.meat || 0,
      color: 'bg-red-600'
    },
    {
      key: 'gold',
      icon: '🪙',
      amount: resources.gold,
      uncollected: uncollectedResources.gold,
      production: totalProduction.gold || 0,
      color: 'bg-yellow-500'
    }
  ];

  // Split resources into two rows for better visibility and center alignment
  const firstRowResources = resourceData.slice(0, 4); // Wood, Clay, Iron, Coal
  const secondRowResources = resourceData.slice(4, 7); // Wheat, Bread, Meat, Gold

  return (
    <div className="bg-card rounded-lg border shadow-sm px-4 py-3">
      {/* Resources Display - Two Rows, Centered */}
      <div className="flex flex-col items-center gap-2">
        {/* First Row: Basic Resources */}
        <div className="flex items-center gap-4">
          {firstRowResources.map((resource) => (
            <div key={resource.key} className="flex items-center gap-1 min-w-0 flex-shrink-0">
              <span className="text-base">{resource.icon}</span>
              <span className="text-caption font-medium">
                {formatNumber(resource.amount)}
              </span>
              {resource.uncollected > 0 && (
                <div className="w-1.5 h-1.5 bg-success rounded-full animate-pulse" />
              )}
            </div>
          ))}
        </div>
        
        {/* Second Row: Processed Resources + Gold */}
        <div className="flex items-center gap-4">
          {secondRowResources.map((resource) => (
            <div key={resource.key} className="flex items-center gap-1 min-w-0 flex-shrink-0">
              <span className="text-base">{resource.icon}</span>
              <span className="text-caption font-medium">
                {formatNumber(resource.amount)}
              </span>
              {resource.uncollected > 0 && (
                <div className="w-1.5 h-1.5 bg-success rounded-full animate-pulse" />
              )}
            </div>
          ))}
          {/* Population inline with second row */}
          <div className="flex items-center gap-1 min-w-0 flex-shrink-0">
            <span className="text-base">👥</span>
            <span className="text-caption font-medium">
              {formatNumber(resources.villager)}/{formatNumber(resources.maxPopulation)}
            </span>
          </div>
        </div>
      </div>

      {/* Collect Resources Button - Below resources, centered */}
      {hasUncollectedResources && onCollectResources && (
        <div className="mt-3 flex justify-center">
          <Button 
            size="sm" 
            onClick={onCollectResources}
            className="min-touch px-4 text-caption animate-pulse"
          >
            <Package className="h-4 w-4 mr-2" />
            {t('resources.collect', 'Collect resources')}
            <Badge variant="destructive" className="ml-2 text-micro">
              {Math.floor(getTotalUncollected())}
            </Badge>
          </Button>
        </div>
      )}
    </div>
  );
}
