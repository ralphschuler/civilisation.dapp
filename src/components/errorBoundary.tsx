import { ReactNode } from "react";
import {
  ErrorBoundary as ReactErrorBoundary,
  FallbackProps,
} from "react-error-boundary";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AlertTriangle, RefreshCw } from "lucide-react";

type Props = {
  children: ReactNode;
  /** Optional custom fallback node; if provided, it replaces the default card UI */
  fallback?: ReactNode;
  /**
   * Optional reset keys – when these values change, the boundary auto-resets.
   * Mirrors react-error-boundary's resetKeys behavior.
   */
  resetKeys?: ReadonlyArray<unknown>;
};

function DefaultFallback({ error, resetErrorBoundary }: FallbackProps) {
  return (
    <div className="flex items-center justify-center min-h-[400px] p-4">
      <Card className="max-w-md w-full">
        <CardHeader className="text-center">
          <div className="mx-auto w-12 h-12 bg-destructive/10 rounded-full flex items-center justify-center mb-4">
            <AlertTriangle className="h-6 w-6 text-destructive" />
          </div>
          <CardTitle className="text-destructive">
            Spielfehler aufgetreten
          </CardTitle>
        </CardHeader>
        <CardContent className="text-center space-y-4">
          <p className="text-muted-foreground">
            Es ist ein unerwarteter Fehler aufgetreten. Versuche das Spiel neu
            zu laden.
          </p>

          {error?.message && (
            <details className="text-left">
              <summary className="text-sm text-muted-foreground cursor-pointer">
                Technische Details
              </summary>
              <pre className="text-xs bg-muted p-2 rounded mt-2 overflow-auto">
                {error.message}
              </pre>
            </details>
          )}

          <div className="space-y-2">
            <Button onClick={resetErrorBoundary} className="w-full">
              <RefreshCw className="h-4 w-4 mr-2" />
              Spiel neu laden
            </Button>
            <Button
              variant="outline"
              onClick={() => window.location.reload()}
              className="w-full"
            >
              Seite neu laden
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export function ErrorBoundary({ children, fallback, resetKeys }: Props) {
  return (
    <ReactErrorBoundary
      fallbackRender={(fp) =>
        fallback ? <>{fallback}</> : <DefaultFallback {...fp} />
      }
      onError={(error, info) => {
        // Bleibt analog zu componentDidCatch
        // (info ist hier ein string mit componentStack)
        // eslint-disable-next-line no-console
        console.error("Game Error:", error, info.componentStack);
      }}
      onReset={() => {
        // Platz für eigenes State-Resetting außerhalb – hier meist nicht nötig,
        // weil das Boundary selbst durch resetErrorBoundary zurückgesetzt wird.
      }}
      resetKeys={resetKeys}
    >
      {children}
    </ReactErrorBoundary>
  );
}
