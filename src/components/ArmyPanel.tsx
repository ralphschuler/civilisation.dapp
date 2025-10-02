import { Army, Building, Resources } from '../types/game';
import { UNIT_TYPES, getUnitIcon, getResourceIcon } from '../data/gameData';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Input } from './ui/input';
import { Badge } from './ui/badge';
import { Separator } from './ui/separator';
import { useState } from 'react';

interface ArmyPanelProps {
  army: Army;
  buildings: { [key: string]: Building };
  resources: Resources;
  onTrainUnit: (unitId: string, quantity: number) => void;
}

export function ArmyPanel({ army, buildings, resources, onTrainUnit }: ArmyPanelProps) {
  const [trainQuantities, setTrainQuantities] = useState<{ [unitId: string]: number }>({});

  const getTrainQuantity = (unitId: string) => trainQuantities[unitId] || 1;
  const setTrainQuantity = (unitId: string, quantity: number) => {
    setTrainQuantities(prev => ({
      ...prev,
      [unitId]: Math.max(1, quantity)
    }));
  };

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    
    if (hours > 0) {
      return `${hours}h ${minutes}m`;
    }
    return `${minutes}m`;
  };

  const canTrainUnit = (unitId: string, quantity: number) => {
    const unit = UNIT_TYPES[unitId as keyof typeof UNIT_TYPES];
    const requiredBuilding = buildings[unit.buildingRequired];
    
    if (!requiredBuilding || requiredBuilding.level < unit.buildingLevelRequired) {
      return false;
    }

    // Check all resource costs
    for (const [resource, cost] of Object.entries(unit.cost)) {
      const totalCost = cost * quantity;
      if ((resources as any)[resource] < totalCost) {
        return false;
      }
    }

    // Check population
    const populationCost = unit.populationCost * quantity;
    return (resources.villager + populationCost) <= resources.maxPopulation;
  };

  const getAvailableUnits = () => {
    return Object.values(UNIT_TYPES).filter(unit => {
      const requiredBuilding = buildings[unit.buildingRequired];
      return requiredBuilding && requiredBuilding.level >= unit.buildingLevelRequired;
    });
  };

  const totalArmySize = Object.values(army).reduce((sum, count) => sum + count, 0);
  const barracksLevel = buildings.barracks?.level || 0;

  return (
    <div className="space-y-6">
      {/* Army Overview */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <span>⚔️</span>
            Armeeübersicht
          </CardTitle>
          <CardDescription>
            Gesamte Armee: {totalArmySize.toLocaleString()} Einheiten
          </CardDescription>
        </CardHeader>
        <CardContent>
          {totalArmySize > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {Object.entries(army).map(([unitId, count]) => {
                if (count === 0) return null;
                const unit = UNIT_TYPES[unitId as keyof typeof UNIT_TYPES];
                return (
                  <div key={unitId} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">{getUnitIcon(unitId)}</span>
                      <div>
                        <div className="font-medium">{unit.name}</div>
                        <div className="text-sm text-muted-foreground">
                          Angriff: {unit.attack} | Verteidigung: {unit.defense}
                        </div>
                      </div>
                    </div>
                    <Badge variant="secondary" className="text-lg">
                      {count.toLocaleString()}
                    </Badge>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-8">
              <span className="text-4xl mb-2 block">🏚️</span>
              <p className="text-muted-foreground">
                Noch keine Einheiten trainiert
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Training */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <span>🏰</span>
            Einheiten ausbilden
          </CardTitle>
          <CardDescription>
            Kaserne Level {barracksLevel} 
            {barracksLevel === 0 && " - Muss erst gebaut werden"}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {barracksLevel > 0 ? (
            <div className="space-y-4">
              {getAvailableUnits().map(unit => {
                const quantity = getTrainQuantity(unit.id);
                const canTrain = canTrainUnit(unit.id, quantity);
                
                return (
                  <Card key={unit.id} className="border-2">
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-center gap-3">
                          <span className="text-3xl">{getUnitIcon(unit.id)}</span>
                          <div>
                            <h4 className="font-medium text-lg">{unit.name}</h4>
                            <div className="flex gap-4 text-sm text-muted-foreground">
                              <span>⚔️ {unit.attack}</span>
                              <span>🛡️ {unit.defense}</span>
                              <span>💨 {unit.speed}</span>
                              <span>📦 {unit.carryCapacity}</span>
                            </div>
                          </div>
                        </div>
                        <Badge variant="outline">
                          👥 {unit.populationCost}
                        </Badge>
                      </div>
                      
                      <Separator className="my-4" />
                      
                      {/* Resource Costs */}
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
                        {Object.entries(unit.cost).map(([resource, cost]) => {
                          const totalCost = cost * quantity;
                          const hasEnough = (resources as any)[resource] >= totalCost;
                          return (
                            <div key={resource} className={`flex items-center justify-between p-2 rounded-lg border ${hasEnough ? 'bg-green-50 border-green-200 dark:bg-green-950/20' : 'bg-red-50 border-red-200 dark:bg-red-950/20'}`}>
                              <div className="flex items-center gap-1">
                                <span>{getResourceIcon(resource)}</span>
                                <span className="text-sm font-medium">{totalCost}</span>
                              </div>
                              <span className={`text-xs ${hasEnough ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                                {(resources as any)[resource]}
                              </span>
                            </div>
                          );
                        })}
                      </div>

                      <div className="flex items-center justify-between mb-4">
                        <div className="text-sm text-muted-foreground">
                          Ausbildungszeit: {formatTime(unit.trainTime * quantity)}
                        </div>
                        <Badge variant="outline">
                          Level {unit.buildingLevelRequired}+ benötigt
                        </Badge>
                      </div>

                      <div className="flex gap-3">
                        <Input
                          type="number"
                          min="1"
                          max="100"
                          value={quantity}
                          onChange={(e) => setTrainQuantity(unit.id, parseInt(e.target.value) || 1)}
                          className="w-24"
                        />
                        <Button
                          disabled={!canTrain}
                          onClick={() => onTrainUnit(unit.id, quantity)}
                          className="flex-1"
                        >
                          {canTrain ? 'Ausbilden' : 'Nicht verfügbar'}
                        </Button>
                      </div>
                      
                      {!canTrain && (
                        <p className="text-xs text-red-500 mt-2">
                          {buildings[unit.buildingRequired]?.level < unit.buildingLevelRequired 
                            ? `Kaserne Level ${unit.buildingLevelRequired} benötigt`
                            : 'Nicht genügend Ressourcen oder Bevölkerung'
                          }
                        </p>
                      )}
                    </CardContent>
                  </Card>
                );
              })}
              
              {getAvailableUnits().length === 0 && (
                <div className="text-center py-8">
                  <span className="text-4xl mb-2 block">🚧</span>
                  <p className="text-muted-foreground">
                    Kaserne Level {barracksLevel} - Keine Einheiten verfügbar
                  </p>
                </div>
              )}
            </div>
          ) : (
            <div className="text-center py-12">
              <span className="text-4xl mb-4 block">🏗️</span>
              <p className="text-muted-foreground text-lg mb-2">
                Kaserne muss erst gebaut werden
              </p>
              <p className="text-sm text-muted-foreground">
                Baue eine Kaserne im Dorf-Screen, um Einheiten zu trainieren
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}