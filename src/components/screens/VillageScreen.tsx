import { useState } from 'react';
import { Village, Building } from '../../types/game';
import { VillageGrid } from '../VillageGrid';
import { BuildingModal } from '../BuildingModal';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/Card';

interface VillageScreenProps {
  village: Village;
  selectedBuilding: string | null;
  onBuildingSelect: (buildingId: string) => void;
  onUpgradeBuilding: (buildingId: string) => void;
}

export function VillageScreen({ 
  village, 
  selectedBuilding, 
  onBuildingSelect, 
  onUpgradeBuilding 
}: VillageScreenProps) {
  const [selectedBuildingForModal, setSelectedBuildingForModal] = useState<Building | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleBuildingClick = (buildingId: string) => {
    const building = village.buildings[buildingId];
    if (building) {
      setSelectedBuildingForModal({ ...building, type: buildingId });
      setIsModalOpen(true);
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedBuildingForModal(null);
  };

  const handleUpgradeFromModal = (buildingType: string) => {
    onUpgradeBuilding(buildingType);
    handleCloseModal();
  };
  const getActiveUpgrades = () => {
    return Object.entries(village.buildings)
      .filter(([_, building]) => building.upgrading)
      .map(([buildingId, building]) => ({ buildingId, building }));
  };

  const activeUpgrades = getActiveUpgrades();

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
    <div className="flex flex-col h-full">
      {/* Village Header */}
      <Card className="mb-4">
        <CardHeader className="pb-2">
          <CardTitle className="flex items-center gap-2">
            🏘️ {village.name}
            <span className="text-sm text-muted-foreground ml-auto">
              Stufe {Math.max(...Object.values(village.buildings).map(b => b.level))}
            </span>
          </CardTitle>
        </CardHeader>
      </Card>

      {/* Active Upgrades */}
      {activeUpgrades.length > 0 && (
        <Card className="mb-4">
          <CardHeader className="pb-2">
            <CardTitle className="text-base">🚧 Aktive Bauarbeiten</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {activeUpgrades.map(({ buildingId, building }) => {
              const timeRemaining = getTimeRemaining(building.upgrading!.completionTime);
              const progress = Math.max(0, Math.min(100, 
                (1 - timeRemaining / 
                ((building.upgrading!.completionTime - Date.now() + timeRemaining * 1000) / 1000)) * 100
              ));
              
              return (
                <div key={buildingId} className="flex items-center justify-between p-2 bg-muted rounded-lg">
                  <div className="flex-1">
                    <div className="font-medium text-sm">
                      {buildingId === 'headquarters' ? 'Hauptgebäude' :
                       buildingId === 'barracks' ? 'Kaserne' :
                       buildingId === 'timberCamp' ? 'Holzfäller' :
                       buildingId === 'clayPit' ? 'Lehmgrube' :
                       buildingId === 'ironMine' ? 'Eisenmine' :
                       buildingId}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      Stufe {building.level} → {building.upgrading!.targetLevel}
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-1.5 mt-1">
                      <div 
                        className="bg-blue-600 h-1.5 rounded-full transition-all"
                        style={{ width: `${progress}%` }}
                      />
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

      {/* Village Grid */}
      <Card className="flex-1">
        <CardHeader className="pb-2">
          <CardTitle className="text-base">Gebäude</CardTitle>
        </CardHeader>
        <CardContent>
          <VillageGrid
            buildings={village.buildings}
            selectedBuilding={selectedBuilding}
            onBuildingSelect={handleBuildingClick}
            onUpgradeBuilding={onUpgradeBuilding}
          />
          
          <div className="mt-4 text-center text-sm text-muted-foreground">
            Tippe auf ein Gebäude für Details und Upgrades
          </div>
        </CardContent>
      </Card>

      {/* Building Modal */}
      <BuildingModal
        building={selectedBuildingForModal}
        resources={village.resources}
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onUpgrade={handleUpgradeFromModal}
      />
    </div>
  );
}
