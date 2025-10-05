import { Card, CardContent, CardHeader, CardTitle } from '../ui/Card';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';
import { Separator } from '../ui/Separator';
import { Settings, BarChart3, Route, Trophy, HelpCircle, Info, Moon, Sun, Volume2, VolumeX, Users } from 'lucide-react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

interface MoreScreenProps {}

export function MoreScreen({}: MoreScreenProps) {
  const navigate = useNavigate();
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [darkMode, setDarkMode] = useState(false);

  const quickActions = [
    {
      id: 'stats',
      icon: BarChart3,
      title: 'Spielerstatistiken',
      description: 'Fortschritt, Ranglisten, Erfolge',
      badge: 'Neu',
      color: 'primary'
    },
    {
      id: 'achievements',
      icon: Trophy,
      title: 'Erfolge & Quests',
      description: 'Belohnungen, Season-Ziele',
      badge: '3',
      color: 'warning'
    }
  ];

  const settingsActions = [
    {
      id: 'settings',
      icon: Settings,
      title: 'Einstellungen',
      description: 'Benachrichtigungen, Sprache, Account',
      badge: null,
      color: 'muted'
    },
    {
      id: 'help',
      icon: HelpCircle,
      title: 'Hilfe & Support',
      description: 'Tutorial, FAQ, Kontakt',
      badge: null,
      color: 'muted'
    }
  ];

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
    document.documentElement.classList.toggle('dark');
  };

  return (
    <div className="space-y-6">
      {/* Quick Settings */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-section">Schnelleinstellungen</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              {darkMode ? <Moon className="h-5 w-5" /> : <Sun className="h-5 w-5" />}
              <div>
                <div className="font-medium text-body">Dunkles Design</div>
                <div className="text-caption text-muted-foreground">Augen schonen bei Nacht</div>
              </div>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={toggleDarkMode}
              className="min-touch"
            >
              {darkMode ? 'Hell' : 'Dunkel'}
            </Button>
          </div>
          
          <Separator />
          
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              {soundEnabled ? <Volume2 className="h-5 w-5" /> : <VolumeX className="h-5 w-5" />}
              <div>
                <div className="font-medium text-body">Sound-Effekte</div>
                <div className="text-caption text-muted-foreground">Bestätigungen und Warnungen</div>
              </div>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setSoundEnabled(!soundEnabled)}
              className="min-touch"
            >
              {soundEnabled ? 'An' : 'Aus'}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Game Features */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-section">Spiel-Features</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          {quickActions.map((action) => (
            <Button
              key={action.id}
              variant="ghost"
              className="w-full justify-start h-auto p-3 min-touch"
              onClick={() => navigate(`/${action.id}`)}
            >
              <div className="flex items-center gap-3 w-full">
                <action.icon className="h-5 w-5 text-muted-foreground" />
                <div className="flex-1 text-left">
                  <div className="font-medium text-body flex items-center gap-2">
                    {action.title}
                    {action.badge && (
                      <Badge 
                        variant={action.color === 'primary' ? 'default' : 'secondary'}
                        className="text-micro"
                      >
                        {action.badge}
                      </Badge>
                    )}
                  </div>
                  <div className="text-caption text-muted-foreground">{action.description}</div>
                </div>
              </div>
            </Button>
          ))}
        </CardContent>
      </Card>

      {/* Settings & Support */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-section">Einstellungen & Support</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          {settingsActions.map((action) => (
            <Button
              key={action.id}
              variant="ghost"
              className="w-full justify-start h-auto p-3 min-touch"
              onClick={() => navigate(`/${action.id}`)}
            >
              <div className="flex items-center gap-3 w-full">
                <action.icon className="h-5 w-5 text-muted-foreground" />
                <div className="flex-1 text-left">
                  <div className="font-medium text-body">{action.title}</div>
                  <div className="text-caption text-muted-foreground">{action.description}</div>
                </div>
              </div>
            </Button>
          ))}
        </CardContent>
      </Card>

      {/* Game Info */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-section flex items-center gap-2">
            <Info className="h-4 w-4" />
            Civilization Mobile
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="grid grid-cols-2 gap-3 text-caption">
            <div>
              <span className="text-muted-foreground">Version:</span>
              <div className="font-medium">v2.0.0</div>
            </div>
            <div>
              <span className="text-muted-foreground">Shard:</span>
              <div className="font-medium">Europa-1</div>
            </div>
            <div>
              <span className="text-muted-foreground">Online:</span>
              <div className="font-medium text-success">Verbunden</div>
            </div>
            <div>
              <span className="text-muted-foreground">Sync:</span>
              <div className="font-medium text-caption">vor 2min</div>
            </div>
          </div>
          
          <Separator />
          
          <div className="text-caption text-muted-foreground leading-relaxed">
            Ein mobiles 4X-Light-Strategiespiel im Stil von Tribal Wars/Civilization. 
            Baue deine Stadt auf, trainiere Armeen und erobere Provinzen in asynchronen PvP-Kämpfen.
          </div>
          
          <div className="text-micro text-muted-foreground">
            © 2025 Civilization Mobile Team. Alle Rechte vorbehalten.
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
