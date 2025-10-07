import { Card, CardContent } from "../ui/Card";
import { Badge } from "../ui/Badge";
import { Progress } from "../ui/Progress";
import { getResourceIcon } from "../../data/gameData";
import { useI18n } from "@/providers/i18n-provider";

interface ResourceCardProps {
  resource: string;
  amount: number;
  production?: number;
  capacity?: number;
  className?: string;
}

export function ResourceCard({
  resource,
  amount,
  production,
  capacity,
  className = "",
}: ResourceCardProps) {
  const { t } = useI18n();
  const formatNumber = (num: number) => {
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
    if (num >= 1000) return `${(num / 1000).toFixed(1)}k`;
    return num.toLocaleString();
  };

  const getResourceName = (res: string) => t(`screens.resources.names.${res}`, res);

  return (
    <Card className={`hover:shadow-md transition-shadow ${className}`}>
      <CardContent className="p-4">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <span className="text-2xl">{getResourceIcon(resource)}</span>
            <div>
              <h3 className="font-medium">{getResourceName(resource)}</h3>
              <Badge variant="outline" className="text-xs">
                {formatNumber(amount)}
              </Badge>
            </div>
          </div>
        </div>

        {capacity && (
          <div className="space-y-2">
            <Progress value={(amount / capacity) * 100} className="h-2" />
            <div className="text-xs text-muted-foreground text-right">
              {Math.round((amount / capacity) * 100)}% {t("screens.resources.of", "von")}{" "}
              {formatNumber(capacity)}
            </div>
          </div>
        )}

        {production && production > 0 && (
          <div className="mt-2 text-center">
            <Badge variant="secondary" className="text-xs">
              +{formatNumber(production)}/h
            </Badge>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
