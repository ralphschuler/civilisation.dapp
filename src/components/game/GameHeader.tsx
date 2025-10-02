import { Village } from '../../types/game';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Bell, Settings, User } from 'lucide-react';

interface GameHeaderProps {
  village: Village;
  onSettingsClick?: () => void;
  onProfileClick?: () => void;
  onNotificationsClick?: () => void;
}

export function GameHeader({ 
  village, 
  onSettingsClick, 
  onProfileClick, 
  onNotificationsClick 
}: GameHeaderProps) {
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
        
        <div className="flex items-center space-x-2">
          <Button 
            variant="ghost" 
            size="sm"
            onClick={onNotificationsClick}
            className="relative"
          >
            <Bell className="h-4 w-4" />
            {/* Notification badge */}
            <div className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full" />
          </Button>
          
          <Button 
            variant="ghost" 
            size="sm"
            onClick={onProfileClick}
          >
            <User className="h-4 w-4" />
          </Button>
          
          <Button 
            variant="ghost" 
            size="sm"
            onClick={onSettingsClick}
          >
            <Settings className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </header>
  );
}