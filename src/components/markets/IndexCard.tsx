import { motion } from 'framer-motion';
import { Card } from '@/components/ui/card';
import { Sparkline } from '@/components/common/Sparkline';
import { AnimatedCounter } from '@/components/common/AnimatedCounter';
import type { MarketIndex } from '@/data/marketIndices';
import { formatNumber } from '@/lib/format';
import { cn } from '@/lib/utils';

interface IndexCardProps {
  index: MarketIndex;
  delay?: number;
}

export function IndexCard({ index, delay = 0 }: IndexCardProps) {
  const positive = index.change >= 0;
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.4, delay, ease: 'easeOut' }}
    >
      <Card className="group p-4 transition-all hover:shadow-card-hover hover:-translate-y-0.5">
        <div className="flex items-center justify-between">
          <p className="truncate text-xs font-semibold text-muted-foreground">{index.name}</p>
          <span
            className={cn(
              'inline-flex items-center gap-0.5 text-xs font-medium',
              positive ? 'text-success' : 'text-danger',
            )}
          >
            {positive ? '+' : ''}{index.changePercent.toFixed(2)}%
          </span>
        </div>
        <p className="mt-1 font-display text-lg font-bold tracking-tight">
          <AnimatedCounter
            value={index.value}
            decimals={index.category === 'forex' ? 4 : 2}
            duration={1.2}
          />
        </p>
        <div className="mt-1 flex items-center justify-between gap-2">
          <span className={cn('text-xs font-medium tabular-nums', positive ? 'text-success' : 'text-danger')}>
            {positive ? '+' : ''}{formatNumber(index.change, index.category === 'forex')}
          </span>
          <Sparkline data={index.sparkline} width={60} height={24} positive={positive} />
        </div>
      </Card>
    </motion.div>
  );
}
