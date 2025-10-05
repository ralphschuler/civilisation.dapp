import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/Card';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/Tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/Select';
import { Input } from '../ui/Input';
import { Label } from '../ui/Label';
import { Textarea } from '../ui/Textarea';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '../ui/AlertDialog';
import { ScrollArea } from '../ui/ScrollArea';
import { Separator } from '../ui/Separator';
import { Progress } from '../ui/Progress';
import { 
  Swords, 
  Shield, 
  Crown, 
  MapPin, 
  Clock, 
  Users, 
  Target, 
  Route,
  Plus,
  Edit2,
  Trash2,
  Send,
  ArrowRight,
  Zap
} from 'lucide-react';
import { Village, Army, AttackType, March, MarchPreset, VillageInfo } from '../../types/game';
import { useI18n } from '@/providers/i18n-provider';

interface MarchPlannerScreenProps {
  village: Village;
  marches: March[];
  marchPresets: MarchPreset[];
  onCreateMarch: (march: Omit<March, 'id'>) => void;
  onCancelMarch: (marchId: string) => void;
  onCreatePreset: (preset: Omit<MarchPreset, 'id'>) => void;
  onDeletePreset: (presetId: string) => void;
  selectedTarget?: VillageInfo | null;
}

export function MarchPlannerScreen({
  village,
  marches,
  marchPresets,
  onCreateMarch,
  onCancelMarch,
  onCreatePreset,
  onDeletePreset,
  selectedTarget
}: MarchPlannerScreenProps) {
  const { t } = useI18n();
  const [activeTab, setActiveTab] = useState('planner');
  const [attackType, setAttackType] = useState<AttackType>('raid');
  const [selectedPreset, setSelectedPreset] = useState<string>('none');
  const [customArmy, setCustomArmy] = useState<Army>({
    spearman: 0,
    swordsman: 0,
    axeman: 0,
    archer: 0,
    crossbow: 0,
    lightcav: 0,
    knight: 0,
    pikeman: 0,
    ram: 0,
    trebuchet: 0
  });
  const [targetX, setTargetX] = useState(selectedTarget?.x || 200);
  const [targetY, setTargetY] = useState(selectedTarget?.y || 200);
  const [targetPlayer, setTargetPlayer] = useState(selectedTarget?.player || '');
  const [departureTime, setDepartureTime] = useState('now');
  const [notes, setNotes] = useState('');
  const [newPresetName, setNewPresetName] = useState('');
  const [newPresetDescription, setNewPresetDescription] = useState('');

  const formatNumber = (num: number) => {
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
    if (num >= 1000) return `${(num / 1000).toFixed(1)}k`;
    return num.toLocaleString();
  };

  const formatTime = (timestamp: number) => {
    return new Date(timestamp).toLocaleString('de-DE', {
      day: '2-digit',
      month: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const calculateDistance = (x1: number, y1: number, x2: number, y2: number) => {
    return Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));
  };

  const calculateTravelTime = (army: Army, distance: number) => {
    // Find slowest unit speed
    const unitSpeeds = {
      spearman: 20,
      swordsman: 22,
      axeman: 18,
      archer: 24,
      crossbow: 20,
      lightcav: 35,
      knight: 30,
      pikeman: 16,
      ram: 8,
      trebuchet: 6
    };

    let slowestSpeed = 40;
    Object.entries(army).forEach(([unitType, count]) => {
      if (count > 0) {
        const speed = unitSpeeds[unitType as keyof typeof unitSpeeds];
        if (speed < slowestSpeed) {
          slowestSpeed = speed;
        }
      }
    });

    // Calculate travel time in minutes
    return Math.ceil((distance / slowestSpeed) * 60);
  };

  const calculateCarryCapacity = (army: Army) => {
    const carryCapacities = {
      spearman: 25,
      swordsman: 15,
      axeman: 10,
      archer: 30,
      crossbow: 20,
      lightcav: 80,
      knight: 60,
      pikeman: 20,
      ram: 0,
      trebuchet: 0
    };

    return Object.entries(army).reduce((total, [unitType, count]) => {
      return total + (count * carryCapacities[unitType as keyof typeof carryCapacities]);
    }, 0);
  };

  const handleCreateMarch = () => {
    const army = selectedPreset && selectedPreset !== 'none' ? 
      marchPresets.find(p => p.id === selectedPreset)?.army || customArmy : 
      customArmy;

    const distance = calculateDistance(village.x || 200, village.y || 200, targetX, targetY);
    const travelTime = calculateTravelTime(army, distance);
    const now = Date.now();
    const departure = departureTime === 'now' ? now : now + (parseInt(departureTime) * 60 * 1000);
    const arrival = departure + (travelTime * 60 * 1000);

    const march: Omit<March, 'id'> = {
      type: attackType,
      status: 'planning',
      fromVillage: {
        id: village.id,
        name: village.name,
        x: village.x || 200,
        y: village.y || 200
      },
      targetVillage: {
        id: `${targetX}_${targetY}`,
        name: selectedTarget?.name || `Dorf (${targetX}|${targetY})`,
        x: targetX,
        y: targetY,
        player: targetPlayer || undefined
      },
      army,
      departureTime: departure,
      arrivalTime: arrival,
      carry: calculateCarryCapacity(army),
      distance,
      travelSpeed: calculateDistance(village.x || 200, village.y || 200, targetX, targetY) / (travelTime / 60),
      notes
    };

    onCreateMarch(march);
    
    // Reset form
    setCustomArmy({
      spearman: 0, swordsman: 0, axeman: 0, archer: 0, crossbow: 0,
      lightcav: 0, knight: 0, pikeman: 0, ram: 0, trebuchet: 0
    });
    setSelectedPreset('');
    setNotes('');
    setDepartureTime('now');
  };

  const handleCreatePreset = () => {
    const preset: Omit<MarchPreset, 'id'> = {
      name: newPresetName,
      description: newPresetDescription,
      army: customArmy,
      attackType
    };

    onCreatePreset(preset);
    setNewPresetName('');
    setNewPresetDescription('');
  };

  const getTotalUnits = (army: Army) => {
    return Object.values(army).reduce((sum, count) => sum + count, 0);
  };

  const getAttackTypeInfo = (type: AttackType) => {
    switch (type) {
      case 'raid':
        return {
          name: t('screens.march.attackType.raid.name', 'Plünderung'),
          icon: <Zap className="h-4 w-4" />,
          description: t('screens.march.attackType.raid.description', 'Schneller Angriff zum Erbeuten von Ressourcen'),
          color: 'text-yellow-600'
        };
      case 'siege':
        return {
          name: t('screens.march.attackType.siege.name', 'Belagerung'),
          icon: <Shield className="h-4 w-4" />,
          description: t('screens.march.attackType.siege.description', 'Angriff auf Mauern und Verteidigungen'),
          color: 'text-orange-600'
        };
      case 'conquer':
        return {
          name: t('screens.march.attackType.conquer.name', 'Eroberung'),
          icon: <Crown className="h-4 w-4" />,
          description: t('screens.march.attackType.conquer.description', 'Vollständige Übernahme des Dorfes'),
          color: 'text-red-600'
        };
    }
  };

  const activeMarchesCount = marches.filter(m => ['planning', 'marching', 'arrived'].includes(m.status)).length;

  return (
    <div className="space-y-4">
      {/* Header Card */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Route className="h-5 w-5" />
            {t('screens.march.title', 'Marschplaner')}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            <div className="text-center p-3 bg-muted rounded-lg">
              <div className="text-2xl font-bold text-blue-600">{activeMarchesCount}</div>
              <div className="text-xs text-muted-foreground">{t('screens.march.stats.active', 'Aktive Märsche')}</div>
            </div>
            <div className="text-center p-3 bg-muted rounded-lg">
              <div className="text-2xl font-bold text-green-600">{marchPresets.length}</div>
              <div className="text-xs text-muted-foreground">{t('screens.march.stats.savedPresets', 'Gespeicherte Presets')}</div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid grid-cols-3 w-full">
          <TabsTrigger value="planner">{t('screens.march.tabs.planner', 'Planen')}</TabsTrigger>
          <TabsTrigger value="active">
            {t('screens.march.tabs.active', 'Aktive Märsche')}
            {activeMarchesCount > 0 && (
              <Badge variant="secondary" className="ml-2 text-xs">
                {activeMarchesCount}
              </Badge>
            )}
          </TabsTrigger>
          <TabsTrigger value="presets">{t('screens.march.tabs.presets', 'Presets')}</TabsTrigger>
        </TabsList>

        <TabsContent value="planner">
          <div className="space-y-4">
            {/* Attack Type Selection */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="h-5 w-5" />
                  {t('screens.march.attackType.title', 'Angriffstyp')}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-3 gap-2">
                  {(['raid', 'siege', 'conquer'] as AttackType[]).map(type => {
                    const info = getAttackTypeInfo(type);
                    return (
                      <Button
                        key={type}
                        variant={attackType === type ? 'default' : 'outline'}
                        onClick={() => setAttackType(type)}
                        className="h-auto p-3 flex flex-col items-center space-y-2"
                      >
                        <div className={info.color}>{info.icon}</div>
                        <div className="text-xs font-medium">{info.name}</div>
                      </Button>
                    );
                  })}
                </div>
                <p className="text-sm text-muted-foreground mt-2">
                  {getAttackTypeInfo(attackType).description}
                </p>
              </CardContent>
            </Card>

            {/* Target Selection */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MapPin className="h-5 w-5" />
                  {t('screens.march.target.title', 'Ziel')}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <Label htmlFor="targetX">{t('screens.march.target.x', 'X-Koordinate')}</Label>
                    <Input
                      id="targetX"
                      type="number"
                      value={targetX}
                      onChange={(e) => setTargetX(parseInt(e.target.value) || 0)}
                      className="min-touch"
                    />
                  </div>
                  <div>
                    <Label htmlFor="targetY">{t('screens.march.target.y', 'Y-Koordinate')}</Label>
                    <Input
                      id="targetY"
                      type="number"
                      value={targetY}
                      onChange={(e) => setTargetY(parseInt(e.target.value) || 0)}
                      className="min-touch"
                    />
                  </div>
                </div>
                <div>
                  <Label htmlFor="targetPlayer">{t('screens.march.target.player', 'Spieler (optional)')}</Label>
                  <Input
                    id="targetPlayer"
                    value={targetPlayer}
                    onChange={(e) => setTargetPlayer(e.target.value)}
                    placeholder={t('screens.march.target.playerPlaceholder', 'Spielername')}
                    className="min-touch"
                  />
                </div>
                {selectedTarget && (
                  <div className="p-3 bg-accent rounded-lg">
                    <div className="font-medium">{selectedTarget.name}</div>
                    <div className="text-sm text-muted-foreground">
                      {t('screens.march.target.playerShort', 'Spieler')}: {selectedTarget.player || t('screens.march.target.unknown', 'Unbekannt')} • 
                      {t('screens.march.target.points', 'Punkte')}: {formatNumber(selectedTarget.points)}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Army Selection */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  {t('screens.march.army.title', 'Armee')}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Preset Selection */}
                <div>
                  <Label htmlFor="preset">{t('screens.march.army.usePreset', 'Preset verwenden')}</Label>
                  <Select value={selectedPreset} onValueChange={setSelectedPreset}>
                    <SelectTrigger className="min-touch">
                      <SelectValue placeholder={t('screens.march.army.noPresetSelected', 'Kein Preset ausgewählt')} />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="none">{t('screens.march.army.noPreset', 'Kein Preset')}</SelectItem>
                      {marchPresets.map(preset => (
                        <SelectItem key={preset.id} value={preset.id}>
                          {preset.name} ({getTotalUnits(preset.army)} {t('screens.march.army.units', 'Einheiten')})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Custom Army Setup */}
                {(!selectedPreset || selectedPreset === 'none') && (
                  <div className="space-y-3">
                    <h4 className="font-medium">{t('screens.march.army.custom', 'Eigene Zusammenstellung')}</h4>
                    <div className="grid grid-cols-2 gap-3">
                      {Object.keys(customArmy).map(unitType => (
                        <div key={unitType}>
                          <Label htmlFor={unitType} className="capitalize">{unitType}</Label>
                          <Input
                            id={unitType}
                            type="number"
                            min="0"
                            max={village.army[unitType] || 0}
                            value={customArmy[unitType as keyof Army]}
                            onChange={(e) => setCustomArmy(prev => ({
                              ...prev,
                              [unitType]: parseInt(e.target.value) || 0
                            }))}
                            className="min-touch"
                          />
                          <div className="text-xs text-muted-foreground">
                            {t('screens.march.army.available', 'Verfügbar')}: {village.army[unitType] || 0}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Army Summary */}
                <div className="p-3 bg-muted rounded-lg">
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <div className="font-medium">{t('screens.march.army.totalUnits', 'Gesamte Einheiten')}</div>
                      <div className="text-muted-foreground">
                        {getTotalUnits(selectedPreset && selectedPreset !== 'none' ? 
                          marchPresets.find(p => p.id === selectedPreset)?.army || customArmy : 
                          customArmy
                        )}
                      </div>
                    </div>
                    <div>
                      <div className="font-medium">{t('screens.march.army.carry', 'Tragfähigkeit')}</div>
                      <div className="text-muted-foreground">
                        {calculateCarryCapacity(selectedPreset && selectedPreset !== 'none' ? 
                          marchPresets.find(p => p.id === selectedPreset)?.army || customArmy : 
                          customArmy
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Timing */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="h-5 w-5" />
                  {t('screens.march.timing.title', 'Zeitplanung')}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <Label htmlFor="departure">{t('screens.march.timing.departure', 'Abmarsch')}</Label>
                  <Select value={departureTime} onValueChange={setDepartureTime}>
                    <SelectTrigger className="min-touch">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="now">{t('screens.march.timing.now', 'Sofort')}</SelectItem>
                      <SelectItem value="5">{t('screens.march.timing.in5', 'In 5 Minuten')}</SelectItem>
                      <SelectItem value="15">{t('screens.march.timing.in15', 'In 15 Minuten')}</SelectItem>
                      <SelectItem value="30">{t('screens.march.timing.in30', 'In 30 Minuten')}</SelectItem>
                      <SelectItem value="60">{t('screens.march.timing.in60', 'In 1 Stunde')}</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="notes">{t('screens.march.timing.notesLabel', 'Notizen (optional)')}</Label>
                  <Textarea
                    id="notes"
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder={t('screens.march.timing.notesPlaceholder', 'Notizen zum Angriff...')}
                    rows={2}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Action Buttons */}
            <div className="flex gap-2">
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button className="flex-1 min-touch">
                    <Send className="h-4 w-4 mr-2" />
                    {t('screens.march.actions.start', 'Marsch starten')}
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>{t('screens.march.confirm.title', 'Marsch bestätigen')}</AlertDialogTitle>
                    <AlertDialogDescription>
                      {t('screens.march.confirm.prefix', 'Möchtest du den')} {getAttackTypeInfo(attackType).name.toLowerCase()} {t('screens.march.confirm.to', 'auf')} 
                      ({targetX}|{targetY}) {t('screens.march.confirm.suffix', 'wirklich starten?')}
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>{t('common.cancel', 'Abbrechen')}</AlertDialogCancel>
                    <AlertDialogAction onClick={handleCreateMarch}>
                      {t('screens.march.confirm.confirm', 'Bestätigen')}
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>

              {(!selectedPreset || selectedPreset === 'none') && getTotalUnits(customArmy) > 0 && (
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button variant="outline" className="min-touch">
                      <Plus className="h-4 w-4" />
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>{t('screens.march.preset.createTitle', 'Preset erstellen')}</AlertDialogTitle>
                      <AlertDialogDescription>
                        {t('screens.march.preset.createQuestion', 'Möchtest du diese Armeezusammenstellung als Preset speichern?')}
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <div className="space-y-3 py-4">
                      <div>
                        <Label htmlFor="presetName">{t('screens.march.preset.nameLabel', 'Name')}</Label>
                        <Input
                          id="presetName"
                          value={newPresetName}
                          onChange={(e) => setNewPresetName(e.target.value)}
                          placeholder={t('screens.march.preset.namePlaceholder', 'z.B. Schneller Raid')}
                          className="min-touch"
                        />
                      </div>
                      <div>
                        <Label htmlFor="presetDescription">{t('screens.march.preset.descriptionLabel', 'Beschreibung')}</Label>
                        <Input
                          id="presetDescription"
                          value={newPresetDescription}
                          onChange={(e) => setNewPresetDescription(e.target.value)}
                          placeholder={t('screens.march.preset.descriptionPlaceholder', 'z.B. Optimiert für schnelle Plünderungen')}
                          className="min-touch"
                        />
                      </div>
                    </div>
                    <AlertDialogFooter>
                      <AlertDialogCancel>{t('common.cancel', 'Abbrechen')}</AlertDialogCancel>
                      <AlertDialogAction 
                        onClick={handleCreatePreset}
                        disabled={!newPresetName.trim()}
                      >
                        {t('screens.march.preset.create', 'Erstellen')}
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              )}
            </div>
          </div>
        </TabsContent>

        <TabsContent value="active">
          <Card>
            <CardHeader>
              <CardTitle>{t('screens.march.active.title', 'Aktive Märsche')}</CardTitle>
            </CardHeader>
            <CardContent>
              {activeMarchesCount === 0 ? (
                <div className="text-center py-8">
                  <div className="text-4xl mb-2">⚔️</div>
                  <p className="text-muted-foreground">
                    {t('screens.march.active.empty', 'Keine aktiven Märsche')}
                  </p>
                  <Button 
                    className="mt-4" 
                    variant="outline"
                    onClick={() => setActiveTab('planner')}
                  >
                    {t('screens.march.active.planFirst', 'Ersten Marsch planen')}
                  </Button>
                </div>
              ) : (
                <ScrollArea className="h-[400px]">
                  <div className="space-y-3">
                    {marches
                      .filter(m => ['planning', 'marching', 'arrived'].includes(m.status))
                      .map(march => {
                        const progress = march.status === 'planning' ? 0 :
                          march.status === 'arrived' ? 100 :
                          Math.min(100, ((Date.now() - march.departureTime) / (march.arrivalTime - march.departureTime)) * 100);

                        return (
                          <div key={march.id} className="p-4 border rounded-lg space-y-3">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-2">
                                {getAttackTypeInfo(march.type).icon}
                                <span className="font-medium">
                                  {getAttackTypeInfo(march.type).name}
                                </span>
                                <ArrowRight className="h-4 w-4 text-muted-foreground" />
                                <span>{march.targetVillage.name}</span>
                              </div>
                              <Badge variant={
                                march.status === 'planning' ? 'secondary' :
                                march.status === 'marching' ? 'default' :
                                'outline'
                              }>
                                {march.status === 'planning' ? t('screens.march.status.planning', 'Geplant') :
                                 march.status === 'marching' ? t('screens.march.status.marching', 'Unterwegs') :
                                 t('screens.march.status.arrived', 'Angekommen')}
                              </Badge>
                            </div>

                            <div className="text-sm text-muted-foreground">
                              <div>{t('screens.march.active.target', 'Ziel')}: ({march.targetVillage.x}|{march.targetVillage.y})</div>
                              <div>{t('screens.march.active.distance', 'Entfernung')}: {march.distance.toFixed(1)} {t('screens.march.active.fields', 'Felder')}</div>
                              <div>{t('screens.march.active.units', 'Einheiten')}: {getTotalUnits(march.army)}</div>
                            </div>

                            {march.status === 'marching' && (
                              <div className="space-y-2">
                                <div className="flex justify-between text-sm">
                                  <span>{t('screens.march.active.progress', 'Fortschritt')}</span>
                                  <span>{progress.toFixed(0)}%</span>
                                </div>
                                <Progress value={progress} className="h-2" />
                                <div className="text-xs text-muted-foreground">
                                  {t('screens.march.active.arrival', 'Ankunft')}: {formatTime(march.arrivalTime)}
                                </div>
                              </div>
                            )}

                            {march.status === 'planning' && (
                              <div className="flex gap-2">
                                <Button
                                  size="sm"
                                  variant="destructive"
                                  onClick={() => onCancelMarch(march.id)}
                                  className="min-touch"
                                >
                                  <Trash2 className="h-4 w-4 mr-1" />
                                  {t('common.cancel', 'Abbrechen')}
                                </Button>
                              </div>
                            )}

                            {march.notes && (
                              <div className="text-sm bg-muted p-2 rounded">
                                <span className="font-medium">{t('screens.march.active.notes', 'Notizen')}: </span>
                                {march.notes}
                              </div>
                            )}
                          </div>
                        );
                      })}
                  </div>
                </ScrollArea>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="presets">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>{t('screens.march.presets.title', 'Gespeicherte Presets')}</span>
                <Button size="sm" onClick={() => setActiveTab('planner')}>
                  <Plus className="h-4 w-4 mr-1" />
                  {t('screens.march.presets.new', 'Neu erstellen')}
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent>
              {marchPresets.length === 0 ? (
                <div className="text-center py-8">
                  <div className="text-4xl mb-2">📋</div>
                  <p className="text-muted-foreground">
                    {t('screens.march.presets.empty', 'Keine Presets gespeichert')}
                  </p>
                  <Button 
                    className="mt-4" 
                    variant="outline"
                    onClick={() => setActiveTab('planner')}
                  >
                    {t('screens.march.presets.createFirst', 'Erstes Preset erstellen')}
                  </Button>
                </div>
              ) : (
                <div className="space-y-3">
                  {marchPresets.map(preset => (
                    <div key={preset.id} className="p-4 border rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          {getAttackTypeInfo(preset.attackType).icon}
                          <span className="font-medium">{preset.name}</span>
                        </div>
                        <div className="flex gap-1">
                          <Button 
                            size="sm" 
                            variant="outline"
                            onClick={() => {
                              setSelectedPreset(preset.id);
                              setAttackType(preset.attackType);
                              setActiveTab('planner');
                            }}
                          >
                            <Edit2 className="h-4 w-4" />
                          </Button>
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button size="sm" variant="destructive">
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>{t('screens.march.presets.deleteTitle', 'Preset löschen')}</AlertDialogTitle>
                                <AlertDialogDescription>
                                  {t('screens.march.presets.deleteQuestionPrefix', 'Möchtest du das Preset')} "{preset.name}" {t('screens.march.presets.deleteQuestionSuffix', 'wirklich löschen?')}
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>{t('common.cancel', 'Abbrechen')}</AlertDialogCancel>
                                <AlertDialogAction 
                                  onClick={() => onDeletePreset(preset.id)}
                                  variant="destructive"
                                >
                                  {t('screens.march.presets.delete', 'Löschen')}
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        </div>
                      </div>

                      <p className="text-sm text-muted-foreground mb-3">
                        {preset.description}
                      </p>

                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <div className="font-medium">{t('screens.march.army.units', 'Einheiten')}</div>
                          <div className="text-muted-foreground">
                            {getTotalUnits(preset.army)}
                          </div>
                        </div>
                        <div>
                          <div className="font-medium">{t('screens.march.army.carry', 'Tragfähigkeit')}</div>
                          <div className="text-muted-foreground">
                            {calculateCarryCapacity(preset.army)}
                          </div>
                        </div>
                      </div>

                      <Separator className="my-3" />

                      <div className="grid grid-cols-5 gap-2 text-xs">
                        {Object.entries(preset.army).map(([unitType, count]) => (
                          count > 0 && (
                            <div key={unitType} className="text-center">
                              <div className="font-medium capitalize">{unitType}</div>
                              <div className="text-muted-foreground">{count}</div>
                            </div>
                          )
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
