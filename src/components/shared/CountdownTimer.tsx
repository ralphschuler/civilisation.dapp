import { useState, useEffect } from 'react';
import { Badge } from '../ui/Badge';
import { Progress } from '../ui/Progress';
import { useI18n } from '@/providers/i18n-provider';

interface CountdownTimerProps {
  targetTime: number;
  onComplete?: () => void;
  showProgress?: boolean;
  variant?: 'default' | 'outline' | 'secondary' | 'destructive';
  className?: string;
}

export function CountdownTimer({ 
  targetTime, 
  onComplete, 
  showProgress = false,
  variant = 'default',
  className = ""
}: CountdownTimerProps) {
  const { t } = useI18n();
  const [timeRemaining, setTimeRemaining] = useState(0);
  const [totalDuration, setTotalDuration] = useState(0);

  useEffect(() => {
    const updateTimer = () => {
      const remaining = Math.max(0, targetTime - Date.now());
      setTimeRemaining(remaining);
      
      if (remaining === 0 && onComplete) {
        onComplete();
      }
    };

    // Set initial total duration for progress calculation
    if (totalDuration === 0) {
      setTotalDuration(Math.max(1, targetTime - Date.now()));
    }

    updateTimer();
    const interval = setInterval(updateTimer, 1000);

    return () => clearInterval(interval);
  }, [targetTime, onComplete, totalDuration]);

  const formatTime = (milliseconds: number) => {
    const seconds = Math.floor(milliseconds / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    if (days > 0) {
      return `${days}d ${hours % 24}h ${minutes % 60}m`;
    }
    if (hours > 0) {
      return `${hours}h ${minutes % 60}m ${seconds % 60}s`;
    }
    if (minutes > 0) {
      return `${minutes}m ${seconds % 60}s`;
    }
    return `${seconds}s`;
  };

  const progress = totalDuration > 0 
    ? Math.max(0, Math.min(100, ((totalDuration - timeRemaining) / totalDuration) * 100))
    : 100;

  if (timeRemaining === 0) {
    return (
      <Badge variant="outline" className={`text-green-600 ${className}`}>
        {t('common.completed', 'Abgeschlossen')}
      </Badge>
    );
  }

  return (
    <div className={`space-y-1 ${className}`}>
      <Badge variant={variant}>
        {formatTime(timeRemaining)}
      </Badge>
      {showProgress && (
        <Progress value={progress} className="h-1" />
      )}
    </div>
  );
}
