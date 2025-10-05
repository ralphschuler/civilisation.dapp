import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/Card';
import { Button } from '../ui/Button';
import { Switch } from '../ui/Switch';
import { Label } from '../ui/Label';
import { Separator } from '../ui/Separator';
import { Slider } from '../ui/Slider';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/Select';
import { Badge } from '../ui/Badge';
import { 
  Settings, 
  Bell, 
  Moon, 
  Volume2, 
  Globe, 
  Shield, 
  Download,
  Trash2,
  RefreshCw,
  ExternalLink,
  ArrowLeft 
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useI18n } from '@/providers/i18n-provider';

interface GameSettings {
  notifications: {
    attacks: boolean;
    trades: boolean;
    buildings: boolean;
    alliance: boolean;
    sound: boolean;
  };
  display: {
    darkMode: boolean;
    language: string;
    animations: boolean;
    compactMode: boolean;
  };
  gameplay: {
    autoCollectResources: boolean;
    confirmAttacks: boolean;
    showCoordinates: boolean;
    quickActions: boolean;
  };
  audio: {
    masterVolume: number;
    soundEffects: boolean;
    backgroundMusic: boolean;
  };
}

interface SettingsScreenProps {
  settings?: GameSettings;
  onSettingsChange?: (settings: GameSettings) => void;
}

const defaultSettings: GameSettings = {
  notifications: {
    attacks: true,
    trades: true,
    buildings: true,
    alliance: true,
    sound: true
  },
  display: {
    darkMode: false,
    language: 'de',
    animations: true,
    compactMode: false
  },
  gameplay: {
    autoCollectResources: false,
    confirmAttacks: true,
    showCoordinates: true,
    quickActions: true
  },
  audio: {
    masterVolume: 70,
    soundEffects: true,
    backgroundMusic: false
  }
};

export function SettingsScreen({ 
  settings = defaultSettings, 
  onSettingsChange 
}: SettingsScreenProps) {
  const navigate = useNavigate();
  const { t, setLang } = useI18n();
  const [localSettings, setLocalSettings] = useState(settings);

  const updateSetting = (category: keyof GameSettings, key: string, value: any) => {
    const newSettings = {
      ...localSettings,
      [category]: {
        ...localSettings[category],
        [key]: value
      }
    };
    setLocalSettings(newSettings);
    onSettingsChange?.(newSettings);

    if (category === 'display' && key === 'language') {
      setLang(value as 'en' | 'de');
    }
  };

  const resetSettings = () => {
    setLocalSettings(defaultSettings);
    onSettingsChange?.(defaultSettings);
  };

  const exportSettings = () => {
    const dataStr = JSON.stringify(localSettings, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'tribal-wars-settings.json';
    link.click();
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate('/more')}
              className="mr-2 h-auto p-1"
            >
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <Settings className="h-5 w-5" />
            {t('screens.settings.title', 'Settings')}
          </CardTitle>
        </CardHeader>
      </Card>

      {/* Notifications */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bell className="h-5 w-5" />
            Benachrichtigungen
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-3">
            {Object.entries(localSettings.notifications).map(([key, value]) => (
              <div key={key} className="flex items-center justify-between">
                <Label htmlFor={`notif-${key}`} className="text-sm">
                  {key === 'attacks' && 'Angriffe'}
                  {key === 'trades' && 'Handel'}
                  {key === 'buildings' && 'Gebäude fertig'}
                  {key === 'alliance' && 'Allianz-Nachrichten'}
                  {key === 'sound' && 'Sound-Benachrichtigungen'}
                </Label>
                <Switch
                  id={`notif-${key}`}
                  checked={value}
                  onCheckedChange={(checked) => updateSetting('notifications', key, checked)}
                />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Display Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Moon className="h-5 w-5" />
            Darstellung
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label>Dark Mode</Label>
              <Switch
                checked={localSettings.display.darkMode}
                onCheckedChange={(checked) => updateSetting('display', 'darkMode', checked)}
              />
            </div>
            
            <div className="flex items-center justify-between">
              <Label>Animationen</Label>
              <Switch
                checked={localSettings.display.animations}
                onCheckedChange={(checked) => updateSetting('display', 'animations', checked)}
              />
            </div>
            
            <div className="flex items-center justify-between">
              <Label>Kompakter Modus</Label>
              <Switch
                checked={localSettings.display.compactMode}
                onCheckedChange={(checked) => updateSetting('display', 'compactMode', checked)}
              />
            </div>
            
            <div className="flex items-center justify-between">
              <Label>Sprache</Label>
              <Select
                value={localSettings.display.language}
                onValueChange={(value) => updateSetting('display', 'language', value)}
              >
                <SelectTrigger className="w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="de">Deutsch</SelectItem>
                  <SelectItem value="en">English</SelectItem>
                  <SelectItem value="fr">Français</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Audio Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Volume2 className="h-5 w-5" />
            Audio
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-4">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label>Master-Lautstärke</Label>
                <Badge variant="outline">{localSettings.audio.masterVolume}%</Badge>
              </div>
              <Slider
                value={[localSettings.audio.masterVolume]}
                onValueChange={([value]) => updateSetting('audio', 'masterVolume', value)}
                max={100}
                step={5}
                className="w-full"
              />
            </div>
            
            <div className="flex items-center justify-between">
              <Label>Soundeffekte</Label>
              <Switch
                checked={localSettings.audio.soundEffects}
                onCheckedChange={(checked) => updateSetting('audio', 'soundEffects', checked)}
              />
            </div>
            
            <div className="flex items-center justify-between">
              <Label>Hintergrundmusik</Label>
              <Switch
                checked={localSettings.audio.backgroundMusic}
                onCheckedChange={(checked) => updateSetting('audio', 'backgroundMusic', checked)}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Gameplay Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Globe className="h-5 w-5" />
            Gameplay
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-3">
            {Object.entries(localSettings.gameplay).map(([key, value]) => (
              <div key={key} className="flex items-center justify-between">
                <Label className="text-sm">
                  {key === 'autoCollectResources' && 'Auto-Ressourcen sammeln'}
                  {key === 'confirmAttacks' && 'Angriffe bestätigen'}
                  {key === 'showCoordinates' && 'Koordinaten anzeigen'}
                  {key === 'quickActions' && 'Schnellaktionen'}
                </Label>
                <Switch
                  checked={value}
                  onCheckedChange={(checked) => updateSetting('gameplay', key, checked)}
                />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Data & Privacy */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            Daten & Datenschutz
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-3">
            <Button variant="outline" className="w-full justify-start" onClick={exportSettings}>
              <Download className="h-4 w-4 mr-2" />
              Einstellungen exportieren
            </Button>
            
            <Button variant="outline" className="w-full justify-start">
              <ExternalLink className="h-4 w-4 mr-2" />
              Datenschutzerklärung
            </Button>
            
            <Separator />
            
            <Button variant="destructive" className="w-full justify-start">
              <Trash2 className="h-4 w-4 mr-2" />
              Alle Daten löschen
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Actions */}
      <Card>
        <CardContent className="p-4">
          <div className="flex gap-3">
            <Button variant="outline" className="flex-1" onClick={resetSettings}>
              <RefreshCw className="h-4 w-4 mr-2" />
              Zurücksetzen
            </Button>
            <Button className="flex-1">
              Speichern
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
