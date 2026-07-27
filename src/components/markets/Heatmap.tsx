import { motion } from 'framer-motion';
import { marketStocks } from '@/data/stocks';
import { cn } from '@/lib/utils';

/**
 * Market heatmap visualization. Block size is proportional to market cap.
 * Green = positive change, red = negative change.
 */
export function MarketHeatmap() {
  const maxCap = Math.max(...marketStocks.map((s) => s.marketCap));

  return (
    <div className="grid auto-rows-[64px] grid-cols-3 gap-1.5 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8">
      {marketStocks.map((stock, i) => {
        const positive = stock.change >= 0;
        const intensity = Math.min(Math.abs(stock.changePercent) / 3, 1);
        const span = Math.max(1, Math.round((stock.marketCap / maxCap) * 4));

        return (
          <motion.div
            key={stock.symbol}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3, delay: i * 0.02 }}
            className={cn(
              'flex flex-col items-center justify-center rounded-lg border p-1.5 text-center transition-transform hover:z-10 hover:scale-105',
              positive ? 'border-success/30' : 'border-danger/30',
            )}
            style={{
              gridColumn: `span ${Math.min(span, 2)}`,
              gridRow: `span ${Math.min(span, 2)}`,
              backgroundColor: positive
                ? `hsl(var(--success) / ${0.08 + intensity * 0.25})`
                : `hsl(var(--danger) / ${0.08 + intensity * 0.25})`,
            }}
          >
            <p className="truncate text-xs font-bold">{stock.symbol}</p>
            <p className={cn('text-[10px] font-medium', positive ? 'text-success' : 'text-danger')}>
              {positive ? '+' : ''}{stock.changePercent.toFixed(2)}%
            </p>
          </motion.div>
        );
      })}
    </div>
  );
}
