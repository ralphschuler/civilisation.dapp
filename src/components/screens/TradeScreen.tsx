import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/Card';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { Badge } from '../ui/Badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/Tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/Select';
import { Separator } from '../ui/Separator';
import { ScrollArea } from '../ui/ScrollArea';
import { getResourceIcon } from '../../data/gameData';
import { Resources } from '../../types/game';
import { ArrowRightLeft, TrendingUp, Clock, Users, Send } from 'lucide-react';

interface TradeOffer {
  id: string;
  playerName: string;
  offering: { [resource: string]: number };
  requesting: { [resource: string]: number };
  ratio: number;
  distance: number;
  expiresAt: number;
}

interface TradeScreenProps {
  resources: Resources;
  onExecuteTrade?: (tradeId: string) => void;
  onCreateTrade?: (offer: Omit<TradeOffer, 'id' | 'playerName' | 'expiresAt'>) => void;
}

const mockTrades: TradeOffer[] = [
  {
    id: '1',
    playerName: 'Holzfäller99',
    offering: { wood: 1000 },
    requesting: { iron: 500 },
    ratio: 2.0,
    distance: 12,
    expiresAt: Date.now() + 1000 * 60 * 60 * 2 // 2 hours
  },
  {
    id: '2',
    playerName: 'Eisenbrecher',
    offering: { iron: 800, coal: 200 },
    requesting: { gold: 300 },
    ratio: 3.3,
    distance: 8,
    expiresAt: Date.now() + 1000 * 60 * 60 * 4 // 4 hours
  },
  {
    id: '3',
    playerName: 'BreadBaker',
    offering: { bread: 500, wheat: 300 },
    requesting: { meat: 400 },
    ratio: 2.0,
    distance: 15,
    expiresAt: Date.now() + 1000 * 60 * 30 // 30 minutes
  }
];

