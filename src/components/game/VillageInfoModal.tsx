import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '../ui/dialog';
import { Button } from '../ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { Progress } from '../ui/progress';
import { Separator } from '../ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { Shield, Swords, Users, TrendingUp, MapPin, Clock, Star, Crown } from 'lucide-react';

interface VillageInfo {
  id: string;
  name: string;
  x: number;
  y: number;
  level: number;
  player: string | null;
  points: number;
  population: number;
  maxPopulation: number;
  buildings: {
    [key: string]: number;
  };
  army: {
    spearman: number;
    soldier: number;
    archer: number;
    knight: number;
    trebuchet: number;
  };
  wall: number;
  lastActivity: string;
  alliance?: string;
  playerRank?: number;
  defenseBonus: number;
}

interface VillageInfoModalProps {
  isOpen: boolean;
  onClose: () => void;
  villageInfo: VillageInfo | null;
  myVillageCoords: { x: number; y: number };
  onAttack?: (villageId: string) => void;
  onSpy?: (villageId: string) => void;
  onTrade?: (villageId: string) => void;
}

export function VillageInfoModal({
  isOpen,
  onClose,
  villageInfo,
  myVillageCoords,
  onAttack,
  onSpy,
  onTrade
}: VillageInfoModalProps) {
  if (!villageInfo) return null;

  const calculateDistance = (x1: number, y1: number, x2: number, y2: number) => {
    return Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));
  };

  const distance = Math.round(calculateDistance(
    myVillageCoords.x,
    myVillageCoords.y,
    villageInfo.x,
    villageInfo.y
  ));

  const formatNumber = (num: number) => {
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
    if (num >= 1000) return `${(num / 1000).toFixed(1)}k`;
    return num.toLocaleString();
  };

  const getTravelTime = (distance: number, unitType: string) => {
    const speeds: { [key: string]: number } = {
      'spearman': 18,
      'soldier': 22,
      'archer': 18,
      'knight': 10,
      'trebuchet': 30
    };
    const baseSpeed = speeds[unitType] || 20;
    const travelTimeMinutes = Math.round((distance * baseSpeed) / 60);
    
    if (travelTimeMinutes < 60) return `${travelTimeMinutes}min`;
    const hours = Math.floor(travelTimeMinutes / 60);
    const minutes = travelTimeMinutes % 60;
    return `${hours}h ${minutes}min`;
  };

  const getVillageStrength = () => {
    const armyStrength = villageInfo.army ? Object.values(villageInfo.army).reduce((sum, count) => sum + count, 0) : 0;
    if (armyStrength > 1000) return { level: 'Sehr stark', color: 'text-red-600', icon: '🔥' };
    if (armyStrength > 500) return { level: 'Stark', color: 'text-orange-500', icon: '⚡' };
    if (armyStrength > 100) return { level: 'Mittel', color: 'text-yellow-500', icon: '⚖️' };
    return { level: 'Schwach', color: 'text-green-500', icon: '🍃' };
  };

  const strength = getVillageStrength();
  const isBarbarianVillage = !villageInfo.player;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <MapPin className="h-5 w-5" />
            {villageInfo.name}
            <Badge variant={isBarbarianVillage ? "secondary" : "default"} className="ml-auto">
              {isBarbarianVillage ? 'Barbarendorf' : 'Spielerdorf'}
            </Badge>
          </DialogTitle>
          <DialogDescription>
            Detaillierte Informationen über dieses Dorf und mögliche Aktionen
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Basic Info */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-lg">
                <span className="text-2xl">
                  {isBarbarianVillage ? '🏴‍☠️' : villageInfo.level >= 20 ? '👑' : villageInfo.level >= 10 ? '🏰' : '🏘️'}
                </span>
                Dorfinfos
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div>
                  <span className="text-muted-foreground">Koordinaten:</span>
                  <div className="font-medium">({villageInfo.x}|{villageInfo.y})</div>
                </div>
                <div>
                  <span className="text-muted-foreground">Entfernung:</span>
                  <div className="font-medium">{distance} Felder</div>
                </div>
                <div>
                  <span className="text-muted-foreground">Punkte:</span>
                  <div className="font-medium">{formatNumber(villageInfo.points)}</div>
                </div>
                <div>
                  <span className="text-muted-foreground">Level:</span>
                  <div className="font-medium">Level {villageInfo.level}</div>
                </div>
              </div>

              {!isBarbarianVillage && (
                <>
                  <Separator />
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground text-sm">Spieler:</span>
                      <div className="flex items-center gap-2">
                        <span className="font-medium">{villageInfo.player}</span>
                        {villageInfo.playerRank && (
                          <Badge variant="outline" className="text-xs">
                            #{villageInfo.playerRank}
                          </Badge>
                        )}
                      </div>
                    </div>
                    
                    {villageInfo.alliance && (
                      <div className="flex items-center justify-between">
                        <span className="text-muted-foreground text-sm">Allianz:</span>
                        <span className="font-medium">{villageInfo.alliance}</span>
                      </div>
                    )}
                    
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground text-sm">Letzte Aktivität:</span>
                      <span className="font-medium text-sm">{villageInfo.lastActivity}</span>
                    </div>
                  </div>
                </>
              )}
            </CardContent>
          </Card>

          {/* Population & Defense */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-lg">
                <Users className="h-4 w-4" />
                Bevölkerung & Verteidigung
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span>Bevölkerung</span>
                  <span>{villageInfo.population}/{villageInfo.maxPopulation}</span>
                </div>
                <Progress value={(villageInfo.population / villageInfo.maxPopulation) * 100} />
              </div>

              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-muted-foreground">Wall Level:</span>
                  <div className="font-medium flex items-center gap-1">
                    <Shield className="h-3 w-3" />
                    Level {villageInfo.wall}
                  </div>
                </div>
                <div>
                  <span className="text-muted-foreground">Verteidigungsbonus:</span>
                  <div className="font-medium">+{villageInfo.defenseBonus}%</div>
                </div>
              </div>

              <div className="flex items-center justify-between p-2 bg-muted rounded-lg">
                <span className="text-sm">Geschätzte Stärke:</span>
                <div className="flex items-center gap-2">
                  <span className="text-lg">{strength.icon}</span>
                  <span className={`font-medium ${strength.color}`}>{strength.level}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Tabs für Details */}
          <Tabs defaultValue="army" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="army" className="text-xs">Armee</TabsTrigger>
              <TabsTrigger value="buildings" className="text-xs">Gebäude</TabsTrigger>
              <TabsTrigger value="travel" className="text-xs">Reisezeit</TabsTrigger>
            </TabsList>

            <TabsContent value="army" className="space-y-3">
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center gap-2 text-base">
                    <Swords className="h-4 w-4" />
                    Geschätzte Armee
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  {villageInfo.army ? Object.entries(villageInfo.army).map(([unitType, count]) => {
                    const unitNames: { [key: string]: { name: string; icon: string } } = {
                      spearman: { name: 'Speerträger', icon: '🛡️' },
                      swordsman: { name: 'Schwertkämpfer', icon: '⚔️' },
                      archer: { name: 'Bogenschütze', icon: '🏹' },
                      knight: { name: 'Schwere Kavallerie', icon: '🐎' },
                      trebuchet: { name: 'Trebuchet', icon: '🏗️' }
                    };
                    
                    const unit = unitNames[unitType] || { name: unitType, icon: '⚔️' };
                    
                    return (
                      <div key={unitType} className="flex items-center justify-between text-sm">
                        <div className="flex items-center gap-2">
                          <span>{unit.icon}</span>
                          <span>{unit.name}</span>
                        </div>
                        <Badge variant="outline">{count > 0 ? formatNumber(count) : '?'}</Badge>
                      </div>
                    );
                  }) : (
                    <div className="text-sm text-muted-foreground text-center py-4">
                      Keine Armeedaten verfügbar
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="buildings" className="space-y-3">
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center gap-2 text-base">
                    <TrendingUp className="h-4 w-4" />
                    Wichtige Gebäude
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  {villageInfo.buildings ? Object.entries(villageInfo.buildings)
                    .filter(([_, level]) => level > 0)
                    .slice(0, 6)
                    .map(([buildingType, level]) => {
                      const buildingNames: { [key: string]: { name: string; icon: string } } = {
                        townhall: { name: 'Rathaus', icon: '🏛️' },
                        barracks: { name: 'Kaserne', icon: '🏗️' },
                        wall: { name: 'Wall', icon: '🛡️' },
                        storage: { name: 'Speicher', icon: '🏪' },
                        market: { name: 'Marktplatz', icon: '🏛️' },
                        farm: { name: 'Bauernhof', icon: '🌾' }
                      };
                      
                      const building = buildingNames[buildingType] || { name: buildingType, icon: '🏢' };
                      
                      return (
                        <div key={buildingType} className="flex items-center justify-between text-sm">
                          <div className="flex items-center gap-2">
                            <span>{building.icon}</span>
                            <span>{building.name}</span>
                          </div>
                          <Badge variant="secondary">Level {level}</Badge>
                        </div>
                      );
                    }) : (
                    <div className="text-sm text-muted-foreground text-center py-4">
                      Keine Gebäudedaten verfügbar
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="travel" className="space-y-3">
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center gap-2 text-base">
                    <Clock className="h-4 w-4" />
                    Reisezeiten ({distance} Felder)
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  {[
                    { type: 'spearman', name: 'Speerträger', icon: '🛡️' },
                    { type: 'soldier', name: 'Schwertkämpfer', icon: '⚔️' },
                    { type: 'archer', name: 'Bogenschütze', icon: '🏹' },
                    { type: 'knight', name: 'Schwere Kavallerie', icon: '🐎' }
                  ].map((unit) => (
                    <div key={unit.type} className="flex items-center justify-between text-sm">
                      <div className="flex items-center gap-2">
                        <span>{unit.icon}</span>
                        <span>{unit.name}</span>
                      </div>
                      <Badge variant="outline">{getTravelTime(distance, unit.type)}</Badge>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>

          {/* Action Buttons */}
          <div className="flex flex-col gap-2 pt-2">
            <div className="grid grid-cols-2 gap-2">
              <Button
                variant="destructive"
                onClick={() => onAttack?.(villageInfo.id)}
                className="flex items-center gap-2"
              >
                <Swords className="h-4 w-4" />
                Angreifen
              </Button>
              <Button
                variant="outline"
                onClick={() => onSpy?.(villageInfo.id)}
                className="flex items-center gap-2"
              >
                👁️ Ausspähen
              </Button>
            </div>
            
            {!isBarbarianVillage && (
              <Button
                variant="outline"
                onClick={() => onTrade?.(villageInfo.id)}
                className="flex items-center gap-2"
              >
                🤝 Handeln
              </Button>
            )}
            
            <Button variant="secondary" onClick={onClose} className="mt-2">
              Schließen
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}