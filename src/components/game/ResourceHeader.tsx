import { Village } from '../../types/game';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { MoreHorizontal, Bell, Settings, User } from 'lucide-react';

interface ResourceHeaderProps {
  village: Village;
  onMoreClick?: () => void;
  onSettingsClick?: () => void;
  onProfileClick?: () => void;
  onNotificationsClick?: () => void;
}

export function ResourceHeader({ 
  village,
  onMoreClick,
  onSettingsClick,
  onProfileClick,
  onNotificationsClick
}: ResourceHeaderProps) {
  return (
    <header className="bg-card border-b px-4 py-3 flex-shrink-0">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="text-2xl">🏰</div>
          <div>
            <h1 className="font-bold text-lg">Tribal Wars</h1>
            <Badge variant="secondary" className="text-xs">
              {village.name}
            </Badge>
          </div>
        </div>
        
        {/* Resource Display */}
        <div className="flex items-center space-x-2 text-sm">
          <div className="flex items-center space-x-1">
            <img src="/assets/resources/wood.png" alt="Wood" className="w-4 h-4" />
            <span>{Math.floor(village.resources.wood)}</span>
          </div>
          <div className="flex items-center space-x-1">
            <img src="/assets/resources/clay.png" alt="Clay" className="w-4 h-4" />
            <span>{Math.floor(village.resources.clay)}</span>
          </div>
          <div className="flex items-center space-x-1">
            <img src="/assets/resources/iron.png" alt="Iron" className="w-4 h-4" />
            <span>{Math.floor(village.resources.iron)}</span>
          </div>
          <div className="flex items-center space-x-1">
            <img src="/assets/resources/villager.png" alt="Population" className="w-4 h-4" />
            <span>{village.resources.population}</span>
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          <Button 
            variant="ghost" 
            size="sm"
            onClick={onNotificationsClick}
            className="relative min-touch"
          >
            <Bell className="h-4 w-4" />
            {/* Notification badge */}
            <div className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full" />
          </Button>
          
          <Button 
            variant="ghost" 
            size="sm"
            onClick={onMoreClick}
            className="min-touch"
          >
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </header>
  );
}