export function TradeScreen({ 
  resources, 
  onExecuteTrade, 
  onCreateTrade 
}: TradeScreenProps) {
  const [selectedResource, setSelectedResource] = useState<string>('wood');
  const [offerAmount, setOfferAmount] = useState<number>(100);
  const [requestResource, setRequestResource] = useState<string>('iron');
  const [requestAmount, setRequestAmount] = useState<number>(50);

  const formatTime = (timestamp: number) => {
    const diff = timestamp - Date.now();
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    
    if (hours > 0) return `${hours}h ${minutes}m`;
    return `${minutes}m`;
  };

  const calculateTravelTime = (distance: number) => {
    // Assuming merchant speed
    const merchantSpeed = 12; // fields per hour
    return Math.ceil(distance / merchantSpeed * 60); // in minutes
  };

  const resourceOptions = [
    { value: 'wood', label: 'Holz', icon: '🪵' },
    { value: 'clay', label: 'Lehm', icon: '🧱' },
    { value: 'iron', label: 'Eisen', icon: '⚔️' },
    { value: 'coal', label: 'Kohle', icon: '⚫' },
    { value: 'wheat', label: 'Weizen', icon: '🌾' },
    { value: 'bread', label: 'Brot', icon: '🍞' },
    { value: 'meat', label: 'Fleisch', icon: '🥩' },
    { value: 'gold', label: 'Gold', icon: '🪙' }
  ];

  const canCreateTrade = offerAmount > 0 && requestAmount > 0 && 
    (resources as any)[selectedResource] >= offerAmount;

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ArrowRightLeft className="h-5 w-5" />
            Handel
          </CardTitle>
        </CardHeader>
      </Card>

      <Tabs defaultValue="market">
        <TabsList className="grid grid-cols-3 w-full">
          <TabsTrigger value="market">Marktplatz</TabsTrigger>
          <TabsTrigger value="create">Angebot erstellen</TabsTrigger>
          <TabsTrigger value="history">Verlauf</TabsTrigger>
        </TabsList>

        <TabsContent value="market">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>Verfügbare Angebote</span>
                <Badge variant="outline">{mockTrades.length} Angebote</Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[500px]">
                <div className="space-y-3">
                  {mockTrades.map((trade) => (
                    <Card key={trade.id} className="border-2">
                      <CardContent className="p-4">
                        <div className="space-y-3">
                          {/* Trader Info */}
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <Users className="h-4 w-4" />
                              <span className="font-medium">{trade.playerName}</span>
                            </div>
                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                              <Clock className="h-3 w-3" />
                              {formatTime(trade.expiresAt)}
                            </div>
                          </div>

                          {/* Trade Details */}
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <span className="text-sm text-muted-foreground">Bietet:</span>
                              {Object.entries(trade.offering).map(([resource, amount]) => (
                                <Badge key={resource} variant="secondary" className="flex items-center gap-1">
                                  <span>{getResourceIcon(resource)}</span>
                                  <span>{amount.toLocaleString()}</span>
                                </Badge>
                              ))}
                            </div>
                            
                            <ArrowRightLeft className="h-4 w-4 text-muted-foreground" />
                            
                            <div className="flex items-center gap-2">
                              <span className="text-sm text-muted-foreground">Möchte:</span>
                              {Object.entries(trade.requesting).map(([resource, amount]) => (
                                <Badge key={resource} variant="outline" className="flex items-center gap-1">
                                  <span>{getResourceIcon(resource)}</span>
                                  <span>{amount.toLocaleString()}</span>
                                </Badge>
                              ))}
                            </div>
                          </div>

                          {/* Trade Stats */}
                          <div className="flex items-center justify-between text-sm">
                            <div className="flex items-center gap-4">
                              <div className="flex items-center gap-1">
                                <TrendingUp className="h-3 w-3" />
                                <span>Ratio: {trade.ratio.toFixed(1)}:1</span>
                              </div>
                              <div>
                                Entfernung: {trade.distance} Felder
                              </div>
                              <div>
                                Reisezeit: {calculateTravelTime(trade.distance)}min
                              </div>
                            </div>
                          </div>

                          <Separator />

                          {/* Actions */}
                          <div className="flex gap-2">
                            <Button 
                              className="flex-1"
                              onClick={() => onExecuteTrade?.(trade.id)}
                            >
                              Handeln
                            </Button>
                            <Button variant="outline" size="sm">
                              Details
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="create">
          <Card>
            <CardHeader>
              <CardTitle>Neues Handelsangebot erstellen</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* What you offer */}
              <div className="space-y-3">
                <h4 className="font-medium">Du bietest an:</h4>
                <div className="flex gap-2">
                  <Select value={selectedResource} onValueChange={setSelectedResource}>
                    <SelectTrigger className="w-32">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {resourceOptions.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          <div className="flex items-center gap-2">
                            <span>{option.icon}</span>
                            <span>{option.label}</span>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Input
                    type="number"
                    value={offerAmount}
                    onChange={(e) => setOfferAmount(parseInt(e.target.value) || 0)}
                    max={(resources as any)[selectedResource]}
                    className="flex-1"
                  />
                </div>
                <div className="text-sm text-muted-foreground">
                  Verfügbar: {((resources as any)[selectedResource] || 0).toLocaleString()}
                </div>
              </div>

              <div className="text-center">
                <ArrowRightLeft className="h-6 w-6 mx-auto text-muted-foreground" />
              </div>

              {/* What you want */}
              <div className="space-y-3">
                <h4 className="font-medium">Du möchtest:</h4>
                <div className="flex gap-2">
                  <Select value={requestResource} onValueChange={setRequestResource}>
                    <SelectTrigger className="w-32">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {resourceOptions.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          <div className="flex items-center gap-2">
                            <span>{option.icon}</span>
                            <span>{option.label}</span>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Input
                    type="number"
                    value={requestAmount}
                    onChange={(e) => setRequestAmount(parseInt(e.target.value) || 0)}
                    className="flex-1"
                  />
                </div>
                {offerAmount > 0 && requestAmount > 0 && (
                  <div className="text-sm text-muted-foreground">
                    Tauschverhältnis: {(offerAmount / requestAmount).toFixed(2)}:1
                  </div>
                )}
              </div>

              <Separator />

              <Button 
                className="w-full" 
                disabled={!canCreateTrade}
                onClick={() => {
                  if (canCreateTrade) {
                    onCreateTrade?.({
                      offering: { [selectedResource]: offerAmount },
                      requesting: { [requestResource]: requestAmount },
                      ratio: offerAmount / requestAmount,
                      distance: 0
                    });
                  }
                }}
              >
                <Send className="h-4 w-4 mr-2" />
                Angebot erstellen
              </Button>

              {!canCreateTrade && (
                <p className="text-sm text-red-500 text-center">
                  {offerAmount === 0 ? 'Gib eine Menge ein' :
                   (resources as any)[selectedResource] < offerAmount ? 'Nicht genügend Ressourcen' :
                   'Gib eine gewünschte Menge ein'}
                </p>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="history">
          <Card>
            <CardHeader>
              <CardTitle>Handelsgeschichte</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8">
                <div className="text-4xl mb-2">📦</div>
                <p className="text-muted-foreground">
                  Noch keine Handelsgeschichte
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
