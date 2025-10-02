import { Card, CardContent } from '../ui/card';
import { Badge } from '../ui/badge';
import { Progress } from '../ui/progress';
import { getResourceIcon } from '../../data/gameData';

interface ResourceCardProps {
  resource: string;
  amount: number;
  production?: number;
  capacity?: number;
  className?: string;
}

export function ResourceCard({ 
  resource, 
  amount, 
  production, 
  capacity,
  className = ""
}: ResourceCardProps) {
  const formatNumber = (num: number) => {
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
    if (num >= 1000) return `${(num / 1000).toFixed(1)}k`;
    return num.toLocaleString();
  };

  const getResourceName = (resource: string) => {
    const names: { [key: string]: string } = {
      wood: 'Holz',
      clay: 'Lehm',
      iron: 'Eisen',
      coal: 'Kohle',
      wheat: 'Weizen',
      bread: 'Brot',
      meat: 'Fleisch',
      gold: 'Gold',
      villager: 'Dorfbewohner'
    };
    return names[resource] || resource;
  };

  return (
    <Card className={`hover:shadow-md transition-shadow ${className}`}>
      <CardContent className="p-4">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <span className="text-2xl">{getResourceIcon(resource)}</span>
            <div>
              <h3 className="font-medium">{getResourceName(resource)}</h3>
              <Badge variant="outline" className="text-xs">
                {formatNumber(amount)}
              </Badge>
            </div>
          </div>
        </div>

        {capacity && (
          <div className="space-y-2">
            <Progress 
              value={(amount / capacity) * 100} 
              className="h-2"
            />
            <div className="text-xs text-muted-foreground text-right">
              {Math.round((amount / capacity) * 100)}% von {formatNumber(capacity)}
            </div>
          </div>
        )}

        {production && production > 0 && (
          <div className="mt-2 text-center">
            <Badge variant="secondary" className="text-xs">
              +{formatNumber(production)}/h
            </Badge>
          </div>
        )}
      </CardContent>
    </Card>
  );
}