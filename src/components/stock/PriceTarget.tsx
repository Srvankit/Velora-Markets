import { motion } from 'framer-motion';
import { TrendingUp, Target, ArrowUp, ArrowDown, DollarSign } from 'lucide-react';
import { Card } from '@/components/ui/card';
import type { AnalystRating } from '@/data/analystRatings';
import { formatCurrency } from '@/lib/format';
import { cn } from '@/lib/utils';

interface PriceTargetProps {
  rating: AnalystRating;
  currentPrice: number;
}

export function PriceTarget({ rating, currentPrice }: PriceTargetProps) {
  const upside = ((rating.averageTarget - currentPrice) / currentPrice) * 100;
  const isPositive = upside >= 0;

  const targets = [
    { icon: ArrowUp, label: 'Highest Target', value: rating.highestTarget, color: 'text-success' },
    { icon: Target, label: 'Average Target', value: rating.averageTarget, color: 'text-primary' },
    { icon: ArrowDown, label: 'Lowest Target', value: rating.lowestTarget, color: 'text-danger' },
  ];

  return (
    <Card className="p-5">
      <h3 className="mb-4 font-display text-base font-semibold">Price Targets</h3>
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {targets.map((t, i) => (
          <motion.div
            key={t.label}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: i * 0.05 }}
            className="rounded-lg border border-border bg-card/40 p-3"
          >
            <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <t.icon className="h-3.5 w-3.5" />
              {t.label}
            </div>
            <p className={cn('mt-1 text-lg font-bold tabular-nums', t.color)}>
              {formatCurrency(t.value)}
            </p>
          </motion.div>
        ))}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.15 }}
          className="rounded-lg border border-border bg-card/40 p-3"
        >
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <DollarSign className="h-3.5 w-3.5" />
            Current Price
          </div>
          <p className="mt-1 text-lg font-bold tabular-nums">{formatCurrency(currentPrice)}</p>
        </motion.div>
      </div>

      <div className={cn(
        'mt-4 flex items-center gap-2 rounded-lg border p-3',
        isPositive ? 'border-success/30 bg-success/5' : 'border-danger/30 bg-danger/5',
      )}>
        <TrendingUp className={cn('h-5 w-5', isPositive ? 'text-success' : 'text-danger')} />
        <div>
          <p className="text-xs text-muted-foreground">Potential Upside</p>
          <p className={cn('text-sm font-bold', isPositive ? 'text-success' : 'text-danger')}>
            {isPositive ? '+' : ''}{upside.toFixed(1)}% to {formatCurrency(rating.averageTarget)}
          </p>
        </div>
      </div>
    </Card>
  );
}
