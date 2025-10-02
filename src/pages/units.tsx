import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useGameStore } from '@/stores/gameStore';

export default function UnitsPage() {
  const { 
    village, 
    error
  } = useGameStore();

  if (error) {
    return (
      <div className="p-4">
        <Card>
          <CardContent className="p-4">
            <div className="text-red-600">Fehler: {error}</div>
          </CardContent>
        </Card>
      </div>
    );
  }

  const getUnitName = (unitType: string) => {
    const names: Record<string, string> = {
      spearman: 'Speerträger',
      swordsman: 'Schwertkämpfer',
      archer: 'Bogenschütze',
      cavalry: 'Kavallerie'
    };
    return names[unitType] || unitType;
  };

  const getUnitIcon = (unitType: string) => {
    const icons: Record<string, string> = {
      spearman: '🛡️',
      swordsman: '⚔️',
      archer: '🏹',
      cavalry: '🐎'
    };
    return icons[unitType] || '⚔️';
  };

  const unitTypes = ['spearman', 'swordsman', 'archer', 'cavalry'];

  return (
    <div className="flex flex-col h-full space-y-4 p-4">
      <Card>
        <CardHeader>
          <CardTitle>⚔️ Meine Armee</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            {unitTypes.map(unitType => (
              <div key={unitType} className="flex items-center gap-2">
                {getUnitIcon(unitType)} {getUnitName(unitType)}: {village.army[unitType] || 0}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
