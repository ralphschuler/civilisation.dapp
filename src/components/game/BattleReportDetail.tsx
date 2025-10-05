import { Card, CardContent, CardHeader, CardTitle } from "../ui/Card";
import { Button } from "../ui/Button";
import { Separator } from "../ui/Separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/Tabs";
import { Alert, AlertDescription } from "../ui/Alert";
import {
  Swords,
  Shield,
  Target,
  TrendingDown,
  Lightbulb,
  Trophy,
  Skull,
  Minus,
} from "lucide-react";
import { BattleResult } from "../../types/reports";

interface BattleReportDetailProps {
  battleData: BattleResult;
  onClose: () => void;
}

export function BattleReportDetail({
  battleData,
  onClose,
}: BattleReportDetailProps) {
  const {
    attacker,
    defender,
    result,
    loot,
    wallDamage,
    reasons,
    suggestions,
    phases,
  } = battleData;

  const getResultIcon = () => {
    switch (result) {
      case "victory":
        return <Trophy className="h-5 w-5 text-success" />;
      case "defeat":
        return <Skull className="h-5 w-5 text-destructive" />;
      default:
        return <Minus className="h-5 w-5 text-muted-foreground" />;
    }
  };

  const getResultColor = () => {
    switch (result) {
      case "victory":
        return "bg-success/10 border-success/20";
      case "defeat":
        return "bg-destructive/10 border-destructive/20";
      default:
        return "bg-muted/10 border-border";
    }
  };

  const renderUnitLosses = (
    units: Record<string, { sent?: number; lost?: number; defending?: number }>,
  ) => (
    <div className="grid grid-cols-2 gap-2">
      {Object.entries(units).map(([unit, data]) => (
        <div
          key={unit}
          className="flex justify-between items-center p-2 bg-muted/30 rounded-md"
        >
          <span className="text-caption">{unit}</span>
          <div className="text-caption text-right">
            {data.sent && <div>Gesendet: {data.sent}</div>}
            {data.defending && <div>Verteidigt: {data.defending}</div>}
            <div className="text-destructive">Verloren: {data.lost || 0}</div>
          </div>
        </div>
      ))}
    </div>
  );

  const renderPhaseStep = (phase: string, data: any, index: number) => (
    <div key={phase} className="flex items-start gap-3">
      <div
        className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-caption
        ${index === 0 ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"}`}
      >
        {index + 1}
      </div>
      <div className="flex-1 space-y-2">
        <h4 className="text-section font-medium">{phase}</h4>
        {data.attackerLosses && Object.keys(data.attackerLosses).length > 0 && (
          <div className="text-caption text-muted-foreground">
            Angreifer Verluste:{" "}
            {Object.entries(data.attackerLosses)
              .map(([unit, count]) => `${unit}: ${count}`)
              .join(", ")}
          </div>
        )}
        {data.defenderLosses && Object.keys(data.defenderLosses).length > 0 && (
          <div className="text-caption text-muted-foreground">
            Verteidiger Verluste:{" "}
            {Object.entries(data.defenderLosses)
              .map(([unit, count]) => `${unit}: ${count}`)
              .join(", ")}
          </div>
        )}
        {data.wallDamage && (
          <div className="text-caption text-muted-foreground">
            Mauerschaden: {data.wallDamage}%
          </div>
        )}
      </div>
    </div>
  );

  return (
    <div className="space-y-4">
      {/* Result Summary */}
      <Card className={`border-2 ${getResultColor()}`}>
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2">
            {getResultIcon()}
            <span>
              Kampfergebnis:{" "}
              {result === "victory"
                ? "Sieg"
                : result === "defeat"
                  ? "Niederlage"
                  : "Unentschieden"}
            </span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <h4 className="font-medium flex items-center gap-2">
                <Swords className="h-4 w-4" />
                Angreifer
              </h4>
              <div className="text-caption">
                <div>{attacker.player}</div>
                <div className="text-muted-foreground">{attacker.village}</div>
              </div>
            </div>
            <div className="space-y-2">
              <h4 className="font-medium flex items-center gap-2">
                <Shield className="h-4 w-4" />
                Verteidiger
              </h4>
              <div className="text-caption">
                <div>{defender.player}</div>
                <div className="text-muted-foreground">{defender.village}</div>
              </div>
            </div>
          </div>

          {loot && Object.keys(loot).length > 0 && (
            <div className="mt-4 p-3 bg-success/10 rounded-md">
              <h4 className="font-medium mb-2">Beute</h4>
              <div className="grid grid-cols-3 gap-2 text-caption">
                {Object.entries(loot).map(([resource, amount]) => (
                  <div key={resource} className="flex justify-between">
                    <span>{resource}:</span>
                    <span>{amount}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {wallDamage && wallDamage > 0 && (
            <Alert>
              <TrendingDown className="h-4 w-4" />
              <AlertDescription>
                Mauerschaden: {wallDamage}% der Mauer wurde zerstört
              </AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>

      {/* Detailed Analysis */}
      <Tabs defaultValue="units" className="space-y-4">
        <TabsList className="grid grid-cols-4 w-full">
          <TabsTrigger value="units">Einheiten</TabsTrigger>
          <TabsTrigger value="phases">Phasen</TabsTrigger>
          <TabsTrigger value="analysis">Analyse</TabsTrigger>
          <TabsTrigger value="tips">Tipps</TabsTrigger>
        </TabsList>

        <TabsContent value="units" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Swords className="h-5 w-5" />
                Angreifer Verluste
              </CardTitle>
            </CardHeader>
            <CardContent>{renderUnitLosses(attacker.units)}</CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5" />
                Verteidiger Verluste
              </CardTitle>
            </CardHeader>
            <CardContent>{renderUnitLosses(defender.units)}</CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="phases" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Kampfverlauf</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {renderPhaseStep("Fernkampf", phases.ranged, 0)}
              <Separator />
              {renderPhaseStep("Sturmangriff", phases.charge, 1)}
              <Separator />
              {renderPhaseStep("Nahkampf", phases.melee, 2)}
              <Separator />
              {renderPhaseStep("Belagerung", phases.siege, 3)}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analysis" className="space-y-4">
          {reasons && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="h-5 w-5" />
                  Warum {result === "victory" ? "gewonnen" : "verloren"}?
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {reasons.counter.length > 0 && (
                  <div>
                    <h4 className="font-medium mb-2">Konter-Effekte</h4>
                    <ul className="space-y-1 text-caption">
                      {reasons.counter.map((reason, index) => (
                        <li key={index} className="flex items-start gap-2">
                          <span className="w-1 h-1 bg-current rounded-full mt-2 flex-shrink-0" />
                          {reason}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {reasons.wall.length > 0 && (
                  <div>
                    <h4 className="font-medium mb-2">Mauer-Effekte</h4>
                    <ul className="space-y-1 text-caption">
                      {reasons.wall.map((reason, index) => (
                        <li key={index} className="flex items-start gap-2">
                          <span className="w-1 h-1 bg-current rounded-full mt-2 flex-shrink-0" />
                          {reason}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {reasons.tech.length > 0 && (
                  <div>
                    <h4 className="font-medium mb-2">Technologie</h4>
                    <ul className="space-y-1 text-caption">
                      {reasons.tech.map((reason, index) => (
                        <li key={index} className="flex items-start gap-2">
                          <span className="w-1 h-1 bg-current rounded-full mt-2 flex-shrink-0" />
                          {reason}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="tips" className="space-y-4">
          {suggestions && suggestions.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Lightbulb className="h-5 w-5" />
                  Nächstes Mal besser
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  {suggestions.map((suggestion, index) => (
                    <li
                      key={index}
                      className="flex items-start gap-3 p-3 bg-muted/30 rounded-md"
                    >
                      <Lightbulb className="h-4 w-4 text-warning mt-0.5 flex-shrink-0" />
                      <span className="text-caption">{suggestion}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>

      <div className="flex gap-3 pt-4">
        <Button onClick={onClose} className="flex-1">
          Schließen
        </Button>
      </div>
    </div>
  );
}
