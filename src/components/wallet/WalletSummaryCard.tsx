import { motion } from 'framer-motion';
import { TrendingUp, TrendingDown } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { AnimatedCounter } from '@/components/common/AnimatedCounter';
import { Sparkline } from '@/components/common/Sparkline';
import { cn } from '@/lib/utils';

interface WalletSummaryCardProps {
  label: string;
  value: number;
  prefix?: string;
  decimals?: number;
  change?: number;
  changePercent?: number;
  sparkline?: number[];
  delay?: number;
}

import { getCurrencySymbol } from '@/lib/currency';

export function WalletSummaryCard({
  label,
  value,
  prefix = getCurrencySymbol(),
  decimals = 2,
  change,
  changePercent,
  sparkline,
  delay = 0,
}: WalletSummaryCardProps) {
  const positive = (change ?? 0) >= 0;
  const hasChange = change !== undefined && changePercent !== undefined;

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay, ease: 'easeOut' }}
    >
      <Card className="group relative overflow-hidden p-4 transition-shadow hover:shadow-card-hover">
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0 flex-1">
            <p className="truncate text-xs font-medium text-muted-foreground">{label}</p>
            <p className="mt-1 font-display text-xl font-bold tracking-tight">
              <AnimatedCounter value={value} prefix={prefix} decimals={decimals} duration={1.2} />
            </p>
            {hasChange && (
              <p className={cn('mt-0.5 flex items-center gap-0.5 text-xs font-medium', positive ? 'text-success' : 'text-danger')}>
                {positive ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
                {positive ? '+' : ''}{prefix}{Math.abs(change!).toFixed(2)} ({positive ? '+' : ''}{changePercent!.toFixed(2)}%)
              </p>
            )}
          </div>
          {sparkline && (
            <div className="shrink-0">
              <Sparkline data={sparkline} width={56} height={28} positive={positive} />
            </div>
          )}
        </div>
      </Card>
    </motion.div>
  );
}
