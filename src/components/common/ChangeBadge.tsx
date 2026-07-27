import { TrendingUp, TrendingDown } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ChangeBadgeProps {
  value: number;
  percent?: number;
  className?: string;
  showIcon?: boolean;
}

export function ChangeBadge({ value, percent, className, showIcon = true }: ChangeBadgeProps) {
  const positive = value >= 0;
  const display = percent !== undefined ? `${positive ? '+' : ''}${percent.toFixed(2)}%` : `${positive ? '+' : ''}${value.toFixed(2)}`;
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1 rounded-md px-1.5 py-0.5 text-xs font-medium',
        positive ? 'bg-success/10 text-success' : 'bg-danger/10 text-danger',
        className,
      )}
    >
      {showIcon && (positive ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />)}
      {display}
    </span>
  );
}
