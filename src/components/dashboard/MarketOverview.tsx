import { motion } from 'framer-motion';
import { Card } from '@/components/ui/card';
import { Sparkline } from '@/components/common/Sparkline';
import { mockMarketIndices } from '@/services/dashboard-data';
import { formatNumber } from '@/lib/format';
import { cn } from '@/lib/utils';

export function MarketOverview() {
  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-8">
      {mockMarketIndices.map((index, i) => {
        const positive = index.change >= 0;
        return (
          <motion.div
            key={index.symbol}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4, delay: i * 0.04, ease: 'easeOut' }}
          >
            <Card className="p-3.5 transition-all hover:shadow-card-hover hover:-translate-y-0.5">
              <p className="truncate text-xs font-semibold text-muted-foreground">{index.name}</p>
              <p className="mt-1 font-display text-base font-bold tracking-tight">
                {formatNumber(index.value, index.category === 'forex')}
              </p>
              <div className="mt-1 flex items-center justify-between gap-1">
                <span
                  className={cn(
                    'text-xs font-medium',
                    positive ? 'text-success' : 'text-danger',
                  )}
                >
                  {positive ? '+' : ''}{index.changePercent.toFixed(2)}%
                </span>
                <Sparkline data={index.sparkline} width={48} height={20} positive={positive} />
              </div>
            </Card>
          </motion.div>
        );
      })}
    </div>
  );
}
