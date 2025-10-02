import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useGameStore } from '@/stores/gameStore';

export default function VillagePage() {
  const { 
    village, 
    selectedBuilding, 
    isLoading, 
    error,
    setSelectedBuilding, 
    upgradeBuilding,
    collectResources 
  } = useGameStore();

  if (error) {
    return (
      <div className="p-4">
        <Card>
          <CardContent className="p-4">
            <div className="text-red-600">Fehler: {error}</div>
            <Button 
              onClick={() => useGameStore.getState().setError(null)}
              className="mt-2"
            >
              Fehler schließen
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const getBuildingName = (buildingId: string) => {
    const names: Record<string, string> = {
      headquarters: 'Hauptgebäude',
      barracks: 'Kaserne',
      timberCamp: 'Holzfäller',
      clayPit: 'Lehmgrube',
      ironMine: 'Eisenmine',
      storage: 'Speicher'
    };
    return names[buildingId] || buildingId;
  };

  const getBuildingIcon = (buildingId: string) => {
    const icons: Record<string, string> = {
      headquarters: '🏛️',
      barracks: '⚔️',
      timberCamp: '🌲',
      clayPit: '🏺',
      ironMine: '⛏️',
      storage: '📦'
    };
    return icons[buildingId] || '🏠';
  };

  const handleBuildingClick = (buildingId: string) => {
    setSelectedBuilding(selectedBuilding === buildingId ? null : buildingId);
  };

  const handleUpgrade = async (buildingId: string) => {
    await upgradeBuilding(buildingId);
  };

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    
    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }
    return `${minutes}:${secs.toString().padStart(2, '0')}`;
  };

  const getActiveUpgrades = () => {
    return Object.entries(village.buildings)
      .filter(([_, building]) => building.upgrading)
      .map(([buildingId, building]) => ({ buildingId, building }));
  };

  const activeUpgrades = getActiveUpgrades();

  return (
    <div className="flex flex-col h-full space-y-4 p-4">
      {/* Village Header */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="flex items-center gap-2">
            🏘️ {village.name}
            <span className="text-sm text-muted-foreground ml-auto">
              Stufe {Math.max(...Object.values(village.buildings).map(b => b.level))}
            </span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div className="flex items-center gap-2">
              🌲 Holz: {village.resources.wood?.toLocaleString() || 0}
            </div>
            <div className="flex items-center gap-2">
              🏺 Lehm: {village.resources.clay?.toLocaleString() || 0}
            </div>
            <div className="flex items-center gap-2">
              ⛏️ Eisen: {village.resources.iron?.toLocaleString() || 0}
            </div>
            <div className="flex items-center gap-2">
              👥 Bevölkerung: {village.resources.population?.toLocaleString() || 0}
            </div>
          </div>
          <div className="mt-3">
            <Button 
              onClick={collectResources}
              size="sm"
              className="w-full"
            >
              Ressourcen sammeln
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Active Upgrades */}
      {activeUpgrades.length > 0 && (
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base">🚧 Aktive Bauarbeiten</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {activeUpgrades.map(({ buildingId, building }) => {
              const timeRemaining = Math.max(0, Math.floor((building.upgrading!.completionTime - Date.now()) / 1000));
              
              return (
                <div key={buildingId} className="flex items-center justify-between p-2 bg-muted rounded-lg">
                  <div className="flex-1">
                    <div className="font-medium text-sm">
                      {getBuildingName(buildingId)}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      Stufe {building.level} → {building.upgrading!.targetLevel}
                    </div>
                  </div>
                  <div className="text-xs text-muted-foreground ml-2">
                    {formatTime(timeRemaining)}
                  </div>
                </div>
              );
            })}
          </CardContent>
        </Card>
      )}

      {/* Buildings Grid */}
      <Card className="flex-1">
        <CardHeader className="pb-2">
          <CardTitle className="text-base">Gebäude</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-3">
            {Object.entries(village.buildings).map(([buildingId, building]) => (
              <div
                key={buildingId}
                className={`p-3 border rounded-lg cursor-pointer transition-colors ${
                  selectedBuilding === buildingId 
                    ? 'border-primary bg-primary/5' 
                    : 'border-border hover:border-primary/50'
                }`}
                onClick={() => handleBuildingClick(buildingId)}
              >
                <div className="text-center">
                  <div className="text-2xl mb-1">{getBuildingIcon(buildingId)}</div>
                  <div className="font-medium text-sm">{getBuildingName(buildingId)}</div>
                  <div className="text-xs text-muted-foreground">Stufe {building.level}</div>
                  {building.upgrading && (
                    <div className="text-xs text-blue-600 mt-1">Wird ausgebaut...</div>
                  )}
                </div>
              </div>
            ))}
          </div>

          {selectedBuilding && (
            <div className="mt-4 p-4 border rounded-lg bg-muted/50">
              <h3 className="font-medium mb-2">
                {getBuildingIcon(selectedBuilding)} {getBuildingName(selectedBuilding)}
              </h3>
              <p className="text-sm text-muted-foreground mb-3">
                Aktuelle Stufe: {village.buildings[selectedBuilding].level}
              </p>
              <div className="flex gap-2">
                <Button 
                  size="sm" 
                  onClick={() => handleUpgrade(selectedBuilding)}
                  disabled={!!village.buildings[selectedBuilding].upgrading || isLoading}
                >
                  {village.buildings[selectedBuilding].upgrading ? 'Wird ausgebaut...' : 
                   isLoading ? 'Lädt...' : 'Ausbauen'}
                </Button>
                <Button 
                  size="sm" 
                  variant="outline"
                  onClick={() => setSelectedBuilding(null)}
                >
                  Schließen
                </Button>
              </div>
            </div>
          )}
          
          <div className="mt-4 text-center text-sm text-muted-foreground">
            Tippe auf ein Gebäude für Details und Upgrades
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
