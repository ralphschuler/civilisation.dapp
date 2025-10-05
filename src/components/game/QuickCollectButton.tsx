import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';
import { getResourceIcon } from '../../data/gameData';
import { UncollectedResources } from '../../types/game';
import { Package } from 'lucide-react';

interface QuickCollectButtonProps {
  resourceType: keyof UncollectedResources;
  uncollectedAmount: number;
  onCollect: (resourceType: keyof UncollectedResources) => void;
  className?: string;
}

export function QuickCollectButton({ 
  resourceType, 
  uncollectedAmount, 
  onCollect,
  className = ""
}: QuickCollectButtonProps) {
  const formatNumber = (num: number) => {
    if (num >= 1000) return `${Math.floor(num / 1000)}k`;
    return Math.floor(num).toString();
  };

  if (uncollectedAmount <= 0) {
    return null;
  }

  return (
    <Button
      size="sm"
      variant="secondary"
      onClick={() => onCollect(resourceType)}
      className={`h-6 px-2 text-xs animate-pulse ${className}`}
    >
      <span className="text-xs mr-1">{getResourceIcon(resourceType)}</span>
      <Package className="h-3 w-3 mr-1" />
      <Badge variant="outline" className="text-xs px-1 py-0 h-auto">
        +{formatNumber(uncollectedAmount)}
      </Badge>
    </Button>
  );
}
