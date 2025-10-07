import { useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Separator } from "@/components/ui/Separator";
import { Alert, AlertDescription } from "@/components/ui/Alert";
import { Progress } from "@/components/ui/Progress";
import { Home, Coins, CheckCircle2, Lock, Info, Shield, Crown, Sparkles } from "lucide-react";
import { useI18n } from "@/providers/i18n-provider";

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
  const { t } = useI18n();
  const costWorld = 10;
  const canPay = useMemo(() => worldBalance >= costWorld, [worldBalance]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Home className="h-5 w-5" />
            {t("screens.mint.title", "Neues Dorf prägen")}
          </CardTitle>
        </CardHeader>
        <CardContent className="text-caption text-muted-foreground">
          {t(
            "screens.mint.description",
            "Dörfer sind NFTs. Jeder Spieler erhält beim Start ein Dorf kostenlos. Solltest du dein letztes Dorf verlieren, kannst du ein neues für 10 WORLD prägen.",
          )}
        </CardContent>
      </Card>

      {/* Mint state feedback */}
      {isMinting && (
        <Alert>
          <Info className="h-4 w-4" />
          <AlertDescription>
            {t("screens.mint.minting", "Mint wird ausgeführt… Dies kann einige Sekunden dauern.")}
          </AlertDescription>
        </Alert>
      )}

      {txHash && (
        <Card className="border-success/30">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-success">
              <CheckCircle2 className="h-5 w-5" />{" "}
              {t("screens.mint.success", "Erfolgreich geprägt")}
            </CardTitle>
          </CardHeader>
          <CardContent className="text-caption">
            {t("screens.mint.transaction", "Transaktion")}:{" "}
            <a className="underline" href={`#tx:${txHash}`}>
              {txHash.slice(0, 10)}…
            </a>
          </CardContent>
        </Card>
      )}

      {/* Free mint card */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-yellow-500" />
            {t("screens.mint.free.title", "Kostenloses Startdorf")}
            <Badge variant={hasFreeMint ? "default" : "outline"} className="ml-2">
              {hasFreeMint
                ? t("screens.mint.free.available", "Verfügbar")
                : t("screens.mint.free.used", "Bereits genutzt")}
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="grid grid-cols-2 gap-3 text-sm">
            <div className="p-3 bg-muted rounded-lg flex items-center gap-2">
              <Shield className="h-4 w-4" />
              {t("screens.mint.free.perk1", "Level 1 Mauer, sichere Startressourcen")}
            </div>
            <div className="p-3 bg-muted rounded-lg flex items-center gap-2">
              <Crown className="h-4 w-4" />
              {t("screens.mint.free.perk2", "Einzigartige NFT-Zugehörigkeit")}
            </div>
          </div>
          <Button className="w-full" disabled={!hasFreeMint || isMinting} onClick={onMintFree}>
            {hasFreeMint
              ? t("screens.mint.free.cta", "Kostenloses Dorf prägen")
              : t("screens.mint.free.unavailable", "Nicht verfügbar")}
          </Button>
          {!hasFreeMint && (
            <div className="text-xs text-muted-foreground text-center">
              {t("screens.mint.free.alreadyUsed", "Dein kostenloses Mint wurde bereits verwendet.")}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Paid mint card */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Coins className="h-5 w-5" />
            {t("screens.mint.paid.title", "Dorf für 10 WORLD prägen")}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between text-sm">
            <span>{t("screens.mint.paid.balance", "Dein WORLD Guthaben")}</span>
            <Badge variant={canPay ? "secondary" : "destructive"}>{worldBalance} WORLD</Badge>
          </div>
          {!canPay && (
            <Alert>
              <Lock className="h-4 w-4" />
              <AlertDescription>
                {t(
                  "screens.mint.paid.needFunds",
                  "Du benötigst mindestens 10 WORLD, um ein neues Dorf zu prägen.",
                )}
              </AlertDescription>
            </Alert>
          )}
          <Button className="w-full" disabled={!canPay || isMinting} onClick={onMintPaid}>
            {t("screens.mint.paid.cta", "Für 10 WORLD prägen")}
          </Button>
        </CardContent>
      </Card>

      {/* Info */}
      <Card>
        <CardHeader>
          <CardTitle className="text-section">
            {t("screens.mint.info.title", "Was bedeutet „Dorf als NFT“?")}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 text-caption text-muted-foreground">
          <ul className="list-disc pl-5 space-y-1">
            <li>
              {t("screens.mint.info.point1", "Du besitzt dein Dorf on-chain; es ist übertragbar.")}
            </li>
            <li>
              {t(
                "screens.mint.info.point2",
                "Bei Verlust deines letzten Dorfs kannst du ein neues prägen.",
              )}
            </li>
            <li>
              {t(
                "screens.mint.info.point3",
                "Das erste Dorf ist kostenlos, weitere kosten 10 WORLD.",
              )}
            </li>
          </ul>
          {isMinting && (
            <div className="space-y-2">
              <div className="flex justify-between text-xs">
                <span>{t("screens.mint.info.preparing", "Vorbereitung")}</span>
                <span>{t("screens.mint.info.running", "Läuft…")}</span>
              </div>
              <Progress value={66} className="h-1" />
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
