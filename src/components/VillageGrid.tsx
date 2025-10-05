import { Building } from '../types/game';
import { BUILDING_TYPES, getBuildingIcon } from '../data/gameData';
import { Button } from './ui/Button';
import { Card } from './ui/Card';
import { Badge } from './ui/Badge';
import { Progress } from './ui/Progress';

interface VillageGridProps {
  buildings: { [key: string]: Building };
  selectedBuilding: string | null;
  onBuildingSelect: (buildingId: string) => void;
  onUpgradeBuilding: (buildingId: string) => void;
}

const BUILDING_GRID_LAYOUT = [
  ['townhall', 'barracks', 'storage'],
  ['woodcutter', 'claypit', 'ironmine'],
  ['farm', 'bakery', 'huntershut'],
  ['house', 'market', 'wall'],
  ['coalpit', 'fisher', null]
];

export function VillageGrid({ 
  buildings, 
  selectedBuilding, 
  onBuildingSelect, 
  onUpgradeBuilding 
}: VillageGridProps) {
  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    
    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }
    return `${minutes}:${secs.toString().padStart(2, '0')}`;
  };

  const getTimeRemaining = (completionTime: number) => {
    const remaining = Math.max(0, Math.floor((completionTime - Date.now()) / 1000));
    return remaining;
  };

  return (
    <div className="grid grid-cols-3 gap-4 max-w-2xl mx-auto">
      {BUILDING_GRID_LAYOUT.map((row, rowIndex) =>
        row.map((buildingId, colIndex) => {
          if (!buildingId) {
            return (
              <div
                key={`${rowIndex}-${colIndex}`}
                className="aspect-square bg-muted/30 border-2 border-dashed border-muted rounded-xl"
              />
            );
          }

          const building = buildings[buildingId];
          const buildingType = BUILDING_TYPES[buildingId as keyof typeof BUILDING_TYPES];
          
          // Skip building if type definition is not found
          if (!buildingType) {
            return (
              <div
                key={`${rowIndex}-${colIndex}-unknown`}
                className="aspect-square bg-muted/30 border-2 border-dashed border-muted rounded-xl flex items-center justify-center"
              >
                <span className="text-micro text-muted-foreground">Unknown</span>
              </div>
            );
          }
          
          const isSelected = selectedBuilding === buildingId;
          const isUpgrading = building?.upgrading;
          const buildingLevel = building?.level || 0;

          return (
            <Card
              key={buildingId}
              className={`aspect-square p-3 cursor-pointer transition-all duration-200 hover:shadow-md hover:scale-105 rounded-xl min-touch ${
                isSelected ? 'ring-2 ring-primary shadow-lg' : ''
              } ${buildingLevel === 0 ? 'opacity-60 bg-muted/20' : 'bg-card'}`}
              onClick={() => onBuildingSelect(buildingId)}
            >
              <div className="h-full flex flex-col items-center justify-between">
                <div className="text-center flex-1 flex flex-col justify-center">
                  <div className="text-3xl mb-2">
                    {getBuildingIcon(buildingId as keyof typeof BUILDING_TYPES)}
                  </div>
                  <h3 className="text-micro font-medium truncate leading-tight">
                    {buildingType.name}
                  </h3>
                  <Badge 
                    variant={buildingLevel === 0 ? "outline" : "secondary"} 
                    className="text-micro mt-1"
                  >
                    Level {buildingLevel}
                  </Badge>
                </div>

                {isUpgrading && (
                  <div className="w-full mt-2">
                    <div className="text-micro text-center text-info mb-1">
                      → Level {building.upgrading!.targetLevel}
                    </div>
                    <div className="text-micro text-center text-muted-foreground mb-2">
                      {formatTime(getTimeRemaining(building.upgrading!.completionTime))}
                    </div>
                    <Progress 
                      value={Math.max(0, Math.min(100, 
                        (1 - getTimeRemaining(building.upgrading!.completionTime) / 
                        ((building.upgrading!.completionTime - Date.now() + getTimeRemaining(building.upgrading!.completionTime) * 1000) / 1000)) * 100
                      ))}
                      className="h-2"
                    />
                  </div>
                )}

                {!isUpgrading && buildingLevel === 0 && (
                  <Button
                    size="sm"
                    className="text-micro px-3 py-1 min-touch mt-2 w-full"
                    onClick={(e) => {
                      e.stopPropagation();
                      onUpgradeBuilding(buildingId);
                    }}
                  >
                    Bauen
                  </Button>
                )}
              </div>
            </Card>
          );
        })
      )}
    </div>
  );
}
