import { Card, CardContent } from "../ui/Card";
import { Progress } from "../ui/Progress";
import { Skeleton } from "../ui/Skeleton";
import { useI18n } from "@/providers/i18n-provider";

interface LoadingScreenProps {
  message?: string;
  progress?: number;
  showSkeleton?: boolean;
}

export function LoadingScreen({ message, progress, showSkeleton = false }: LoadingScreenProps) {
  const { t } = useI18n();
  const msg = message ?? t("loading.message", "Loading game...");
  if (showSkeleton) {
    return (
      <div className="space-y-4">
        <Card>
          <CardContent className="p-4">
            <div className="space-y-3">
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-4 w-1/2" />
              <div className="grid grid-cols-3 gap-3">
                <Skeleton className="h-20 w-full" />
                <Skeleton className="h-20 w-full" />
                <Skeleton className="h-20 w-full" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="space-y-3">
              <Skeleton className="h-4 w-2/3" />
              <div className="grid grid-cols-2 gap-3">
                <Skeleton className="h-16 w-full" />
                <Skeleton className="h-16 w-full" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-[400px] space-y-6">
      <div className="text-center space-y-4">
        <div className="text-6xl animate-pulse">🏰</div>
        <div className="space-y-2">
          <h2 className="text-xl font-medium">{t("loading.title", "Tribal Wars")}</h2>
          <p className="text-muted-foreground">{msg}</p>
        </div>
      </div>

      {progress !== undefined && (
        <div className="w-full max-w-xs space-y-2">
          <Progress value={progress} className="h-2" />
          <p className="text-xs text-center text-muted-foreground">
            {Math.round(progress)}% {t("loading.completed", "completed")}
          </p>
        </div>
      )}

      <div className="flex space-x-1">
        <div
          className="w-2 h-2 bg-primary rounded-full animate-bounce"
          style={{ animationDelay: "0ms" }}
        />
        <div
          className="w-2 h-2 bg-primary rounded-full animate-bounce"
          style={{ animationDelay: "150ms" }}
        />
        <div
          className="w-2 h-2 bg-primary rounded-full animate-bounce"
          style={{ animationDelay: "300ms" }}
        />
      </div>
    </div>
  );
}
