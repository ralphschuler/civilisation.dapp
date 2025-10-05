import { useNavigate, useLocation } from 'react-router-dom';
import { Button } from './ui/Button';

const NAVIGATION_ITEMS = [
  { id: '/village', icon: '🏛️', label: 'Village' },
  { id: '/world', icon: '🗺️', label: 'World' },
  { id: '/units', icon: '⚔️', label: 'Units' },
  { id: '/resources', icon: '💰', label: 'Resources' }
];

export function MobileNavigation() {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-card border-t z-50 safe-area-pb">
      <div className="grid grid-cols-4 gap-1 p-2">
        {NAVIGATION_ITEMS.map((item) => (
          <Button
            key={item.id}
            variant={location.pathname === item.id ? 'default' : 'ghost'}
            size="sm"
            className="flex flex-col items-center gap-1 min-h-[44px] min-w-[44px] h-auto py-2 px-1 text-caption"
            onClick={() => navigate(item.id)}
          >
            <span className="text-lg">{item.icon}</span>
            <span className="text-micro leading-tight">{item.label}</span>
          </Button>
        ))}
      </div>
    </div>
  );
}
