import { useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Separator } from '@/components/ui/Separator';
import { Alert, AlertDescription } from '@/components/ui/Alert';
import { Progress } from '@/components/ui/Progress';
import { Home, Coins, CheckCircle2, Lock, Info, Shield, Crown, Sparkles } from 'lucide-react';

type MintVillageScreenProps = {
  hasFreeMint: boolean;
  worldBalance?: number; // WORLD coin balance
  isMinting?: boolean;
  txHash?: string | null;
  onMintFree?: () => void;
  onMintPaid?: () => void;
};

export function MintVillageScreen({
  hasFreeMint,
  worldBalance = 0,
  isMinting = false,
  txHash = null,
  onMintFree,
  onMintPaid,
}: MintVillageScreenProps) {
  const costWorld = 10;
  const canPay = useMemo(() => worldBalance >= costWorld, [worldBalance]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Home className="h-5 w-5" />
            Neues Dorf prägen
          </CardTitle>
        </CardHeader>
        <CardContent className="text-caption text-muted-foreground">
          Dörfer sind NFTs. Jeder Spieler erhält beim Start ein Dorf kostenlos. 
          Solltest du dein letztes Dorf verlieren, kannst du ein neues für 10 WORLD prägen.
        </CardContent>
      </Card>

      {/* Mint state feedback */}
      {isMinting && (
        <Alert>
          <Info className="h-4 w-4" />
          <AlertDescription>
            Mint wird ausgeführt… Dies kann einige Sekunden dauern.
          </AlertDescription>
        </Alert>
      )}

      {txHash && (
        <Card className="border-success/30">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-success">
              <CheckCircle2 className="h-5 w-5" /> Erfolgreich geprägt
            </CardTitle>
          </CardHeader>
          <CardContent className="text-caption">
            Transaktion: <a className="underline" href={`#tx:${txHash}`}>{txHash.slice(0, 10)}…</a>
          </CardContent>
        </Card>
      )}

      {/* Free mint card */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-yellow-500" />
            Kostenloses Startdorf
            <Badge variant={hasFreeMint ? 'default' : 'outline'} className="ml-2">
              {hasFreeMint ? 'Verfügbar' : 'Bereits genutzt'}
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="grid grid-cols-2 gap-3 text-sm">
            <div className="p-3 bg-muted rounded-lg flex items-center gap-2">
              <Shield className="h-4 w-4" />
              Level 1 Mauer, sichere Startressourcen
            </div>
            <div className="p-3 bg-muted rounded-lg flex items-center gap-2">
              <Crown className="h-4 w-4" />
              Einzigartige NFT-Zugehörigkeit
            </div>
          </div>
          <Button className="w-full" disabled={!hasFreeMint || isMinting} onClick={onMintFree}>
            {hasFreeMint ? 'Kostenloses Dorf prägen' : 'Nicht verfügbar'}
          </Button>
          {!hasFreeMint && (
            <div className="text-xs text-muted-foreground text-center">Dein kostenloses Mint wurde bereits verwendet.</div>
          )}
        </CardContent>
      </Card>

      {/* Paid mint card */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Coins className="h-5 w-5" />
            Dorf für 10 WORLD prägen
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between text-sm">
            <span>Dein WORLD Guthaben</span>
            <Badge variant={canPay ? 'secondary' : 'destructive'}>
              {worldBalance} WORLD
            </Badge>
          </div>
          {!canPay && (
            <Alert>
              <Lock className="h-4 w-4" />
              <AlertDescription>
                Du benötigst mindestens 10 WORLD, um ein neues Dorf zu prägen.
              </AlertDescription>
            </Alert>
          )}
          <Button className="w-full" disabled={!canPay || isMinting} onClick={onMintPaid}>
            Für 10 WORLD prägen
          </Button>
        </CardContent>
      </Card>

      {/* Info */}
      <Card>
        <CardHeader>
          <CardTitle className="text-section">Was bedeutet „Dorf als NFT“?</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 text-caption text-muted-foreground">
          <ul className="list-disc pl-5 space-y-1">
            <li>Du besitzt dein Dorf on-chain; es ist übertragbar.</li>
            <li>Bei Verlust deines letzten Dorfs kannst du ein neues prägen.</li>
            <li>Das erste Dorf ist kostenlos, weitere kosten 10 WORLD.</li>
          </ul>
          {isMinting && (
            <div className="space-y-2">
              <div className="flex justify-between text-xs">
                <span>Vorbereitung</span>
                <span>Läuft…</span>
              </div>
              <Progress value={66} className="h-1" />
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

