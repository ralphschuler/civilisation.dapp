import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { Progress } from '../ui/progress';
import { ScrollArea } from '../ui/scroll-area';
import { Separator } from '../ui/separator';
import { 
  TrendingUp, 
  TrendingDown, 
  Clock, 
  MapPin, 
  Users, 
  Coins,
  Trophy,
  AlertTriangle,
  Target,
  ArrowRight,
  FileText,
  BarChart3,
  Lightbulb,
  Swords,
  Shield,
  Crown
} from 'lucide-react';
import { March, BattleReport, Army, AttackType } from '../../types/game';

interface MarchReportsScreenProps {
  marches: March[];
  battleReports: BattleReport[];
}

export function MarchReportsScreen({ marches, battleReports }: MarchReportsScreenProps) {
  const [activeTab, setActiveTab] = useState('completed');
  const [selectedReport, setSelectedReport] = useState<BattleReport | null>(null);

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

  const getAttackTypeInfo = (type: AttackType) => {
    switch (type) {
      case 'raid':
        return {
          name: 'Plünderung',
          icon: <Target className="h-4 w-4" />,
          color: 'text-yellow-600'
        };
      case 'siege':
        return {
          name: 'Belagerung',
          icon: <Shield className="h-4 w-4" />,
          color: 'text-orange-600'
        };
      case 'conquer':
        return {
          name: 'Eroberung',
          icon: <Crown className="h-4 w-4" />,
          color: 'text-red-600'
        };
    }
  };

  const getTotalUnits = (army: Army) => {
    return Object.values(army).reduce((sum, count) => sum + count, 0);
  };

  const calculateTotalLoot = (marches: March[]) => {
    return marches
      .filter(m => m.loot)
      .reduce((total, march) => {
        if (!march.loot) return total;
        return total + Object.values(march.loot).reduce((sum, amount) => sum + amount, 0);
      }, 0);
  };

  const completedMarches = marches.filter(m => m.status === 'completed');
  const successfulMarches = completedMarches.filter(m => m.battleReport?.winner === 'attacker');
  const failedMarches = completedMarches.filter(m => m.battleReport?.winner === 'defender');
  const returningMarches = marches.filter(m => m.status === 'returning');

  const winRate = completedMarches.length > 0 ? 
    (successfulMarches.length / completedMarches.length) * 100 : 0;

  const totalLoot = calculateTotalLoot(successfulMarches);

  if (selectedReport) {
    return (
      <div className="space-y-4">
        {/* Back Button */}
        <Button 
          variant="outline" 
          onClick={() => setSelectedReport(null)}
          className="min-touch"
        >
          ← Zurück zur Übersicht
        </Button>

        {/* Battle Report Details */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Kampfbericht #{selectedReport.id.slice(-6)}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Battle Overview */}
            <div className="grid grid-cols-2 gap-4">
              <Card>
                <CardContent className="p-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-blue-600 mb-1">
                      {selectedReport.attacker}
                    </div>
                    <div className="text-sm text-muted-foreground">Angreifer</div>
                    <div className="text-xs mt-2">
                      {getTotalUnits(selectedReport.attackerArmy)} Einheiten
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-red-600 mb-1">
                      {selectedReport.defender}
                    </div>
                    <div className="text-sm text-muted-foreground">Verteidiger</div>
                    <div className="text-xs mt-2">
                      {getTotalUnits(selectedReport.defenderArmy)} Einheiten
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Winner */}
            <div className="text-center p-4 bg-muted rounded-lg">
              <div className="flex items-center justify-center gap-2 mb-2">
                {selectedReport.winner === 'attacker' ? 
                  <Trophy className="h-6 w-6 text-yellow-500" /> :
                  <Shield className="h-6 w-6 text-blue-500" />
                }
                <span className="text-xl font-bold">
                  {selectedReport.winner === 'attacker' ? 'Sieg' : 'Niederlage'}
                </span>
              </div>
              <div className="text-sm text-muted-foreground">
                {getAttackTypeInfo(selectedReport.attackType).name} • {formatTime(selectedReport.timestamp)}
              </div>
            </div>

            {/* Battle Factors */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="h-5 w-5" />
                  Kampffaktoren
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {Object.entries(selectedReport.factors).map(([factor, value]) => {
                    const factorNames = {
                      counter: 'Konter-Bonus',
                      wall: 'Mauer-Bonus',
                      moral: 'Moral',
                      tech: 'Technologie',
                      terrain: 'Gelände',
                      variance: 'Glück'
                    };

                    const isPositive = value > 0;
                    const percentage = Math.abs(value * 100);

                    return (
                      <div key={factor} className="flex items-center justify-between">
                        <span className="text-sm font-medium">
                          {factorNames[factor as keyof typeof factorNames]}
                        </span>
                        <div className="flex items-center gap-2">
                          <div className="w-24 bg-muted rounded-full h-2">
                            <div 
                              className={`h-2 rounded-full ${isPositive ? 'bg-green-500' : 'bg-red-500'}`}
                              style={{ width: `${Math.min(100, percentage)}%` }}
                            />
                          </div>
                          <span className={`text-sm font-medium ${isPositive ? 'text-green-600' : 'text-red-600'}`}>
                            {isPositive ? '+' : ''}{percentage.toFixed(0)}%
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>

            {/* Losses */}
            <div className="grid grid-cols-2 gap-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Verluste Angreifer</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {Object.entries(selectedReport.attackerLosses).map(([unitType, losses]) => (
                      losses > 0 && (
                        <div key={unitType} className="flex justify-between text-sm">
                          <span className="capitalize">{unitType}</span>
                          <span className="text-red-600">-{losses}</span>
                        </div>
                      )
                    ))}
                    {getTotalUnits(selectedReport.attackerLosses) === 0 && (
                      <p className="text-sm text-muted-foreground">Keine Verluste</p>
                    )}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Verluste Verteidiger</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {Object.entries(selectedReport.defenderLosses).map(([unitType, losses]) => (
                      losses > 0 && (
                        <div key={unitType} className="flex justify-between text-sm">
                          <span className="capitalize">{unitType}</span>
                          <span className="text-red-600">-{losses}</span>
                        </div>
                      )
                    ))}
                    {getTotalUnits(selectedReport.defenderLosses) === 0 && (
                      <p className="text-sm text-muted-foreground">Keine Verluste</p>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Loot */}
            {selectedReport.loot && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Coins className="h-5 w-5" />
                    Beute
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-3 gap-4">
                    {Object.entries(selectedReport.loot).map(([resource, amount]) => (
                      amount > 0 && (
                        <div key={resource} className="text-center p-3 bg-yellow-50 rounded-lg">
                          <div className="text-lg font-bold text-yellow-600">
                            {formatNumber(amount)}
                          </div>
                          <div className="text-xs text-muted-foreground capitalize">
                            {resource}
                          </div>
                        </div>
                      )
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Suggestions */}
            {selectedReport.suggestions.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Lightbulb className="h-5 w-5" />
                    Verbesserungsvorschläge
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {selectedReport.suggestions.map((suggestion, index) => (
                      <div key={index} className="flex items-start gap-2 p-3 bg-blue-50 rounded-lg">
                        <Lightbulb className="h-4 w-4 text-blue-600 mt-0.5" />
                        <p className="text-sm">{suggestion}</p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Battle Replay */}
            {selectedReport.replay && selectedReport.replay.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Swords className="h-5 w-5" />
                    Kampfverlauf
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {selectedReport.replay.map((phase, index) => (
                      <div key={index} className="border-l-2 border-muted pl-4">
                        <div className="flex items-center gap-2 mb-2">
                          <Badge variant="outline">
                            Phase {index + 1}: {phase.phase}
                          </Badge>
                        </div>
                        <div className="grid grid-cols-2 gap-4 text-sm">
                          <div>
                            <div className="font-medium">Angreifer</div>
                            <div className="text-muted-foreground">
                              Schaden: {phase.damage.attacker}
                            </div>
                          </div>
                          <div>
                            <div className="font-medium">Verteidiger</div>
                            <div className="text-muted-foreground">
                              Schaden: {phase.damage.defender}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Statistics Overview */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5" />
            Marsch-Statistiken
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center p-3 bg-muted rounded-lg">
              <div className="text-2xl font-bold text-blue-600">{completedMarches.length}</div>
              <div className="text-xs text-muted-foreground">Märsche gesamt</div>
            </div>
            <div className="text-center p-3 bg-muted rounded-lg">
              <div className="text-2xl font-bold text-green-600">{winRate.toFixed(0)}%</div>
              <div className="text-xs text-muted-foreground">Erfolgsquote</div>
            </div>
            <div className="text-center p-3 bg-muted rounded-lg">
              <div className="text-2xl font-bold text-yellow-600">{formatNumber(totalLoot)}</div>
              <div className="text-xs text-muted-foreground">Beute gesamt</div>
            </div>
            <div className="text-center p-3 bg-muted rounded-lg">
              <div className="text-2xl font-bold text-purple-600">{returningMarches.length}</div>
              <div className="text-xs text-muted-foreground">Rückkehrend</div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid grid-cols-3 w-full">
          <TabsTrigger value="completed">
            Abgeschlossen
            {completedMarches.length > 0 && (
              <Badge variant="secondary" className="ml-2 text-xs">
                {completedMarches.length}
              </Badge>
            )}
          </TabsTrigger>
          <TabsTrigger value="returning">
            Rückkehrend
            {returningMarches.length > 0 && (
              <Badge variant="secondary" className="ml-2 text-xs">
                {returningMarches.length}
              </Badge>
            )}
          </TabsTrigger>
          <TabsTrigger value="analysis">Analyse</TabsTrigger>
        </TabsList>

        <TabsContent value="completed">
          <Card>
            <CardHeader>
              <CardTitle>Abgeschlossene Märsche</CardTitle>
            </CardHeader>
            <CardContent>
              {completedMarches.length === 0 ? (
                <div className="text-center py-8">
                  <div className="text-4xl mb-2">📜</div>
                  <p className="text-muted-foreground">
                    Noch keine abgeschlossenen Märsche
                  </p>
                </div>
              ) : (
                <ScrollArea className="h-[400px]">
                  <div className="space-y-3">
                    {completedMarches.map(march => {
                      const isSuccess = march.battleReport?.winner === 'attacker';
                      const info = getAttackTypeInfo(march.type);

                      return (
                        <div 
                          key={march.id} 
                          className="p-4 border rounded-lg space-y-3 cursor-pointer hover:bg-muted/50"
                          onClick={() => march.battleReport && setSelectedReport(march.battleReport)}
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <div className={info.color}>{info.icon}</div>
                              <span className="font-medium">{info.name}</span>
                              <ArrowRight className="h-4 w-4 text-muted-foreground" />
                              <span>{march.targetVillage.name}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              {isSuccess ? (
                                <Badge variant="default" className="bg-green-600">
                                  <Trophy className="h-3 w-3 mr-1" />
                                  Sieg
                                </Badge>
                              ) : (
                                <Badge variant="destructive">
                                  <AlertTriangle className="h-3 w-3 mr-1" />
                                  Niederlage
                                </Badge>
                              )}
                            </div>
                          </div>

                          <div className="grid grid-cols-2 gap-4 text-sm">
                            <div>
                              <div className="text-muted-foreground">Ziel</div>
                              <div>({march.targetVillage.x}|{march.targetVillage.y})</div>
                              {march.targetVillage.player && (
                                <div className="text-xs text-muted-foreground">
                                  {march.targetVillage.player}
                                </div>
                              )}
                            </div>
                            <div>
                              <div className="text-muted-foreground">Ankunft</div>
                              <div>{formatTime(march.arrivalTime)}</div>
                            </div>
                          </div>

                          {march.loot && Object.values(march.loot).some(amount => amount > 0) && (
                            <div className="flex items-center gap-2 p-2 bg-yellow-50 rounded">
                              <Coins className="h-4 w-4 text-yellow-600" />
                              <span className="text-sm font-medium">
                                Beute: {formatNumber(Object.values(march.loot).reduce((sum, amount) => sum + amount, 0))}
                              </span>
                            </div>
                          )}

                          {march.notes && (
                            <div className="text-sm bg-muted p-2 rounded">
                              <span className="font-medium">Notizen: </span>
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

        <TabsContent value="returning">
          <Card>
            <CardHeader>
              <CardTitle>Rückkehrende Truppen</CardTitle>
            </CardHeader>
            <CardContent>
              {returningMarches.length === 0 ? (
                <div className="text-center py-8">
                  <div className="text-4xl mb-2">🏃‍♂️</div>
                  <p className="text-muted-foreground">
                    Keine rückkehrenden Truppen
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  {returningMarches.map(march => {
                    const progress = march.returnTime ? 
                      Math.min(100, ((Date.now() - march.arrivalTime) / (march.returnTime - march.arrivalTime)) * 100) : 
                      0;

                    return (
                      <div key={march.id} className="p-4 border rounded-lg space-y-3">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <Users className="h-4 w-4 text-blue-600" />
                            <span className="font-medium">Rückkehr aus {march.targetVillage.name}</span>
                          </div>
                          <Badge variant="outline">
                            {getTotalUnits(march.army)} Einheiten
                          </Badge>
                        </div>

                        <div className="space-y-2">
                          <div className="flex justify-between text-sm">
                            <span>Fortschritt</span>
                            <span>{progress.toFixed(0)}%</span>
                          </div>
                          <Progress value={progress} className="h-2" />
                          <div className="text-xs text-muted-foreground">
                            Ankunft: {march.returnTime ? formatTime(march.returnTime) : 'Unbekannt'}
                          </div>
                        </div>

                        {march.loot && Object.values(march.loot).some(amount => amount > 0) && (
                          <div className="flex items-center gap-2 p-2 bg-yellow-50 rounded">
                            <Coins className="h-4 w-4 text-yellow-600" />
                            <span className="text-sm font-medium">
                              Transportiert: {formatNumber(Object.values(march.loot).reduce((sum, amount) => sum + amount, 0))} Ressourcen
                            </span>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analysis">
          <div className="space-y-4">
            {/* Performance Analysis */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5" />
                  Leistungsanalyse
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-medium mb-3">Erfolgreiche Märsche</h4>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Plünderungen</span>
                        <span className="text-green-600">
                          {successfulMarches.filter(m => m.type === 'raid').length}
                        </span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>Belagerungen</span>
                        <span className="text-green-600">
                          {successfulMarches.filter(m => m.type === 'siege').length}
                        </span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>Eroberungen</span>
                        <span className="text-green-600">
                          {successfulMarches.filter(m => m.type === 'conquer').length}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-medium mb-3">Fehlgeschlagene Märsche</h4>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Plünderungen</span>
                        <span className="text-red-600">
                          {failedMarches.filter(m => m.type === 'raid').length}
                        </span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>Belagerungen</span>
                        <span className="text-red-600">
                          {failedMarches.filter(m => m.type === 'siege').length}
                        </span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>Eroberungen</span>
                        <span className="text-red-600">
                          {failedMarches.filter(m => m.type === 'conquer').length}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Recent Trends */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="h-5 w-5" />
                  Aktuelle Trends
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {winRate > 70 && (
                    <div className="flex items-center gap-2 p-3 bg-green-50 rounded-lg">
                      <TrendingUp className="h-4 w-4 text-green-600" />
                      <div>
                        <div className="font-medium text-green-800">Sehr gut!</div>
                        <div className="text-sm text-green-600">
                          Deine Erfolgsquote von {winRate.toFixed(0)}% ist ausgezeichnet.
                        </div>
                      </div>
                    </div>
                  )}

                  {winRate < 50 && completedMarches.length >= 3 && (
                    <div className="flex items-center gap-2 p-3 bg-red-50 rounded-lg">
                      <TrendingDown className="h-4 w-4 text-red-600" />
                      <div>
                        <div className="font-medium text-red-800">Verbesserung nötig</div>
                        <div className="text-sm text-red-600">
                          Deine Erfolgsquote liegt bei nur {winRate.toFixed(0)}%. Überprüfe deine Strategie.
                        </div>
                      </div>
                    </div>
                  )}

                  {totalLoot > 50000 && (
                    <div className="flex items-center gap-2 p-3 bg-yellow-50 rounded-lg">
                      <Coins className="h-4 w-4 text-yellow-600" />
                      <div>
                        <div className="font-medium text-yellow-800">Reiche Beute!</div>
                        <div className="text-sm text-yellow-600">
                          Du hast bereits {formatNumber(totalLoot)} Ressourcen erbeutet.
                        </div>
                      </div>
                    </div>
                  )}

                  {completedMarches.length === 0 && (
                    <div className="text-center py-8">
                      <div className="text-4xl mb-2">📊</div>
                      <p className="text-muted-foreground">
                        Führe mehr Märsche durch, um detaillierte Analysen zu erhalten
                      </p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}